export interface TextChunk {
  id: string;
  source: string;
  content: string;
}

export function chunkText(text: string, source: string): TextChunk[] {
  const rawChunks = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  const mergedChunks: string[] = [];
  for (let i = 0; i < rawChunks.length; i++) {
    const current = rawChunks[i];
    if (
      current.startsWith("Answer:") &&
      mergedChunks.length > 0 &&
      mergedChunks[mergedChunks.length - 1].startsWith("Question:")
    ) {
      mergedChunks[mergedChunks.length - 1] += "\n\n" + current;
    } else {
      mergedChunks.push(current);
    }
  }

  return mergedChunks.map((content, index) => ({
    id: `${source}-${index}`,
    source,
    content
  }));
}
