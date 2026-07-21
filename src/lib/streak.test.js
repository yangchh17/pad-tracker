// Plain-node regression test for computeStreak — no test runner configured
// in this project, so this is run directly: `node src/lib/streak.test.js`.
// Not imported anywhere in the app; safe to leave in the repo as documentation
// of expected behavior for future changes to streak.js.
import { computeStreak } from './streak.js';

function pastTs(n) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n); // n days into the past (positive n = past)
  return +d;
}
function entriesAt(...daysAgoList) {
  return daysAgoList.map((n) => ({ ts: pastTs(n) }));
}

let passed = 0;
let failed = 0;
function test(name, entries, expectedDays) {
  const actual = computeStreak(entries);
  if (actual.days === expectedDays) {
    console.log(`PASS ${name}: days=${actual.days}`);
    passed++;
  } else {
    console.log(`FAIL ${name}: got days=${actual.days}, expected ${expectedDays}`);
    failed++;
  }
}

test('no entries', [], 0);
test('today only', entriesAt(0), 1);
test('5 consecutive days including today', entriesAt(0, 1, 2, 3, 4), 5);
test('today not logged yet, 3 consecutive ending yesterday', entriesAt(1, 2, 3), 3);
test('today not logged yet, only yesterday', entriesAt(1), 1);
test('one gap bridged: today+yesterday, gap, then 3 days ago', entriesAt(0, 1, 3), 3);
test('gap right after today: today, gap, 2 days ago', entriesAt(0, 2), 2);
test('two consecutive gaps break the streak', entriesAt(0, 3), 1);
test('older run separated by 3+ day absence does not connect', entriesAt(0, 1, 5, 6), 2);
test('single very old entry with nothing since', entriesAt(30), 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
