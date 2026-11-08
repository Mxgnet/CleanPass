/* No dependencies or network calls. History lives only in page memory. */
(() => {
  'use strict';
  const symbols = { 'at-hash': '@#', punctuation: '.,;:', brackets: '[{}]', all: '@#$%&*+=?!-_.,;:[{}]' };
  const numbers = { even: '2468', odd: '13579', all: '123456789' };

  function randomCharacter(characters) {
    // Reject the remainder so every character has the same probability.
    const range = 0x100000000;
    const limit = range - (range % characters.length);
    const buffer = new Uint32Array(1);
    do { globalThis.crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
    return characters[buffer[0] % characters.length];
  }

  function generatePassword(options) {
    const clean = set => options.excludeAmbiguous ? set.replace(/[IilL0Oo]/g, '') : set;
    const letters = clean('abcdefghijklmnopqrstuvwxyz');
    const vowels = clean('aeiou');
    const consonants = clean('bcdfghjklmnpqrstvwxyz');
    const segments = [];
    for (let segment = 0; segment < options.numSegments; segment++) {
      let value = '';
      for (let position = 0; position < options.segmentLength; position++) {
        let set = letters;
        // A trailing number takes priority for three-character segments too.
        if (position === options.segmentLength - 1 && options.includeNumbers) set = numbers[options.numberType];
        else if (position === 0 && options.capitalFirst) set = letters.toUpperCase();
        else if (position === 1 && options.vowelSecond) set = vowels;
        else if (position === 2 && options.consonantThird) set = consonants;
        value += randomCharacter(set);
      }
      segments.push(value);
    }
    return segments.reduce((password, segment, index) => password +
      (index && options.specialCharacters ? randomCharacter(symbols[options.specialCharsType]) : '') + segment, '');
  }

  // Expose the pure generator to the dependency-free Node checks.
  if (typeof module !== 'undefined' && module.exports) module.exports = { generatePassword, randomCharacter };
  if (typeof document === 'undefined') return;

  function template(id) {
    const check = (name, text) => `<label class="check-label"><input type="checkbox" name="${name}" checked>${text}</label>`;
    return `
      <header class="app-header">
        <h1 class="app-title">CleanPass<span class="cursor" aria-hidden="true">_</span></h1>
      </header>
      <div class="console-layout">
      <form class="workspace" aria-label="${id} password generator">
        <div class="settings">
          <h2 class="section-label">01 / Parameters</h2>
          <div class="config-row">
            <span class="config-label" id="${id}-segments-label">Segments</span>
            <div class="radio-group" role="radiogroup" aria-labelledby="${id}-segments-label">
              ${[2, 3, 4].map(n => `<label><input type="radio" name="numSegments" value="${n}" ${n === 3 ? 'checked' : ''}>${n}</label>`).join('')}
            </div>
            <span class="field-note">groups of characters</span>
          </div>
          <div class="config-row">
            <label class="config-label" for="${id}-length">Group length</label>
            <select name="segmentLength" id="${id}-length"><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option></select>
            <span class="field-note">characters per group</span>
          </div>
          <div class="basic-checks">
            ${check('includeNumbers', 'End with a number')}
            ${check('specialCharacters', 'Add separators')}
          </div>
          <details>
            <summary>Fine-tune character rules</summary>
            <div class="advanced-fields">
              <label class="advanced-field">Number set<select name="numberType"><option value="even">Even / 2 4 6 8</option><option value="odd">Odd / 1 3 5 7 9</option><option value="all">All / 1–9</option></select></label>
              <label class="advanced-field">Separator set<select name="specialCharsType"><option value="at-hash">@ #</option><option value="punctuation">. , ; :</option><option value="brackets">[ { } ]</option><option value="all">All symbols</option></select></label>
              ${check('capitalFirst', 'Capitalize first letter')}
              ${check('vowelSecond', 'Second letter is a vowel')}
              ${check('consonantThird', 'Third letter is a consonant')}
              ${check('excludeAmbiguous', 'Exclude I i l L 0 O o')}
              <p class="advanced-note">Rules apply to each group. A final number takes priority over the third-letter rule. Numbers use 1–9; zero is never included.</p>
            </div>
          </details>
        </div>
        <div class="result">
          <div class="result-heading"><h2 class="section-label">02 / Output</h2><span class="result-meta"></span></div>
          <output class="password" aria-label="Generated password" aria-live="polite"></output>
          <div class="actions"><button class="generate" type="submit">Generate again <span aria-hidden="true">↵</span></button><button class="copy" type="button">Copy password</button></div>
          <p class="status" role="status"></p>
        </div>
      </form>
      <aside class="history" aria-label="Password history">
        <details class="history-disclosure">
          <summary><span>03 / History <span class="history-count">0</span></span><span class="history-chevron" aria-hidden="true">⌄</span></summary>
          <div class="history-body">
            <div class="history-toolbar"><span>newest first · last 20</span><button class="clear-history" type="button">Clear</button></div>
            <ol class="history-list" aria-label="Recent passwords"></ol>
            <p class="history-empty">No entries. Generate a password to start.</p>
            <p class="history-note">This tab only. Cleared on refresh.</p>
            <p class="history-status status" role="status"></p>
          </div>
        </details>
      </aside>
      </div>`;
  }

  document.querySelectorAll('[data-generator]').forEach(root => {
    root.innerHTML = template(root.dataset.generator);
    const form = root.querySelector('form');
    const output = root.querySelector('output');
    const status = root.querySelector('.status');
    const copy = root.querySelector('.copy');
    const historyList = root.querySelector('.history-list');
    const historyStatus = root.querySelector('.history-status');
    const historyCount = root.querySelector('.history-count');
    const clearHistory = root.querySelector('.clear-history');
    const disclosure = root.querySelector('.history-disclosure');
    const mobile = window.matchMedia('(max-width: 760px)');
    disclosure.open = !mobile.matches;
    mobile.addEventListener('change', event => { disclosure.open = !event.matches; });
    let sequence = 0;
    let version = 0;

    function updateHistoryCount() {
      const count = historyList.children.length;
      historyCount.textContent = String(count).padStart(2, '0');
      root.querySelector('.history-empty').hidden = count > 0;
      clearHistory.disabled = count === 0;
    }

    async function copyPassword(element, button, feedback, isCurrent) {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(element.textContent);
        if (!isCurrent()) return;
        button.textContent = 'Copied ✓';
        feedback.textContent = 'Password copied to clipboard.';
      } catch {
        if (!isCurrent()) return;
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        feedback.textContent = 'Password selected; press ⌘C or Ctrl+C to copy.';
      }
    }

    function recordPassword(password) {
      const entry = document.createElement('li');
      entry.className = 'history-entry';
      const number = String(++sequence).padStart(3, '0');
      const meta = document.createElement('div');
      meta.className = 'history-meta';
      const index = document.createElement('span');
      index.textContent = '#' + number;
      const time = document.createElement('time');
      const now = new Date();
      time.dateTime = now.toISOString();
      time.textContent = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      meta.append(index, time);
      const row = document.createElement('div');
      row.className = 'history-value';
      const value = document.createElement('code');
      value.textContent = password;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy password ' + number);
      button.addEventListener('click', () => copyPassword(value, button, historyStatus, () => entry.isConnected));
      row.append(value, button);
      entry.append(meta, row);
      historyList.prepend(entry);
      if (historyList.children.length > 20) historyList.lastElementChild.remove();
      historyList.scrollTop = 0;
      historyStatus.textContent = '';
      updateHistoryCount();
    }

    clearHistory.addEventListener('click', () => {
      historyList.replaceChildren();
      updateHistoryCount();
      historyStatus.textContent = 'History cleared.';
    });
    function regenerate() {
      version++;
      const options = Object.fromEntries(new FormData(form));
      form.querySelectorAll('input[type="checkbox"]').forEach(input => { options[input.name] = input.checked; });
      // Read disabled selects too, so re-enabling a rule keeps its selected set.
      form.querySelectorAll('select').forEach(select => { options[select.name] = select.value; });
      options.numSegments = Number(options.numSegments);
      options.segmentLength = Number(options.segmentLength);
      form.elements.numberType.disabled = !options.includeNumbers;
      form.elements.specialCharsType.disabled = !options.specialCharacters;
      status.textContent = '';
      copy.textContent = 'Copy password';
      try {
        output.textContent = generatePassword(options);
        root.querySelector('.result-meta').textContent = `${output.textContent.length} characters / ${options.numSegments} groups`;
        copy.disabled = false;
        recordPassword(output.textContent);
      } catch {
        output.textContent = 'Generation unavailable';
        root.querySelector('.result-meta').textContent = '';
        status.textContent = 'This browser could not provide secure randomness. Try a current browser.';
        copy.disabled = true;
      }
    }
    form.addEventListener('submit', event => { event.preventDefault(); regenerate(); });
    form.addEventListener('change', regenerate);
    copy.addEventListener('click', () => {
      const copiedVersion = version;
      copyPassword(output, copy, status, () => version === copiedVersion);
    });
    regenerate();
  });
})();
