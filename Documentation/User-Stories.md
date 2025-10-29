# User Stories

## MUST HAVE
- **En tant qu’utilisateur**, je veux saisir une IP, un port, une méthode de test, une taille de paquets et une durée, afin de lancer une attaque DDoS.  
  **Critères d’acceptation :**  
  - L’utilisateur peut remplir tous les champs du formulaire (IP, port, méthode, taille, durée).  
  - L’utilisateur peut cliquer sur “Lancer l'attaque”.  
  - Un retour console s’affiche avec des lignes simulant l’envoi de paquets et le temps de réponse.

- **En tant qu’utilisateur**, je veux pouvoir créer un compte et m’authentifier, afin d’accéder aux fonctionnalités protégées.  
  **Critères d’acceptation :**  
  - L’utilisateur peut s’inscrire avec email et mot de passe.  
  - L’utilisateur peut se connecter/déconnecter.  
  - Seuls les utilisateurs connectés accèdent à la page "Attaque" et à leur Historique.

- **En tant qu’utilisateur**, je veux consulter l’historique de mes attaques, afin de suivre mes tests passés.  
  **Critères d’acceptation :**  
  - L’utilisateur peut voir une liste de ses attaques avec IP, port, méthode, durée et résultat.  
  - Les simulations s’enregistrent automatiquement après chaque test.

---

## SHOULD HAVE
- **En tant qu’administrateur**, je veux gérer les utilisateurs (créer, modifier, supprimer), afin de contrôler les accès.  
  **Critères d’acceptation :**  
  - L’admin voit un tableau listant tous les utilisateurs.  
  - L’admin peut créer un nouvel utilisateur.  
  - L’admin peut modifier le rôle ou supprimer un utilisateur existant.

- **En tant qu’administrateur**, je veux consulter l’historique global de toutes les simulations, afin de superviser l’usage de l’application.  
  **Critères d’acceptation :**  
  - L’admin accède à une page “Historique global”.  
  - Le tableau affiche les simulations de tous les utilisateurs.

---

## COULD HAVE
- **En tant qu’utilisateur**, je veux visualiser des statistiques (graphiques, compteurs), afin d’analyser mes attaques plus facilement.  
  **Critères d’acceptation :**  
  - L’utilisateur voit un graphique du nombre de d'attaques effectuées par jour/semaine.  
  - L’utilisateur voit un top 3 des méthodes de test les plus utilisées.

---

## WON’T HAVE

-   **Toute fonctionnalité permettant de lancer de véritables attaques DDoS sur un tiers extérieur.** L'application est strictement pédagogique et se limite à une **attaque sur un serveur que l'on possède**.
    **Justification technique :**
    -   Aucun paquet n'est envoyé vers des adresses IP externes (uniquement en accord avec le propriétaire).
    -   L'attaque s'exécute entièrement côté client (dans le navigateur) ou via un backend qui mock les résultats.
    -   Toute tentative d'étendre l'application pour générer du trafic réseau réel hors scope est interdit.
