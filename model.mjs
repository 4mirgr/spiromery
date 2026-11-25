export const artifacts = {
  none: 'مانور کامل',
  early: 'پایان زودرس',
  cough: 'سرفه در ثانیه اول',
  slow: 'شروع کند',
};

const durationByShape = { normal: 4, obstructive: 8, restrictive: 3 };
const smoothStep = x => x * x * (3 - 2 * x);

function lungEmptying(shape, ratio) {
  if (shape === 'fixed') {
    const ramp = 0.16;
    const duration = (1 - ramp / 2) / ratio + ramp;
    const cumulative = (time) => {
      if (time <= 0) return 0;
      if (time >= duration) return 1;
      const denominator = duration - ramp;
      if (time < ramp) return time ** 2 / (2 * ramp * denominator);
      if (time > duration - ramp) return 1 - (duration - time) ** 2 / (2 * ramp * denominator);
      return (time - ramp / 2) / denominator;
    };
    return { duration, cumulative };
  }

  const duration = durationByShape[shape];
  const slow = 2;
  const fast = duration * 4.5;
  const cdf = (time, b) => {
    const x = Math.min(1, Math.max(0, time / duration));
    return 1 - (1 - x) ** b * (1 + b * x);
  };
  const fastShare = (ratio - cdf(1, slow)) / (cdf(1, fast) - cdf(1, slow));
  return {
    duration,
    cumulative: (time) => fastShare * cdf(time, fast) + (1 - fastShare) * cdf(time, slow),
  };
}

export function maneuver(pair, shape, artifact = 'none') {
  const [fev1, fvc] = pair;
  const { duration, cumulative } = lungEmptying(shape, fev1 / fvc);
  const endedEarly = artifact === 'early';
  const end = endedEarly ? 1.3 : duration;
  const position = (t) => {
    const time = artifact === 'slow' ? Math.max(0, t - 0.28 * (1 - Math.exp(-t / 0.26))) / (1 - 0.28 / duration) : t;
    if (artifact === 'cough' && t > 0.26 && t < 0.64) {
      const phase = (t - 0.26) / 0.38;
      return fvc * cumulative(time) - 0.14 * Math.sin(Math.PI * phase) ** 2;
    }
    return fvc * cumulative(time);
  };
  const stepCount = Math.ceil(end / 0.015);
  const samples = Array.from({ length: stepCount + 1 }, (_, index) => {
    const time = end * index / stepCount;
    const before = Math.max(0, time - 0.001);
    const after = Math.min(end, time + 0.001);
    return { time, volume: position(time), flow: (position(after) - position(before)) / (after - before) };
  });
  const finishedVolume = position(end);
  const inspiration = endedEarly ? [] : Array.from({ length: 121 }, (_, index) => {
    const progress = index / 120;
    const profile = shape === 'fixed'
      ? smoothStep(Math.min(1, progress / 0.13, (1 - progress) / 0.13))
      : Math.sin(Math.PI * progress) ** 0.62;
    const peak = shape === 'fixed' ? 2.0 : Math.min(5.4, fvc * 1.15);
    return { volume: finishedVolume * (1 - progress), flow: -peak * profile };
  });
  const firstSecond = position(1);
  const valid = artifact === 'none';
  return {
    fev1: firstSecond, fvc: finishedVolume, ratio: firstSecond / finishedVolume,
    pef: Math.max(...samples.map(point => point.flow)), samples, inspiration, valid, end, endedEarly,
  };
}

export function bronchodilator(before, after, predicted) {
  const indices = before.map((baseline, i) => {
    const delta = after[i] - baseline;
    // Round computation noise before comparing inclusive decimal boundaries.
    const stable = (number) => Number(number.toFixed(10));
    return {
      delta: stable(delta),
      baselinePercent: stable(100 * delta / baseline),
      predictedPercent: stable(100 * delta / predicted[i]),
    };
  });
  return {
    indices,
    ers: indices.some(value => value.predictedPercent > 10),
    gina: indices.some(value => value.delta >= 0.2 && value.baselinePercent >= 12),
  };
}

export function lungVolumes({ irv, tv, erv, rv }) {
  return { ic: irv + tv, frc: erv + rv, vc: irv + tv + erv, tlc: irv + tv + erv + rv };
}
