# Project Charter Development

## 1. Objectifs du projet
- **But** : Sensibiliser les entreprises aux vulnérabilités liées aux attaques par déni de service (DDoS) via un outil simple et pédagogique.  
- **Objectifs SMART** :  
  1. Fournir une interface web permettant de saisir une IP, un port, une méthode de test, la taille des paquets et la durée, afin de lancer une simulation pédagogique.  
  2. Générer un retour console réaliste affichant l’envoi de paquets et les temps de réponse simulés.  
  3. Permettre aux utilisateurs authentifiés de consulter l’historique de leurs simulations.  

---

## 2. Parties prenantes et rôles
- **Interne** :  
  - **Alcinoé Romanelli** (unique membre du projet)  
    - *Chef de projet* : planification et suivi.  
    - *Développeur back-end* : conception et implémentation du simulateur.  
    - *Responsable technique* : choix des technologies et cadrage pédagogique.  

- **Externe** :  
  - Professeurs / tuteurs : évaluateurs académiques.  
  - Jury scolaire : valide la présentation finale.  
  - Entreprises (fictives) : utilisateurs finaux potentiels pour la sensibilisation.  

---

## 3. Périmètre (Scope)
- **In-scope (inclus)** :  
  - Page d’accueil présentant ce qu’est une attaque DDoS.  
  - Page de simulation avec formulaire (IP, port, méthode, taille des paquets, durée).  
  - Console de retour avec résultats simulés.  
  - Page historique listant les simulations passées par utilisateur.  
  - Authentification basique (compte utilisateur / admin).  

- **Out-of-scope (exclus)** :  
  - Lancement de véritables attaques réseau.  
  - Fonctions avancées (ex. statistiques détaillées, intégration à des systèmes tiers).  
  - Recherche automatique d’IP ou scan réseau.  

---

## 4. Risques
- **Mauvaise interprétation** : risque que le projet soit perçu comme un outil offensif.  
  - *Mitigation* : rappeler clairement dans l’interface et la documentation qu’il s’agit d’un simulateur pédagogique.  
- **Difficultés techniques** : mise en place de l’authentification et de la gestion d’historique.  
  - *Mitigation* : commencer par une version simple, puis enrichir progressivement.  
- **Gestion du temps** : projet sur 3 mois.  
  - *Mitigation* : définir des jalons clairs par phase (conception → dev → test → rendu).  

---

## 5. Plan de haut niveau (3 mois)
- **Mois 1** :  
  - Finalisation de la charte projet.  
  - Documentation technique initiale.  
  - Début du développement de l’interface (page accueil + simulation simple).  

- **Mois 2** :  
  - Implémentation du retour console.  
  - Ajout de l’historique des simulations.  
  - Mise en place de l’authentification.  

- **Mois 3** :  
  - Tests finaux et corrections.  
  - Rédaction du rapport.  
  - Soutenance et livraison.  

---

## 6. Résumé
Cette charte de projet définit les objectifs, les rôles, le périmètre, les risques et le plan de réalisation du simulateur de DDoS. Elle sert de référence pour guider le développement et assurer la réussite du projet dans le temps imparti.
