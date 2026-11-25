import { cases as faCases } from './cases.mjs';
import { cases as enCases, caseLabels as enCaseLabels } from './cases.en.mjs';
import * as faCourse from './curriculum.mjs';
import * as enCourse from './curriculum.en.mjs';
import { bronchodilator, lungVolumes, maneuver } from './model.mjs';
import { colors, drawChart, drawBreathingChart } from './charts.mjs';
import * as faNotebook from './lesson-notes.mjs';
import * as enNotebook from './lesson-notes.en.mjs';
import { createTranslator } from './locale.mjs';
import { expandTerms, renderNotebook, renderSessionContent } from './notebook.mjs';

const main = document.querySelector('main');
const localKey = 'gerami.spirometry.learn.v1';
const caseKey = 'gerami.spirometry.cases.v1';
const languageKey = 'gerami.spirometry.language';
const languageToggle = document.querySelector('#language-toggle');
const numberFormatters = { fa: new Intl.NumberFormat('fa-IR'), en: new Intl.NumberFormat('en') };
let locale = 'fa';
try {
  if (localStorage.getItem(languageKey) === 'en') locale = 'en';
} catch { /* The default language remains available without storage. */ }
let t;
let cases, lessons, modules, references, glossary, sessions, notesByLesson;
const numberLabel = value => numberFormatters[locale].format(value);
const format = (value, digits = 2) => value.toFixed(digits);
const num = value => `<bdi dir="ltr">${value}</bdi>`;
const lessonAnswers = new Map();
const caseProgress = new Map();
const stages = ['readTest', 'diagnosticReasoning', 'clinicalDecision'];
const artifactLabels = { none:'maneuverComplete', early:'maneuverEarly', cough:'maneuverCough', slow:'maneuverSlow' };
const volumeFields = [
  ['irv','IRV','inspiratoryReserve',2.8], ['tv','TV','tidalVolume',0.5],
  ['erv','ERV','expiratoryReserve',1.1], ['rv','RV','residualVolume',1.4],
];
const volumes = Object.fromEntries(volumeFields.map(([key,,,value]) => [key,value]));
const lab = { caseId:'normal', artifact:'none', mode:'flow', reference:false, showAfter:false };
let chartCleanup;
let lastRoute = '';
let complete = new Set();

function applyLocale() {
  const english = locale === 'en';
  t = createTranslator(locale);
  cases = english ? enCases : faCases;
  ({ lessons, modules, references } = english ? enCourse : faCourse);
  ({ glossary, sessions } = english ? enNotebook : faNotebook);
  notesByLesson = new Map(sessions.map(session => [session.lessonId, session]));
  document.documentElement.lang = locale;
  document.documentElement.dir = english ? 'ltr' : 'rtl';
  const name = { brand: t('appTitle') };
  document.title = name.brand;
  document.querySelector('meta[name="description"]').content = t('pageDescription');
  for (const node of document.querySelectorAll('[data-message]')) node.textContent = t(node.dataset.message, name);
  for (const node of document.querySelectorAll('[data-label-message]')) node.setAttribute('aria-label', t(node.dataset.labelMessage, name));
  languageToggle.title = t('languageAction');
  languageToggle.hidden = false;
}

applyLocale();

try {
  const saved = JSON.parse(localStorage.getItem(localKey) ?? '[]');
  if (Array.isArray(saved)) complete = new Set(saved.filter(id => lessons.some(lesson => lesson.id === id)));
  const savedCases = JSON.parse(localStorage.getItem(caseKey) ?? '{}');
  for (const item of cases) {
    const step = savedCases?.[item.id];
    if (Number.isInteger(step) && step > 0 && step <= stages.length) {
      caseProgress.set(item.id, { step, answer:undefined, mode:'flow' });
    }
  }
} catch { /* Reading remains available when storage is blocked. */ }

function saveCases() {
  const progress = Object.fromEntries([...caseProgress].filter(([,state]) => state.step > 0)
    .map(([id,state]) => [id,state.step]));
  try { localStorage.setItem(caseKey, JSON.stringify(progress)); }
  catch { /* In-memory progress remains available for this session. */ }
}

function completeLesson(id) {
  complete.add(id);
  try { localStorage.setItem(localKey, JSON.stringify([...complete])); }
  catch { /* In-memory progress remains available for this session. */ }
}

const button = (href, label, primary = false) => `<a class="btn${primary ? ' primary' : ''}" href="${href}">${label}</a>`;
const sourceList = keys => `<ul class="source-list">${keys.map(key => {
  const [title, url] = references[key];
  return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title} <span aria-hidden="true">↗</span></a></li>`;
}).join('')}</ul>`;
const head = (title, description, back = '') => `<div class="page-head">${back}<h1>${title}</h1><p>${description}</p></div>`;

function home() {
  const next = lessons.find(lesson => !complete.has(lesson.id));
  main.innerHTML = `
    <section class="hero">
      <img class="hero-art" src="./assets/lungs.webp" width="651" height="700" alt="" fetchpriority="high">
      <div class="hero-copy">
        <span class="eyebrow">${t('audience')}</span>
        <h1>${t('appTitle')}</h1>
        <p>${t('heroDescription')}</p>
        <div class="actions">
          ${button(next ? '#course/' + next.id : '#course', complete.size && next ? t('resume') : next ? t('start') : t('reviewCourse'), true)}
          <a class="btn quiet" href="#lab">${t('openLab')}</a>
        </div>
      </div>
    </section>
    <div class="meta-strip">
      <div><strong>${t('lessonCount', {count:numberLabel(lessons.length)})}</strong><span>${t('scope')}</span></div>
      <div><strong>${t('caseCount', {count:numberLabel(cases.length)})}</strong><span>${t('stagedFeedback')}</span></div>
      <div><strong>ATS/ERS</strong><span>${t('guidance')}</span></div>
    </div>
    <div class="section-head"><div><h2>${t('learningPath')}</h2><p>${t('pathDescription')}</p></div><a href="#course">${t('browseLessons')}</a></div>
    <div class="cards">
      ${[
        ['volumes','◫','',modules[0],t('basicsDescription')],
        ['reference','∿','blue',modules[1],t('interpretationDescription')],
        ['asthma-care','✚','amber',modules[2],t('clinicalDescription')],
      ].map(([id,icon,color,title,body]) => `<a class="card" href="#course/${id}"><span class="card-symbol ${color}" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${body}</p><span class="card-link">${t('openModule')}</span></a>`).join('')}
    </div>`;
}

function course() {
  main.innerHTML = head(t('courseTitle'),t('courseDescription')) + `
    <div class="panel progress-panel"><strong>${t('lessonProgress', {done:numberLabel(complete.size),total:numberLabel(lessons.length)})}</strong><progress value="${complete.size}" max="${lessons.length}" aria-label="${t('completedLessons')}"></progress></div>
    <div class="stack">${modules.map((title,index) => `<section class="panel module-panel"><h2>${title}</h2>${
      lessons.map((lesson, i) => {
        if (lesson.module !== index) return '';
        const note = notesByLesson.get(lesson.id);
        return `<a class="lesson-row ${complete.has(lesson.id) ? 'done' : ''}" href="#course/${lesson.id}"><span class="lesson-num">${complete.has(lesson.id) ? '✓' : numberLabel(i + 1)}</span><span class="lesson-title">${note ? expandTerms(note.title, glossary, locale) : lesson.title}</span><span class="lesson-time">${t('minutes', {time:numberLabel(note?.minutes ?? lesson.time)})}</span></a>`;
      }).join('')
    }</section>`).join('')}</div>`;
}

function options(quiz, selected, renderText = text => text) {
  return `<p class="prompt">${renderText(quiz[0])}</p><div class="options">${quiz[1].map((choice,index) =>
    `<button type="button" class="option" data-answer="${index}" aria-pressed="${index === selected}">${renderText(choice)}</button>`
  ).join('')}</div><div class="feedback" role="status" hidden></div>`;
}

function answerQuiz(container, quiz, answer, renderText) {
  const correct = quiz[2] === answer;
  for (const option of container.querySelectorAll('[data-answer]')) {
    option.setAttribute('aria-pressed', String(Number(option.dataset.answer) === answer));
  }
  const feedback = container.querySelector('.feedback');
  feedback.classList.toggle('try', !correct);
  feedback.hidden = false;
  if (correct && renderText) feedback.innerHTML = t('correct') + renderText(quiz[3]);
  else feedback.textContent = correct ? t('correct') + quiz[3] : t('retry');
  return correct;
}

function practiceLink(id) {
  if (id === 'volumes') return button('#lab/volumes',t('volumeLab'));
  if (id === 'lab') return button('#lab',t('curveLab'));
  if (id === 'cases') return button('#cases',t('practiceCases'));
  return button('#cases/' + id,t('relatedPractice'));
}

function showLesson(lesson) {
  const index = lessons.indexOf(lesson);
  const note = notesByLesson.get(lesson.id);
  const formatNote = note ? text => expandTerms(text, glossary, locale) : undefined;
  const lessonQuiz = note?.quiz ?? lesson.quiz;
  const selected = lessonAnswers.get(lesson.id) ?? (complete.has(lesson.id) ? lessonQuiz[2] : undefined);
  const article = note
    ? renderSessionContent(note, glossary, 'h2', locale)
    : lesson.sections.map(([title,text]) => `<section><h2>${title}</h2><p>${text}</p></section>`).join('');
  const noteLink = note ? button('#notebook/' + note.id, t('sessionNotebook')) : '';
  const sources = note
    ? ''
    : `<div class="section-head"><h2>${t('lessonSources')}</h2></div>${sourceList(lesson.refs)}`;
  const title = note ? formatNote(note.title) : lesson.title;
  const goal = note ? formatNote(note.goal) : lesson.goal;
  main.innerHTML = head(title, goal, `<a class="back" href="#course">${t('allLessons')}</a>`) + `
    <div class="read-grid">
      <div class="stack">
        <article class="panel lesson-copy">${article}</article>
        <section id="lesson-quiz" class="panel quiz"><h2>${t('selfCheck')}</h2>${options(lessonQuiz, selected, formatNote)}</section>
        <div class="actions">${index > 0 ? button('#course/' + lessons[index-1].id,t('previousLesson')) : ''}${index < lessons.length-1 ? button('#course/' + lessons[index+1].id,t('nextLesson'), true) : button('#cases',t('solveCases'),true)}</div>
      </div>
      <aside class="panel context"><span class="pill" id="lesson-status">${complete.has(lesson.id) ? t('completed') : t('lessonTiming', {index:numberLabel(index+1),duration:t('minutes', {time:numberLabel(note?.minutes ?? lesson.time)})})}</span><h2 style="margin-top:12px">${modules[lesson.module]}</h2><div class="actions">${note ? noteLink : practiceLink(lesson.practice)}</div>${sources}</aside>
    </div>`;
  const quiz = main.querySelector('#lesson-quiz');
  if (selected !== undefined) answerQuiz(quiz, lessonQuiz, selected, formatNote);
  quiz.addEventListener('click', event => {
    const choice = event.target.closest('[data-answer]');
    if (!choice) return;
    const answer = Number(choice.dataset.answer);
    lessonAnswers.set(lesson.id, answer);
    if (answerQuiz(quiz, lessonQuiz, answer, formatNote)) {
      completeLesson(lesson.id);
      main.querySelector('#lesson-status').textContent = t('completed');
    }
  });
}

const labNav = active => `<nav class="lab-nav" aria-label="${t('labNav')}">
  <a class="btn" href="#lab"${active === 'curves' ? ' aria-current="page"' : ''}>${t('spirometryCurves')}</a>
  <a class="btn" href="#lab/volumes"${active === 'volumes' ? ' aria-current="page"' : ''}>${t('volumes')}</a>
</nav>`;

function stat(label,value,unit) {
  return `<div class="stat"><dt>${label}</dt><dd>${value} <small>${unit}</small></dd></div>`;
}

function drawMonitor(target, { before, after, reference, mode, modelLabel = t('maneuverCurve') }, onMode) {
  const curves = [];
  if (reference) curves.push({ ...reference,color:colors.reference,label:t('normalReference'),dashed:true });
  curves.push({ ...before,color:colors.before,label:t('baselineManeuver') });
  if (after) curves.push({ ...after,color:colors.after,label:t('afterDrug') });
  // Values on the monitor continue to describe the base trace when an overlay is active.
  target.innerHTML = `
    <div class="monitor-head"><h2>${modelLabel}</h2>
      <div class="segmented" aria-label="${t('graphAxes')}">
        <button type="button" data-mode="flow" aria-pressed="${mode === 'flow'}">${t('flowVolume')}</button>
        <button type="button" data-mode="time" aria-pressed="${mode === 'time'}">${t('volumeTime')}</button>
      </div>
    </div>
    <canvas class="plot" role="img" aria-label="${mode === 'time' ? t('volumeTimeLabel') : t('flowVolumeLabel')}"></canvas>
    <div class="legend">${curves.map(curve => `<span><i class="swatch ${curve.dashed ? 'dashed' : ''}" style="--curve:${curve.color}" aria-hidden="true"></i>${curve.label}</span>`).join('')}</div>
    <dl class="stats" aria-label="${t('baselineMeasures')}">${stat('FEV₁',format(before.fev1),'L')}${stat('FVC',format(before.fvc),'L')}${stat('FEV₁/FVC',format(before.ratio),'')}${stat('PEF',format(before.pef,1),'L/s')}</dl>
    <p class="hint">${before.valid ? t('validManeuver') : t('flawedManeuver')}</p>`;
  const canvas = target.querySelector('canvas');
  const redraw = () => drawChart(canvas, curves, mode, locale);
  chartCleanup?.();
  const observer = new ResizeObserver(redraw);
  observer.observe(canvas);
  chartCleanup = () => observer.disconnect();
  redraw();
  target.querySelector('.segmented').addEventListener('click', event => {
    const selected = event.target.closest('[data-mode]');
    if (!selected || selected.dataset.mode === mode) return;
    onMode(selected.dataset.mode);
    target.querySelector(`[data-mode="${selected.dataset.mode}"]`).focus();
  });
}

function spirometryTable(item, pair, post) {
  const [fev1, fvc] = pair;
  const rows = [
    ['FEV₁','L',fev1,item.lln[0],item.predicted[0],post?.[0]],
    ['FVC','L',fvc,item.lln[1],item.predicted[1],post?.[1]],
    ['FEV₁/FVC','',fev1 / fvc,item.lln[2],null,post && post[0] / post[1]],
  ];
  return `<div class="table-wrap"><table>
    <thead><tr><th scope="col">${t('measure')}</th><th scope="col">${t('baseline')}</th>${post ? `<th scope="col">${t('afterDrug')}</th>` : ''}<th scope="col">${t('lowerLimit')}</th><th scope="col">${t('predicted')}</th></tr></thead>
    <tbody>${rows.map(([name,unit,before,lln,predicted,after]) => `<tr>
      <th scope="row">${num(name)}</th>
      <td>${num(format(before) + ' ' + unit)}</td>
      ${post ? `<td>${num(format(after) + ' ' + unit)}</td>` : ''}
      <td>${num(format(lln) + ' ' + unit)}</td>
      <td>${predicted === null ? '—' : num(format(predicted) + ' ' + unit)}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

function responseTable(item) {
  const response = bronchodilator(item.pre,item.post,item.predicted);
  return `<div class="table-wrap"><table>
    <thead><tr><th scope="col">${t('measure')}</th><th scope="col">${t('volumeChange')}</th><th scope="col">${t('ofPredicted')}</th><th scope="col">${t('fromBaseline')}</th></tr></thead>
    <tbody>${response.indices.map((row,i) => `<tr><th scope="row">${i === 0 ? 'FEV₁' : 'FVC'}</th><td>${num(format(row.delta * 1000,0) + ' mL')}</td><td>${num(format(row.predictedPercent,1) + '%')}</td><td>${num(format(row.baselinePercent,1) + '%')}</td></tr>`).join('')}</tbody>
  </table></div><p class="hint">${t('responseSummary', {
      predicted:num('&gt;10%'), percent:num('≥12%'), volume:num('≥200 mL'),
      ers:t(response.ers ? 'criterionMet' : 'criterionMissed'),
      gina:t(response.gina ? 'criterionMet' : 'criterionMissed'),
    })}</p>`;
}

function showLab(item) {
  if (item) Object.assign(lab, { caseId:item.id, artifact:item.artifact ?? 'none', showAfter:Boolean(item.post) });
  main.innerHTML = head(t('simulator'),t('simulatorDescription')) + labNav('curves') + `
    <div class="lab-grid">
      <div class="stack"><section class="monitor"></section><section class="panel context" id="lab-result"></section></div>
      <aside class="panel control">
        <h2>${t('maneuverSettings')}</h2>
        <label class="field">${t('examplePattern')}<select id="profile">${cases.map(c => `<option value="${c.id}"${c.id === lab.caseId ? ' selected' : ''}>${c.title}</option>`).join('')}</select></label>
        <label class="field">${t('maneuverQuality')}<select id="artifact">${Object.entries(artifactLabels).map(([id,label]) => `<option value="${id}"${id === lab.artifact ? ' selected' : ''}>${t(label)}</option>`).join('')}</select></label>
        <label class="check"><input id="reference" type="checkbox"${lab.reference ? ' checked' : ''}>${t('overlayNormal')}</label>
        <label class="check"><input id="post" type="checkbox"${lab.showAfter ? ' checked' : ''}>${t('afterDrugCurve')}</label>
        <p class="hint" id="post-note"></p>
        <div class="actions" id="lab-case-link"></div>
      </aside>
    </div>`;

  const scenario = main.querySelector('#profile');
  const quality = main.querySelector('#artifact');
  const normal = main.querySelector('#reference');
  const post = main.querySelector('#post');
  const monitor = main.querySelector('.monitor');

  function display() {
    const selected = cases.find(c => c.id === lab.caseId);
    const before = maneuver(selected.pre, selected.shape, lab.artifact);
    const after = lab.showAfter && selected.post
      ? maneuver(selected.post, selected.postShape ?? selected.shape)
      : null;
    const reference = lab.reference ? maneuver(cases[0].pre, cases[0].shape) : null;
    post.disabled = !selected.post;
    post.checked = Boolean(after);
    main.querySelector('#post-note').textContent = selected.post ? '' : t('noPostData');
    main.querySelector('#lab-case-link').innerHTML = button('#cases/' + selected.id, t('analyzeCase'));
    const canCompare = after && before.valid;
    main.querySelector('#lab-result').innerHTML = `<h2>${selected.title}</h2>` +
      spirometryTable(selected,[before.fev1,before.fvc],after ? selected.post : null) +
      (canCompare ? responseTable(selected) : '') +
      (!before.valid ? `<p class="hint">${t('compareOnlyComplete')}</p>` : '');
    drawMonitor(monitor, { before, after, reference, mode:lab.mode }, mode => {
      lab.mode = mode;
      display();
    });
  }
  scenario.addEventListener('change', () => {
    lab.caseId = scenario.value;
    const selected = cases.find(c => c.id === scenario.value);
    lab.artifact = quality.value = selected.artifact ?? 'none';
    lab.showAfter = Boolean(selected.post);
    display();
  });
  quality.addEventListener('change', () => { lab.artifact = quality.value; display(); });
  normal.addEventListener('change', () => { lab.reference = normal.checked; display(); });
  post.addEventListener('change', () => { lab.showAfter = post.checked; display(); });
  display();
}

function showVolumes() {
  main.innerHTML = head(t('lungVolumeTitle'),t('lungVolumeDescription')) + labNav('volumes') + `
    <div class="lab-grid">
      <section class="panel volume-panel context">
        <h2>${t('volumeComponents')}</h2>
        <div class="volume-plot-wrap"><canvas class="volume-plot" role="img" aria-label="${t('breathingGraph')}"></canvas></div>
        <dl class="stats" id="volume-stats"></dl>
        <ul><li>${t('inspiratoryCapacity')} ${num('IC = IRV + TV')}</li><li>${t('functionalResidualCapacity')} ${num('FRC = ERV + RV')}</li><li>${t('vitalCapacity')} ${num('VC = IRV + TV + ERV')}</li><li>${t('totalLungCapacity')} ${num('TLC = VC + RV')}</li></ul>
        <p>${t('staticVolumes')}</p>
      </section>
      <aside class="panel control"><h2>${t('sampleVolumes')}</h2><div class="volume-fields">${volumeFields.map(([key,label,name]) =>
        `<label>${t(name)} (${label}) <output for="v-${key}"></output><input type="range" id="v-${key}" data-volume="${key}" min="0.2" max="${key === 'tv' ? '1.2' : '4.5'}" step="0.1" value="${volumes[key]}"></label>`
      ).join('')}</div><div class="actions"><button class="btn" type="button" id="reset-volumes">${t('reset')}</button>${button('#course/volumes',t('volumeLesson'))}</div></aside>
    </div>`;
  const inputs = [...main.querySelectorAll('[data-volume]')];
  const canvas = main.querySelector('.volume-plot');
  const redraw = () => drawBreathingChart(canvas, volumes, locale);
  const observer = new ResizeObserver(redraw);
  observer.observe(canvas);
  chartCleanup = () => observer.disconnect();
  function refresh() {
    for (const input of inputs) {
      const value = format(volumes[input.dataset.volume],1) + ' L';
      input.previousElementSibling.textContent = value;
      input.previousElementSibling.dir = 'ltr';
      input.setAttribute('aria-valuetext', value);
    }
    redraw();
    main.querySelector('#volume-stats').innerHTML = Object.entries(lungVolumes(volumes))
      .map(([key,value]) => stat(key.toUpperCase(),format(value,1),'L')).join('');
  }
  for (const input of inputs) input.addEventListener('input', () => {
    volumes[input.dataset.volume] = Number(input.value);
    refresh();
  });
  main.querySelector('#reset-volumes').addEventListener('click', () => {
    for (const [key,,,defaultValue] of volumeFields) volumes[key] = defaultValue;
    for (const input of inputs) input.value = volumes[input.dataset.volume];
    refresh();
  });
  refresh();
}

const faCaseLabels = [
  'ارزیابی پایه', 'خس‌خس متغیر', 'سیگار و تنگی نفس پیشرونده', 'سرفه خشک و کراکل', 'تفسیر دوباره FVC پایین',
  'خس‌خس همراه کراکل', 'مانورهای ناهماهنگ', 'استریدور فعالیتی', 'تنگی نفس خفیف در سالمندی',
  'افت اشباع در راه رفتن', 'ارتوپنه و سرفه ضعیف', 'تنگی نفس فعالیتی و اضافه‌وزن',
];
const caseName = item => (locale === 'en' ? enCaseLabels : faCaseLabels)[cases.indexOf(item)];

function caseList() {
  main.innerHTML = head(t('clinicalCases'),t('clinicalCasesDescription')) + `
    <div class="cards">${cases.map((item,i) => `<a class="card" href="#cases/${item.id}">
      <span class="eyebrow">${t('caseNumber', {index:numberLabel(i+1),age:item.ages})}</span>
      <h3>${caseName(item)}</h3><p>${item.story}</p><span class="card-link">${t(caseProgress.get(item.id)?.step === stages.length ? 'reviewAnswer' : 'solveCase')}</span>
    </a>`).join('')}</div>`;
}

function showCase(item) {
  const state = caseProgress.get(item.id) ?? { step:0, answer:undefined, mode:'flow' };
  caseProgress.set(item.id,state);
  const before = maneuver(item.pre,item.shape,item.artifact);
  const after = item.post ? maneuver(item.post,item.postShape ?? item.shape) : null;
  main.innerHTML = head(caseName(item), item.ages + ' · ' + t('fictionalCase'), `<a class="back" href="#cases">${t('backToCases')}</a>`) + `
    <div class="read-grid">
      <div class="stack">
        <section class="panel context"><h2>${t('history')}</h2><p>${item.story}</p></section>
        <section class="monitor"></section>
        <section class="panel context">
          <h2>${t('testReport')}</h2>
          ${spirometryTable(item,[before.fev1,before.fvc],item.post)}
          <div id="case-extra"></div>
        </section>
      </div>
      <div class="stack">
        <section class="panel quiz" id="case-quiz"></section>
        <section class="panel context"><h2>${t('caseSources')}</h2>${sourceList(item.refs)}</section>
      </div>
    </div>`;

  const target = main.querySelector('.monitor');
  const updatePlot = () => drawMonitor(target,{ before,after,mode:state.mode },mode => {
    state.mode = mode;
    updatePlot();
  });
  const quiz = main.querySelector('#case-quiz');
  const extra = main.querySelector('#case-extra');
  function updateCase() {
    const finished = state.step === stages.length;
    extra.innerHTML = state.step > 0 ? `<ul class="case-extra">${item.extra.map(([label,value,hint]) =>
      `<li><strong>${label}</strong> · <bdi>${value}</bdi> · <bdi>${hint}</bdi></li>`
    ).join('')}</ul>` : `<p class="hint">${t('supplementalData')}</p>`;
    if (finished) {
      const next = cases[cases.indexOf(item)+1];
      quiz.innerHTML = `<span class="pill">${item.tag}</span><h2>${item.title}</h2><p>${item.assessment}</p>
        ${after ? responseTable(item) : ''}<div class="actions">
        <button class="btn" type="button" data-restart>${t('restartCase')}</button>
        ${button('#lab/' + item.id,t('practiceCurve'))}${button(next ? '#cases/' + next.id : '#cases',next ? t('nextCase') : t('allCases'),true)}</div>`;
      return;
    }

    quiz.innerHTML = `<ol class="steps">${stages.map((label,index) =>
      `<li${index === state.step ? ' aria-current="step"' : ''}>${index < state.step ? '✓ ' : ''}${t(label)}</li>`
    ).join('')}</ol><h2 tabindex="-1">${t('caseStage', {index:numberLabel(state.step+1)})}</h2>
    ${options(item.questions[state.step],state.answer)}
    <div class="actions"><button class="btn primary" type="button" data-next hidden>${state.step === stages.length - 1 ? t('caseSummary') : t('nextStage')}</button></div>`;
    if (state.answer !== undefined) showAnswer(state.answer);
  }
  function showAnswer(answer) {
    quiz.querySelector('[data-next]').hidden = !answerQuiz(quiz,item.questions[state.step],answer);
  }
  quiz.addEventListener('click', event => {
    const option = event.target.closest('[data-answer]');
    if (option) {
      state.answer = Number(option.dataset.answer);
      showAnswer(state.answer);
    } else if (event.target.closest('[data-next]')) {
      state.step += 1;
      state.answer = undefined;
      saveCases();
      updateCase();
      quiz.querySelector('h2').tabIndex = -1;
      quiz.querySelector('h2').focus();
    } else if (event.target.closest('[data-restart]')) {
      Object.assign(state,{ step:0, answer:undefined });
      saveCases();
      updateCase();
      quiz.querySelector('h2').focus();
    }
  });
  updatePlot();
  updateCase();
}

function route(moveFocus = false, preserveState = false) {
  if (location.hash === '#main' && !preserveState) {
    main.focus();
    return;
  }
  chartCleanup?.();
  chartCleanup = undefined;
  if (location.hash !== '#main') lastRoute = location.hash;
  const [page, id] = lastRoute.slice(1).split('/');
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === (page || 'home')) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  const lesson = lessons.find(entry => entry.id === id);
  const item = cases.find(entry => entry.id === id);
  switch (page) {
    case 'course': lesson ? showLesson(lesson) : course(); break;
    case 'lab': id === 'volumes' ? showVolumes() : showLab(preserveState ? undefined : item); break;
    case 'cases': item ? showCase(item) : caseList(); break;
    case 'notebook': {
      renderNotebook(main, sessions, glossary, id, locale);
      const session = sessions.find(entry => entry.id === id);
      if (session && !preserveState) {
        const chapter = document.getElementById('notebook-session-' + session.id);
        chapter.focus({ preventScroll:true });
        chapter.scrollIntoView({ block:'start' });
        return;
      }
      break;
    }
    case 'sources': main.innerHTML = head(t('sources'),t('sourcesDescription')) + '<section class="panel">' + sourceList(Object.keys(references)) + '</section>'; break;
    default: home();
  }
  if (moveFocus) {
    window.scrollTo(0,0);
    main.focus({preventScroll:true});
  }
}

languageToggle.addEventListener('click', () => {
  const openDetails = [...main.querySelectorAll('details')].map(details => details.open);
  locale = locale === 'en' ? 'fa' : 'en';
  try { localStorage.setItem(languageKey, locale); }
  catch { /* Apply the language for this session even when storage is unavailable. */ }
  applyLocale();
  route(false, true);
  main.querySelectorAll('details').forEach((details, index) => {
    details.open = openDetails[index] === true;
  });
});
window.addEventListener('hashchange', () => route(true));
route();
