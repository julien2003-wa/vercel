# Laboratoire de Chimie Virtuel

Simulation de paillasse de chimie (niveau lycée) en **HTML/CSS/JS pur**, sans dépendance ni étape de build : il suffit d'ouvrir `index.html` dans un navigateur.

## Objectif

Permettre aux élèves de manipuler virtuellement le matériel de laboratoire (ballon, bec Bunsen, support, burettes/flacons de réactifs) pour reproduire une expérience réelle et en observer le résultat.

## Exemple implémenté : hydratation de l'éthylène

1. Verser l'eau distillée dans le ballon.
2. Ajouter quelques gouttes d'acide sulfurique (catalyseur).
3. Faire buller l'éthylène (glisser-déposer ou clic sur le flacon).
4. Chauffer : la réaction s'anime (bulles, vapeur) puis le liquide change de couleur pour représenter l'éthanol formé.

Équation : `CH₂=CH₂ + H₂O --(H₂SO₄, Δ)--> CH₃-CH₂-OH`

Un panneau latéral affiche le protocole, l'équation, un journal d'observations et une note pédagogique. Un bouton « Réinitialiser » permet de recommencer l'expérience.

## Prochaines étapes possibles

- Ajouter d'autres réactions (estérification, combustion, dosages acido-basiques…).
- Sélecteur de « manipulation » pour changer d'expérience sans changer de page.
- Portage en composant réutilisable (React/Next) si le projet doit s'intégrer à une application plus large.
