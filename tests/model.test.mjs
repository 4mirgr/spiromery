import test from 'node:test';
import assert from 'node:assert/strict';
import { artifacts, bronchodilator, lungVolumes, maneuver } from '../model.mjs';
import { cases } from '../cases.mjs';
import { lessons, modules, references } from '../curriculum.mjs';

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-8, `Expected ${actual} to equal ${expected}`);
}

test('representative curves agree with the fictional report and preserve physical ordering', () => {
  for (const item of cases) {
    for (const [pair,shape] of [[item.pre,item.shape],[item.post,item.postShape ?? item.shape]]) {
      if (!pair) continue;
      const [fev1,fvc] = pair;
      assert.ok(fev1 > 0 && fev1 < fvc);
      const model = maneuver(pair,shape);
      close(model.fev1,fev1);
      close(model.fvc,fvc);
      close(model.ratio,fev1/fvc);
      close(model.samples[0].volume,0);
      close(model.samples.at(-1).volume,fvc);
      close(model.inspiration[0].volume,fvc);
      close(model.inspiration.at(-1).volume,0);
      assert.ok(model.samples.every((point,i,all) => i === 0 || point.volume >= all[i-1].volume));
      assert.ok(model.inspiration.every(point => point.flow <= 0));
      assert.ok(model.valid && model.pef > 0 && !model.endedEarly);
    }
  }
});

test('early termination lowers FVC and leaves the trace open', () => {
  const base = maneuver([3,4.1],'normal');
  const early = maneuver([3,4.1],'normal','early');
  assert.ok(early.fvc < base.fvc);
  close(early.fev1, base.fev1);
  assert.ok(early.ratio > base.ratio && early.endedEarly);
  assert.deepEqual(early.inspiration,[]);
  for (const artifact of Object.keys(artifacts).filter(id => id !== 'none')) {
    assert.equal(maneuver([3,4.1],'normal',artifact).valid,false);
  }
});

test('a fixed central airway pattern shows flow limitation on both limbs', () => {
  const model = maneuver([1.97,3.45],'fixed');
  const expiry = model.samples.filter(point => point.time > 0.3 && point.time < model.end - 0.3);
  expiry.forEach(point => close(point.flow,model.pef));
  assert.equal(model.inspiration[60].flow,-2);
});

test('bronchodilator response keeps the two denominators and inclusive cutoffs distinct', () => {
  const atLimit = bronchodilator([2,3],[2.35,3],[3.5,4]);
  assert.equal(atLimit.indices[0].predictedPercent,10);
  assert.equal(atLimit.ers,false);
  assert.equal(atLimit.gina,true);
  const inclusive = bronchodilator([1.5,3],[1.7,3],[3,4]);
  assert.equal(inclusive.indices[0].delta,0.2);
  assert.equal(inclusive.gina,true);
  assert.equal(bronchodilator([2,3],[2.351,3],[3.5,4]).ers,true);
  assert.equal(bronchodilator([3,3.5],[3,3.99],[3.5,4.25]).ers,true);
});

test('lung capacities use the correct subdivisions', () => {
  const values = lungVolumes({ irv:2.8,tv:0.5,erv:1.1,rv:1.4 });
  close(values.ic,3.3);
  close(values.frc,2.5);
  close(values.vc,4.4);
  close(values.tlc,5.8);
});

test('the course and staged cases have complete references, options and practice links', () => {
  for (const list of [lessons,cases]) {
    assert.equal(new Set(list.map(item => item.id)).size,list.length);
    for (const item of list) {
      assert.ok(item.refs.length && item.refs.every(key => key in references));
      for (const [question,options,answer,feedback] of item.questions ?? [item.quiz]) {
        assert.ok(question && options.length >= 2 && options[answer] && feedback);
      }
    }
  }
  for (const lesson of lessons) {
    assert.ok(modules[lesson.module] && lesson.sections.length >= 3);
    assert.ok(['volumes','lab','cases'].includes(lesson.practice) || cases.some(item => item.id === lesson.practice));
  }
  for (const item of cases) assert.equal(item.questions.length,3);
});
