/**
 * Video Context States
 * @readonly
 * @typedef {Object} STATE
 * @property {number} STATE.PLAYING - All sources are active
 * @property {number} STATE.PAUSED - All sources are paused
 * @property {number} STATE.STALLED - One or more sources is unable to play
 * @property {number} STATE.ENDED - All sources have finished playing
 * @property {number} STATE.BROKEN - The render graph is in a broken state
 */
export const STATE = Object.freeze({
    PLAYING: 0,
    PAUSED: 1,
    STALLED: 2,
    ENDED: 3,
    BROKEN: 4
});

/**
 * Video Context Events
 * @readonly
 * @typedef {Object} STATE
 * @property {string} STATE.UPDATE - Called any time a frame is rendered to the screen.
 * @property {string} STATE.STALLED - happens anytime the playback is stopped due to buffer starvation for playing assets.
 * @property {string} STATE.ENDED - Called once plackback has finished (i.e ctx.currentTime == ctx.duration).
 * @property {string} STATE.CONTENT - Called at the start of a time region where there is content playing out of one or more sourceNodes.
 * @property {number} STATE.NOCONTENT - Called at the start of any time region where the VideoContext is still playing, but there are currently no active playing sources.
 */
export const EVENTS = Object.freeze({
    UPDATE: "update",
    STALLED: "stalled",
    ENDED: "ended",
    CONTENT: "content",
    NOCONTENT: "nocontent"
});
