import Groq from "groq-sdk";

import {
  retrieveRelevantDocuments
} from "./retriever.js";

import {
  createRAGPrompt
} from "./prompt.js";

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY || "gsk_placeholder"
});

export async function askRAG(question) {
  if (
    !process.env.GROQ_API_KEY
  ) {
    throw new Error(
      "GROQ_API_KEY is missing from .env"
    );
  }

  const documents =
    await retrieveRelevantDocuments(
      question,
      3
    );

  const context =
    documents
      .map(
        (document) =>
          document.content
      )
      .join("\n\n");

  const prompt =
    createRAGPrompt(
      context,
      question
    );

  const response =
    await groq.chat.completions.create(
      {
        model:
          process.env.GROQ_MODEL || "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content:
              "You are a strict John Salon customer support assistant. Use only the provided context. Never invent information."
          },
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0
      }
    );

  const answer =
    response
      ?.choices?.[0]
      ?.message?.content;

  return {
    answer:
      answer ||
      "I don't have that information. Please contact John Salon at 6303522044.",

    sources:
      documents.map(
        (document) => ({
          source:
            document.source,

          score:
            Number(
              document.score.toFixed(
                4
              )
            )
        })
      )
  };
}
