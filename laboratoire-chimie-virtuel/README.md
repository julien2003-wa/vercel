# Laboratoire de Chimie Virtuel — Première C (APC Cameroun)

Simulation de paillasse de chimie en **HTML/CSS/JS pur**, sans dépendance ni étape de build : il suffit d'ouvrir `index.html` dans un navigateur.

Page d'accueil avec menu de chapitres : chaque carte ouvre une manipulation virtuelle interactive correspondant à un chapitre du programme de chimie de Première C.

## Chapitres couverts

1. **Cinétique chimique** — facteurs cinétiques (concentration, température, catalyseur) sur la réaction Mg + HCl, suivi du volume de gaz dégagé avec graphique en temps réel et comparaison avec l'essai précédent.
2. **Oxydoréduction — Pile Daniell** — construction d'une pile Zn/Cu, fermeture du circuit, animation des électrons et du dépôt de cuivre, lecture de la tension.
3. **Alcanes — Combustion** — combustion complète (flamme bleue) vs incomplète (flamme jaune fuligineuse, suie), test du CO₂ à l'eau de chaux.
4. **Alcènes** — tests de reconnaissance (eau de brome, KMnO₄) puis hydratation catalytique de l'éthylène en éthanol (exemple phare, entièrement visible : couleur du liquide, bulles, vapeur, étiquette du produit).
5. **Les alcools** — réaction au sodium (tous les alcools), oxydation ménagée au dichromate (distingue alcool I, II, III), estérification à reflux avec apparition visible de deux phases (ester en haut, phase aqueuse en bas).
6. **Dérivés halogénés** — substitution basique (hydrolyse), puis test d'identification au nitrate d'argent (précipité coloré selon l'halogène).
7. **Nomenclature organique** — fiche de référence (groupes fonctionnels) + quiz d'entraînement à choix multiples avec score.

## Notes pédagogiques

- Certaines réactions/mécanismes sont simplifiés pour rester lisibles à ce niveau (ex. la tension de la pile Daniell n'est affichée qu'à circuit fermé).
- Les couleurs et durées des animations sont choisies pour la clarté visuelle, pas pour un réalisme chronométrique.
- Chaque manipulation est indépendante : on peut naviguer librement entre les chapitres depuis le bouton « Accueil ».

## Prochaines étapes possibles

- Ajouter d'autres chapitres (équilibres acido-basiques, dosages, polymères) si le programme l'exige.
- Portage en composant réutilisable (React/Next) si le projet doit s'intégrer à une application plus large.
