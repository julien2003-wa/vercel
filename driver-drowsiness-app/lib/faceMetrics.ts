/**
 * Indices des points de repere (landmarks) MediaPipe Face Mesh (478 points)
 * utilises pour calculer l'Eye Aspect Ratio (EAR) et le Mouth Aspect Ratio (MAR).
 * Reference : correspondance standard entre le mesh MediaPipe et le schema EAR/MAR
 * a 6 points popularise par Soukupova & Cech (2016).
 */
export const RIGHT_EYE = [33, 160, 158, 133, 153, 144] as const;
export const LEFT_EYE = [362, 385, 387, 263, 373, 380] as const;
export const MOUTH_TOP = 13;
export const MOUTH_BOTTOM = 14;
export const MOUTH_LEFT = 78;
export const MOUTH_RIGHT = 308;

/** EAR en dessous de ce seuil : l'oeil est considere comme ferme. */
export const EAR_CLOSED_THRESHOLD = 0.21;
/** Duree de fermeture continue des yeux avant de declencher une alerte de somnolence. */
export const EYES_CLOSED_ALERT_MS = 1200;
/** MAR au dessus de ce seuil : la bouche est consideree ouverte (baillement). */
export const MAR_YAWN_THRESHOLD = 0.55;
/** Duree d'ouverture continue de la bouche avant de compter un baillement. */
export const YAWN_MIN_DURATION_MS = 600;

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

function pixelDistance(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  width: number,
  height: number,
): number {
  const dx = (a.x - b.x) * width;
  const dy = (a.y - b.y) * height;
  return Math.sqrt(dx * dx + dy * dy);
}

function eyeAspectRatio(
  landmarks: NormalizedLandmark[],
  eye: readonly number[],
  width: number,
  height: number,
): number {
  const [p1, p2, p3, p4, p5, p6] = eye.map((i) => landmarks[i]);
  const vertical1 = pixelDistance(p2, p6, width, height);
  const vertical2 = pixelDistance(p3, p5, width, height);
  const horizontal = pixelDistance(p1, p4, width, height);
  if (horizontal === 0) return 0;
  return (vertical1 + vertical2) / (2 * horizontal);
}

/** Moyenne de l'EAR des deux yeux : plus la valeur est basse, plus les yeux sont fermes. */
export function computeEAR(landmarks: NormalizedLandmark[], width: number, height: number): number {
  const left = eyeAspectRatio(landmarks, LEFT_EYE, width, height);
  const right = eyeAspectRatio(landmarks, RIGHT_EYE, width, height);
  return (left + right) / 2;
}

/** Ratio d'ouverture de la bouche : plus la valeur est haute, plus la bouche est ouverte. */
export function computeMAR(landmarks: NormalizedLandmark[], width: number, height: number): number {
  const vertical = pixelDistance(landmarks[MOUTH_TOP], landmarks[MOUTH_BOTTOM], width, height);
  const horizontal = pixelDistance(landmarks[MOUTH_LEFT], landmarks[MOUTH_RIGHT], width, height);
  if (horizontal === 0) return 0;
  return vertical / horizontal;
}
