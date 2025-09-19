# 📖 Documentation API Simulateur DDoS

---

__1) APIs externes utilisées__  
- **ipinfo.io** → pour enrichir les informations sur l’adresse IP saisie (organisation, localisation, ASN).  
- **NVD (CVE Database)** → pour référencer des vulnérabilités connues associées à certains services/ports.  
- **Sentry (ou équivalent)** → suivi et analyse des erreurs backend.  

---

__2) API interne Simulateur DDoS__  
Toutes les routes sont sous la base `/api/v1`.  

- **Format d’entrée** : JSON (sauf filtres en query string).  
- **Format de sortie** : JSON.  
- **Authentification** : JWT (access token) via `Authorization: Bearer <token>`.  

---

__Authentification__  

| URL             | Méthode | Entrée                               | Sortie                          |
|-----------------|---------|--------------------------------------|---------------------------------|
| `/auth/register` | POST    | `{ email, password, role? }`        | `{ user, tokens }`              |
| `/auth/login`   | POST    | `{ email, password }`                | `{ user, tokens }`              |
| `/auth/refresh` | POST    | `{ refresh }`                        | `{ tokens }`                    |
| `/auth/logout`  | POST    | -                                    | `{ ok:true }`                   |

---

__Utilisateur__  

| URL        | Méthode | Entrée                          | Sortie                                    |
|------------|---------|---------------------------------|-------------------------------------------|
| `/users/me` | GET     | -                               | `{ id, email, role }`                     |
| `/users`    | GET     | (admin) `?page&query`           | `{ items:[...], total }`                  |
| `/users/:id`| PATCH   | `{ email?, role? }`             | `{ user }`                                |
| `/users/:id`| DELETE  | -                               | `{ ok:true }`                             |

---

__Simulations__  

| URL             | Méthode | Entrée                                                    | Sortie                                |
|-----------------|---------|-----------------------------------------------------------|---------------------------------------|
| `/simulate`     | POST    | `{ ip, port, methode, taillePaquets, dureeSec }`          | `{ retourConsole, latenceMs, id }`    |
| `/simulate/:id` | GET     | -                                                         | `{ id, params, retourConsole, date }` |

---

__Historique__  

| URL          | Méthode | Entrée                   | Sortie                                |
|--------------|---------|--------------------------|---------------------------------------|
| `/history`   | GET     | `?page&pageSize`         | `{ items:[...], total }`              |
| `/history/:id`| DELETE | (admin) -                | `{ ok:true }`                         |

---

__Logs & Monitoring__  

| URL        | Méthode | Entrée                   | Sortie                  |
|------------|---------|--------------------------|-------------------------|
| `/logs`    | GET     | (admin) `?from&to&type` | `{ items:[...], total }`|

---

__Sécurité__  
- Toutes les données sensibles sont protégées par :  
  - **Validation stricte** des entrées (Zod/Valibot).  
  - **Rate limiting** sur `/simulate` (évite l’abus).  
  - **Helmet + CORS configuré** sur l’API.  
- Stockage sécurisé des tokens (JWT avec refresh).  

---
