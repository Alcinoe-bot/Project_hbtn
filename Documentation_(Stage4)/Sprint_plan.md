# 📅 Planning et Organisation — Projet Attaques Cybersécurité (MVP)

Le projet est structuré autour des **User Stories définies**,
organisées pour livrer rapidement une version fonctionnelle d' **Attaques de sécurité réseau**,
puis enrichir progressivement avec l’authentification, l’historique et l’administration.

---

## 🗓️ Planning prévisionnel (8 semaines)

| Semaine | Dates | User Stories / Tâches principales | Story Points | Livrable attendu | Responsable |
|---------|-------|-----------------------------------|--------------|-----------------|-------------|
| **1** | 30 sept. – 6 oct. | - Familiarisation stack (React, TS, Tailwind, shadcn/ui)<br>- Mise en place environnements (front + routing + Git)<br>- NavBar + pages vides (Accueil, Simulation, Historique, Utilisateurs, NotAllowed) | 8 pts | Projet initialisé + navigation fonctionnelle | Dév (solo) |
| **2** | 7 – 13 oct. | - US1 : Page Accueil avec explication DDoS + avertissement pédagogique<br>- Mise en place thème (bleu foncé/gris clair/blanc)<br>- Composants UI (Card, Button, Alert) | 10 pts | Page d’accueil finalisée + style global cohérent | Dév (solo) |
| **3** | 14 – 20 oct. | - US2 : Formulaire d'attaque (IP, port, méthode, taille paquets, durée)<br>- retour console pour **DDoS**<br>- Sauvegarde locale (localStorage) de la simulation | 18 pts | Simulation DDoS fictive fonctionnelle + enregistrement | Dév (solo) |
| **4** | 21 – 27 oct. | - US3 : Ajout attaque pédagogiques **Brute-force** et **Injection SQL**<br>- Logs console simulés (tentatives / payloads factices)<br>- Historique utilisateur (vue détaillée) | 20 pts | Simulation multi-méthodes + historique utilisateur | Dév (solo) |
| **5** | 28 oct. – 3 nov. | - US4 : Authentification basique (login/logout)<br>- Gestion de rôles (user/admin)<br>- Restriction d’accès (simulation + historique = users connectés) | 16 pts | Auth fonctionnelle + rôles actifs | Dév (solo) |
| **6** | 4 – 10 nov. | - US5 : Page Admin<br>- Gestion utilisateurs (CRUD fictif)<br>- Historique global (toutes simulations)<br>- Export CSV (optionnel) | 18 pts | Interface Admin + supervision globale | Dév (solo) |
| **7** | 11 – 17 nov. | - Fiches pédagogiques pour chaque attaque (DDoS, Brute-force, SQLi)<br>- Explication + contre-mesures (mitigation)<br>- Dashboard simple (graphes stats simulées) | 20 pts | Mode pédagogique complet + dashboard basique | Dév (solo) |
| **8** | 18 – 24 nov. | - Stabilisation + corrections bugs<br>- Tests QA (unitaires + navigation)<br>- Documentation technique (README, guide installation, guide usage pédagogique)<br>- Préparation slides + démo | 15 pts | MVP final stable + doc complète + support soutenance | Dév (solo) |
| **Demoday** | 25 nov. | - Soutenance et démo du MVP Simulateur pédagogique | - | Présentation publique et démonstration | Dév (solo) |

---

## 🔄 Rituels Agile intégrés
- **Daily Check** (15 min perso / log journalier) → avancement + blocages.
- **Sprint Review** (fin de semaine) → vérifier livrables de la semaine.
- **Sprint Retrospective** (fin de semaine) → identifier points d’amélioration.

---

## 📊 Estimations & Priorités
- Méthode : **MoSCoW** → toutes les US listées sont **Must Have** pour le MVP, sauf export CSV (Could Have).
- **Capacité par sprint** : ~15 à 20 points (adapté à un développeur solo).
- **Dépendances clés** :
  - Authentification → nécessaire avant gestion utilisateurs/admin.
  - Simulations → nécessaires avant l’historique et le dashboard.
  - Fiches pédagogiques → livrées après que les 3 méthodes soient implémentées.

---

## 📚 Ressources
- [Scrum.org – Sprint Planning Guide](https://www.scrum.org/resources/what-is-sprint-planning)  
- [Agile Business – MoSCoW Prioritisation](https://www.agilebusiness.org/dsdm-project-framework/moscow-prioririsation.html)  

---
