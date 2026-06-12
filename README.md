# Task Manager Testing App

Webová aplikace vytvořená pro účely bakalářské práce zaměřené na manuální a automatizované testování webových aplikací.

Aplikace slouží jako testovací prostředí obsahující autentizaci uživatelů, správu úkolů, validace formulářů, simulaci chyb backendu a další funkcionality vhodné pro tvorbu různých testovacích scénářů.

---

## Použité technologie

### Frontend

* React
* React Router
* Vite
* React Toastify
* CSS

### Backend

* Node.js
* Express
* bcryptjs
* JSON soubor jako datové úložiště (dočasně)

---

## Struktura projektu

```txt
task-manager-app/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Loader.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskStats.jsx
│   │   │   └── TaskToolbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── TaskEdit.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── alerts.css
│   │   │   ├── base.css
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── layout.css
│   │   │   ├── profile.css
│   │   │   ├── responsive.css
│   │   │   ├── tasks.css
│   │   │   ├── toast.css
│   │   │   └── index.css
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── data/
│   │   └── db.json
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── delayMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── simulatedErrorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── services/
│   │   └── dbService.js
│   │
│   ├── utils/
│   │   ├── createId.js
│   │   ├── userUtils.js
│   │   └── validation.js
│   │
│   └── server.js
│
└── README.md
```

---

## Implementované funkce

### Autentizace

* registrace uživatele
* přihlášení uživatele
* odhlášení uživatele
* hashování hesel pomocí bcrypt
* ochrana neveřejných stránek

### Správa úkolů

* vytvoření úkolu
* úprava úkolu
* odstranění úkolu
* označení úkolu jako dokončený / nedokončený
* nastavení kategorie
* nastavení priority
* nastavení termínu dokončení

### Filtrování a vyhledávání

* vyhledávání podle názvu
* filtrování dokončených úkolů
* filtrování nedokončených úkolů
* zobrazení všech úkolů

### Řazení úkolů

* podle data vytvoření (nejnovější a nejstarší)
* podle termínu dokončení (nejbližší a nejvzdálenější)
* podle priority (nejvyšší a nejnižší)
* podle názvu (A-Z)

### Uživatelský profil

* zobrazení údajů uživatele
* úprava jména uživatele
* statistiky úkolů
* datum registrace

### Validace

* povinná pole
* validace e-mailu
* minimální délka hesla
* minimální délka názvu úkolu
* validace termínu dokončení

### Testovací funkcionality

* simulace API zpoždění (500–1000 ms)
* simulace náhodných API chyb
* toast notifikace
* loading stavy
* error handling

---

## Vhodné testovací scénáře

### Registrace

1. Registrace s prázdnými poli.
2. Registrace s neplatným e-mailem.
3. Registrace s krátkým heslem.
4. Registrace s již existujícím e-mailem.

### Přihlášení

5. Přihlášení se správnými údaji.
6. Přihlášení s nesprávným heslem.
7. Přihlášení s neexistujícím účtem.

### Správa úkolů

8. Vytvoření nového úkolu.
9. Vytvoření úkolu s neplatnými daty.
10. Úprava existujícího úkolu.
11. Odstranění úkolu.
12. Označení úkolu jako dokončeného.
13. Označení úkolu jako nedokončeného.

### Filtrování a řazení

14. Vyhledávání podle názvu.
15. Filtrování dokončených úkolů.
16. Filtrování nedokončených úkolů.
17. Řazení podle priority.
18. Řazení podle termínu.

### Profil

19. Zobrazení profilu uživatele.
20. Úprava jména uživatele.
21. Kontrola statistik uživatele.

### Bezpečnost

22. Přístup na chráněné stránky bez přihlášení.
23. Přístup k úkolům jiného uživatele.
24. Ověření hashování hesel.

### Testování chyb

25. Simulovaná chyba backendu.
26. Ověření zobrazení toast notifikace.
27. Ověření loading stavů.

---

## Určení aplikace

Primárním cílem projektu je vytvořit jednoduché, přehledné a snadno testovatelné prostředí pro:

* manuální testování
* automatizované testování pomocí Playwright
* automatizované testování pomocí Cypress
* automatizované testování pomocí Selenium

Aplikace slouží jako praktická část bakalářské práce zaměřené na porovnání různých přístupů k testování webových aplikací.