const assert = require('node:assert/strict');
const { test } = require('node:test');
const { generatePassword, randomCharacter } = require('./password_generator.js');
const defaults = {
  numSegments: 3, segmentLength: 4, includeNumbers: true, specialCharacters: true,
  numberType: 'even', specialCharsType: 'at-hash', capitalFirst: true,
  vowelSecond: true, consonantThird: true, excludeAmbiguous: true
};

test('every supported format follows its length, separator, letter, and number rules', () => {
  const sets = { 'at-hash': '@#', punctuation: '.,;:', brackets: '[{}]', all: '@#$%&*+=?!-_.,;:[{}]' };
  const digits = { even: '2468', odd: '13579', all: '123456789' };
  for (const numSegments of [2, 3, 4])
  for (const segmentLength of [3, 4, 5])
  for (const includeNumbers of [true, false])
  for (const specialCharacters of [true, false])
  for (const numberType of Object.keys(digits))
  for (const specialCharsType of Object.keys(sets))
  for (const excludeAmbiguous of [true, false]) {
    const options = { ...defaults, numSegments, segmentLength, includeNumbers, specialCharacters, numberType, specialCharsType, excludeAmbiguous };
    const password = generatePassword(options);
    assert.equal(password.length, numSegments * segmentLength + (specialCharacters ? numSegments - 1 : 0));
    if (excludeAmbiguous) assert.doesNotMatch(password, /[IilL0Oo]/);
    for (let group = 0; group < numSegments; group++) {
      const start = group * (segmentLength + Number(specialCharacters));
      const segment = password.slice(start, start + segmentLength);
      assert.match(segment[0], /[A-Z]/);
      assert.match(segment[1], /[aeiou]/);
      if (segmentLength > 3 || !includeNumbers) assert.match(segment[2], /[bcdfghjklmnpqrstvwxyz]/);
      if (includeNumbers) assert.ok(digits[numberType].includes(segment.at(-1)));
      else assert.match(segment, /^[A-Z][a-z]+$/);
      if (specialCharacters && group < numSegments - 1) assert.ok(sets[specialCharsType].includes(password[start + segmentLength]));
    }
  }
});

test('letter rules can all be disabled', () => {
  const password = generatePassword({ ...defaults, capitalFirst: false, vowelSecond: false, consonantThird: false, includeNumbers: false, specialCharacters: false });
  assert.match(password, /^[a-z]{12}$/);
});

test('random selection rejects biased tail values', () => {
  const original = globalThis.crypto;
  let calls = 0;
  try {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: {
      getRandomValues(buffer) { buffer[0] = calls++ === 0 ? 0xffffffff : 4; return buffer; }
    } });
    assert.equal(randomCharacter('abc'), 'b');
    assert.equal(calls, 2);
  } finally {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: original });
  }
});
