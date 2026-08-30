'use client';

import { useState } from 'react';
import type { QuestionnaireAnswers } from '@/lib/types';

interface QuestionnaireStepProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
}

const KSS_LABELS: Record<number, string> = {
  1: 'Tres alerte',
  2: 'Alerte',
  3: 'Plutot alerte',
  4: 'Ni alerte ni somnolent',
  5: 'Quelques signes de somnolence',
  6: 'Somnolent, mais sans effort pour rester eveille',
  7: 'Somnolent, effort pour rester eveille',
  8: 'Tres somnolent, forte lutte contre le sommeil',
  9: 'Extremement somnolent, ne peut plus lutter',
};

export default function QuestionnaireStep({ onComplete }: QuestionnaireStepProps) {
  const [kss, setKss] = useState<number | null>(null);
  const [hoursSlept, setHoursSlept] = useState('7');
  const [hoursDriving, setHoursDriving] = useState('0');
  const [impaired, setImpaired] = useState(false);

  const canSubmit = kss !== null && hoursSlept !== '' && hoursDriving !== '';

  function handleSubmit() {
    if (kss === null) return;
    onComplete({
      kss,
      hoursSlept: Number(hoursSlept),
      hoursDriving: Number(hoursDriving),
      impairedByAlcoholOrDrugs: impaired,
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-100">
          Comment vous sentez-vous en ce moment ?
        </h2>
        <p className="text-xs text-slate-500">Echelle de somnolence de Karolinska (KSS)</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKss(value)}
              className={`rounded-lg border px-2 py-3 text-sm font-semibold transition ${
                kss === value
                  ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        {kss !== null && <p className="text-sm text-slate-400">{KSS_LABELS[kss]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Heures de sommeil la nuit derniere
          <input
            type="number"
            min={0}
            max={16}
            step={0.5}
            value={hoursSlept}
            onChange={(e) => setHoursSlept(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Heures deja passees a conduire aujourd&apos;hui
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            value={hoursDriving}
            onChange={(e) => setHoursDriving(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={impaired}
          onChange={(e) => setImpaired(e.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950 accent-sky-500"
        />
        J&apos;ai consomme de l&apos;alcool ou un medicament sedatif recemment
      </label>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-auto w-full rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:self-start"
      >
        Continuer vers le test de reaction
      </button>
    </div>
  );
}
