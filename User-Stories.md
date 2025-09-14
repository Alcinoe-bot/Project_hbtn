# User Stories

## MUST HAVE
- **En tant qu’utilisateur**, je veux saisir une IP, un port, une méthode de test, une taille de paquets et une durée, afin de lancer une simulation pédagogique d’attaque DDoS.  
  **Critères d’acceptation :**  
  - L’utilisateur peut remplir tous les champs du formulaire (IP, port, méthode, taille, durée).  
  - L’utilisateur peut cliquer sur “Lancer la simulation”.  
  - Un retour console s’affiche avec des lignes simulant l’envoi de paquets et le temps de réponse.

- **En tant qu’utilisateur**, je veux pouvoir créer un compte et m’authentifier, afin d’accéder aux fonctionnalités protégées.  
  **Critères d’acceptation :**  
  - L’utilisateur peut s’inscrire avec email et mot de passe.  
  - L’utilisateur peut se connecter/déconnecter.  
  - Seuls les utilisateurs connectés accèdent à la page Simulation et à leur Historique.

- **En tant qu’utilisateur**, je veux consulter l’historique de mes simulations, afin de suivre mes tests passés.  
  **Critères d’acceptation :**  
  - L’utilisateur peut voir une liste de ses simulations avec IP, port, méthode, durée et résultat.  
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
- **En tant qu’utilisateur**, je veux visualiser des statistiques (graphiques, compteurs), afin d’analyser mes simulations plus facilement.  
  **Critères d’acceptation :**  
  - L’utilisateur voit un graphique du nombre de simulations effectuées par jour/semaine.  
  - L’utilisateur voit un top 3 des méthodes de test les plus utilisées.

---

## WON’T HAVE
- **En tant qu’utilisateur**, je veux pouvoir lancer de véritables attaques réseau sur des serveurs externes, afin de tester des systèmes réels.  
  **Critères d’acceptation :**  
  - L’application ne permet pas d’attaquer des cibles réelles.  
  - Toute tentative de fonctionnalité offensive est explicitement exclue.
