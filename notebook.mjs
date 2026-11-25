const fa = new Intl.NumberFormat('fa-IR');
const htmlEntities = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => htmlEntities[character]);
}

function renderTerm(key, glossary) {
  if (!Object.hasOwn(glossary, key)) throw new Error(`Missing glossary entry: ${key}`);
  const [persian, english, abbreviation] = glossary[key];
  const fullName = abbreviation ? `${english}, ${abbreviation}` : english;
  return `<span class="notebook-term">${escapeHtml(persian)} <bdi lang="en" dir="ltr">(${escapeHtml(fullName)})</bdi></span>`;
}

export function expandTerms(text, glossary) {
  return escapeHtml(text).replace(/\[([a-z][a-z0-9_-]*)\]/gi, (_, key) => renderTerm(key, glossary));
}

function destination(href, matcher) {
  return matcher.test(href) ? escapeHtml(href) : '#notebook';
}

export function renderSessionContent(session, glossary, { heading = 'h2', courseLink = false } = {}) {
  const title = heading === 'h3' ? 'h3' : 'h2';
  const show = value => expandTerms(value, glossary);
  const items = list => list.map(item => `<li>${show(item)}</li>`).join('');
  const { table, example, question, refs, practice } = session;
  const answer = show(question.answer);
  return `
    <div class="notebook-content">
      <section class="notebook-summary">
        <${title}>خلاصه مرور سریع</${title}>
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
        <${title}>نکته بالینی</${title}>
        <p>${show(session.takeaway)}</p>
      </section>
      <section class="notebook-review">
        <${title}>تمرین جلسه</${title}>
        <p>${show(question.prompt)}</p>
        <details>
          <summary>دیدن پاسخ تشریحی</summary>
          <p>${answer}</p>
        </details>
        <p class="notebook-print-answer"><strong>پاسخ تشریحی</strong> ${answer}</p>
      </section>
      <section class="notebook-refs">
        <${title}>منابع این جلسه</${title}>
        <ul class="source-list">${refs.map(([label, href]) => `<li>
          <a href="${destination(href, /^https:\/\/[^\s]+$/i)}" target="_blank" rel="noopener noreferrer">${show(label)} <span aria-hidden="true">↗</span></a>
        </li>`).join('')}</ul>
      </section>
      <div class="notebook-session-actions">
        <a class="btn" href="${destination(practice.href, /^#(?:course|lab|cases)(?:\/[a-z0-9-]+)?$/)}">${show(practice.label)}</a>
        ${courseLink ? `<a class="btn" href="${destination('#course/' + session.lessonId, /^#course\/[a-z0-9-]+$/)}">درس تعاملی و خودآزمایی ←</a>` : ''}
      </div>
    </div>`;
}

export function renderNotebook(target, sessions, glossary, requestedId) {
  const active = sessions.find(session => session.id === requestedId);
  const terms = [...new Set(sessions.flatMap(session => session.terms))];
  target.innerHTML = `
    <div class="notebook">
      <header class="notebook-cover">
        <div class="notebook-cover-copy">
          <p class="notebook-series">آزمایشگاه اسپیرومتری <bdi lang="en" dir="ltr">(Spirometry Lab)</bdi></p>
          <h1>جزوه اسپیرومتری</h1>
          <p>جلسه‌های آموزش، جدول‌های مرور و خودآزمایی برای رزیدنت طب داخلی</p>
          <button class="btn notebook-print" type="button" data-print-notebook>چاپ یا ذخیره نسخه الکترونیکی</button>
        </div>
      </header>
      <div class="notebook-grid">
        <nav class="notebook-index" aria-label="فهرست جلسات جزوه">
          <h2>فهرست جلسات</h2>
          <ol>
            ${sessions.map((session, index) => `<li><a href="#notebook/${encodeURIComponent(session.id)}"${active === session ? ' aria-current="location"' : ''}>
              <span class="notebook-number">${fa.format(index + 1)}</span>
              <span>${expandTerms(session.title, glossary)}</span>
            </a></li>`).join('')}
          </ol>
        </nav>
        <div class="notebook-chapters">
          ${sessions.map((session, index) => `
            <article id="notebook-session-${escapeHtml(session.id)}" class="notebook-chapter" tabindex="-1">
              <header class="notebook-chapter-heading">
                <p class="notebook-chapter-meta">جلسه ${fa.format(index + 1)} <span aria-hidden="true">·</span> ${fa.format(session.minutes)} دقیقه</p>
                <h2>${expandTerms(session.title, glossary)}</h2>
                <p><bdi lang="en" dir="ltr">${expandTerms(session.subtitle, glossary)}</bdi></p>
                <p class="notebook-chapter-goal">${expandTerms(session.goal, glossary)}</p>
              </header>
              ${renderSessionContent(session, glossary, { heading:'h3', courseLink:true })}
            </article>
          `).join('')}
          <section class="notebook-glossary" aria-labelledby="notebook-glossary-title">
            <h2 id="notebook-glossary-title">واژه‌نامه فارسی و انگلیسی</h2>
            <ul>${terms.map(key => `<li>${renderTerm(key, glossary)}</li>`).join('')}</ul>
          </section>
        </div>
      </div>
    </div>`;

  target.querySelector('[data-print-notebook]').addEventListener('click', () => window.print());
}
