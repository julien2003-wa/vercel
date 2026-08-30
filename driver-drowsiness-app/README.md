# Test de somnolence des chauffeurs

Application web autonome (Next.js) pour evaluer et surveiller la vigilance d'un
chauffeur avant et pendant la conduite.

## Fonctionnalites

1. **Questionnaire pre-depart** : echelle de somnolence de Karolinska (KSS),
   heures de sommeil, heures de conduite deja effectuees, alcool/medicaments.
2. **Test de temps de reaction** (5 essais) : mesure la vitesse de reaction a
   un stimulus visuel et detecte les faux departs.
3. **Bilan avant depart** : score combine (questionnaire + reactivite) donnant
   un niveau de risque (faible / modere / eleve) avec les raisons.
4. **Surveillance camera en temps reel** : utilise `@mediapipe/tasks-vision`
   (FaceLandmarker, execute dans le navigateur) pour calculer, image par
   image :
   - l'**Eye Aspect Ratio (EAR)** afin de detecter une fermeture prolongee des
     yeux (alerte visuelle + sonore) ;
   - le **Mouth Aspect Ratio (MAR)** afin de detecter les baillements ;
   - l'absence de visage face a la camera.
5. **Resume de session** : nombre d'episodes de somnolence, de baillements, et
   duree du plus long episode les yeux fermes.

Toute la detection s'execute cote client (dans le navigateur) : aucune image
video n'est envoyee a un serveur.

## Stack technique

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- `@mediapipe/tasks-vision` (FaceLandmarker) pour la detection de points de
  repere du visage, avec calcul manuel de l'EAR/MAR

## Lancer en local

```bash
cd driver-drowsiness-app
npm install
npm run dev
```

Ouvrez http://localhost:3000 et autorisez l'acces a la camera lors de l'etape
de surveillance.

## Avertissement

Cet outil est une aide a la decision et ne constitue pas un dispositif
medical. En cas de doute sur votre etat de vigilance, ne prenez pas la route.
