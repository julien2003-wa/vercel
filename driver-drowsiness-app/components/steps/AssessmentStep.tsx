'use client';

import { useEffect, useMemo } from 'react';
import { assessPreDrive } from '@/lib/scoring';
import type { PreDriveAssessment, QuestionnaireAnswers, ReactionTestResult, RiskLevel } from '@/lib/types';

interface AssessmentStepProps {
  answers: QuestionnaireAnswers;
  reaction: ReactionTestResult;
  onAssessed: (assessment: PreDriveAssessment) => void;
  onStartMonitoring: () => void;
  onRestart: () => void;
}

const RISK_COPY: Record<RiskLevel, { title: string; color: string; advice: string }> = {
  low: {
    title: 'Risque faible',
    color: 'text-emerald-400 border-emerald-500',
    advice: 'Vous semblez suffisamment alerte pour prendre la route. Restez attentif aux signes de fatigue.',
  },
  medium: {
    title: 'Risque modere',
    color: 'text-amber-400 border-amber-500',
    advice:
      'Des signes de fatigue sont presents. Envisagez une pause, un cafe ou de reporter le trajet si possible.',
  },
  high: {
    title: 'Risque eleve',
    color: 'text-red-400 border-red-500',
    advice:
      "Il est fortement deconseille de prendre la route dans cet etat. Reposez-vous avant de conduire.",
  },
};

export default function AssessmentStep({
  answers,
  reaction,
  onAssessed,
  onStartMonitoring,
  onRestart,
}: AssessmentStepProps) {
  const assessment = useMemo(() => assessPreDrive(answers, reaction), [answers, reaction]);

  useEffect(() => {
    onAssessed(assessment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment]);

  const copy = RISK_COPY[assessment.riskLevel];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className={`rounded-xl border-2 p-5 ${copy.color}`}>
        <h2 className="text-xl font-bold">{copy.title}</h2>
        <p className="mt-2 text-sm text-slate-300">{copy.advice}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-200">Details du bilan</h3>
        <ul className="flex flex-col gap-1 text-sm text-slate-400">
          {assessment.reasons.map((reason, i) => (
            <li key={i}>- {reason}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
        <p>Temps de reaction moyen : {reaction.averageMs ?? '—'} ms</p>
        <p>Faux departs : {reaction.falseStarts}</p>
      </div>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onStartMonitoring}
          className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Demarrer la surveillance camera pendant la conduite
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
        >
          Refaire le test
        </button>
      </div>
    </div>
  );
}
