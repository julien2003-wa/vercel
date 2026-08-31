export type Step =
  | 'welcome'
  | 'questionnaire'
  | 'reaction-test'
  | 'assessment'
  | 'monitor'
  | 'summary';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface QuestionnaireAnswers {
  /** Karolinska Sleepiness Scale, 1 (tres alerte) a 9 (tres somnolent) */
  kss: number;
  /** Heures de sommeil la nuit precedente */
  hoursSlept: number;
  /** Heures deja passees a conduire pendant ce trajet */
  hoursDriving: number;
  /** Consommation d'alcool ou de medicaments sedatifs */
  impairedByAlcoholOrDrugs: boolean;
}

export interface ReactionTrial {
  /** Temps de reaction en millisecondes, ou null si faux depart */
  reactionMs: number | null;
  falseStart: boolean;
}

export interface ReactionTestResult {
  trials: ReactionTrial[];
  averageMs: number | null;
  falseStarts: number;
}

export interface PreDriveAssessment {
  riskLevel: RiskLevel;
  score: number;
  reasons: string[];
}

export type DrowsinessEventType = 'eyes-closed' | 'yawn' | 'no-face';

export interface DrowsinessEvent {
  type: DrowsinessEventType;
  timestamp: number;
  durationMs?: number;
}

export interface MonitorSessionStats {
  startedAt: number;
  endedAt: number | null;
  eyesClosedEvents: number;
  yawnEvents: number;
  noFaceEvents: number;
  longestEyesClosedMs: number;
  events: DrowsinessEvent[];
}
