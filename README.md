# Task Manager Testing App

Jednoduchá webová aplikace vytvořená pro účely bakalářské práce a testování manuálními i automatizovanými testy.

## Technologie

### Frontend
- React
- React Router
- Vite
- jednoduchý CSS

### Backend
- Node.js
- Express
- JSON soubor jako úložiště dat

## Struktura projektu

```txt
frontend/
  src/
    pages/
    App.jsx
    api.js
    main.jsx
    styles.css
backend/
  data/db.json
  server.js
```

## Testovací účet

```txt
Email: test@test.cz
Heslo: Test1234
```

## Implementované funkce

- registrace uživatele
- přihlášení uživatele
- odhlášení
- chráněné stránky
- seznam úkolů
- vytvoření úkolu
- úprava úkolu
- odstranění úkolu
- označení úkolu jako dokončený / nedokončený
- filtrování úkolů podle stavu
- vyhledávání úkolů podle názvu
- uživatelský profil
- úprava jména uživatele
- statistiky uživatele
- validace formulářů
- základní error handling
- simulované API zpoždění 500–1000 ms

## Vhodné testovací scénáře

1. Registrace s prázdnými poli.
2. Registrace s neplatným emailem.
3. Registrace s heslem kratším než 8 znaků.
4. Přihlášení se správnými údaji.
5. Přihlášení se špatným heslem.
6. Vytvoření úkolu s validním názvem.
7. Pokus o vytvoření úkolu s krátkým názvem.
8. Úprava existujícího úkolu.
9. Označení úkolu jako dokončeného.
10. Odstranění úkolu.
11. Filtrování dokončených a nedokončených úkolů.
12. Vyhledávání úkolů podle názvu.
13. Zobrazení profilu uživatele.
14. Úprava jména v profilu.
15. Ověření, že nepřihlášený uživatel nemá přístup na `/tasks` a `/profile`.

## Poznámka

Autentizace je jednoduchá. Aplikace není určena pro produkční použití, ale jako testovací prostředí pro ukázku manuálního a automatizovaného testování.
