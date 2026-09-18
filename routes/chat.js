import express from "express";

import {
  askRAG
} from "../rag/ragservice.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Trimora RAG Chatbot API is active and ready."
  });
});

router.post("/", async (req, res) => {
  try {
    const { message, question } = req.body;
    const query = message || question;

    if (
      !query ||
      !query.trim()
    ) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const result =
      await askRAG(query.trim());

    res.json(result);

  } catch (error) {
    console.error(
      "Chat error:",
      error
    );

    res.status(500).json({
      error:
        "Unable to process your question.",
      answer: "I don't have that information. Please contact John Salon at 6303522044."
    });
  }
});

export default router;
