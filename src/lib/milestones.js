/**
 * Milestone tracking for PAD Tracker.
 *
 * Milestones celebrate consistent logging at 7, 30, and 90 entries.
 * Rewards the act of checking in, never the content of moods.
 */

const MILESTONE_THRESHOLDS = [7, 30, 90];

/**
 * Get the current milestone status based on entry count.
 * @param {Array} entries - array of entry objects
 * @returns {{ reached: number[], next: number|null, progress: number, total: number }}
 */
export function getMilestoneStatus(entries) {
  const total = entries.length;
  const reached = MILESTONE_THRESHOLDS.filter((threshold) => total >= threshold);
  const next = MILESTONE_THRESHOLDS.find((threshold) => total < threshold) || null;
  const progress = next ? total / next : 1;

  return { reached, next, progress, total };
}

/**
 * Check which milestones are newly reached (not yet shown to user).
 * @param {Array} entries - array of entry objects
 * @param {number[]} shownMilestones - array of milestone thresholds already shown
 * @returns {number[]} array of newly reached milestone thresholds
 */
export function getNewMilestones(entries, shownMilestones = []) {
  const status = getMilestoneStatus(entries);
  return status.reached.filter((milestone) => !shownMilestones.includes(milestone));
}
