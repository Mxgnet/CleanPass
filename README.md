# CleanPass

A small, dependency-free password generator built with HTML, CSS, and JavaScript. Passwords are generated in the browser with `crypto.getRandomValues`; nothing is persisted or sent to a server. There are no external fonts or scripts.

The interface uses the Console design: a dark, text-first layout with generator controls and a local session history feed.

## Run locally

From this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open <http://127.0.0.1:8765>. No installation or build step is needed. Clipboard access works on localhost or HTTPS; if the browser blocks copying, the output is selected for manual copying.

## Password format

Choose 2–4 groups of 3–5 characters. Defaults are three four-character groups, each starting with an uppercase letter, followed by a vowel, a consonant, and an even number. Separators are selected independently from `@` and `#`.

Advanced controls change the number and separator sets, letter rules, and ambiguous-character exclusion. A trailing number takes priority over the consonant rule in three-character groups. Number sets use 1–9 and never zero. Ambiguous-character exclusion removes `I i l L 0 O o` from applicable sets.

Changing a setting immediately generates a new password. Generate again also works with the keyboard. Copy feedback resets when the output changes. The history feed keeps the latest 20 generated passwords in memory, newest first, with timestamps, individual copy buttons, and a Clear action. It appears on the right on desktop and in a collapsed History disclosure on mobile. Refreshing or closing the page clears the feed; passwords are never written to browser storage. Clearing history leaves the current output and clipboard unchanged.

## Checks

With a current Node.js version:

```sh
node --test password_generator.test.js
```

Checks cover all 864 combinations of group counts, lengths, number/separator modes, and ambiguity settings; disabled letter rules; and rejection of biased random values.
