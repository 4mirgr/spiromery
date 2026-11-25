import { lessons as sourceLessons, references as sourceReferences } from './curriculum.mjs';

const referenceTitles = {
  physiology: 'OpenStax · Breathing mechanics and lung volumes',
  technique: 'ATS/ERS 2019 · Standardization of spirometry',
  interpretation: 'ERS/ATS 2022 · Interpretation of pulmonary function tests',
  volumes: 'ERS/ATS 2023 · Measurement of lung volumes',
  dlco: 'ERS/ATS 2017 · Measuring diffusing capacity for carbon monoxide',
  asthma: 'GINA 2026 · Strategy for asthma diagnosis and management',
  copd: 'GOLD 2027 · Strategy for chronic obstructive pulmonary disease',
  ild: 'ATS/ERS/JRS/ALAT 2022 · Pulmonary fibrosis',
  bct: 'ERS 2017 · Methacholine challenge testing',
};

export const references = Object.fromEntries(Object.entries(sourceReferences).map(
  ([id, [, url]]) => [id, [referenceTitles[id], url]],
));

export const modules = ['Foundations and testing', 'Spirometry interpretation', 'From pattern to clinical decision'];

const content = {
  maneuver: {
    title: 'The forced maneuver and key measurements',
    goal: 'Find forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC) on the volume–time curve, and peak expiratory flow (PEF) on the flow–volume loop.',
    sections: [
      ['The maneuver', 'Seat the patient and check the seal around the mouthpiece. The patient first inhales rapidly and fully to total lung capacity (TLC), then starts exhaling explosively without a long pause and keeps going to an acceptable endpoint. When the spirometer records the full loop, a rapid, complete inspiration after expiration helps assess the inspiratory limb and maneuver quality. If the final forced inspiratory vital capacity (FIVC) exceeds FVC, their difference should be no greater than the larger of 100 mL and 5% of FVC. A larger difference suggests the patient began below TLC.'],
      ['Find the measurements on the curves', 'FVC is the total volume exhaled during the forced maneuver. FEV₁ is the volume exhaled in the first second. PEF is the highest expiratory flow and depends on the initial effort. An FEV₁ of 2.4 L and an FVC of 3.6 L give a ratio of about 0.67. Compare the ratio with the patient’s lower limit of normal (LLN).'],
      ['Slow vital capacity and FVC', 'In airflow obstruction, dynamic airway compression and air trapping can make FVC smaller than slow vital capacity (SVC). An abbreviated maneuver or incomplete inspiration can also reduce FVC. Document medication use, body position, measured height and the reason for testing.'],
    ],
    quiz: ['Where do you read FEV₁ on the volume–time curve?', ['At the highest flow', 'At the cumulative volume after one second', 'At the volume at the end of expiration'], 'The volume at one second is FEV₁. The volume at the end of the maneuver is FVC.'],
  },
  quality: {
    title: 'Quality control and maneuver errors',
    goal: 'Check the acceptability and repeatability of forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC) before interpretation.',
    sections: [
      ['Safety and preparation', 'Use a trained operator, perform equipment checks and follow infection-control procedures. In situations such as pneumothorax, a recent cardiac event, hemodynamic instability or recent surgery, review relative contraindications and weigh the benefits and risks. Decisions about withholding a bronchodilator depend on the testing objective and laboratory protocol.'],
      ['Start, middle and end', 'Assess a slow start using back-extrapolated volume (BEV). The limit is the greater of 100 mL and 5% of FVC. A cough in the first second makes FEV₁ unacceptable. Assess FVC separately. Look for leaks, glottic closure and early termination by inspecting the loop and observing the patient. One acceptable end-of-expiration indicator is a change of no more than 25 mL over the last second. Reaching 15 seconds or obtaining an FVC greater than or within the repeatability tolerance of the previous best FVC can also satisfy the end criterion. There is no fixed six-second minimum.'],
      ['Repeatability and quality grades', 'In adults, aim for three acceptable maneuvers in each pre- and post-bronchodilator set. The largest two FEV₁ values and the largest two FVC values must each be within 150 mL. The best FEV₁ and FVC can come from different maneuvers. Grade each measurement separately and state your confidence when quality is low. For example, FVC values of 3.70 L and 3.52 L differ by 180 mL and fail the repeatability criterion even if the two best FEV₁ values are within 150 mL.'],
    ],
    quiz: ['A patient coughs at 0.4 seconds. Which measurement do you reject first?', ['FEV₁', 'Total lung capacity (TLC)', 'FVC in every case'], 'A cough in the first second makes FEV₁ unacceptable. Check FVC quality separately.'],
  },
  curves: {
    title: 'Reading the curves and the inspiratory limb',
    goal: 'Locate the onset, peak, decline in flow and end of the maneuver on both plots.',
    sections: [
      ['Volume–time curve', 'The horizontal axis is time and the vertical axis is cumulative expired volume. The slope shows instantaneous flow. Read forced expiratory volume in one second (FEV₁) one second from the start and forced vital capacity (FVC) at the end. With obstruction, the lungs may empty more slowly and take longer to reach a plateau.'],
      ['Flow–volume loop', 'Expiration is above the axis and inspiration is below it. The initial peak depends on effort. A concave expiratory limb can accompany airflow obstruction. A small loop with a preserved ratio can suggest restriction. Measure total lung capacity (TLC) to assess it.'],
      ['Flattened limbs', 'Repeatable inspiratory flattening suggests variable extrathoracic obstruction. Expiratory flattening suggests variable intrathoracic obstruction. Both limbs can flatten in fixed obstruction. Check effort first, then select imaging, laryngoscopy or bronchoscopy for confirmation according to the clinical history.'],
    ],
    quiz: ['What does reproducible flattening of both limbs suggest?', ['Fixed large-airway obstruction', 'Confirmed restriction', 'Increased diffusing capacity for carbon monoxide (DLCO)'], 'A fixed central airway obstruction can limit both inspiratory and expiratory flow.'],
  },
  reference: {
    title: 'Reference values, lower limits of normal and z-scores',
    goal: 'Compare results with the right reference values for the patient and report borderline findings carefully.',
    sections: [
      ['Predicted values', 'Reference values are derived from healthy populations and vary with age, height and the sex used by the equation. Record the equation and version, such as Global Lung Function Initiative (GLI) Global when used by the laboratory. A single threshold of 80% predicted does not define normality across all ages.'],
      ['Reference limits and impairment', 'The lower limit of normal (LLN) is usually the fifth percentile, corresponding to a z-score of about −1.645. The European Respiratory Society and American Thoracic Society (ERS/ATS) use the z-score of the relevant measure to grade functional impairment. Keep that grade separate from clinical disease severity and symptom burden. The Global Initiative for Chronic Obstructive Lung Disease (GOLD) uses a post-bronchodilator ratio below 0.70 to confirm chronic obstructive pulmonary disease (COPD) in the appropriate clinical setting.'],
      ['When the criteria disagree', 'A post-bronchodilator ratio of 0.69 with an LLN of 0.64 is below the GOLD fixed threshold and above the patient’s reference limit. Review age, symptoms, exposures and prior test quality. GOLD recommends repeating a borderline result on a separate occasion. The disagreement can run in the other direction in younger adults.'],
    ],
    quiz: ['How do you classify a ratio of 0.72 when this patient’s LLN is 0.75?', ['Below the ERS/ATS reference limit', 'Normal because it is above 0.70', 'Diagnostic of restriction'], 'Use the individual LLN for physiologic interpretation. The fixed threshold of 0.70 has a specific role in the GOLD framework.'],
  },
  algorithm: {
    title: 'Step-by-step interpretation',
    goal: 'Build a clear report by checking quality, the ratio, forced vital capacity (FVC) and total lung capacity (TLC) in that order.',
    sections: [
      ['1. Read the ratio', 'After you confirm quality, a ratio of forced expiratory volume in one second to forced vital capacity (FEV₁/FVC) below the lower limit of normal (LLN) indicates an obstructive pattern. Use valid FEV₁ to describe impairment and FVC to assess whether lung volumes may be reduced.'],
      ['2. Interpret FVC alongside TLC', 'A preserved ratio with low FVC calls for lung volume testing. A TLC below the LLN confirms restriction. A low ratio and a low TLC indicate a mixed pattern. A low ratio and low FVC with preserved TLC indicate obstruction with reduced FVC. The ratio of residual volume to total lung capacity (RV/TLC) can help identify air trapping.'],
      ['3. When findings are normal or incomplete', 'With preserved FVC and ratio, check FEV₁ as well. A low FEV₁ or FVC with preserved ratio and normal TLC can reflect a nonspecific pattern. Without TLC testing, the cause of reduced vital capacity is uncertain. Asthma between episodes and other causes of breathlessness remain possible when spirometry is normal.'],
    ],
    quiz: ['FEV₁/FVC is below the LLN, FVC is low and TLC is normal. What is the conclusion?', ['Mixed pattern', 'Obstruction with reduced FVC', 'Confirmed restriction'], 'A mixed impairment requires TLC below the LLN as well. A high RV/TLC supports air trapping.'],
  },
  bronchodilator: {
    title: 'Bronchodilator responsiveness',
    goal: 'Calculate the response with the appropriate criterion and interpret it alongside the history.',
    sections: [
      ['Compare pre- and post-bronchodilator testing', 'Assess maneuver quality independently before and after bronchodilation. Document the agent, dose, timing and method according to the laboratory protocol. For example, the Global Initiative for Asthma (GINA) describes a diagnostic response assessment 10 to 15 minutes after inhaled salbutamol. Report baseline, post-treatment and predicted values for forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC).'],
      ['Two denominators for two purposes', 'Under the 2022 European Respiratory Society and American Thoracic Society (ERS/ATS) standard, calculate 100 × (post − pre) ÷ predicted for each measure. A change greater than 10% for either FEV₁ or FVC is significant. For the adult asthma workup, GINA accepts an increase from baseline of both at least 12% and at least 200 mL in FEV₁ or FVC as evidence of variability. Meeting both the 15% and 400 mL thresholds gives greater confidence.'],
      ['Worked example', 'FEV₁ rises from 2.00 to 2.34 L against a predicted value of 3.00 L. The increase is 11.3% of predicted and 17% from baseline, so both criteria are met. A positive response also occurs in chronic obstructive pulmonary disease (COPD). With ongoing clinical suspicion, a negative result on a single occasion does not rule out asthma.'],
    ],
    quiz: ['Predicted FEV₁ is 3.5 L and the increase is 0.35 L. How does this compare with the ERS/ATS criterion?', ['It meets the criterion', 'It is exactly 10% and falls short of the threshold', 'The percentage change from baseline is required'], 'The ERS/ATS threshold is strictly greater than 10% of predicted.'],
  },
  obstruction: {
    title: 'Obstruction, air trapping and hyperinflation',
    goal: 'Explain obstruction from the ratio and air trapping from lung volume measurements.',
    sections: [
      ['Why does flow fall?', 'Increased airway resistance or reduced elastic recoil limits rapid lung emptying. A ratio below the lower limit of normal (LLN) indicates obstruction. Concavity supports the interpretation when considered with the ratio. Forced expiratory flow between 25% and 75% of forced vital capacity (FEF₂₅–₇₅) depends on the forced vital capacity (FVC) and maneuver quality. It is insufficient on its own to diagnose small-airway disease.'],
      ['Lung volumes', 'The ratio of residual volume to total lung capacity (RV/TLC) above the upper limit of normal (ULN) supports air trapping. High functional residual capacity (FRC) or TLC can support hyperinflation. As RV rises, the volume available to exhale between TLC and RV falls. FVC can therefore be low even when TLC is normal or high.'],
      ['Clinical differential', 'Variable symptoms, atopy and triggers favor asthma. Tobacco use, biomass fuel exposure and persistent symptoms raise the likelihood of chronic obstructive pulmonary disease (COPD). Chronic purulent sputum and recurrent infection suggest evaluating for bronchiectasis with computed tomography (CT). Consider childhood history, occupational exposure and alpha-1 antitrypsin deficiency where relevant.'],
    ],
    quiz: ['What is the most likely explanation for low FVC, high RV/TLC and normal TLC?', ['Air trapping', 'Confirmed restriction', 'Fixed central obstruction'], 'As residual volume takes up more of total lung capacity, the vital capacity available for exhalation decreases.'],
  },
  restriction: {
    title: 'Restriction, mixed impairment and preserved ratio impaired spirometry',
    goal: 'Interpret low forced vital capacity (FVC) in the context of total lung capacity (TLC), maneuver quality and the patient’s presentation.',
    sections: [
      ['Confirming restriction', 'TLC below the lower limit of normal (LLN) confirms restrictive impairment. Parenchymal causes include interstitial lung disease (ILD). Extrapulmonary causes include neuromuscular disease, chest wall deformity and severe obesity. Diffusing capacity for carbon monoxide (DLCO) and lung imaging help localize the cause.'],
      ['Mixed and nonspecific patterns', 'In a mixed pattern, both the ratio of forced expiratory volume in one second to forced vital capacity (FEV₁/FVC) and TLC are low. A preserved ratio with low FEV₁ or FVC and preserved TLC is a nonspecific pattern. The Global Initiative for Chronic Obstructive Lung Disease (GOLD) generally defines preserved ratio impaired spirometry (PRISm) as a post-bronchodilator ratio of at least 0.70 and FEV₁ below 80% predicted. The label describes spirometry and leaves the cause open.'],
      ['Simple and complex restriction', 'In simple restriction the volumes decline more proportionally. In complex restriction, disproportionately low FVC and a high ratio of residual volume to total lung capacity (RV/TLC) can accompany air trapping or a mechanical limitation such as obesity or muscle weakness. Review absolute RV, TLC and clinical findings as well.'],
    ],
    quiz: ['FVC is low and the ratio is preserved. TLC is unavailable. What should you report?', ['Confirmed restriction', 'Possible restriction and a suggestion to measure TLC', 'Confirmed asthma'], 'FVC alone cannot establish TLC.'],
  },
  pft: {
    title: 'Static lung volumes, gas transfer and additional testing',
    goal: 'Choose a follow-up test for breathlessness according to the clinical question.',
    sections: [
      ['Measuring lung volumes', 'Body plethysmography measures thoracic gas volume and can account for trapped gas. Washout and dilution techniques depend on gas communicating with the airways and can underestimate volumes in severe obstruction. Check measurement method and quality before comparing serial tests.'],
      ['What does diffusing capacity show?', 'The diffusing capacity of the lung for carbon monoxide (DLCO) estimates gas transfer from the alveoli to blood. Pulmonary fibrosis, emphysema, anemia and pulmonary vascular disease can lower it. Check hemoglobin (Hb), inspiratory quality and alveolar volume (VA). The carbon monoxide transfer coefficient (KCO) is DLCO divided by VA and varies when VA is low, so it cannot provide a simple adjustment for volume.'],
      ['Match the test to the question', 'When the ratio is preserved and restriction is suspected, measure total lung capacity (TLC). If you suspect muscle weakness, consider seated and supine vital capacity (VC) and inspiratory muscle strength. With suspected asthma and normal spirometry, consider repeating the test during symptoms, assessing peak expiratory flow (PEF) variability or arranging a challenge test at an appropriate center. Breathlessness with normal spirometry and low DLCO raises pulmonary vascular and parenchymal causes as well as anemia.'],
    ],
    quiz: ['What do normal spirometry and low DLCO mean in a patient with exertional breathlessness?', ['Lung disease is excluded', 'Review test quality and hemoglobin, and investigate vascular or parenchymal causes as indicated', 'This diagnoses asthma'], 'Abnormal gas transfer warrants further evaluation. Use other findings to identify the cause.'],
  },
  'asthma-care': {
    title: 'Asthma from diagnosis to control',
    goal: 'Use variable symptoms and evidence of variable airflow limitation to guide treatment and follow-up.',
    sections: [
      ['Confirming asthma', 'Wheeze, breathlessness, cough or chest tightness that vary over time and with triggers suggest asthma. Document airflow variability with a bronchodilator response, follow-up measurements or an appropriate diagnostic test. Inspiratory symptoms, hoarseness or abrupt onset and resolution during exercise also warrant consideration of inducible laryngeal obstruction.'],
      ['Controller and reliever treatment', 'Choose inhaled corticosteroid (ICS)-containing treatment for adults and adolescents. At steps 1 and 2, the preferred Global Initiative for Asthma (GINA) track uses as-needed low-dose ICS–formoterol. At steps 3 and 4, use maintenance-and-reliever therapy (MART) with an appropriate combination according to the guideline. The alternative track uses a different reliever depending on availability, treatment step and adherence. Avoid a short-acting beta₂-agonist (SABA) alone or a long-acting beta₂-agonist (LABA) without ICS.'],
      ['Review before changing treatment', 'Before stepping up, review the diagnosis, inhaler technique, adherence, exposures and comorbidities. At follow-up, assess symptoms, exacerbations and lung function and give the patient a written action plan. After at least 2 to 3 months of stable control, consider a gradual step-down. Continue some ICS in adolescents and adults. In difficult-to-treat or severe asthma, consider referral to establish the phenotype and assess targeted therapy.'],
      ['Exacerbations', 'Clinical severity, oxygenation and the initial response guide urgent treatment and transfer. Depending on the protocol, treatment includes rapid-acting bronchodilation, titrated oxygen and systemic corticosteroids when indicated. In severe respiratory distress, prioritize immediate assessment and treatment before forced spirometry.'],
    ],
    quiz: ['Asthma is uncontrolled, inhaler technique is poor and treatment is taken irregularly. What should you do before stepping up?', ['Improve technique and adherence and review the diagnosis', 'Add a LABA without ICS', 'Treat with SABA alone'], 'Stepping up before addressing modifiable factors can increase medication exposure while leaving control inadequate.'],
  },
  'copd-care': {
    title: 'Chronic obstructive pulmonary disease from diagnosis to treatment',
    goal: 'Use diagnostic criteria, symptoms and exacerbation risk for their respective decisions.',
    sections: [
      ['Confirming the diagnosis in context', 'Assess progressive breathlessness, chronic cough or sputum, and exposure to smoke and particles. The Global Initiative for Chronic Obstructive Lung Disease (GOLD) requires a post-bronchodilator ratio of forced expiratory volume in one second to forced vital capacity (FEV₁/FVC) below 0.70 to confirm chronic obstructive pulmonary disease (COPD). Repeat a post-bronchodilator ratio of 0.60 to 0.80 on a separate occasion. Once obstruction is confirmed, GOLD grades impairment using post-bronchodilator FEV₁ as percent predicted. Grade 1 means at least 80%, grade 2 means 50% to under 80%, grade 3 means 30% to under 50%, and grade 4 means under 30%. Assess symptoms and exacerbation history separately when selecting initial treatment.'],
      ['Stable disease', 'Include tobacco cessation, exposure reduction, appropriate vaccinations, physical activity and pulmonary rehabilitation. In GOLD 2027, when there has been no moderate or severe exacerbation in the prior year, a lower symptom burden corresponds to group A. This typically means a Chronic Airways Assessment Test (CAAT) score below 10 or a modified Medical Research Council (mMRC) dyspnea grade below 2 when using that scale. Higher symptom burden corresponds to group B. At least one moderate or severe exacerbation places the patient in group E. Start a bronchodilator in group A and generally combine a long-acting beta₂-agonist with a long-acting muscarinic antagonist (LABA/LAMA) in groups B and E. Check device technique, patient ability and availability.'],
      ['Exacerbation risk and inhaled corticosteroids', 'For patients with exacerbations, their number and severity, blood eosinophils, pneumonia history and concomitant asthma guide the decision to add inhaled corticosteroids (ICS). At initial treatment for group E, consider triple therapy (LABA/LAMA/ICS) when eosinophils are at least 300 cells per microliter. For a moderate or severe exacerbation despite LABA/LAMA at follow-up, GOLD supports escalation to triple therapy. Benefit is more likely from 100 eosinophils per microliter and rises with higher counts. Concomitant asthma requires ICS-containing therapy.'],
      ['Acute exacerbations', 'Consider pneumonia, heart failure, pulmonary embolism and pneumothorax according to the clinical picture. Depending on severity, treatment includes a short-acting beta₂-agonist (SABA) with or without a short-acting muscarinic antagonist (SAMA), a short course of systemic corticosteroids and antibiotics when criteria are met. Consider controlled oxygen, blood gas testing and noninvasive ventilation (NIV) in suitable patients with hypercapnic respiratory failure.'],
    ],
    quiz: ['A patient with COPD has chronic breathlessness, no moderate or severe exacerbation in the past year, and no concomitant asthma. What is the best basis for treatment?', ['Response to a SABA during testing alone', 'Symptoms, exacerbation history and group-based bronchodilator therapy', 'ICS alone from the outset'], 'Base treatment on the phenotype, symptom burden and exacerbation history.'],
  },
  'restrictive-care': {
    title: 'Clinical evaluation and treatment of restrictive impairment',
    goal: 'Distinguish parenchymal restriction, muscle weakness and other extrapulmonary causes in practice.',
    sections: [
      ['When you suspect an intrapulmonary cause', 'Basal crackles, a dry cough, confirmed restriction and reduced diffusing capacity for carbon monoxide (DLCO) support an evaluation for interstitial lung disease (ILD). Ask about exposures, medications, radiotherapy and symptoms of connective tissue disease. High-resolution computed tomography (HRCT) and multidisciplinary review, when needed, help establish the pattern.'],
      ['When you suspect an extrapulmonary cause', 'Orthopnea, muscle weakness, ineffective cough and a fall in supine vital capacity (VC) suggest diaphragm weakness or neuromuscular disease. Maximal inspiratory pressure (MIP), sniff nasal inspiratory pressure (SNIP) and evaluation for hypoventilation inform decisions about ventilatory support. Expiratory reserve volume (ERV) is commonly low in obesity. Confirm restrictive impairment with low total lung capacity (TLC).'],
      ['Cause-directed management', 'In interstitial disease, remove relevant exposures and treat the underlying condition. For confirmed idiopathic pulmonary fibrosis (IPF), consider antifibrotic therapy, assess oxygen and rehabilitation needs, and consider transplant referral when appropriate. In obesity or muscle weakness, address the cause and evaluate sleep-disordered breathing and hypoventilation. In a mixed pattern, evaluate and treat the obstructive and restrictive components individually.'],
    ],
    quiz: ['Which combination makes interstitial lung disease a priority?', ['Low TLC, low DLCO and basal crackles', 'Early termination of FVC with normal TLC', 'Exercise-related flattening of the inspiratory limb'], 'Confirmed restriction with impaired gas transfer and a parenchymal sign warrants targeted history and HRCT.'],
  },
  report: {
    title: 'Reporting and follow-up',
    goal: 'Write a short report stating the physiologic finding, confidence and next step.',
    sections: [
      ['Start with quality and context', 'Record the indication, quality of forced expiratory volume in one second (FEV₁) and forced vital capacity (FVC), reference equation and medication status. Include raw values, units, the lower limit of normal (LLN) and z-scores where available. State which errors could affect the result and whether the maneuver needs repeating.'],
      ['Describe the pattern and evidence', 'Example. The maneuver is acceptable and repeatable. The FEV₁/FVC ratio is 0.58, below the LLN. FVC is also reduced. Total lung capacity (TLC) is above the LLN. The ratio of residual volume to total lung capacity (RV/TLC) is above the upper limit of normal (ULN). These findings support obstruction with air trapping. Report the post-bronchodilator change separately and name the criterion used.'],
      ['Follow-up', 'Interpret serial results in light of the clinical status, consistency of equipment and reference equations, maneuver quality and time between tests. A small change can reflect normal variability or measurement error. Integrate symptoms, exacerbations, daily function and previous findings, and link the next step to the clinical question.'],
    ],
    quiz: ['Which report is most accurate when FVC is low, the ratio is preserved and TLC was unavailable?', ['Restriction was confirmed', 'Possible restriction. Consider measuring TLC.', 'Start antifibrotic therapy'], 'State what the test supports and connect follow-up testing to the clinical question.'],
  },
};

export const lessons = sourceLessons.map(lesson => {
  if (lesson.id === 'volumes') return lesson;
  const { title, goal, sections, quiz: [question, choices, explanation] } = content[lesson.id];
  return { ...lesson, title, goal, sections, quiz: [question, choices, lesson.quiz[2], explanation] };
});
