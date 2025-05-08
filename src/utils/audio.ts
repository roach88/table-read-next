export const createAudioObjectUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeAudioObjectUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const createTimestamps = (
  text: string,
  averageWordsPerMinute = 150,
): Array<{ time: number; lineIndex: number }> => {
  const lines = text.split("\n");
  const timestamps: Array<{ time: number; lineIndex: number }> = [];

  let cumulativeTime = 0;

  lines.forEach((line, index) => {
    timestamps.push({ time: cumulativeTime, lineIndex: index });

    // Estimate duration based on word count (very rough approximation)
    const wordCount = line.trim().split(/\s+/).length;
    const estimatedSeconds = (wordCount / averageWordsPerMinute) * 60;

    cumulativeTime += estimatedSeconds || 0.5; // Minimum of 0.5 seconds for empty lines
  });

  return timestamps;
};
