# Echte Sprachaufnahmen für „Meine bunte Welt“

**Verbindliche Vorgabe:** Keine KI-Stimme, keine Web Speech API, keine Text-to-Speech-Bibliothek und keine dynamisch generierten Wörter. Die Lernspiele spielen ausschließlich menschlich eingesprochene Audio-Dateien ab. Fehlen Dateien, bleibt das Spiel visuell nutzbar; es wird keine Computerstimme als Ersatz gestartet.

## Dateiformat

- Empfohlen: MP3, 44,1 kHz, Mono, 128–192 kbit/s, natürliche deutsche Stimme, klare kinderfreundliche Aussprache.
- Ruhiges, trockenes Signal ohne laute Hintergrundmusik, Werbung, Raumecho oder abrupte Schnitte; Pegel zwischen Clips angleichen.
- Jeden Clip in einer eigenen Datei speichern. Dateiname nur Kleinbuchstaben, Bindestrich, Endung.
- Eigene oder für diese Nutzung ausdrücklich lizenzierte menschliche Aufnahmen verwenden. Bei fremden Aufnahmen Urheber-/Lizenzpflichten prüfen und dokumentieren.
- Dateien entweder im **PIN-geschützten Elternbereich** direkt auf das Gerät laden (lokal und offline), oder im Repository unter `audio/lernen/` ablegen.
- Bereits im Repository vorhandene Audios werden nach dem ersten erfolgreichen Abspielen vom Service Worker offline zwischengespeichert. Für vollständige Vorab-Offlinepakete die tatsächlich hinzugefügten Dateien zusätzlich in die ASSETS-Liste in `sw.js` aufnehmen.

## ABC: je ein Clip, einmal Buchstabe und Beispielwort

| Datei | Einzusprechender Text |
|---|---|
| `abc-a.mp3` | A wie Apfel. |
| `abc-b.mp3` | B wie Ball. |
| `abc-c.mp3` | C wie Clown. |
| `abc-d.mp3` | D wie Dino. |
| `abc-e.mp3` | E wie Ente. |
| `abc-f.mp3` | F wie Fisch. |
| `abc-g.mp3` | G wie Giraffe. |
| `abc-h.mp3` | H wie Haus. |
| `abc-i.mp3` | I wie Igel. |
| `abc-j.mp3` | J wie Jacke. |
| `abc-k.mp3` | K wie Katze. |
| `abc-l.mp3` | L wie Löwe. |
| `abc-m.mp3` | M wie Maus. |
| `abc-n.mp3` | N wie Nase. |
| `abc-o.mp3` | O wie Oma. |
| `abc-p.mp3` | P wie Pferd. |
| `abc-q.mp3` | Q wie Qualle. |
| `abc-r.mp3` | R wie Regen. |
| `abc-s.mp3` | S wie Sonne. |
| `abc-t.mp3` | T wie Tiger. |
| `abc-u.mp3` | U wie Uhr. |
| `abc-v.mp3` | V wie Vogel. |
| `abc-w.mp3` | W wie Wolke. |
| `abc-x.mp3` | X wie Xylophon. |
| `abc-y.mp3` | Y wie Yoga. |
| `abc-z.mp3` | Z wie Zebra. |

## Wörter tippen: je ein Clip

- `wort-oma.mp3` – „Oma“
- `wort-mama.mp3` – „Mama“
- `wort-papa.mp3` – „Papa“
- `wort-eis.mp3` – „Eis“
- `wort-auto.mp3` – „Auto“
- `wort-hund.mp3` – „Hund“
- `wort-ball.mp3` – „Ball“
- `wort-ente.mp3` – „Ente“
- `wort-haus.mp3` – „Haus“
- `wort-sonne.mp3` – „Sonne“

## Elternprüfung / Qualitätskontrolle

1. Auf normalem iPad-Lautsprecher und Kopfhörer testen: natürliche, gut verständliche Sprache und gleiche Lautstärke.
2. Jedes Wort mit der dargestellten Schreibweise vergleichen, besonders C, Q, X und Y.
3. In Safari den Lautsprecher einmal antippen. Wird keine Aufnahme gefunden, erscheint ein Hinweis, **aber keine synthetische Ersatzstimme**.
4. Offline-Test: Dateien im Elternbereich importieren, Flugmodus aktivieren, App neu öffnen und abhören.
5. Für Repository-Dateien: einmal online vollständig abspielen, dann im Flugmodus erneut abspielen. Für vorab komplette Offline-Installation Dateien in `sw.js` ergänzen.
6. Eltern-Uploads werden ausschließlich auf dem jeweiligen Gerät in IndexedDB gespeichert. Sie werden nicht in das Bilder-Backup exportiert und können durch Löschen der Website-Daten verloren gehen.

## Veröffentlichungsstatus

Die vier Spiele, die Integration und die Audio-Schnittstelle sind bereit. Ein professionell eingesprochenes Sprachpaket wird **nicht vorgetäuscht** und muss separat hergestellt oder aus überprüften, geeignet lizenzierten menschlichen Aufnahmen zusammengestellt werden.
