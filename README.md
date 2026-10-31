# Meine bunte Welt – Version 1.2

Offline-fähige, werbefreie Mal- und Spielwelt für Kinder, die von Familien auf dem eigenen Gerät genutzt werden kann. Keine Registrierung, keine Cloud-Konten, keine Werbung.

## Neu in Version 1.2

- Großer Spielmodus: Malfläche und Spiele füllen den verfügbaren App-Bereich aus.
- Ein Knopf wechselt zwischen Fokusmodus und normaler Ansicht.
- Optionaler Kindername, Alters-/Schwierigkeitsstufe, drei Farbwelten, Standard-Vollbild im Elternbereich.
- Korrektur eines HTML-Layoutfehlers der bisherigen Maloberfläche.
- Neuer PWA-Cache für Version 1.2.

## Auf dem iPad installieren

1. https://dennodhn.github.io/bunte-welt-/ in Safari öffnen.
2. Teilen → Zum Home-Bildschirm → Als Web-App öffnen (falls angezeigt) → Hinzufügen.
3. Als App vom Home-Bildschirm starten; die Safari-Adressleiste entfällt.
4. Flugmodus aktivieren und die App testen.

**Hinweis:** Der Fokusmodus nutzt den verfügbaren App-Bildschirm. Je nach iPadOS-Version bleiben Systemleisten sichtbar; eine Website kann diese nicht verlässlich ausschalten. Für einen geschützten Bereich den iPad-*Geführten Zugriff* einschalten.

## Datenschutz

Die Einstellungen sowie Zeichnungen liegen nur im Browser-/Web-App-Speicher des jeweiligen Geräts. Die App enthält kein Tracking und sendet keine Bilder an GitHub. Gezeichnete Bilder regelmäßig aus dem Elternbereich exportieren; bei Löschen der Website-Daten können sie verloren gehen. Familien verwenden jeweils ihre eigenen lokalen Daten, kein Login erforderlich.

## Dateien

- index.html: HTML-Einstieg
- style.css: Layout und Fokus-Modus
- app.js: Spiele, Malen, Eltern-Einstellungen, Galerie
- manifest.webmanifest: PWA-Einstellungen
- sw.js: Offline-Cache
- icons: App-Icons

Die Änderung wurde im simulierten iPad-Hoch-/Querformat und im mobilen Testbrowser geprüft; ein Test auf echtem iPad und Safari ist weiterhin erforderlich.