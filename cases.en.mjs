import { cases as sourceCases } from './cases.mjs';

const content = {
  normal: {
    title: 'Normal spirometry',
    label: 'Baseline evaluation',
    tag: 'Foundations',
    story: 'An asymptomatic 28-year-old without occupational exposures presents for baseline testing. Three maneuvers are acceptable and repeatable.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.7 L'],
      ['Diffusing capacity for carbon monoxide (DLCO)', 'Within the reference range'],
    ],
    questions: [
      ['What do you check first?', ['Quality of each measurement', 'Global Initiative for Chronic Obstructive Lung Disease (GOLD) airflow obstruction grade', 'Type of inhaled medication'], 'Review the numbers once acceptability and repeatability are established.'],
      ['What is the physiologic interpretation?', ['Restrictive', 'Normal', 'Mixed'], 'The ratio is about 0.83. It, forced vital capacity (FVC) and forced expiratory volume in one second (FEV₁) all exceed their lower limits of normal (LLNs).'],
      ['Does the patient need respiratory treatment?', ['Start an inhaled corticosteroid (ICS)', 'Start a long-acting beta₂-agonist with a long-acting muscarinic antagonist (LABA/LAMA)', 'There is no indication in this scenario'], 'Document the baseline. Treatment or routine repeat testing can wait for a clinical indication.'],
    ],
    assessment: 'Normal spirometry with adequate test quality. In a symptomatic patient, use the history to guide the next step even when spirometry is normal.',
  },
  asthma: {
    title: 'Asthma with a clear bronchodilator response',
    label: 'Variable wheeze',
    tag: 'Obstruction',
    story: 'Wheeze and nocturnal cough sometimes follow exercise and pollen exposure. The patient has a history of allergic rhinitis. The pre- and post-bronchodilator maneuvers are reliable.',
    extra: [
      ['Change in forced expiratory volume in one second (FEV₁)', '+20% of predicted · +31% from baseline'],
    ],
    questions: [
      ['What is the pre-bronchodilator pattern?', ['Restrictive', 'Obstructive', 'Normal'], 'The ratio of 0.58 is below the lower limit of normal (LLN). Forced vital capacity (FVC) is above its LLN.'],
      ['How do you assess the increase in FEV₁ by the European Respiratory Society and American Thoracic Society (ERS/ATS) criterion?', ['620 mL divided by 3.10 L', '620 mL divided by FVC', '620 mL divided by 2.00 L'], 'An increase of 20% of predicted meets the ERS/ATS criterion. A 31% increase from baseline and a 620 mL increase also meet the Global Initiative for Asthma (GINA) criterion.'],
      ['What should guide initial treatment?', ['Short-acting beta₂-agonist (SABA) alone', 'Long-acting beta₂-agonist (LABA) alone', 'Inhaled corticosteroid (ICS)-containing treatment guided by symptoms and risk'], 'GINA’s preferred track for most adults uses ICS–formoterol. Review symptom severity, exacerbation history, access and inhaler technique.'],
    ],
    assessment: 'Variable symptoms with a clear bronchodilator response support asthma. Consider chronic obstructive pulmonary disease (COPD) and laryngeal obstruction when the context suggests them. Provide a written action plan and review control and inhaler technique at follow-up.',
  },
  copd: {
    title: 'Chronic obstructive pulmonary disease with persistent obstruction',
    label: 'Smoking and progressive breathlessness',
    tag: 'Obstruction',
    story: 'The patient has a 42-pack-year smoking history, progressive breathlessness and a productive cough. The Chronic Airways Assessment Test (CAAT), formerly the COPD Assessment Test (CAT), score is 17. There were no moderate or severe exacerbations in the past year.',
    extra: [
      ['Diffusing capacity for carbon monoxide (DLCO)', 'Reduced'],
      ['Residual volume / total lung capacity (RV/TLC)', 'Upper limit of normal (ULN) 0.45'],
    ],
    questions: [
      ['Which ratio is used to assess for chronic obstructive pulmonary disease (COPD)?', ['Pre-bronchodilator ratio', 'Post-bronchodilator ratio, about 0.45', 'RV/TLC'], 'With the symptoms and exposure history, a ratio below 0.70 after bronchodilation meets the Global Initiative for Chronic Obstructive Lung Disease (GOLD) criterion.'],
      ['What mechanism is consistent with low DLCO and air trapping?', ['Emphysema', 'A definitely normal maneuver', 'Fixed tracheal stenosis'], 'Emphysema is likely. Check hemoglobin and test quality, and consider imaging and other causes of low DLCO as indicated.'],
      ['Which initial plan is most appropriate?', ['Symptom-directed treatment with a long-acting beta₂-agonist and long-acting muscarinic antagonist (LABA/LAMA), plus smoking cessation', 'Inhaled corticosteroid (ICS) alone', 'Long-term antibiotics for every patient'], 'This patient is in group B. GOLD prefers dual bronchodilation in this group. Review pulmonary rehabilitation, vaccinations and inhaler technique.'],
    ],
    assessment: 'The findings support COPD. Consider concomitant asthma, bronchiectasis with purulent sputum or recurrent infection, and cardiac disease if dyspnea is disproportionate. Exacerbations, blood eosinophils and concomitant asthma inform the role of ICS.',
  },
  ild: {
    title: 'Restriction in interstitial lung disease',
    label: 'Dry cough and crackles',
    tag: 'Restriction',
    story: 'The patient reports a dry cough and exertional breathlessness. Fine crackles are audible at both lung bases.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.8 L'],
      ['Diffusing capacity for carbon monoxide (DLCO)', 'Reduced after accounting for hemoglobin'],
    ],
    questions: [
      ['What should you measure when the ratio is about 0.87 and forced vital capacity (FVC) is low?', ['Total lung capacity (TLC)', 'Only peak expiratory flow (PEF)', 'Repeat the fixed GOLD ratio'], 'A TLC below the lower limit of normal confirms restriction.'],
      ['Which investigation is most useful with crackles and low DLCO?', ['High-resolution computed tomography (HRCT) and review of exposures and autoimmune symptoms', 'A therapeutic inhaler trial alone', 'Follow-up without further testing'], 'Interstitial lung disease (ILD) is likely. Use HRCT and the history to investigate the cause.'],
      ['When should you consider antifibrotic therapy?', ['As soon as FVC is low', 'After confirming the diagnosis and an appropriate indication', 'Once the ratio drops below 0.70'], 'Treatment depends on the underlying ILD. With confirmed idiopathic pulmonary fibrosis (IPF) or progressive pulmonary fibrosis, use the relevant guideline to assess indications and treatment selection.'],
    ],
    assessment: 'Confirmed restriction with impaired gas transfer. Use the history, HRCT and multidisciplinary review when indicated to distinguish IPF, connective tissue disease-associated ILD, hypersensitivity pneumonitis and medication-induced disease.',
  },
  trapping: {
    title: 'Air trapping with low forced vital capacity',
    label: 'Reassessing low forced vital capacity',
    tag: 'Obstruction',
    story: 'The patient has a smoking history and prolonged expiration. A previous report labeled the pattern mixed based on reduced forced vital capacity (FVC) alone.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.9 L'],
      ['Pre-bronchodilator residual volume / total lung capacity (RV/TLC)', 'Upper limit of normal (ULN) 0.44'],
    ],
    questions: [
      ['What can you say before measuring TLC?', ['The ratio of forced expiratory volume in one second to forced vital capacity (FEV₁/FVC) is low, and FVC is low', 'A mixed pattern is confirmed', 'Pure restriction is confirmed'], 'The ratio indicates obstruction. Lung volumes are still needed to explain the reduced FVC.'],
      ['What is the interpretation with lung volume data?', ['Obstruction with air trapping', 'Restriction', 'Mixed impairment'], 'TLC is preserved and RV/TLC is high. A higher residual volume leaves less volume available for vital capacity (VC).'],
      ['What is a useful clinical next step?', ['Evaluate for chronic obstructive pulmonary disease (COPD) and other causes of obstruction using the history and bronchodilator response', 'Start antifibrotic therapy', 'Use FVC alone to monitor treatment'], 'A functional pattern leaves the underlying cause open. After establishing the disease, consider symptoms, exacerbations and test quality during follow-up.'],
    ],
    assessment: 'A low ratio, preserved TLC and high RV/TLC support air trapping as the explanation for reduced FVC. Review expiratory maneuver quality, exposures and symptoms.',
  },
  mixed: {
    title: 'Confirmed mixed ventilatory impairment',
    label: 'Wheeze with crackles',
    tag: 'Mixed impairment',
    story: 'The patient has a smoking history, wheeze and basal crackles. Prior computed tomography (CT) showed emphysematous changes and reticulation.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.62 L'],
      ['Diffusing capacity for carbon monoxide (DLCO)', 'Reduced'],
    ],
    questions: [
      ['Which two measurements confirm mixed impairment?', ['The ratio and TLC both below their LLNs', 'Low forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC)', 'Low peak expiratory flow (PEF) and DLCO'], 'The low ratio confirms the obstructive component. Low TLC confirms the restrictive component.'],
      ['Which possibility is worth investigating?', ['Peripheral airflow obstruction with coexisting parenchymal disease', 'Fixed central airway stenosis in every case', 'A short maneuver as the sole explanation'], 'The obstructive and restrictive components can have different causes.'],
      ['What is the next step?', ['Inhaled corticosteroid (ICS) for every patient', 'Correlate high-resolution computed tomography (HRCT) with the findings and assess each component separately', 'Repeat peak expiratory flow alone'], 'Review imaging, exposures, lung volumes, DLCO and serial changes to guide cause-specific treatment.'],
    ],
    assessment: 'This is mixed impairment. Evaluate for coexisting emphysema and fibrosis in this scenario. Some people with both conditions have nearly preserved volumes and markedly reduced DLCO.',
  },
  'quality-case': {
    title: 'Early termination of expiration',
    label: 'Inconsistent maneuvers',
    tag: 'Quality control',
    story: 'The patient stops exhaling after about 1.3 seconds on every maneuver. There is no visible plateau and forced vital capacity (FVC) varies by more than 150 mL between maneuvers.',
    extra: [
      ['End-of-expiration quality', 'Visible early termination'],
    ],
    questions: [
      ['Which measurement is most likely to be underestimated?', ['Forced vital capacity (FVC)', 'Measured total lung capacity (TLC)', 'Diffusing capacity for carbon monoxide (DLCO)'], 'Early termination can underestimate FVC and artificially raise the ratio.'],
      ['How should you assess forced expiratory volume in one second (FEV₁)?', ['Separately from FVC, using the first-second criteria', 'Always unusable', 'Always acceptable'], 'If the start was acceptable and a full second was recorded without an artifact affecting it, FEV₁ can be assessed independently.'],
      ['What should you do next?', ['Report confirmed restriction', 'Coach the patient and repeat when feasible and safe', 'Treat based on the recorded ratio'], 'Improve test quality where possible. If you cannot obtain better maneuvers, describe the resulting limitation in the report.'],
    ],
    assessment: 'Early termination makes FVC unreliable. The recorded FVC of 3.30 L yields a ratio of about 0.91. In this maneuver, a high ratio cannot exclude obstruction or confirm restriction.',
  },
  'central-airway': {
    title: 'Fixed central airway stenosis',
    label: 'Exertional stridor',
    tag: 'Loop morphology',
    story: 'The patient has breathlessness and exertional stridor after prolonged intubation. Both limbs flatten across multiple maneuvers with good effort.',
    extra: [
      ['Loop limbs', 'Repeatable'],
    ],
    questions: [
      ['Which pattern fits the loop?', ['Fixed large-airway obstruction', 'Pure restriction', 'Normal loop'], 'Limitation of both limbs raises suspicion for fixed stenosis.'],
      ['What diagnosis matters given this history?', ['Post-intubation stenosis', 'Idiopathic pulmonary fibrosis (IPF)', 'Diaphragm weakness'], 'Post-intubation tracheal stenosis is an important possibility.'],
      ['What is the appropriate next step?', ['Specialist airway evaluation and confirmation by imaging or endoscopy', 'Long-term escalation of inhaled corticosteroids (ICS) alone', 'Treatment based solely on the ratio'], 'The severity of respiratory distress and stridor determines urgency. Prioritize immediate assessment if the patient is unstable.'],
    ],
    assessment: 'The differential includes tracheal stenosis, a mass and external compression. When only the inspiratory limb flattens and symptoms vary, also consider inducible laryngeal obstruction.',
  },
  borderline: {
    title: 'Borderline ratio in an older adult',
    label: 'Mild breathlessness in an older adult',
    tag: 'Reference limits',
    story: 'The patient has prolonged smoke exposure and mild breathlessness. This is the first post-bronchodilator test.',
    extra: [
      ['Post-bronchodilator ratio', 'Above the lower limit of normal (LLN) and below 0.70'],
    ],
    questions: [
      ['How does the European Respiratory Society and American Thoracic Society (ERS/ATS) classify the ratio?', ['At or above the lower limit of normal (LLN)', 'Severely reduced', 'Confirms restriction'], 'Physiologic interpretation uses the individual’s LLN.'],
      ['How does the ratio compare with the Global Initiative for Chronic Obstructive Lung Disease (GOLD) criterion?', ['Below the fixed threshold and in the range that needs confirmation', 'Above 0.70', 'The clinical setting is irrelevant'], 'A ratio of 0.69 is below 0.70 and in the 0.60 to 0.80 range. Repeat testing on a separate occasion is recommended.'],
      ['What is the next step?', ['Make a definitive diagnosis from this single test', 'Review test quality and risk factors and repeat on a separate occasion', 'Start oral corticosteroids'], 'Biologic variation and reference equations matter for borderline values. Consider nonpulmonary causes of breathlessness as indicated.'],
    ],
    assessment: 'Report the disagreement between criteria. Chronic obstructive pulmonary disease (COPD) is a clinical diagnosis confirmed by spirometry. A borderline result requires assessment of the context and whether the finding persists.',
  },
  'low-dlco': {
    title: 'Normal spirometry with low gas transfer',
    label: 'Oxygen desaturation during walking',
    tag: 'Additional testing',
    story: 'The patient reports progressive exertional breathlessness. Oxygen saturation fell during walking and spirometry quality is adequate.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.65 L'],
      ['Diffusing capacity for carbon monoxide (DLCO)', 'Hemoglobin accounted for'],
    ],
    questions: [
      ['What is the spirometry pattern?', ['Restrictive', 'Normal', 'Obstructive'], 'Forced expiratory volume in one second (FEV₁), forced vital capacity (FVC) and their ratio are within the reference range.'],
      ['What is a reasonable differential for low DLCO?', ['Pulmonary vascular disease or early interstitial lung disease (ILD)', 'Muscle weakness alone', 'Confirmed asthma'], 'Consider vascular disease, emphysema, early ILD, technical factors and anemia.'],
      ['What guides the next investigation?', ['FEV₁ percent predicted alone', 'History, examination, oxygenation and additional findings', 'Response to a short-acting beta₂-agonist (SABA) alone'], 'After checking DLCO quality and hemoglobin, choose echocardiography, high-resolution computed tomography (HRCT) or a vascular workup according to clinical probability.'],
    ],
    assessment: 'The patient has breathlessness and impaired gas transfer with normal spirometry. Further evaluation is needed to explain the symptoms.',
  },
  weakness: {
    title: 'Respiratory muscle weakness',
    label: 'Orthopnea and weak cough',
    tag: 'Restriction',
    story: 'The patient has proximal weakness, orthopnea and a weak cough. Daytime resting oxygen saturation is normal.',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.85 L'],
      ['Supine vital capacity (VC)', 'Seated VC 2.20 L · 30% decline'],
    ],
    questions: [
      ['What is the physiologic pattern?', ['Confirmed restriction', 'Obstruction', 'Mixed impairment'], 'Total lung capacity (TLC) is low and the ratio is preserved.'],
      ['Which finding supports diaphragm weakness?', ['A fall in supine vital capacity with orthopnea', 'A ratio above 0.70 alone', 'Normal tidal volume in all positions'], 'The positional change and symptoms justify testing respiratory muscle strength.'],
      ['What is the next step?', ['Start antifibrotic therapy', 'Measure maximal inspiratory pressure (MIP) or sniff nasal inspiratory pressure (SNIP), and assess sleep-related hypoventilation and neuromuscular causes', 'Recommend exercise only'], 'Normal daytime saturation can coexist with sleep-related hypoventilation. Consider ventilatory support and cough assistance according to the findings.'],
    ],
    assessment: 'Extrapulmonary restriction is likely. Use examination and targeted testing to distinguish diaphragm dysfunction, neuromuscular disease and other mechanical causes.',
  },
  preserved: {
    title: 'Preserved ratio with low forced vital capacity',
    label: 'Exertional breathlessness and overweight',
    tag: 'Nonspecific pattern',
    story: 'The patient is overweight and has exertional breathlessness. Test quality is good. Before and after bronchodilation the ratio is preserved, while forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC) are below their lower limits of normal (LLNs).',
    extra: [
      ['Total lung capacity (TLC)', 'Lower limit of normal (LLN) 4.70 L'],
      ['Residual volume / total lung capacity (RV/TLC)', 'Upper limit of normal (ULN) 0.43'],
    ],
    questions: [
      ['What should you report before measuring TLC?', ['Low FVC with preserved ratio and possible restriction', 'Confirmed restriction', 'Confirmed mixed impairment'], 'Describe the findings initially. Measuring TLC is necessary to confirm restriction.'],
      ['What does normal TLC establish?', ['A nonspecific pattern', 'Definite restriction', 'Confirmed obstruction'], 'A normal TLC with preserved ratio and reduced spirometric values supports a nonspecific pattern.'],
      ['What does the label preserved ratio impaired spirometry (PRISm) add?', ['It confirms the need to start treatment for chronic obstructive pulmonary disease (COPD)', 'It describes a subgroup and supports evaluating the cause and following the patient', 'It confirms obesity as the cause'], 'PRISm is a descriptive category with different possible trajectories. Review the pattern, test quality and clinical status over time.'],
    ],
    assessment: 'This is a nonspecific pattern. The post-bronchodilator ratio is 0.81 and post-bronchodilator FEV₁ is about 69% predicted, which also fits the operational definition of PRISm. Consider asthma, small-airway disease and mechanical factors as appropriate, and monitor changes over time.',
  },
};

const localExtraValues = {
  'quality-case': { 0: 'No plateau' },
  'central-airway': { 0: 'Flat inspiratory and expiratory limbs' },
};

export const caseLabels = sourceCases.map(item => content[item.id].label);

export const cases = sourceCases.map(item => {
  const { title, tag, story, extra, questions, assessment } = content[item.id];
  const age = item.ages.replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).match(/\d+/)[0];
  return {
    ...item, title, tag, story, assessment, ages: `${age} years old`,
    extra: item.extra.map(([, value], index) => [
      extra[index][0], localExtraValues[item.id]?.[index] ?? value, extra[index][1],
    ]),
    questions: questions.map(([prompt, choices, explanation], index) => [
      prompt, choices, item.questions[index][2], explanation,
    ]),
  };
});
