/**
 * Forgiving streak computation for PAD Tracker.
 *
 * A "day with an entry" = local calendar date (not 24h rolling) with ≥1 entry.
 * Exactly one gap day is tolerated per streak without breaking it.
 * If today has no entry yet, the streak doesn't break — we start counting from yesterday.
 */

function fmtLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Compute consecutive-day streak of logged entries.
 * @param {{ ts: number }[]} entries - array of entry objects with a `ts` (ms) field
 * @returns {{ days: number, usedGrace: boolean }} streak count and whether grace day was consumed
 */
export function computeStreak(entries) {
  if (!entries || entries.length === 0) {
    return { days: 0, usedGrace: false };
  }

  // Collect unique local calendar dates as YYYY-MM-DD (uses local timezone)
  const dateSet = new Set();
  for (const entry of entries) {
    dateSet.add(fmtLocal(new Date(entry.ts)));
  }

  const now = new Date();
  const todayStr = fmtLocal(now);

  // Start walking backward from today (if logged) or yesterday (day isn't over yet)
  let current = new Date(todayStr + 'T12:00:00');
  if (!dateSet.has(todayStr)) {
    current.setDate(current.getDate() - 1);
  }

  let streak = 0;
  let gapFound = false; // first gap found (grace used)

  while (true) {
    const key = fmtLocal(current);
    if (dateSet.has(key)) {
      streak += 1;
    } else if (!gapFound) {
      // First gap — tolerate it but don't count this day
      gapFound = true;
    } else {
      break; // second gap — end of streak
    }
    current.setDate(current.getDate() - 1);

    // Safety: cap at ~730 days to prevent infinite loop
    if (streak > 730) break;
  }

  return { days: streak, usedGrace: gapFound };
}
