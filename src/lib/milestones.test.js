// Plain-node regression test for milestone logic — no test runner configured
// in this project, so this is run directly: `node src/lib/milestones.test.js`.
// Not imported anywhere in the app; safe to leave in the repo as documentation
// of expected behavior for future changes to milestones.js.
import { getMilestoneStatus, getNewMilestones } from './milestones.js';

function entries(n) {
  return Array.from({ length: n }, (_, i) => ({ id: i, ts: Date.now() - i * 1000 }));
}

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
    passed++;
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
    failed++;
  }
}
function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'assertion failed');
}
function assertEq(a, b, msg) {
  const as = JSON.stringify(a), bs = JSON.stringify(b);
  if (as !== bs) throw new Error(msg ? `${msg}: got ${as}, expected ${bs}` : `got ${as}, expected ${bs}`);
}

// --- getMilestoneStatus ---

test('no entries: no reached, next=7, progress=0', () => {
  const s = getMilestoneStatus([]);
  assertEq(s.reached, []);
  assertEq(s.next, 7);
  assertEq(s.progress, 0);
  assertEq(s.total, 0);
});

test('6 entries: no reached, next=7, progress=6/7', () => {
  const s = getMilestoneStatus(entries(6));
  assertEq(s.reached, []);
  assertEq(s.next, 7);
  assert(Math.abs(s.progress - 6 / 7) < 0.0001, `progress ${s.progress}`);
});

test('7 entries: reached=[7], next=30, progress=7/30', () => {
  const s = getMilestoneStatus(entries(7));
  assertEq(s.reached, [7]);
  assertEq(s.next, 30);
  assert(Math.abs(s.progress - 7 / 30) < 0.0001, `progress ${s.progress}`);
});

test('30 entries: reached=[7,30], next=90', () => {
  const s = getMilestoneStatus(entries(30));
  assertEq(s.reached, [7, 30]);
  assertEq(s.next, 90);
});

test('35 entries: reached=[7,30] (both crossed), next=90', () => {
  const s = getMilestoneStatus(entries(35));
  assertEq(s.reached, [7, 30]);
  assertEq(s.next, 90);
});

test('90 entries: reached=[7,30,90], next=null, progress=1', () => {
  const s = getMilestoneStatus(entries(90));
  assertEq(s.reached, [7, 30, 90]);
  assertEq(s.next, null);
  assertEq(s.progress, 1);
});

test('100 entries: all reached, next=null, progress=1', () => {
  const s = getMilestoneStatus(entries(100));
  assertEq(s.reached, [7, 30, 90]);
  assertEq(s.next, null);
  assertEq(s.progress, 1);
});

// --- getNewMilestones ---

test('getNewMilestones: none shown, 7 entries → [7]', () => {
  assertEq(getNewMilestones(entries(7), []), [7]);
});

test('getNewMilestones: 7 already shown, 7 entries → []', () => {
  assertEq(getNewMilestones(entries(7), [7]), []);
});

test('getNewMilestones: none shown, 30 entries → [7,30]', () => {
  assertEq(getNewMilestones(entries(30), []), [7, 30]);
});

test('getNewMilestones: 7 shown, 30 entries → [30]', () => {
  assertEq(getNewMilestones(entries(30), [7]), [30]);
});

test('getNewMilestones: all shown, 90 entries → []', () => {
  assertEq(getNewMilestones(entries(90), [7, 30, 90]), []);
});

test('getNewMilestones: none shown, 0 entries → []', () => {
  assertEq(getNewMilestones([], []), []);
});

test('getNewMilestones: defaults shownMilestones to [] when omitted', () => {
  assertEq(getNewMilestones(entries(7)), [7]);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
