import { createTranslator } from './locale.mjs';

export const colors = { before:'#8fe2ab', after:'#f6cc84', reference:'#8cb5be' };

export function drawChart(canvas, curves, mode, locale) {
  const t = createTranslator(locale);
  const { width, height } = canvas.getBoundingClientRect();
  if (width === 0 || height === 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const volumeTime = mode === 'time';
  const left = 47;
  const right = width - 13;
  const top = 21;
  const bottom = height - 43;
  const stepY = volumeTime ? 1 : 2;
  const maxX = volumeTime ? Math.max(6, ...curves.map(c => Math.ceil(c.end))) : Math.max(5, ...curves.map(c => Math.ceil(c.fvc)));
  const maxY = volumeTime
    ? Math.max(5, ...curves.map(c => Math.ceil(c.fvc)))
    : Math.max(10, ...curves.map(c => Math.ceil(c.pef / stepY) * stepY));
  const minY = volumeTime ? 0 : -6;
  const px = x => left + x / maxX * (right - left);
  const py = y => bottom - (y - minY) / (maxY - minY) * (bottom - top);

  function line(x1, y1, x2, y2, stroke) {
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.font = '11px Vazirmatn, sans-serif';
  ctx.fillStyle = '#c2d6cd';
  ctx.textAlign = 'center';
  for (let x = 0; x <= maxX; x += 1) {
    line(px(x), top, px(x), bottom, x === 0 ? '#69877d' : '#34524b');
    ctx.fillText(x, px(x), bottom + 16);
  }
  ctx.textAlign = 'right';
  for (let y = minY; y <= maxY; y += stepY) {
    line(left, py(y), right, py(y), y === 0 ? '#819e93' : '#34524b');
    ctx.fillText(y, left - 7, py(y) + 4);
  }
  ctx.textAlign = 'left';
  ctx.fillText(t(volumeTime ? 'volumeAxis' : 'flowAxis'), left, 13);
  ctx.textAlign = 'center';
  ctx.fillText(t(volumeTime ? 'expiredTimeAxis' : 'expiredVolumeAxis'), (left + right) / 2, height - 5);

  if (volumeTime) {
    ctx.setLineDash([3, 4]);
    line(px(1), top, px(1), bottom, '#b8c9ab');
    ctx.setLineDash([]);
  }

  for (const curve of curves) {
    const x = sample => px(volumeTime ? sample.time : sample.volume);
    const y = sample => py(volumeTime ? sample.volume : sample.flow);
    const points = volumeTime
      ? [...curve.samples, ...(!curve.endedEarly ? [{ time:maxX, volume:curve.fvc }] : [])]
      : [...curve.samples, ...curve.inspiration];
    ctx.beginPath();
    ctx.strokeStyle = curve.color;
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(curve.dashed ? [6, 5] : []);
    for (const [i, point] of points.entries()) {
      if (i === 0) ctx.moveTo(x(point), y(point));
      else ctx.lineTo(x(point), y(point));
    }
    ctx.stroke();
    ctx.setLineDash([]);
    if (volumeTime) {
      ctx.fillStyle = curve.color;
      ctx.beginPath();
      ctx.arc(px(1), py(curve.fev1), 3.6, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

export function drawBreathingChart(canvas, { rv, erv, tv, irv }, locale) {
  const t = createTranslator(locale);
  const { width, height } = canvas.getBoundingClientRect();
  if (width === 0 || height === 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const frc = rv + erv;
  const tidalTop = frc + tv;
  const tlc = tidalTop + irv;
  const left = 38;
  const right = width - 60;
  const bottom = height - 33;
  const px = time => left + time / 10 * (right - left);
  const py = volume => bottom - volume / (tlc * 1.11) * (bottom - 12);
  const boundaries = [
    [0, rv,'#e5eee9','RV'], [rv, frc,'#c7e0d2','ERV'],
    [frc, tidalTop,'#e8f2c4','TV'], [tidalTop, tlc,'#d1e7d7','IRV'],
  ];
  ctx.font = '11px Vazirmatn, sans-serif';
  for (const [low, high, fill, label] of boundaries) {
    ctx.fillStyle = fill;
    ctx.fillRect(left, py(high), right - left, py(low) - py(high));
    if (py(low) - py(high) > 14) {
      ctx.fillStyle = '#426258';
      ctx.fillText(label, left + 6, (py(high) + py(low)) / 2 + 4);
    }
  }
  ctx.textAlign = 'left';
  for (const [name, volume] of [['TLC',tlc],['FRC',frc],['RV',rv]]) {
    const y = py(volume);
    ctx.strokeStyle = '#88a597';
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right + 4, y);
    ctx.stroke();
    ctx.fillStyle = '#32584a';
    ctx.fillText(name, right + 8, y + 4);
  }
  ctx.textAlign = 'center';
  ctx.fillText(t('timeAxis'), (left + right) / 2, height - 4);
  for (let time = 0; time <= 10; time += 2) ctx.fillText(time, px(time), bottom + 15);
  ctx.fillText('L', 13, 14);
  ctx.textAlign = 'right';
  for (let value = 0; value <= tlc; value += tlc > 8 ? 2 : 1) {
    ctx.fillText(value, left - 8, py(value) + 4);
  }

  const points = [[0,frc],[0.65,tidalTop],[1.55,frc],[2.2,tidalTop],[3.1,frc],
    [3.75,tidalTop],[4.6,frc],[5.9,tlc],[7.7,rv],[9,frc],[9.5,tidalTop],[10,frc]];
  ctx.beginPath();
  ctx.moveTo(px(points[0][0]), py(points[0][1]));
  for (const [[t0,v0],[t1,v1]] of points.slice(1).map((point,i) => [points[i],point])) {
    const midpoint = px((t1 + t0) / 2);
    ctx.bezierCurveTo(midpoint, py(v0), midpoint, py(v1), px(t1), py(v1));
  }
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#216a53';
  ctx.stroke();
}
