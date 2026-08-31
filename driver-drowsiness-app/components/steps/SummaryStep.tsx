'use client';

import type { MonitorSessionStats, PreDriveAssessment, RiskLevel } from '@/lib/types';

interface SummaryStepProps {
  assessment: PreDriveAssessment;
  monitorStats: MonitorSessionStats | null;
  onRestart: () => void;
}

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Faible',
  medium: 'Modere',
  high: 'Eleve',
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${seconds.toString().padStart(2, '0')} s`;
}

export default function SummaryStep({ assessment, monitorStats, onRestart }: SummaryStepProps) {
  const sessionDurationMs =
    monitorStats && monitorStats.endedAt ? monitorStats.endedAt - monitorStats.startedAt : 0;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h2 className="text-lg font-semibold text-slate-100">Resume de la session</h2>

      <div className="rounded-xl border border-slate-800 p-4">
        <p className="text-sm text-slate-400">Bilan avant depart</p>
        <p className="text-xl font-bold text-slate-100">
          Risque {RISK_LABEL[assessment.riskLevel]} ({assessment.score} pts)
        </p>
      </div>

      {monitorStats ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-400">
            Duree de surveillance : {formatDuration(sessionDurationMs)}
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg border border-slate-800 p-3">
              <p className="text-2xl font-bold text-slate-100">{monitorStats.eyesClosedEvents}</p>
              <p className="text-slate-500">Episodes yeux fermes</p>
            </div>
            <div className="rounded-lg border border-slate-800 p-3">
              <p className="text-2xl font-bold text-slate-100">{monitorStats.yawnEvents}</p>
              <p className="text-slate-500">Baillements</p>
            </div>
            <div className="rounded-lg border border-slate-800 p-3">
              <p className="text-2xl font-bold text-slate-100">{monitorStats.noFaceEvents}</p>
              <p className="text-slate-500">Visage absent</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Episode le plus long les yeux fermes : {monitorStats.longestEyesClosedMs} ms
          </p>

          {monitorStats.eyesClosedEvents > 0 || monitorStats.yawnEvents >= 3 ? (
            <p className="rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
              Des signes de somnolence ont ete detectes pendant la surveillance. Faites une pause
              des que possible.
            </p>
          ) : monitorStats.noFaceEvents > 0 ? (
            <p className="rounded-lg border border-amber-700 bg-amber-950/30 p-3 text-sm text-amber-300">
              Le visage du conducteur n&apos;a pas ete visible par la camera a plusieurs reprises.
              Verifiez le positionnement de la camera pour une surveillance fiable.
            </p>
          ) : (
            <p className="rounded-lg border border-emerald-700 bg-emerald-950/30 p-3 text-sm text-emerald-300">
              Aucun signe significatif de somnolence detecte pendant la surveillance.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Surveillance camera non effectuee.</p>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-auto w-full rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto sm:self-start"
      >
        Refaire un test
      </button>
    </div>
  );
}
