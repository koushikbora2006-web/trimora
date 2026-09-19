import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db.js";
import chatRouter from "./routes/chat.js";
import bookingRouter from "./routes/booking.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Trimorva backend is running"
  });
});

app.use("/api/chat", chatRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/booking", bookingRouter);

const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Trimorva backend running on http://localhost:${PORT}`
    );
  });
};

startServer();
