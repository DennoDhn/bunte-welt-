# Meine bunte Welt

Die iPad-App öffnet direkt ein weißes Malblatt oder den letzten lokalen Entwurf. Mit dem Finger malen, die Farbe wechseln und ein neues Blatt anfangen sind direkt erreichbar.

- Rot, Gelb, Grün und Blau liegen unten auf dem Blatt. Die Palette öffnet sieben weitere Farben und den Radierer.
- Der Fisch öffnet 18 Vorlagen mit geschützten Konturen zum freien Ausmalen.
- „Neues Blatt“ sichert eine bemalte Seite in der Galerie. Unbenutzte Blätter erzeugen keinen Galerieeintrag.
- Die Klangwelt bietet zwölf Geräusche auf zwei Seiten mit je sechs Bildtasten.
- Das Zahnrad öffnet den PIN-geschützten Elternbereich mit Galerie, Kinderprofilen, Sicherung und Spielauswahl. Dort steht auch die geladene App-Version.

## Lernspiele (Entwicklungsstand 2.18.0)

Vier zusätzliche Lernspiele: **ABC entdecken** (A–Z mit Bildern), **Buchstaben finden**, **Wörter tippen** und **Zahlen entdecken**. Große Tasten, kein Zeitdruck, lokal gespeicherter Fortschritt pro Profil für ABC und Wörter.

**Sprache:** Die Lernspiele verwenden ausschließlich echte, vorher aufgenommene Sprachdateien. Keine KI-Stimme und kein Browser-TTS. Im PIN-geschützten Elternbereich können Erwachsene entsprechende MP3-/OGG-/WAV-/M4A-Aufnahmen auf dem Gerät hinterlegen. Die 36 erforderlichen professionellen Aufnahmen sind **noch nicht Teil dieses Entwicklungsstands**. Bis dahin funktionieren die visuellen Übungen; die Lautsprecher melden fehlende Aufnahmen, statt eine synthetische Stimme abzuspielen.

Aufnahmetexte, Dateinamen, Lizenzanforderungen und Offline-Test: [docs/LERN-AUDIO.md](docs/LERN-AUDIO.md).

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
