let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    // Dynamic import to prevent bundling overhead in client components
    const { pipeline } = await import('@huggingface/transformers');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

export async function createEmbedding(text: string): Promise<number[]> {
  const model = await getExtractor();
  const output = await model(text, {
    pooling: 'mean',
    normalize: true
  });
  return Array.from(output.data);
}
