import { cases } from './cases.mjs';
import { lessons, modules, references } from './curriculum.mjs';
import { artifacts, bronchodilator, lungVolumes, maneuver } from './model.mjs';
import { colors, drawChart, drawBreathingChart } from './charts.mjs';

const main = document.querySelector('main');
const localKey = 'gerami.spirometry.learn.v1';
const caseKey = 'gerami.spirometry.cases.v1';
const fa = new Intl.NumberFormat('fa-IR');
const format = (value, digits = 2) => value.toFixed(digits);
const num = value => `<bdi dir="ltr">${value}</bdi>`;
const lessonAnswers = new Map();
const caseProgress = new Map();
const stages = ['خواندن تست', 'استدلال تشخیصی', 'تصمیم بالینی'];
const volumeFields = [
  ['irv','IRV','ذخیره دمی',2.8], ['tv','TV','حجم جاری',0.5],
  ['erv','ERV','ذخیره بازدمی',1.1], ['rv','RV','باقی‌مانده',1.4],
];
const volumes = Object.fromEntries(volumeFields.map(([key,,,value]) => [key,value]));
const lab = { caseId:'normal', artifact:'none', mode:'flow', reference:false, showAfter:false };
let chartCleanup;
let complete = new Set();

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
        <span class="eyebrow">آموزش ویژه رزیدنت طب داخلی</span>
        <h1>آزمایشگاه اسپیرومتری</h1>
        <p>از اولین مانور تا تفسیر منحنی و تصمیم بالینی، اسپیرومتری را قدم‌به‌قدم تمرین کنید.</p>
        <div class="actions">
          ${button(next ? '#course/' + next.id : '#course', complete.size && next ? 'ادامه یادگیری ←' : next ? 'شروع دوره ←' : 'مرور دوره ←', true)}
          <a class="btn quiet" href="#lab">ورود به شبیه‌ساز</a>
        </div>
      </div>
    </section>
    <div class="meta-strip">
      <div><strong>${fa.format(lessons.length)} درس</strong><span>از مبانی تا درمان</span></div>
      <div><strong>${fa.format(cases.length)} کیس</strong><span>با بازخورد مرحله‌ای</span></div>
      <div><strong>ATS/ERS</strong><span>همراه GINA و GOLD</span></div>
    </div>
    <div class="section-head"><div><h2>مسیر یادگیری</h2><p>سه گام برای خواندن و به‌کارگیری اسپیرومتری در بالین</p></div><a href="#course">همه درس‌ها ←</a></div>
    <div class="cards">
      ${[
        ['volumes','◫','',modules[0],'حجم‌های ریه، مانور اجباری و کنترل کیفیت تست'],
        ['reference','∿','blue',modules[1],'خواندن منحنی، مقایسه با LLN و تفسیر پاسخ دارویی'],
        ['asthma-care','✚','amber',modules[2],'تشخیص افتراقی، درمان علت‌محور و گزارش‌نویسی'],
      ].map(([id,icon,color,title,body]) => `<a class="card" href="#course/${id}"><span class="card-symbol ${color}" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${body}</p><span class="card-link">ورود به فصل ←</span></a>`).join('')}
    </div>`;
}

function course() {
  main.innerHTML = head('دوره آموزش اسپیرومتری','درس‌ها به ترتیب از فیزیولوژی پایه به حل مسئله بالینی می‌رسند.') + `
    <div class="panel progress-panel"><strong>${fa.format(complete.size)} از ${fa.format(lessons.length)} درس</strong><progress value="${complete.size}" max="${lessons.length}" aria-label="درس‌های تکمیل‌شده"></progress></div>
    <div class="stack">${modules.map((title,index) => `<section class="panel module-panel"><h2>${title}</h2>${
      lessons.map((lesson, i) => lesson.module === index
        ? `<a class="lesson-row ${complete.has(lesson.id) ? 'done' : ''}" href="#course/${lesson.id}"><span class="lesson-num">${complete.has(lesson.id) ? '✓' : fa.format(i + 1)}</span><span class="lesson-title">${lesson.title}</span><span class="lesson-time">${fa.format(lesson.time)} دقیقه</span></a>`
        : '').join('')
    }</section>`).join('')}</div>`;
}

function options(quiz, selected) {
  return `<p class="prompt">${quiz[0]}</p><div class="options">${quiz[1].map((choice,index) =>
    `<button type="button" class="option" data-answer="${index}" aria-pressed="${index === selected}">${choice}</button>`
  ).join('')}</div><div class="feedback" role="status" hidden></div>`;
}

function answerQuiz(container, quiz, answer) {
  const correct = quiz[2] === answer;
  for (const option of container.querySelectorAll('[data-answer]')) {
    option.setAttribute('aria-pressed', String(Number(option.dataset.answer) === answer));
  }
  const feedback = container.querySelector('.feedback');
  feedback.classList.toggle('try', !correct);
  feedback.hidden = false;
  feedback.textContent = correct ? 'درست است. ' + quiz[3] : 'یک بار دیگر تلاش کن و داده‌های مرتبط با سؤال را مرور کن.';
  return correct;
}

function practiceLink(id) {
  if (id === 'volumes') return button('#lab/volumes','آزمایشگاه حجم‌ها ←');
  if (id === 'lab') return button('#lab','آزمایشگاه منحنی‌ها ←');
  if (id === 'cases') return button('#cases','تمرین با کیس‌ها ←');
  return button('#cases/' + id,'تمرین مرتبط ←');
}

function showLesson(lesson) {
  const index = lessons.indexOf(lesson);
  const selected = lessonAnswers.get(lesson.id) ?? (complete.has(lesson.id) ? lesson.quiz[2] : undefined);
  main.innerHTML = head(lesson.title, lesson.goal, '<a class="back" href="#course">→ همه درس‌ها</a>') + `
    <div class="read-grid">
      <div class="stack">
        <article class="panel lesson-copy">${lesson.sections.map(([title,text]) => `<section><h2>${title}</h2><p>${text}</p></section>`).join('')}</article>
        <section id="lesson-quiz" class="panel quiz"><h2>خودآزمایی</h2>${options(lesson.quiz, selected)}</section>
        <div class="actions">${index > 0 ? button('#course/' + lessons[index-1].id,'→ درس قبلی') : ''}${index < lessons.length-1 ? button('#course/' + lessons[index+1].id,'درس بعدی ←', true) : button('#cases','حل کیس‌های بالینی ←',true)}</div>
      </div>
      <aside class="panel context"><span class="pill" id="lesson-status">${complete.has(lesson.id) ? 'تکمیل شد' : `درس ${fa.format(index+1)} · ${fa.format(lesson.time)} دقیقه`}</span><h2 style="margin-top:12px">${modules[lesson.module]}</h2><div class="actions">${practiceLink(lesson.practice)}</div><div class="section-head"><h2>منابع این درس</h2></div>${sourceList(lesson.refs)}</aside>
    </div>`;
  const quiz = document.querySelector('#lesson-quiz');
  if (selected !== undefined) answerQuiz(quiz, lesson.quiz, selected);
  quiz.addEventListener('click', event => {
    const choice = event.target.closest('[data-answer]');
    if (!choice) return;
    const answer = Number(choice.dataset.answer);
    lessonAnswers.set(lesson.id, answer);
    if (answerQuiz(quiz, lesson.quiz, answer)) {
      completeLesson(lesson.id);
      document.querySelector('#lesson-status').textContent = 'تکمیل شد';
    }
  });
}

const labNav = active => `<nav class="lab-nav" aria-label="آزمایشگاه">
  <a class="btn" href="#lab"${active === 'curves' ? ' aria-current="page"' : ''}>منحنی‌های اسپیرومتری</a>
  <a class="btn" href="#lab/volumes"${active === 'volumes' ? ' aria-current="page"' : ''}>حجم‌ها و ظرفیت‌ها</a>
</nav>`;

function stat(label,value,unit) {
  return `<div class="stat"><dt>${label}</dt><dd>${value} <small>${unit}</small></dd></div>`;
}

function drawMonitor(target, { before, after, reference, mode, modelLabel = 'منحنی مانور' }, onMode) {
  const curves = [];
  if (reference) curves.push({ ...reference,color:colors.reference,label:'نمونه طبیعی مستقل',dashed:true });
  curves.push({ ...before,color:colors.before,label:'مانور پایه' });
  if (after) curves.push({ ...after,color:colors.after,label:'پس از دارو' });
  // Values on the monitor continue to describe the base trace when an overlay is active.
  target.innerHTML = `
    <div class="monitor-head"><h2>${modelLabel}</h2>
      <div class="segmented" aria-label="محورهای نمودار">
        <button type="button" data-mode="flow" aria-pressed="${mode === 'flow'}">جریان–حجم</button>
        <button type="button" data-mode="time" aria-pressed="${mode === 'time'}">حجم–زمان</button>
      </div>
    </div>
    <canvas class="plot" role="img" aria-label="${mode === 'time' ? 'نمودار حجم–زمان، نقطه ثانیه اول مشخص شده' : 'نمودار جریان–حجم، بازدم بالای محور و دم پایین محور'}"></canvas>
    <div class="legend">${curves.map(curve => `<span><i class="swatch ${curve.dashed ? 'dashed' : ''}" style="--curve:${curve.color}" aria-hidden="true"></i>${curve.label}</span>`).join('')}</div>
    <dl class="stats" aria-label="مقادیر مانور پایه">${stat('FEV₁',format(before.fev1),'L')}${stat('FVC',format(before.fvc),'L')}${stat('FEV₁/FVC',format(before.ratio),'')}${stat('PEF',format(before.pef,1),'L/s')}</dl>
    <p class="hint">${before.valid ? 'اعداد بالا مربوط به مانور پایه‌اند. شکل منحنی‌ها با مدل آموزشی تولید شده است.' : 'این مانور دچار خطاست. مقادیر خام برای مقایسه‌اند و تفسیر به بررسی کیفیت هر شاخص نیاز دارد.'}</p>`;
  const canvas = target.querySelector('canvas');
  const redraw = () => drawChart(canvas, curves, mode);
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
    <thead><tr><th scope="col">شاخص</th><th scope="col">پایه</th>${post ? '<th scope="col">پس از دارو</th>' : ''}<th scope="col">حد پایین (LLN)</th><th scope="col">پیش‌بینی</th></tr></thead>
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
    <thead><tr><th scope="col">شاخص</th><th scope="col">تغییر حجم</th><th scope="col">از پیش‌بینی</th><th scope="col">از پایه</th></tr></thead>
    <tbody>${response.indices.map((row,i) => `<tr><th scope="row">${i === 0 ? 'FEV₁' : 'FVC'}</th><td>${num(format(row.delta * 1000,0) + ' mL')}</td><td>${num(format(row.predictedPercent,1) + '%')}</td><td>${num(format(row.baselinePercent,1) + '%')}</td></tr>`).join('')}</tbody>
  </table></div><p class="hint">پاسخ ERS/ATS (${num('&gt;10%')} از پیش‌بینی) ${response.ers ? 'دارد' : 'ندارد'} · معیار تغییرپذیری GINA در بالغ (${num('≥12%')} و ${num('≥200 mL')} از پایه) ${response.gina ? 'دارد' : 'ندارد'}.</p>`;
}

function showLab(item) {
  if (item) Object.assign(lab, { caseId:item.id, artifact:item.artifact ?? 'none', showAfter:Boolean(item.post) });
  main.innerHTML = head('شبیه‌ساز اسپیرومتری','الگو را انتخاب کن، کیفیت مانور را تغییر بده و رابطه شکل منحنی و مقادیر را ببین.') + labNav('curves') + `
    <div class="lab-grid">
      <div class="stack"><section class="monitor"></section><section class="panel context" id="lab-result"></section></div>
      <aside class="panel control">
        <h2>تنظیم مانور</h2>
        <label class="field">الگوی نمونه<select id="profile">${cases.map(c => `<option value="${c.id}"${c.id === lab.caseId ? ' selected' : ''}>${c.title}</option>`).join('')}</select></label>
        <label class="field">کیفیت مانور<select id="artifact">${Object.entries(artifacts).map(([id,label]) => `<option value="${id}"${id === lab.artifact ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
        <label class="check"><input id="reference" type="checkbox"${lab.reference ? ' checked' : ''}>هم‌پوشانی نمونه طبیعی</label>
        <label class="check"><input id="post" type="checkbox"${lab.showAfter ? ' checked' : ''}>منحنی پس از دارو</label>
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
    main.querySelector('#post-note').textContent = selected.post ? '' : 'برای این نمونه، داده پس از دارو تعریف نشده است.';
    main.querySelector('#lab-case-link').innerHTML = button('#cases/' + selected.id, 'تحلیل کیس ←');
    const canCompare = after && before.valid;
    main.querySelector('#lab-result').innerHTML = `<h2>${selected.title}</h2>` +
      spirometryTable(selected,[before.fev1,before.fvc],after ? selected.post : null) +
      (canCompare ? responseTable(selected) : '') +
      (!before.valid ? '<p class="hint">محاسبه پاسخ دارویی فقط برای مانور پایه کامل انجام می‌شود.</p>' : '');
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
  main.innerHTML = head('حجم‌ها و ظرفیت‌های ریه','هر حجم را تغییر بده و تغییر ظرفیت‌های وابسته را دنبال کن.') + labNav('volumes') + `
    <div class="lab-grid">
      <section class="panel volume-panel context">
        <h2>ترکیب حجم‌های ریه</h2>
        <div class="volume-plot-wrap"><canvas class="volume-plot" role="img" aria-label="تنفس آرام، سپس دم تا TLC و بازدم تا RV"></canvas></div>
        <dl class="stats" id="volume-stats"></dl>
        <ul><li>ظرفیت دمی ${num('IC = IRV + TV')}</li><li>ظرفیت باقیمانده عملکردی ${num('FRC = ERV + RV')}</li><li>ظرفیت حیاتی ${num('VC = IRV + TV + ERV')}</li><li>ظرفیت کل ریه ${num('TLC = VC + RV')}</li></ul>
        <p>RV و ظرفیت‌های حاوی آن در اسپیرومتری ساده مستقیماً اندازه‌گیری نمی‌شوند. در PFT کامل می‌توان با اندازه‌گیری حجم‌های استاتیک آن‌ها را تعیین کرد.</p>
      </section>
      <aside class="panel control"><h2>حجم‌های نمونه</h2><div class="volume-fields">${volumeFields.map(([key,label,name]) =>
        `<label>${name} (${label}) <output for="v-${key}"></output><input type="range" id="v-${key}" data-volume="${key}" min="0.2" max="${key === 'tv' ? '1.2' : '4.5'}" step="0.1" value="${volumes[key]}"></label>`
      ).join('')}</div><div class="actions"><button class="btn" type="button" id="reset-volumes">بازنشانی</button>${button('#course/volumes','درس حجم‌ها ←')}</div></aside>
    </div>`;
  const inputs = [...main.querySelectorAll('[data-volume]')];
  const canvas = main.querySelector('.volume-plot');
  const redraw = () => drawBreathingChart(canvas, volumes);
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

const caseLabels = [
  'ارزیابی پایه', 'خس‌خس متغیر', 'سیگار و تنگی نفس پیشرونده', 'سرفه خشک و کراکل', 'تفسیر دوباره FVC پایین',
  'خس‌خس همراه کراکل', 'مانورهای ناهماهنگ', 'استریدور فعالیتی', 'تنگی نفس خفیف در سالمندی',
  'افت اشباع در راه رفتن', 'ارتوپنه و سرفه ضعیف', 'تنگی نفس فعالیتی و اضافه‌وزن',
];
const caseName = item => caseLabels[cases.indexOf(item)];

function caseList() {
  main.innerHTML = head('کیس‌های بالینی','شرح‌حال و منحنی را بخوان و در سه مرحله از الگو به تصمیم بالینی برس.') + `
    <div class="cards">${cases.map((item,i) => `<a class="card" href="#cases/${item.id}">
      <span class="eyebrow">کیس ${fa.format(i+1)} · ${item.ages}</span>
      <h3>${caseName(item)}</h3><p>${item.story}</p><span class="card-link">${caseProgress.get(item.id)?.step === stages.length ? 'مرور پاسخ' : 'حل کیس'} ←</span>
    </a>`).join('')}</div>`;
}

function showCase(item) {
  const state = caseProgress.get(item.id) ?? { step:0, answer:undefined, mode:'flow' };
  caseProgress.set(item.id,state);
  const before = maneuver(item.pre,item.shape,item.artifact);
  const after = item.post ? maneuver(item.post,item.postShape ?? item.shape) : null;
  main.innerHTML = head(caseName(item), item.ages + ' · کیس فرضی', '<a class="back" href="#cases">→ همه کیس‌ها</a>') + `
    <div class="read-grid">
      <div class="stack">
        <section class="panel context"><h2>شرح حال</h2><p>${item.story}</p></section>
        <section class="monitor"></section>
        <section class="panel context">
          <h2>گزارش آزمون</h2>
          ${spirometryTable(item,[before.fev1,before.fvc],item.post)}
          <div id="case-extra"></div>
        </section>
      </div>
      <div class="stack">
        <section class="panel quiz" id="case-quiz"></section>
        <section class="panel context"><h2>منابع کیس</h2>${sourceList(item.refs)}</section>
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
    ).join('')}</ul>` : '<p class="hint">داده‌های تکمیلی در مرحله بعد نمایش داده می‌شوند.</p>';
    if (finished) {
      const next = cases[cases.indexOf(item)+1];
      quiz.innerHTML = `<span class="pill">${item.tag}</span><h2>${item.title}</h2><p>${item.assessment}</p>
        ${after ? responseTable(item) : ''}<div class="actions">
        <button class="btn" type="button" data-restart>حل دوباره</button>
        ${button('#lab/' + item.id,'تمرین با منحنی')}${button(next ? '#cases/' + next.id : '#cases',next ? 'کیس بعدی ←' : 'همه کیس‌ها',true)}</div>`;
      return;
    }

    quiz.innerHTML = `<ol class="steps">${stages.map((label,index) =>
      `<li${index === state.step ? ' aria-current="step"' : ''}>${index < state.step ? '✓ ' : ''}${label}</li>`
    ).join('')}</ol><h2 tabindex="-1">مرحله ${fa.format(state.step + 1)}</h2>
    ${options(item.questions[state.step],state.answer)}
    <div class="actions"><button class="btn primary" type="button" data-next hidden>${state.step === stages.length - 1 ? 'دیدن جمع‌بندی' : 'مرحله بعد ←'}</button></div>`;
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

function route(moveFocus = false) {
  if (location.hash === '#main') {
    main.focus();
    return;
  }
  chartCleanup?.();
  chartCleanup = undefined;
  const [page, id] = location.hash.slice(1).split('/');
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === (page || 'home')) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  const lesson = lessons.find(entry => entry.id === id);
  const item = cases.find(entry => entry.id === id);
  switch (page) {
    case 'course': lesson ? showLesson(lesson) : course(); break;
    case 'lab': id === 'volumes' ? showVolumes() : showLab(item); break;
    case 'cases': item ? showCase(item) : caseList(); break;
    case 'sources': main.innerHTML = head('منابع دوره','استانداردهای فنی و راهنماهای بالینی به‌کاررفته در درس‌ها و کیس‌ها.') + '<section class="panel">' + sourceList(Object.keys(references)) + '</section>'; break;
    default: home();
  }
  if (moveFocus) {
    window.scrollTo(0,0);
    main.focus({preventScroll:true});
  }
}

window.addEventListener('hashchange', () => route(true));
route();
