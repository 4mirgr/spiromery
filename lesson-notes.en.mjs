// English session notes supply the course page and its printable notebook.
export { glossary } from './lesson-notes.mjs';

export const sessions = [
  {
    id: 'lung-volumes',
    lessonId: 'volumes',
    title: 'Lung Volumes and Capacities',
    subtitle: 'Lung Volumes and Capacities',
    minutes: 12,
    goal: 'Distinguish the air moved in one quiet breath from the air already in the lungs. Identify which volumes [spirometry] can measure.',
    summary: [
      'During quiet breathing, each breath moves one [tidalVolume].',
      'At the end of a quiet expiration, the lungs contain the [functionalResidual]. At the end of a maximal expiration, they contain the [residualVolume].',
      'A lung capacity combines two or more volumes. [totalLungCapacity] equals [vitalCapacity] plus [residualVolume].',
    ],
    sections: [
      [
        '1. Follow one quiet breath',
        'Picture yourself breathing in and out normally. The air that moves during either phase is your [tidalVolume]. If you inhale as far as you can from the end of a quiet inspiration, the additional air is your [inspiratoryReserve]. If you exhale as far as you can from the end of a quiet expiration, the additional air is your [expiratoryReserve].',
      ],
      [
        '2. Distinguish the air that moves from the air in the lungs',
        'Some air stays in the lungs even after maximal expiration. This is the [residualVolume]. At the end of a quiet expiration, the lungs contain this volume plus additional air that can still be exhaled. Together, these make up the [functionalResidual]. This is why the quiet-breathing baseline on a plot of total air in the lungs is above zero. A cumulative expired volume curve starts at zero because it counts only the air that has left the lungs.',
      ],
      [
        '3. Identify what the spirometer measures',
        '[spirometry] records the air that moves through the mouth. The air remaining after maximal expiration never passes through the device. Measuring [residualVolume] and the capacities that include it, [functionalResidual] and [totalLungCapacity], requires [staticLungVolumes] testing. For example, a laboratory can obtain these values using [plethysmography] and supplemental breathing maneuvers.',
      ],
      [
        '4. Interpret a low value in context',
        '[forcedVitalCapacity] is the volume recorded during a complete, forced expiration after maximal inspiration. [slowVitalCapacity] is recorded during a slow maneuver. With airway obstruction and [airTrapping], the forced maneuver may yield a lower value. Check maneuver quality first. When [forcedVitalCapacity] is low and the ratio of [firstSecond] to [forcedVitalCapacity] is preserved, consider [restriction]. Confirmation requires [totalLungCapacity] below the [lowerLimit].',
      ],
    ],
    table: {
      heading: 'Reference table for lung volumes and capacities',
      columns: ['Term', 'Definition or relationship'],
      rows: [
        ['[tidalVolume]', 'Air moved in one quiet inspiration or expiration.'],
        ['[inspiratoryReserve]', 'Additional air inhaled from the end of a quiet inspiration to maximal inspiration.'],
        ['[expiratoryReserve]', 'Additional air exhaled from the end of a quiet expiration to maximal expiration.'],
        ['[residualVolume]', 'Air remaining in the lungs after maximal expiration.'],
        ['[inspiratoryCapacity]', 'Air inhaled from the end of a quiet expiration to maximal inspiration. The sum of [tidalVolume] and [inspiratoryReserve].'],
        ['[functionalResidual]', 'Air remaining in the lungs at the end of a quiet expiration. The sum of [expiratoryReserve] and [residualVolume].'],
        ['[vitalCapacity]', 'The greatest volume of air that can move between maximal inspiration and maximal expiration. The sum of [inspiratoryReserve], [tidalVolume], and [expiratoryReserve].'],
        ['[totalLungCapacity]', 'Air in the lungs after maximal inspiration. The sum of [vitalCapacity] and [residualVolume].'],
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        'Suppose [inspiratoryReserve] is 2.8 liters, [tidalVolume] is 0.5 liters, [expiratoryReserve] is 1.1 liters, and [residualVolume] is 1.4 liters.',
        '[inspiratoryCapacity] is 3.3 liters (0.5 plus 2.8).',
        '[functionalResidual] is 2.5 liters (1.1 plus 1.4).',
        '[vitalCapacity] is 4.4 liters (2.8 plus 0.5 plus 1.1).',
        '[totalLungCapacity] is 5.8 liters (4.4 plus 1.4).',
      ],
    },
    takeaway: 'To confirm [restriction], compare [totalLungCapacity] with the [lowerLimit]. A low [forcedVitalCapacity] is a clue that calls for this measurement.',
    quiz: [
      'Which measurement is needed to confirm [restriction]?',
      ['[firstSecond]', '[totalLungCapacity]', '[tidalVolume]'],
      1,
      'Confirmation requires [totalLungCapacity] below the [lowerLimit].',
    ],
    question: {
      prompt: 'In the example, how many liters are in the lungs immediately after a quiet inspiration? Which two values do you use?',
      answer: '3.0 liters. Start at the end of quiet expiration with a [functionalResidual] of 2.5 liters and add one [tidalVolume] of 0.5 liters.',
    },
    terms: [
      'tidalVolume','inspiratoryReserve','expiratoryReserve','residualVolume',
      'inspiratoryCapacity','functionalResidual','vitalCapacity','totalLungCapacity',
      'spirometry','staticLungVolumes','forcedVitalCapacity','slowVitalCapacity',
      'airTrapping','firstSecond','lowerLimit','restriction','plethysmography',
    ],
    refs: [
      ['Standardization of Spirometry (2019)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6794117/'],
      ['Standardisation of the Measurement of Lung Volumes (2023)', 'https://pubmed.ncbi.nlm.nih.gov/37500112/'],
      ['Interpretive Strategies for Routine Lung Function Tests (2022)', 'https://pubmed.ncbi.nlm.nih.gov/34949706/'],
    ],
    practice: { label: 'Practice with the volume–time curve', href: '#lab/volumes' },
  },
];
