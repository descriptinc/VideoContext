export function clamp(num: number, min: number, max: number): number {
    if (num < min) {
        return min;
    }
    if (num > max) {
        return max;
    }
    return num;
}

export function computePlaybackRateToSync(
    time: number,
    targetTime: number,
    basePlaybackRate: number,
    syncConstant: number
) {
    // VideoContext has its own timing logic, we want to ensure that it's synchronized with the WebAudio timing
    // We do this by minutely adjusting the video playbackRate to be faster or slower than 1x

    const adjustPlaybackRate = 1 - time + targetTime + syncConstant;

    // Browsers limit playback rate and may cause a crash if they go out of range
    // See https://stackoverflow.com/a/32320020/10332852
    return clamp(basePlaybackRate * adjustPlaybackRate, 1 / 16, 16.0);
}
