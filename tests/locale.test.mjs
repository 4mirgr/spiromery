import test from 'node:test';
import assert from 'node:assert/strict';
import * as faCourse from '../curriculum.mjs';
import * as enCourse from '../curriculum.en.mjs';
import { cases as faCases } from '../cases.mjs';
import { cases as enCases, caseLabels } from '../cases.en.mjs';
import { sessions as faSessions } from '../lesson-notes.mjs';
import { glossary, sessions as enSessions } from '../lesson-notes.en.mjs';
import { renderSessionContent } from '../notebook.mjs';
import { createTranslator } from '../locale.mjs';

const arabicScript = /\p{Script=Arabic}/u;
const withoutText = ({ title, goal, sections, quiz, ...rest }) => rest;
const sourceLinks = references => Object.entries(references).map(([key, [, url]]) => [key, url]);

test('English lessons keep the course outline, answers and reference destinations', () => {
  assert.equal(enCourse.modules.length, faCourse.modules.length);
  assert.deepEqual(sourceLinks(enCourse.references), sourceLinks(faCourse.references));
  assert.deepEqual(enCourse.lessons.map(withoutText), faCourse.lessons.map(withoutText));
  for (const [index, english] of enCourse.lessons.entries()) {
    const persian = faCourse.lessons[index];
    if (!persian.quiz) continue;
    assert.ok(english.title && english.goal);
    assert.equal(english.sections.length, persian.sections.length);
    assert.equal(english.quiz[1].length, persian.quiz[1].length);
    assert.equal(english.quiz[2], persian.quiz[2]);
  }
  assert.doesNotMatch(JSON.stringify(enCourse), arabicScript);
});

test('English clinical cases preserve every case fixture and quiz stage', () => {
  assert.equal(enCases.length, faCases.length);
  assert.equal(caseLabels.length, faCases.length);
  for (const [index, english] of enCases.entries()) {
    const persian = faCases[index];
    for (const field of ['id','shape','postShape','artifact','pre','post','predicted','lln','refs']) {
      assert.deepEqual(english[field], persian[field], `${english.id} ${field}`);
    }
    assert.equal(english.extra.length, persian.extra.length);
    assert.deepEqual(english.questions.map(([, choices, answer]) => [choices.length, answer]),
      persian.questions.map(([, choices, answer]) => [choices.length, answer]));
    assert.ok(english.title && english.story && english.assessment && caseLabels[index]);
  }
  assert.doesNotMatch(JSON.stringify([enCases, caseLabels]), arabicScript);
});

test('English notebook sessions contain the same chapters, terms and links', () => {
  assert.equal(enSessions.length, faSessions.length);
  for (const [index, english] of enSessions.entries()) {
    const persian = faSessions[index];
    assert.deepEqual(
      [english.id, english.lessonId, english.terms, english.quiz[2], english.practice.href],
      [persian.id, persian.lessonId, persian.terms, persian.quiz[2], persian.practice.href],
    );
    assert.deepEqual(english.refs.map(([,url]) => url), persian.refs.map(([,url]) => url));
    assert.equal(english.table.rows.length, persian.table.rows.length);
    assert.equal(english.sections.length, persian.sections.length);
    const content = renderSessionContent(english, glossary, 'h2', 'en');
    assert.doesNotMatch(content, arabicScript);
    for (const key of english.terms) assert.ok(glossary[key]?.[1], key);
  }
  assert.doesNotMatch(JSON.stringify(enSessions), arabicScript);
});

test('interface strings localize without an untranslated fallback', () => {
  const en = createTranslator('en');
  const fa = createTranslator('fa');
  assert.equal(en('lessonProgress', {done:1, total:14}), '1 of 14 lessons');
  assert.equal(fa('lessonProgress', {done:'۱', total:'۱۴'}), '۱ از ۱۴ درس');
  assert.throws(() => en('missingTranslation'), /Missing interface message/);
  assert.throws(() => fa('lessonProgress'), /Missing value/);
});
