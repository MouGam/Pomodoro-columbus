export function jsonSecondsToMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
        minuates:`${mins}`,
        seconds: `${secs.toString().padStart(2, '0')}`
    };
}

export function parseMinutesToSeconds(min, seconds) {
    // const [mins, secs] = timeStr.split(':').map(Number);
    return min * 60 + seconds;
}
