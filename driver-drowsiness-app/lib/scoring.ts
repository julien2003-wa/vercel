import type { PreDriveAssessment, QuestionnaireAnswers, ReactionTestResult } from './types';

const NUM_REACTION_TRIALS = 5;
const REACTION_MIN_DELAY_MS = 1500;
const REACTION_MAX_DELAY_MS = 4500;
const REACTION_SLOW_THRESHOLD_MS = 400;
const REACTION_VERY_SLOW_THRESHOLD_MS = 550;

function randomReactionDelay(): number {
  return REACTION_MIN_DELAY_MS + Math.random() * (REACTION_MAX_DELAY_MS - REACTION_MIN_DELAY_MS);
}

function summarizeReactionTest(trials: ReactionTestResult['trials']): ReactionTestResult {
  const validTimes = trials.filter((t) => t.reactionMs !== null).map((t) => t.reactionMs as number);
  const averageMs = validTimes.length
    ? Math.round(validTimes.reduce((sum, ms) => sum + ms, 0) / validTimes.length)
    : null;
  const falseStarts = trials.filter((t) => t.falseStart).length;
  return { trials, averageMs, falseStarts };
}

function assessPreDrive(
  answers: QuestionnaireAnswers,
  reaction: ReactionTestResult,
): PreDriveAssessment {
  let score = 0;
  const reasons: string[] = [];

  if (answers.kss >= 7) {
    score += 4;
    reasons.push('Score de somnolence de Karolinska eleve (signes de somnolence marques).');
  } else if (answers.kss >= 5) {
    score += 2;
    reasons.push('Score de somnolence de Karolinska modere.');
  }

  if (answers.hoursSlept < 5) {
    score += 3;
    reasons.push('Moins de 5 heures de sommeil la nuit derniere.');
  } else if (answers.hoursSlept < 6.5) {
    score += 1;
    reasons.push('Sommeil insuffisant la nuit derniere.');
  }

  if (answers.hoursDriving >= 4) {
    score += 2;
    reasons.push('Plus de 4 heures de conduite deja effectuees sans pause prolongee.');
  } else if (answers.hoursDriving >= 2) {
    score += 1;
    reasons.push('Plus de 2 heures de conduite deja effectuees.');
  }

  if (answers.impairedByAlcoholOrDrugs) {
    score += 5;
    reasons.push('Consommation recente d\'alcool ou de medicaments sedatifs signalee.');
  }

  if (reaction.averageMs !== null) {
    if (reaction.averageMs >= REACTION_VERY_SLOW_THRESHOLD_MS) {
      score += 3;
      reasons.push('Temps de reaction moyen tres lent au test de vigilance.');
    } else if (reaction.averageMs >= REACTION_SLOW_THRESHOLD_MS) {
      score += 1;
      reasons.push('Temps de reaction moyen legerement lent au test de vigilance.');
    }
  }

  if (reaction.falseStarts >= 2) {
    score += 2;
    reasons.push('Plusieurs faux departs au test de vigilance (perte d\'attention).');
  }

  let riskLevel: PreDriveAssessment['riskLevel'];
  if (score >= 8) {
    riskLevel = 'high';
  } else if (score >= 4) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  if (reasons.length === 0) {
    reasons.push('Aucun signe de somnolence detecte : bons indicateurs sur tous les tests.');
  }

  return { riskLevel, score, reasons };
}

export {
  NUM_REACTION_TRIALS,
  randomReactionDelay,
  REACTION_SLOW_THRESHOLD_MS,
  REACTION_VERY_SLOW_THRESHOLD_MS,
  summarizeReactionTest,
  assessPreDrive,
};
