# Meine bunte Welt – Version 2.0

Werbefreie Offline-Kinder-App für das iPad, mit Fokus auf kindgerechtes Malen.

## Die wichtigsten Neuerungen

- Bildschirmfüllende Malfläche ohne herkömmliche Webseitenleisten
- **Neues Blatt** speichert das bisherige Bild atomar in der Galerie und öffnet ein leeres Blatt mit nur einem Tipp
- Schwebende Palette, Pinselarten, Radierer, Sterne, Rückgängig und Wiederholen
- Visuell überarbeiteter Startbildschirm mit vier großen Spielzugängen
- Neu: Bausteine, Farben sortieren, Aquarium, Suchspiel
- Bis zu sechs lokale Kinderprofile mit separaten Malblättern und Galerien
- Bisherige Aktivitäten aus 1.3 weiterhin nutzbar, auch offline
- Eltern-PIN, lokal gespeicherte Bilder, JSON-Backup und Export bestehen weiter

## Datenschutz und Offlinebetrieb

Die App verwendet keine Accounts, Tracker oder externe Bibliotheken.
Zeichnungen werden nur im lokalen IndexedDB-Speicher dieses Geräts gespeichert.
Zum Sichern der Bilder den Elternbereich nutzen. Ein normaler Browser-/Gerätespeicher ist
nicht vor versehentlicher Löschung oder Betriebssystembereinigung geschützt.
Für iPad-Kinderbetrieb geführten Zugriff aktivieren.

## Migration

Der bisherige Entwurf `draft` und ältere Galerie-Bilder bleiben erhalten und werden
als Bilder von Profil `main` behandelt. Neue Profile erhalten eigene Entwürfe.
Bestehende v1.3-Backup-Dateien können weiter eingelesen werden. Vor dem Update ist
eine manuelle Sicherung der vorhandenen Bilder empfehlenswert.

## Veröffentlichen

GitHub Pages vom Branch `main` mit Verzeichnis `/`.

https://dennodhn.github.io/bunte-welt-/

GitHub-Pages-Offline-Support: Die App nach der Installation einmal vollständig laden,
danach im Flugmodus testen. Ein echter iPad-Praxistest bleibt erforderlich.
