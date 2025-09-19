# 🛠️ Plan SCM & Stratégies QA – Simulateur DDoS

---

## 1) Gestion du code source (SCM)

- **Outil** : Git + GitHub  
- **Organisation des branches** :  
  - `main` → version stable, prête à déploiement.  
  - `develop` → intégration continue des nouvelles fonctionnalités.  
  - `feature/*` → une branche par fonctionnalité (ex: `feature/auth`, `feature/simulation`).  
  - `fix/*` → corrections de bugs.  

- **Workflow** :  
  - Chaque PR doit être relue (**code review**) avant merge.  
  - Utilisation des **commits conventionnels** (Conventional Commits).  
  - **Numérotation SemVer** pour les versions (ex: `v1.0.0`).  

---

## 2) Assurance Qualité (QA)

### a) Tests
- **Unitaires** : Jest pour tester les fonctions critiques (ex. validation d’IP, génération du retour console).  
- **Intégration** : Supertest pour vérifier les endpoints API (authentification, simulation, historique).  
- **End-to-End (E2E)** : Playwright/Cypress pour simuler un utilisateur réel (connexion, lancer simulation, consulter historique).  

### b) Validation des entrées
- Utilisation de **Zod (ou Valibot)** pour contrôler toutes les entrées API (`ip`, `port`, `taillePaquets`, etc.).  
- Gestion des erreurs avec codes HTTP clairs (`400 Bad Request`, `401 Unauthorized`, `429 Too Many Requests`).  

### c) Qualité de code
- **ESLint + Prettier** pour un code homogène.  
- Revue de code obligatoire avant chaque merge.  
- Règle de couverture de test minimale : **80%**.  

### d) Sécurité
- **Helmet** pour ajouter les bons headers HTTP.  
- **CORS configuré** pour restreindre les origines.  
- **Rate limiting** sur les routes sensibles (`/simulate`).  
- **Logs centralisés** (winston/pino) pour tracer les simulations et erreurs.  

---

## 3) Intégration & Déploiement (CI/CD)

- **CI** : GitHub Actions  
  - Lancement automatique des tests unitaires/intégration sur chaque PR.  
  - Analyse de sécurité des dépendances (npm audit).  
- **CD** :  
  - Déploiement automatique sur un hébergeur type Vercel (front) et Render/Railway (API).  
  - Environnements distincts : `staging` (pré-prod) et `production`.  

---

## 4) Résumé

✅ Avec ce plan, le projet garantit :  
- Une **gestion claire du cycle de vie du code** (branches, commits, versions).  
- Une **qualité logicielle** via tests, linting et revue.  
- Une **sécurité renforcée** (rate-limit, validation, logs).  
- Une **intégration continue fluide** avec tests et déploiement automatisés.  

---
