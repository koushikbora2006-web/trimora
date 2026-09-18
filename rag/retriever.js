import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { createEmbedding } from "./embeddings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vectorFile = path.join(
  __dirname,
  "vectorstore",
  "vectors.json"
);

export function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];

    magnitudeA +=
      a[i] * a[i];

    magnitudeB +=
      b[i] * b[i];
  }

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (
      Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB)
    )
  );
}

export async function retrieveRelevantDocuments(
  question,
  topK = 3
) {
  if (!fs.existsSync(vectorFile)) {
    throw new Error(
      "Knowledge base does not exist. Run the RAG creation command first."
    );
  }

  const rawData =
    fs.readFileSync(
      vectorFile,
      "utf8"
    );

  const documents =
    JSON.parse(rawData);

  if (
    !Array.isArray(documents) ||
    documents.length === 0
  ) {
    throw new Error(
      "Knowledge base is empty. Run the RAG creation command first."
    );
  }

  const questionEmbedding =
    await createEmbedding(
      question
    );

  const scoredDocuments =
    documents.map((document) => ({
      id: document.id,
      source: document.source,
      content: document.content,
      score: cosineSimilarity(
        questionEmbedding,
        document.embedding
      )
    }));

  scoredDocuments.sort(
    (a, b) =>
      b.score - a.score
  );

  return scoredDocuments.slice(
    0,
    topK
  );
}
