import fs from 'fs';
import path from 'path';
import { createEmbedding } from './embeddings';

const vectorFile = path.join(process.cwd(), 'rag', 'vectorstore', 'vectors.json');

export interface ScoredDocument {
  id: string;
  source: string;
  content: string;
  score: number;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export async function retrieveRelevantDocuments(
  question: string,
  topK: number = 3
): Promise<ScoredDocument[]> {
  if (!fs.existsSync(vectorFile)) {
    throw new Error(
      'Knowledge base does not exist. Run "npm run rag:build" first.'
    );
  }

  const rawData = fs.readFileSync(vectorFile, 'utf8');
  const documents: Array<{
    id: string;
    source: string;
    content: string;
    embedding: number[];
  }> = JSON.parse(rawData);

  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error('Knowledge base is empty. Run "npm run rag:build" first.');
  }

  const questionEmbedding = await createEmbedding(question);

  const scoredDocuments: ScoredDocument[] = documents.map((document) => ({
    id: document.id,
    source: document.source,
    content: document.content,
    score: cosineSimilarity(questionEmbedding, document.embedding)
  }));

  scoredDocuments.sort((a, b) => b.score - a.score);

  return scoredDocuments.slice(0, topK);
}
