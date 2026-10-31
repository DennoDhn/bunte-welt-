# Meine bunte Welt 🌈

Eine werbefreie, kinderfreundliche Mal- und Spielwelt für das iPad – vollständig offline nutzbar nach der ersten Installation.

## Enthaltene Spiele und Funktionen

- Freies Malen, Zauberpinsel und Ausmalen mit 6 Vorlagen
- Farbenmischen, Farben und Formen erkennen
- Einfache Tierpuzzles, Seifenblasen und Tiergeräusche
- Tiere füttern, Garten wachsen lassen, Sternenhimmel
- Automatisches Speichern, Bildergalerie und Eltern-PIN
- Keine Werbung, Registrierung, Tracker oder externen Server

## In GitHub Pages veröffentlichen

1. Auf dieser Repository-Seite unter **Settings → General → Danger Zone → Change repository visibility** die Sichtbarkeit auf **Public** ändern. Dafür musst du angemeldet sein; der Quellcode wird dadurch öffentlich, nicht die lokal gespeicherten Zeichnungen.
2. **Settings → Pages → Build and deployment → Deploy from a branch** auswählen.
3. Als Branch **main** und Ordner **/(root)** auswählen, dann **Save**.
4. Nach erfolgreicher Veröffentlichung lautet die Adresse:
   **https://dennodhn.github.io/bunte-welt-/**

## Auf dem iPad installieren

Die veröffentlichte Adresse in **Safari** öffnen, auf **Teilen → Zum Home-Bildschirm** tippen und die Web-App hinzufügen. Einmal mit Internet vollständig laden; danach den Offline-Betrieb im Flugmodus testen.

Um das iPad auf die Kinder-App zu beschränken, **Einstellungen → Bedienungshilfen → Geführter Zugriff** aktivieren.

## Daten & Sicherheit

Zeichnungen bleiben ausschließlich im lokalen Browser-/App-Speicher des jeweiligen iPads, nicht auf GitHub. Der Elternbereich bietet Bildexport und Sicherung. Für wichtige Bilder regelmäßig ein Backup durchführen. Löschen der Website-Daten kann Zeichnungen entfernen.

**Version:** 1.1. Der vollständige Test auf einem echten iPad ist noch offen.

## Technischer Aufbau

- `index.html`: Einstiegspunkt
- `style.css`: responsives Layout
- `app.js`: Spiele, Mal-Engine, Galerie, Elternbereich
- `manifest.webmanifest`: PWA-Installation
- `sw.js`: Offline-Cache
- `icons/icon.svg`: App-Symbol

Statisches Projekt ohne Backend, Datenbank oder externe Abhängigkeiten.
