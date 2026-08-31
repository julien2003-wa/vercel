'use client';

import { useEffect, useRef, useState } from 'react';
import { useFaceLandmarker } from '@/lib/useFaceLandmarker';
import {
  computeEAR,
  computeMAR,
  EAR_CLOSED_THRESHOLD,
  EYES_CLOSED_ALERT_MS,
  MAR_YAWN_THRESHOLD,
  YAWN_MIN_DURATION_MS,
} from '@/lib/faceMetrics';
import type { DrowsinessEvent, MonitorSessionStats } from '@/lib/types';

interface MonitorStepProps {
  onEnd: (stats: MonitorSessionStats) => void;
}

type AlertLevel = 'normal' | 'warning' | 'danger';

const NO_FACE_ALERT_MS = 3000;
const BEEP_INTERVAL_MS = 1500;

export default function MonitorStep({ onEnd }: MonitorStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeepAtRef = useRef(0);

  const eyesClosedSinceRef = useRef<number | null>(null);
  const eyesClosedLoggedRef = useRef(false);
  const yawnSinceRef = useRef<number | null>(null);
  const yawnLoggedRef = useRef(false);
  const noFaceSinceRef = useRef<number | null>(null);
  const noFaceLoggedRef = useRef(false);
  const statsRef = useRef<MonitorSessionStats>({
    startedAt: Date.now(),
    endedAt: null,
    eyesClosedEvents: 0,
    yawnEvents: 0,
    noFaceEvents: 0,
    longestEyesClosedMs: 0,
    events: [],
  });

  const { ready, error: modelError, detectForVideo } = useFaceLandmarker();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('normal');
  const [liveEar, setLiveEar] = useState<number | null>(null);
  const [liveStats, setLiveStats] = useState(statsRef.current);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
      } catch (err) {
        setCameraError(
          err instanceof Error
            ? `Acces camera refuse ou indisponible : ${err.message}`
            : 'Acces camera refuse ou indisponible.',
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  function playBeep(frequency: number) {
    const now = performance.now();
    if (now - lastBeepAtRef.current < BEEP_INTERVAL_MS) return;
    lastBeepAtRef.current = now;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25);
    } catch {
      // audio non disponible : l'alerte visuelle reste active
    }
  }

  function logEvent(event: DrowsinessEvent) {
    statsRef.current.events.push(event);
  }

  useEffect(() => {
    if (!ready || !cameraReady) return;

    function tick() {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const result = detectForVideo(video, performance.now());
      const now = Date.now();
      let nextAlert: AlertLevel = 'normal';

      const face = result?.faceLandmarks?.[0];

      if (!face) {
        eyesClosedSinceRef.current = null;
        eyesClosedLoggedRef.current = false;
        yawnSinceRef.current = null;
        yawnLoggedRef.current = false;
        if (noFaceSinceRef.current === null) noFaceSinceRef.current = now;
        const noFaceDuration = now - noFaceSinceRef.current;
        if (noFaceDuration >= NO_FACE_ALERT_MS) {
          nextAlert = 'danger';
          if (!noFaceLoggedRef.current) {
            noFaceLoggedRef.current = true;
            statsRef.current.noFaceEvents += 1;
            logEvent({ type: 'no-face', timestamp: now });
          }
          playBeep(440);
        }
      } else {
        noFaceSinceRef.current = null;
        noFaceLoggedRef.current = false;

        const ear = computeEAR(face, video.videoWidth, video.videoHeight);
        const mar = computeMAR(face, video.videoWidth, video.videoHeight);
        setLiveEar(ear);

        if (ear < EAR_CLOSED_THRESHOLD) {
          if (eyesClosedSinceRef.current === null) eyesClosedSinceRef.current = now;
          const duration = now - eyesClosedSinceRef.current;
          if (duration >= EYES_CLOSED_ALERT_MS) {
            nextAlert = 'danger';
            if (!eyesClosedLoggedRef.current) {
              eyesClosedLoggedRef.current = true;
              statsRef.current.eyesClosedEvents += 1;
              logEvent({ type: 'eyes-closed', timestamp: now, durationMs: duration });
            }
            statsRef.current.longestEyesClosedMs = Math.max(
              statsRef.current.longestEyesClosedMs,
              duration,
            );
            playBeep(880);
          }
        } else {
          eyesClosedSinceRef.current = null;
          eyesClosedLoggedRef.current = false;
        }

        if (mar > MAR_YAWN_THRESHOLD) {
          if (yawnSinceRef.current === null) yawnSinceRef.current = now;
          const duration = now - yawnSinceRef.current;
          if (duration >= YAWN_MIN_DURATION_MS) {
            if (nextAlert !== 'danger') nextAlert = 'warning';
            if (!yawnLoggedRef.current) {
              yawnLoggedRef.current = true;
              statsRef.current.yawnEvents += 1;
              logEvent({ type: 'yawn', timestamp: now, durationMs: duration });
            }
          }
        } else {
          yawnSinceRef.current = null;
          yawnLoggedRef.current = false;
        }
      }

      setAlertLevel(nextAlert);
      setLiveStats({ ...statsRef.current });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, cameraReady, detectForVideo]);

  function handleEnd() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    statsRef.current.endedAt = Date.now();
    onEnd({ ...statsRef.current });
  }

  const alertStyles: Record<AlertLevel, string> = {
    normal: 'border-slate-700',
    warning: 'border-amber-500',
    danger: 'border-red-600 alert-pulse',
  };

  const alertMessages: Record<AlertLevel, string> = {
    normal: 'Etat normal',
    warning: 'Baillement detecte : signe de fatigue',
    danger: 'Alerte : signe de somnolence detecte !',
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h2 className="text-lg font-semibold text-slate-100">Surveillance en conduite</h2>

      {(cameraError || modelError) && (
        <p className="rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {cameraError ?? modelError}. Verifiez les permissions de la camera et rechargez la page.
        </p>
      )}

      <div className={`relative overflow-hidden rounded-2xl border-4 bg-black transition ${alertStyles[alertLevel]}`}>
        <video ref={videoRef} className="aspect-video w-full -scale-x-100 object-cover" muted playsInline />
        {!ready && !modelError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm text-slate-300">
            Chargement du modele de detection faciale...
          </div>
        )}
      </div>

      <div
        className={`rounded-xl border p-4 text-sm font-semibold ${
          alertLevel === 'danger'
            ? 'border-red-600 text-red-400'
            : alertLevel === 'warning'
              ? 'border-amber-500 text-amber-400'
              : 'border-slate-700 text-slate-400'
        }`}
      >
        {alertMessages[alertLevel]}
        {liveEar !== null && (
          <span className="ml-2 font-normal text-slate-500">(EAR {liveEar.toFixed(2)})</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border border-slate-800 p-3">
          <p className="text-2xl font-bold text-slate-100">{liveStats.eyesClosedEvents}</p>
          <p className="text-slate-500">Yeux fermes</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-3">
          <p className="text-2xl font-bold text-slate-100">{liveStats.yawnEvents}</p>
          <p className="text-slate-500">Baillements</p>
        </div>
        <div className="rounded-lg border border-slate-800 p-3">
          <p className="text-2xl font-bold text-slate-100">{liveStats.noFaceEvents}</p>
          <p className="text-slate-500">Visage absent</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleEnd}
        className="mt-auto w-full rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 sm:w-auto sm:self-start"
      >
        Terminer la surveillance
      </button>
    </div>
  );
}
