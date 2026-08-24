# Audit de Merge Queue - 19 Septembre 2026

## Inventaire

| # | Titre | Scope | Fichiers touchés | Deliverable Mapped |
|---|---|---|---|---|
| 137 | moderation-alert | Alerte de modération | 1 | Phase 1 |
| 136 | stale-comments-brief | Brief des commentaires stale | 2 | Phase 1 |
| 135 | blackboard-stripe-panel | Panel Stripe Blackboard | 3 | Phase 2 |
| 134 | blackboard-derniers-users | Panel derniers utilisateurs | 2 | Phase 2 |
| 133 | blackboard-aging-comments | Panel des commentaires vieillissants | 2 | Phase 2 |
| 132 | auto-debug-core-urls | Débuggage auto des URLs core | 4 | Phase 3 |
| 129 | auth-console-cleanup | Nettoyage console auth | 2 | Phase 1 |
| 126 | mini12-health-checker | Health checker mini12 | 1 | Phase 3 |
| 128 | newsletter-draft-aug29 | Draft newsletter 29 Août | 1 | Phase 2 |
| 138 | weekly-engagement-tracker | Tracker d'engagement hebdo | 3 | Phase 3 |

## Dépendances & conflits

- Les PRs #134 (derniers-users) et #133 (aging-comments) touchent aux mêmes fichiers et partagent le scaffolding du panel blackboard.

## Ordre de merge recommandé

1. #137 moderation-alert
2. #136 stale-comments-brief
3. #135 blackboard-stripe-panel
4. #134 blackboard-derniers-users
5. #133 blackboard-aging-comments
6. #132 auto-debug-core-urls
7. #129 auth-console-cleanup
8. #126 mini12-health-checker
9. #128 newsletter-draft-aug29
10. #138 weekly-engagement-tracker

## Risques par PR

- #137: Risque faible, petit ajout d'alerte.
- #136: Risque faible, modification du brief.
- #135: Risque modéré, intégration API externe (Stripe).
- #134: Risque de conflit avec #133 (scaffolding).
- #133: Risque de conflit avec #134 (scaffolding), doit être rebasée après.
- #132: Risque modéré, touche aux URLs core.
- #129: Risque de nécessiter un rebase après #132.
- #126: Risque faible, script externe/isolé.
- #128: Risque très faible, contenu markdown/draft.
- #138: Risque modéré, ajout d'un nouveau tracker global.
