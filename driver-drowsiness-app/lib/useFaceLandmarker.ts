'use client';

import { useEffect, useRef, useState } from 'react';
import type { FaceLandmarker as FaceLandmarkerType, FaceLandmarkerResult } from '@mediapipe/tasks-vision';

const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';
const MODEL_ASSET_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

interface UseFaceLandmarkerState {
  ready: boolean;
  error: string | null;
}

/**
 * Charge le modele MediaPipe FaceLandmarker (WASM + poids, recuperes via CDN au runtime)
 * et expose une fonction de detection a appeler sur chaque frame video.
 */
export function useFaceLandmarker() {
  const landmarkerRef = useRef<FaceLandmarkerType | null>(null);
  const [state, setState] = useState<UseFaceLandmarkerState>({ ready: false, error: null });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const filesetResolver = await vision.FilesetResolver.forVisionTasks(WASM_BASE_URL);
        const landmarker = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET_URL,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setState({ ready: true, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({
            ready: false,
            error:
              err instanceof Error
                ? err.message
                : 'Impossible de charger le modele de detection faciale.',
          });
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  function detectForVideo(video: HTMLVideoElement, timestampMs: number): FaceLandmarkerResult | null {
    if (!landmarkerRef.current) return null;
    return landmarkerRef.current.detectForVideo(video, timestampMs);
  }

  return { ...state, detectForVideo };
}
