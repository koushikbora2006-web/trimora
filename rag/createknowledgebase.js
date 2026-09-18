import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { chunkText } from "./chunker.js";
import { createEmbedding } from "./embeddings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFolder = path.join(__dirname, "data");
const vectorFolder = path.join(__dirname, "vectorstore");
const vectorFile = path.join(
  vectorFolder,
  "vectors.json"
);

async function createKnowledgeBase() {
  try {
    console.log("=================================");
    console.log("Creating Trimora Knowledge Base");
    console.log("=================================");

    if (!fs.existsSync(vectorFolder)) {
      fs.mkdirSync(vectorFolder, {
        recursive: true
      });
    }

    const files = fs
      .readdirSync(dataFolder)
      .filter((file) => file.endsWith(".txt"));

    const preferredOrder = ["salon_info.txt", "services.txt", "faq.txt", "policies.txt", "john_salon_beauty_spa_guide.txt"];
    files.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    if (files.length === 0) {
      throw new Error(
        "No .txt files found inside rag/data"
      );
    }

    let documents = [];

    for (const file of files) {
      const filePath = path.join(
        dataFolder,
        file
      );

      console.log(`Reading: ${file}`);

      const text = fs.readFileSync(
        filePath,
        "utf8"
      );

      const chunks = chunkText(
        text,
        file
      );

      documents.push(...chunks);
    }

    console.log(
      `Total chunks: ${documents.length}`
    );

    const vectors = [];

    for (const document of documents) {
      console.log(
        `Creating embedding: ${document.id}`
      );

      const embedding =
        await createEmbedding(
          document.content
        );

      vectors.push({
        id: document.id,
        source: document.source,
        content: document.content,
        embedding
      });
    }

    fs.writeFileSync(
      vectorFile,
      JSON.stringify(
        vectors,
        null,
        2
      ),
      "utf8"
    );

    console.log("");
    console.log(
      "Knowledge base created successfully!"
    );
    console.log(
      `Saved to: ${vectorFile}`
    );
    console.log("");
  } catch (error) {
    console.error(
      "Knowledge base creation failed:"
    );

    console.error(error);
  }
}

createKnowledgeBase();
