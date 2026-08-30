'use client';

interface WelcomeStepProps {
  onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-slate-300">
          Ce systeme vous aide a evaluer votre niveau de vigilance avant un trajet, puis peut
          surveiller en continu les signes de somnolence pendant que vous conduisez (yeux fermes,
          baillements) via la camera de votre appareil.
        </p>
        <ul className="flex flex-col gap-2 text-sm text-slate-400">
          <li>1. Questionnaire rapide sur votre etat (echelle de Karolinska, sommeil, trajet).</li>
          <li>2. Test de reactivite : cliquez le plus vite possible des l&apos;apparition du signal.</li>
          <li>3. Bilan avant depart avec un niveau de risque.</li>
          <li>4. Surveillance optionnelle par camera pendant la conduite, avec alertes sonores.</li>
        </ul>
        <p className="text-xs text-slate-500">
          Ce test est un outil d&apos;aide a la decision et ne remplace pas un diagnostic medical.
          En cas de doute sur votre etat, ne prenez pas la route.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto sm:self-start"
      >
        Commencer le test
      </button>
    </div>
  );
}
