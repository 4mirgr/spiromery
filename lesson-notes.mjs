// Session notes are the shared source for the course page and its printable notebook.
// Use [termKey] wherever a technical term appears in the session.
export const glossary = {
  tidalVolume: ['حجم جاری', 'Tidal Volume', 'TV'],
  inspiratoryReserve: ['حجم ذخیره دمی', 'Inspiratory Reserve Volume', 'IRV'],
  expiratoryReserve: ['حجم ذخیره بازدمی', 'Expiratory Reserve Volume', 'ERV'],
  residualVolume: ['حجم باقی‌مانده', 'Residual Volume', 'RV'],
  inspiratoryCapacity: ['ظرفیت دمی', 'Inspiratory Capacity', 'IC'],
  functionalResidual: ['ظرفیت باقی‌مانده عملکردی', 'Functional Residual Capacity', 'FRC'],
  vitalCapacity: ['ظرفیت حیاتی', 'Vital Capacity', 'VC'],
  totalLungCapacity: ['ظرفیت کل ریه', 'Total Lung Capacity', 'TLC'],
  spirometry: ['اسپیرومتری', 'Spirometry'],
  staticLungVolumes: ['حجم‌های استاتیک ریه', 'Static Lung Volumes'],
  forcedVitalCapacity: ['ظرفیت حیاتی اجباری', 'Forced Vital Capacity', 'FVC'],
  lowerLimit: ['حد پایین طبیعی', 'Lower Limit of Normal', 'LLN'],
  firstSecond: ['حجم بازدمی اجباری در ثانیه اول', 'Forced Expiratory Volume in One Second', 'FEV₁'],
  restriction: ['الگوی محدودیتی', 'Restrictive Ventilatory Impairment'],
  plethysmography: ['پلتیسموگرافی کل بدن', 'Body Plethysmography'],
  slowVitalCapacity: ['ظرفیت حیاتی آهسته', 'Slow Vital Capacity', 'SVC'],
  airTrapping: ['حبس هوا', 'Air Trapping'],
};

export const sessions = [
  {
    id: 'lung-volumes',
    lessonId: 'volumes',
    title: 'حجم‌ها و ظرفیت‌های ریه',
    subtitle: 'Lung Volumes and Capacities',
    minutes: 12,
    goal: 'حجم یک نفس آرام را از کل هوای داخل ریه جدا کن و مرز اندازه‌گیری با [spirometry] را بشناس.',
    summary: [
      'در تنفس آرام، فقط [tidalVolume] در هر نفس جابه‌جا می‌شود.',
      'حجم هوای داخل ریه در پایان بازدم آرام برابر [functionalResidual] است. در پایان بیشترین بازدم، به [residualVolume] می‌رسیم.',
      'ظرفیت حاصل جمع دو یا چند حجم است. [totalLungCapacity]، مجموع [vitalCapacity] و [residualVolume] است.',
    ],
    sections: [
      [
        '۱. یک نفس آرام را دنبال کن',
        'یک دم و بازدم معمولی را تصور کن. حجم هوایی که در همان دم یا بازدم آرام جابه‌جا می‌شود [tidalVolume] است. اگر بلافاصله پس از یک دم معمولی، تا بیشترین حد ممکن هوای بیشتری وارد کنی، بخش اضافه [inspiratoryReserve] است. اگر از پایان بازدم آرام تا آخرین حد ممکن هوای بیشتری بیرون بدهی، این بخش اضافه [expiratoryReserve] است.',
      ],
      [
        '۲. هوای جابه‌جا‌شده را از هوای داخل ریه جدا کن',
        'حتی پس از بیشترین بازدم، مقداری هوا در ریه می‌ماند. آن مقدار [residualVolume] است. در پایان بازدم آرام، هم این مقدار باقی مانده و هم هنوز بخشی قابل بازدم است. مجموع این دو [functionalResidual] است. به همین دلیل خط پایه تنفس آرام در نمودار حجم کل هوای داخل ریه بالاتر از صفر است. منحنی حجم بازدمی تجمعی از صفر شروع می‌شود، چون فقط هوای خارج‌شده را جمع می‌کند.',
      ],
      [
        '۳. ببین اسپیرومتر چه چیزی اندازه می‌گیرد',
        '[spirometry] هوایی را ثبت می‌کند که از راه دهان جابه‌جا می‌شود. آن مقدار هوایی که پس از بازدم حداکثری داخل ریه می‌ماند از دستگاه عبور نمی‌کند. برای تعیین [residualVolume] و ظرفیت‌های شامل آن، یعنی [functionalResidual] و [totalLungCapacity]، به آزمون [staticLungVolumes] نیاز داریم. برای نمونه، آزمایشگاه با [plethysmography] و مانورهای تکمیلی این مقادیر را به دست می‌آورد.',
      ],
      [
        '۴. عدد کم را درست به بالین وصل کن',
        '[forcedVitalCapacity] با بازدم کامل و اجباری پس از دم حداکثری ثبت می‌شود و [slowVitalCapacity] با مانور آهسته. در انسداد همراه با [airTrapping]، عدد حاصل از مانور اجباری ممکن است کمتر باشد. پس از بررسی کیفیت مانور، اگر [forcedVitalCapacity] پایین باشد و نسبت [firstSecond] به [forcedVitalCapacity] حفظ شده باشد، [restriction] مطرح می‌شود. برای تأیید آن باید [totalLungCapacity] زیر [lowerLimit] باشد.',
      ],
    ],
    table: {
      heading: 'جدول مرجع حجم‌ها و ظرفیت‌ها',
      columns: ['اصطلاح فارسی و انگلیسی', 'تعریف یا رابطه'],
      rows: [
        ['[tidalVolume]', 'هوای جابه‌جاشده در یک دم یا بازدم آرام'],
        ['[inspiratoryReserve]', 'هوای اضافی که پس از پایان دم آرام تا دم حداکثری وارد می‌شود'],
        ['[expiratoryReserve]', 'هوای اضافی که پس از پایان بازدم آرام تا بازدم حداکثری خارج می‌شود'],
        ['[residualVolume]', 'هوایی که پس از بازدم حداکثری در ریه می‌ماند'],
        ['[inspiratoryCapacity]', 'از پایان بازدم آرام تا دم حداکثری. مجموع [tidalVolume] و [inspiratoryReserve]'],
        ['[functionalResidual]', 'هوای باقی‌مانده در پایان بازدم آرام. مجموع [expiratoryReserve] و [residualVolume]'],
        ['[vitalCapacity]', 'بیشترین حجم قابل جابه‌جایی بین دم و بازدم حداکثری. مجموع [inspiratoryReserve]، [tidalVolume] و [expiratoryReserve]'],
        ['[totalLungCapacity]', 'حجم هوای داخل ریه پس از دم حداکثری. مجموع [vitalCapacity] و [residualVolume]'],
      ],
    },
    example: {
      title: 'مثال با اعداد فرضی',
      lines: [
        'فرض کن [inspiratoryReserve] برابر ۲٫۸، [tidalVolume] برابر ۰٫۵، [expiratoryReserve] برابر ۱٫۱ و [residualVolume] برابر ۱٫۴ لیتر باشد.',
        '[inspiratoryCapacity] برابر ۳٫۳ لیتر است. ۰٫۵ به‌علاوه ۲٫۸.',
        '[functionalResidual] برابر ۲٫۵ لیتر است. ۱٫۱ به‌علاوه ۱٫۴.',
        '[vitalCapacity] برابر ۴٫۴ لیتر است. ۲٫۸ به‌علاوه ۰٫۵ به‌علاوه ۱٫۱.',
        '[totalLungCapacity] برابر ۵٫۸ لیتر است. ۴٫۴ به‌علاوه ۱٫۴.',
      ],
    },
    takeaway: 'برای گزارش [restriction] قطعی، [totalLungCapacity] را با [lowerLimit] مقایسه کن. [forcedVitalCapacity] پایین فقط سرنخ است.',
    quiz: [
      'برای تأیید [restriction] کدام اندازه‌گیری لازم است؟',
      ['[firstSecond]', '[totalLungCapacity]', '[tidalVolume]'],
      1,
      'تأیید به [totalLungCapacity] زیر [lowerLimit] نیاز دارد.',
    ],
    question: {
      prompt: 'در همین مثال، بلافاصله بعد از یک دم آرام، چند لیتر هوا در ریه است؟ از کدام دو مقدار استفاده می‌کنی؟',
      answer: '۳٫۰ لیتر. از پایان بازدم آرام با [functionalResidual] برابر ۲٫۵ لیتر شروع می‌کنیم و با یک دم آرام، [tidalVolume] برابر ۰٫۵ لیتر به آن اضافه می‌شود.',
    },
    terms: [
      'tidalVolume','inspiratoryReserve','expiratoryReserve','residualVolume',
      'inspiratoryCapacity','functionalResidual','vitalCapacity','totalLungCapacity',
      'spirometry','staticLungVolumes','forcedVitalCapacity','slowVitalCapacity',
      'airTrapping','firstSecond','lowerLimit','restriction','plethysmography',
    ],
    refs: [
      ['استاندارد انجام اسپیرومتری ۲۰۱۹ (Standardization of Spirometry)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6794117/'],
      ['استاندارد اندازه‌گیری حجم‌های ریه ۲۰۲۳ (Standardisation of the Measurement of Lung Volumes)', 'https://pubmed.ncbi.nlm.nih.gov/37500112/'],
      ['استاندارد تفسیر آزمون‌های عملکرد ریه ۲۰۲۲ (Interpretive Strategies for Routine Lung Function Tests)', 'https://pubmed.ncbi.nlm.nih.gov/34949706/'],
    ],
    practice: { label: 'تمرین با نمودار حجم–زمان', href: '#lab/volumes' },
  },
];
