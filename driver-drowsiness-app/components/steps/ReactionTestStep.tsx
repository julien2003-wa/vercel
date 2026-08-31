'use client';

import { useEffect, useRef, useState } from 'react';
import { NUM_REACTION_TRIALS, randomReactionDelay, summarizeReactionTest } from '@/lib/scoring';
import type { ReactionTrial } from '@/lib/types';

type Phase = 'ready' | 'waiting' | 'go' | 'false-start' | 'result' | 'done';

interface ReactionTestStepProps {
  onComplete: (result: ReturnType<typeof summarizeReactionTest>) => void;
}

export default function ReactionTestStep({ onComplete }: ReactionTestStepProps) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [trials, setTrials] = useState<ReactionTrial[]>([]);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const goAtRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startTrial() {
    setPhase('waiting');
    const delay = randomReactionDelay();
    timeoutRef.current = setTimeout(() => {
      goAtRef.current = performance.now();
      setPhase('go');
    }, delay);
  }

  function recordTrial(trial: ReactionTrial) {
    const updated = [...trials, trial];
    setTrials(updated);
    if (updated.length >= NUM_REACTION_TRIALS) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      setPhase('done');
      onComplete(summarizeReactionTest(updated));
    } else {
      setPhase('result');
    }
  }

  function handleZoneClick() {
    if (phase === 'ready') {
      startTrial();
      return;
    }
    if (phase === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase('false-start');
      recordTrial({ reactionMs: null, falseStart: true });
      return;
    }
    if (phase === 'go') {
      const ms = Math.round(performance.now() - goAtRef.current);
      setLastMs(ms);
      recordTrial({ reactionMs: ms, falseStart: false });
      return;
    }
    if (phase === 'result' || phase === 'false-start') {
      startTrial();
    }
  }

  const zoneStyles: Record<Phase, string> = {
    ready: 'bg-slate-800 border-slate-600',
    waiting: 'bg-red-900/40 border-red-600',
    go: 'bg-emerald-500/30 border-emerald-400',
    'false-start': 'bg-amber-900/40 border-amber-500',
    result: 'bg-slate-800 border-slate-600',
    done: 'bg-slate-800 border-slate-600',
  };

  const zoneText: Record<Phase, string> = {
    ready: `Cliquez pour demarrer l'essai 1/${NUM_REACTION_TRIALS}`,
    waiting: 'Attendez le signal vert...',
    go: 'Cliquez maintenant !',
    'false-start': "Trop tot ! Cliquez pour reessayer.",
    result: `Temps enregistre : ${lastMs} ms. Cliquez pour l'essai suivant.`,
    done: 'Test termine.',
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-100">Test de temps de reaction</h2>
        <p className="text-sm text-slate-400">
          Cliquez sur la zone des qu&apos;elle devient <span className="text-emerald-400">verte</span>.
          Ne cliquez pas pendant la phase <span className="text-red-400">rouge</span>, sinon c&apos;est
          un faux depart. Essai {Math.min(trials.length + 1, NUM_REACTION_TRIALS)} sur{' '}
          {NUM_REACTION_TRIALS}.
        </p>
      </div>

      <button
        type="button"
        onClick={handleZoneClick}
        disabled={phase === 'done'}
        className={`flex h-56 flex-1 select-none flex-col items-center justify-center rounded-2xl border-2 text-center text-lg font-semibold text-slate-100 transition ${zoneStyles[phase]}`}
      >
        {zoneText[phase]}
      </button>

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        {trials.map((t, i) => (
          <span
            key={i}
            className={`rounded-full border px-3 py-1 ${
              t.falseStart ? 'border-amber-600 text-amber-400' : 'border-slate-700'
            }`}
          >
            #{i + 1}: {t.falseStart ? 'faux depart' : `${t.reactionMs} ms`}
          </span>
        ))}
      </div>
    </div>
  );
}
