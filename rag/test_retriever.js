import { retrieveRelevantDocuments } from "./retriever.js";

async function test() {
  const query = "How much is Swedish full body massage?";
  console.log(`Query: "${query}"`);
  const docs = await retrieveRelevantDocuments(query, 3);
  console.log(`Retrieved ${docs.length} documents:`);
  docs.forEach((d, i) => {
    console.log(`\n[${i + 1}] Score: ${d.score.toFixed(4)} | Source: ${d.source}`);
    console.log(`    Content: ${d.content.substring(0, 120)}...`);
  });
}

test().catch(console.error);
