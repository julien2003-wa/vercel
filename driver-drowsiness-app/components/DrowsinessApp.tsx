'use client';

import { useState } from 'react';
import type {
  MonitorSessionStats,
  PreDriveAssessment,
  QuestionnaireAnswers,
  ReactionTestResult,
  Step,
} from '@/lib/types';
import WelcomeStep from '@/components/steps/WelcomeStep';
import QuestionnaireStep from '@/components/steps/QuestionnaireStep';
import ReactionTestStep from '@/components/steps/ReactionTestStep';
import AssessmentStep from '@/components/steps/AssessmentStep';
import MonitorStep from '@/components/steps/MonitorStep';
import SummaryStep from '@/components/steps/SummaryStep';

const STEP_ORDER: Step[] = [
  'welcome',
  'questionnaire',
  'reaction-test',
  'assessment',
  'monitor',
  'summary',
];

const STEP_LABELS: Record<Step, string> = {
  welcome: 'Accueil',
  questionnaire: 'Questionnaire',
  'reaction-test': 'Test de reaction',
  assessment: 'Bilan',
  monitor: 'Surveillance',
  summary: 'Resume',
};

export default function DrowsinessApp() {
  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [reaction, setReaction] = useState<ReactionTestResult | null>(null);
  const [assessment, setAssessment] = useState<PreDriveAssessment | null>(null);
  const [monitorStats, setMonitorStats] = useState<MonitorSessionStats | null>(null);

  const currentIndex = STEP_ORDER.indexOf(step);

  function restart() {
    setAnswers(null);
    setReaction(null);
    setAssessment(null);
    setMonitorStats(null);
    setStep('welcome');
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Test de somnolence des chauffeurs
        </h1>
        <p className="text-sm text-slate-400">
          Evaluez votre etat de vigilance avant de prendre la route et surveillez les signes de
          fatigue pendant la conduite.
        </p>
      </header>

      <ol className="flex flex-wrap gap-2 text-xs text-slate-400">
        {STEP_ORDER.map((s, i) => (
          <li
            key={s}
            className={`rounded-full border px-3 py-1 ${
              i === currentIndex
                ? 'border-sky-400 text-sky-300'
                : i < currentIndex
                  ? 'border-slate-600 text-slate-500 line-through'
                  : 'border-slate-800 text-slate-600'
            }`}
          >
            {i + 1}. {STEP_LABELS[s]}
          </li>
        ))}
      </ol>

      <section className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:p-8">
        {step === 'welcome' && <WelcomeStep onStart={() => setStep('questionnaire')} />}

        {step === 'questionnaire' && (
          <QuestionnaireStep
            onComplete={(a) => {
              setAnswers(a);
              setStep('reaction-test');
            }}
          />
        )}

        {step === 'reaction-test' && (
          <ReactionTestStep
            onComplete={(r) => {
              setReaction(r);
              setStep('assessment');
            }}
          />
        )}

        {step === 'assessment' && answers && reaction && (
          <AssessmentStep
            answers={answers}
            reaction={reaction}
            onAssessed={setAssessment}
            onStartMonitoring={() => setStep('monitor')}
            onRestart={restart}
          />
        )}

        {step === 'monitor' && (
          <MonitorStep
            onEnd={(stats) => {
              setMonitorStats(stats);
              setStep('summary');
            }}
          />
        )}

        {step === 'summary' && assessment && (
          <SummaryStep assessment={assessment} monitorStats={monitorStats} onRestart={restart} />
        )}
      </section>
    </div>
  );
}
