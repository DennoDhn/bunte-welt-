# Meine bunte Welt – Version 1.3

Eine werbefreie, offlinefähige Mal- und Spielwelt für Kinder ab etwa zwei Jahren.

## Direkt öffnen
https://dennodhn.github.io/bunte-welt-/

Auf dem iPad in Safari öffnen, über **Teilen → Zum Home-Bildschirm** installieren. Die App anschließend einmal mit Internet vollständig laden und im Flugmodus prüfen. Für eine Beschränkung auf die App **Geführten Zugriff** in iPadOS aktivieren.

## 14 Aktivitäten
- Freies Finger-Malen mit Zauberpinsel, Stempel und Radierer
- 10 Ausmalbilder: Fisch, Blume, Haus, Schmetterling, Auto, Luftballons, Sonne, Baum, Katze, Rakete
- Stickerbuch mit drei Landschaften und 36 Stickern; Szenen bleiben lokal gespeichert
- Zauberbilder mit fünf verdeckten Motiven zum Freiwischen
- Farben und Formen, Tierpuzzle, Farben mischen, Seifenblasen, Tiere füttern
- Tierbabys mit den richtigen Elterntieren zusammenbringen
- Tierlaute, Blumen wachsen lassen, Sternenhimmel
- Musik-Ecke mit Xylophon, Trommel, Glöckchen und Rassel

## Familienfunktionen
Vier Lieblingsspiele auf der Startseite, optionaler Kindername, Spielstufe, Farbwelt, vergrößerter Spielmodus, Ruhemodus, Eltern-PIN.

## Bilder und Backups
Bilder liegen auf dem jeweiligen Gerät in IndexedDB. Im Elternbereich kann man einzelne Kunstwerke exportieren oder löschen und das gesamte Familien-Archiv als **JSON-Backup** einschließlich Ausmalfortschritt, Stickerbildern und Einstellungen sichern und wiederherstellen. Die Eltern-PIN wird nicht exportiert. Nach der Wiederherstellung bleiben bestehende Malentwürfe unangetastet.

**Wichtig:** iPadOS kann lokalen Browser-Speicher unter bestimmten Umständen entfernen. Wichtige Bilder regelmäßig außerhalb der App sichern. Der echte iPad-Test ist noch ausstehend.

## Technik
Statische PWA mit `index.html`, `style.css`, `extra.js`, `app.js`, `sw.js`, `manifest.webmanifest` und `icons/`. Keine externen Bibliotheken, keine Werbung, kein Tracking, keine Server-Datenbank.

**GitHub:** `main` ist die veröffentlichte Version. Backup: `backup/v1.2-before-v1.3`; Entwicklung: `feature/v1.3-kreativwelt`.
