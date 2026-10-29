# 🍅 Pomodoro Timer

Pomodoro timer con design ispirato ad Apple (vetro smerigliato, elementi arrotondati, colori tenui) e suoni rilassanti.

## Funzionalità

- Timer di focus (default 25 min) e pausa (default 5 min), entrambi regolabili dal menu.
- Campanellina delicata a fine timer; dopo il focus parte automaticamente la pausa.
- Suoni ambientali con slider verticali: pioggia (registrazione), tuoni e vento (sintetizzati).
- Sfondo animato con nuvole e pioggia; con i tuoni attivi, lampi molto leggeri.
- 12 gradienti di sfondo (6 chiari, 6 scuri) con anteprima nel pulsante.
- Pulsante muto/smuto in basso a destra.

## Struttura del progetto

```
pomodoro-timer/
├── src/                      # Codice sorgente (il cuore dell'applicazione)
│   ├── index.html            # Pagina unica
│   ├── assets/               # Risorse statiche
│   │   ├── audio/rain.mp3
│   │   └── icons/favicon.svg
│   ├── styles/               # CSS diviso per responsabilità
│   │   ├── main.css          #   entry point (@import)
│   │   ├── variables.css     #   design tokens e temi light/dark
│   │   ├── base.css          #   reset e stili globali
│   │   ├── background.css    #   nuvole, pioggia, lampi
│   │   ├── timer.css         #   anello, tempo, pulsanti
│   │   ├── controls.css      #   pulsanti tondi e firma
│   │   ├── menu.css          #   menu, slider, crediti
│   │   └── palette.css       #   selettore gradienti
│   └── scripts/              # JavaScript (moduli ES)
│       ├── main.js           #   composizione dell'app
│       ├── config/           #   costanti e palette
│       ├── components/       #   parti dell'interfaccia (timer, menu, sfondo…)
│       ├── services/         #   logica non visiva (motore audio, tuoni)
│       └── utils/            #   funzioni di supporto (DOM, formattazione)
├── scripts/build.mjs         # Build: copia src/ in dist/
├── dist/                     # Output di produzione (generata, non versionata)
├── CREDITS.md                # Attribuzioni
├── package.json
├── .editorconfig
├── .gitignore
└── README.md
```

Criteri adottati: `src/` per il codice sorgente, `dist/` per l'output della build (ignorata da Git), `assets/` per le risorse statiche, e separazione di stili e script per responsabilità. Le cartelle tipiche del lato server (`views/`, `middleware/`, `models/`) non servono: il progetto è una web app statica.

## Avvio

Serve Node.js ≥ 18 (solo per i comandi di comodo, non ci sono dipendenze). I moduli ES richiedono un server HTTP: aprire `index.html` con `file://` non funziona.

```bash
npm run dev       # server locale su src/
npm run build     # genera dist/
npm run preview   # server locale su dist/
npm run clean     # elimina dist/
```

In alternativa: `python3 -m http.server -d src`.

## Crediti

Vedi [CREDITS.md](CREDITS.md).
