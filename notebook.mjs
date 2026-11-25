import { createTranslator } from './locale.mjs';

const htmlEntities = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };

const copyByLocale = {
  fa: {
    summary: 'خلاصه مرور سریع',
    takeaway: 'نکته بالینی',
    exercise: 'تمرین جلسه',
    revealAnswer: 'دیدن پاسخ تشریحی',
    answer: 'پاسخ تشریحی',
    references: 'منابع این جلسه',
    course: 'درس تعاملی و خودآزمایی ←',
    printDocument: 'جزوه',
    title: 'جزوه اسپیرومتری',
    subtitle: 'جلسه‌های آموزش، جدول‌های مرور و خودآزمایی برای رزیدنت طب داخلی',
    print: 'چاپ یا ذخیره نسخه الکترونیکی',
    contents: 'فهرست جلسات',
    contentsLabel: 'فهرست جلسات جزوه',
    session: 'جلسه',
    minutes: 'دقیقه',
    glossary: 'واژه‌نامه فارسی و انگلیسی',
  },
  en: {
    summary: 'Quick review',
    takeaway: 'Clinical takeaway',
    exercise: 'Practice question',
    revealAnswer: 'Show the worked answer',
    answer: 'Worked answer',
    references: 'Session references',
    course: 'Interactive lesson and quiz →',
    printDocument: 'Notebook',
    title: 'Spirometry Notebook',
    subtitle: 'Lessons, reference tables, and practice questions for internal medicine residents',
    print: 'Print or save as PDF',
    contents: 'Table of contents',
    contentsLabel: 'Notebook table of contents',
    session: 'Session',
    minutes: 'min',
    glossary: 'Glossary',
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => htmlEntities[character]);
}

function renderTerm(key, glossary, locale) {
  if (!Object.hasOwn(glossary, key)) throw new Error(`Missing glossary entry: ${key}`);
  const [persian, english, abbreviation] = glossary[key];
  if (locale === 'en') {
    const fullName = abbreviation ? `${english} (${abbreviation})` : english;
    return `<span class="notebook-term">${escapeHtml(fullName)}</span>`;
  }
  const fullName = abbreviation ? `${english}, ${abbreviation}` : english;
  return `<span class="notebook-term">${escapeHtml(persian)} <bdi lang="en" dir="ltr">(${escapeHtml(fullName)})</bdi></span>`;
}

export function expandTerms(text, glossary, locale = 'fa') {
  return escapeHtml(text).replace(/\[([a-z][a-z0-9_-]*)\]/gi, (_, key) => renderTerm(key, glossary, locale));
}

function destination(href, matcher) {
  return matcher.test(href) ? escapeHtml(href) : '#notebook';
}

export function renderSessionContent(session, glossary, heading = 'h2', locale = 'fa') {
  return renderContent(session, glossary, heading, locale, false);
}

function renderContent(session, glossary, heading, locale, courseLink) {
  const copy = locale === 'en' ? copyByLocale.en : copyByLocale.fa;
  const title = heading === 'h3' ? 'h3' : 'h2';
  const show = value => expandTerms(value, glossary, locale);
  const items = list => list.map(item => `<li>${show(item)}</li>`).join('');
  const { table, example, question, refs, practice } = session;
  const answer = show(question.answer);
  return `
    <div class="notebook-content">
      <section class="notebook-summary">
        <${title}>${copy.summary}</${title}>
        <ul>${items(session.summary)}</ul>
      </section>
      <div class="notebook-reading">
        ${session.sections.map(([name, text]) => `<section>
          <${title}>${show(name)}</${title}>
          <p>${show(text)}</p>
        </section>`).join('')}
      </div>
      <table class="notebook-table">
        <caption>${show(table.heading)}</caption>
        <thead><tr>${table.columns.map(column => `<th scope="col">${show(column)}</th>`).join('')}</tr></thead>
        <tbody>
          ${table.rows.map(([label, ...cells]) => `<tr>
            <th scope="row">${show(label)}</th>
            ${cells.map(cell => `<td>${show(cell)}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
      <section class="notebook-worked">
        <${title}>${show(example.title)}</${title}>
        <ol>${items(example.lines)}</ol>
      </section>
      <section class="notebook-takeaway">
        <${title}>${copy.takeaway}</${title}>
        <p>${show(session.takeaway)}</p>
      </section>
      <section class="notebook-review">
        <${title}>${copy.exercise}</${title}>
        <p>${show(question.prompt)}</p>
        <details>
          <summary>${copy.revealAnswer}</summary>
          <p>${answer}</p>
        </details>
        <p class="notebook-print-answer"><strong>${copy.answer}</strong> ${answer}</p>
      </section>
      <section class="notebook-refs">
        <${title}>${copy.references}</${title}>
        <ul class="source-list">${refs.map(([label, href]) => `<li>
          <a href="${destination(href, /^https:\/\/[^\s]+$/i)}" target="_blank" rel="noopener noreferrer">${show(label)} <span aria-hidden="true">↗</span></a>
        </li>`).join('')}</ul>
      </section>
      <div class="notebook-session-actions">
        <a class="btn" href="${destination(practice.href, /^#(?:course|lab|cases)(?:\/[a-z0-9-]+)?$/)}">${show(practice.label)}</a>
        ${courseLink ? `<a class="btn" href="${destination('#course/' + session.lessonId, /^#course\/[a-z0-9-]+$/)}">${copy.course}</a>` : ''}
      </div>
    </div>`;
}

export function renderNotebook(target, sessions, glossary, requestedId, locale = 'fa') {
  const english = locale === 'en';
  const brand = createTranslator(locale)('appTitle');
  const copy = english ? copyByLocale.en : copyByLocale.fa;
  const number = new Intl.NumberFormat(english ? 'en-US' : 'fa-IR');
  const show = value => expandTerms(value, glossary, locale);
  const active = sessions.find(session => session.id === requestedId);
  const terms = [...new Set(sessions.flatMap(session => session.terms))];
  target.innerHTML = `
    <div class="notebook" lang="${english ? 'en' : 'fa'}" dir="${english ? 'ltr' : 'rtl'}">
      <header class="notebook-cover">
        <div class="notebook-cover-copy">
          <p class="notebook-series">${escapeHtml(brand)}</p>
          <h1>${copy.title}</h1>
          <p>${copy.subtitle}</p>
          <button class="btn notebook-print" type="button" data-print-notebook>${copy.print}</button>
        </div>
      </header>
      <div class="notebook-grid">
        <nav class="notebook-index" aria-label="${copy.contentsLabel}">
          <h2>${copy.contents}</h2>
          <ol>
            ${sessions.map((session, index) => `<li><a href="#notebook/${encodeURIComponent(session.id)}"${active === session ? ' aria-current="location"' : ''}>
              <span class="notebook-number">${number.format(index + 1)}</span>
              <span>${show(session.title)}</span>
            </a></li>`).join('')}
          </ol>
        </nav>
        <div class="notebook-chapters">
          ${sessions.map((session, index) => `
            <article id="notebook-session-${escapeHtml(session.id)}" class="notebook-chapter" tabindex="-1">
              <header class="notebook-chapter-heading">
                <p class="notebook-chapter-meta">${copy.session} ${number.format(index + 1)} <span aria-hidden="true">·</span> ${number.format(session.minutes)} ${copy.minutes}</p>
                <h2>${show(session.title)}</h2>
                ${session.subtitle !== session.title ? `<p><bdi lang="en" dir="ltr">${show(session.subtitle)}</bdi></p>` : ''}
                <p class="notebook-chapter-goal">${show(session.goal)}</p>
              </header>
              ${renderContent(session, glossary, 'h3', locale, true)}
            </article>
          `).join('')}
          <section class="notebook-glossary" aria-labelledby="notebook-glossary-title">
            <h2 id="notebook-glossary-title">${copy.glossary}</h2>
            <ul>${terms.map(key => `<li>${renderTerm(key, glossary, locale)}</li>`).join('')}</ul>
          </section>
        </div>
      </div>
    </div>`;

  target.querySelector('[data-print-notebook]').addEventListener('click', () => {
    const previousTitle = document.title;
    document.title = `${brand} · ${copy.printDocument}`;
    try {
      window.print();
    } finally {
      document.title = previousTitle;
    }
  });
}
