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
task-manager-app/
  frontend/
    src/
      components/        # znovupoužitelné React komponenty
      pages/             # jednotlivé stránky aplikace
      App.jsx            # hlavní komponenta s routováním
      api.js             # komunikace s backend API
      main.jsx           # vstupní bod React aplikace
      styles.css         # globální styly

  backend/
    data/
      db.json            # JSON soubor pro ukládání dat
    server.js            # Express server a API endpointy
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
- označení úkolu jako splněný / nesplněný
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
2. Registrace s neplatným e-mailem.
3. Registrace s heslem kratším než 8 znaků.
4. Přihlášení se správnými údaji.
5. Přihlášení se špatným heslem.
6. Vytvoření úkolu s validním názvem.
7. Pokus o vytvoření úkolu s krátkým názvem.
8. Úprava existujícího úkolu.
9. Označení úkolu jako splněné.
10. Odstranění úkolu.
11. Filtrování splněných a nesplněných úkolů.
12. Vyhledávání úkolů podle názvu.
13. Zobrazení profilu uživatele.
14. Úprava jména v profilu.
15. Ověření, že nepřihlášený uživatel nemá přístup na `/tasks` a `/profile`.

## Poznámka

Autentizace je jednoduchá. Aplikace není určena pro produkční použití, ale jako testovací prostředí pro ukázku manuálního a automatizovaného testování.
