import express from "express";
import { createBooking, validateBooking } from "../booking.js";

const router = express.Router();
const bookingsInMemory = [];

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: bookingsInMemory.length,
    bookings: bookingsInMemory
  });
});

router.post("/", (req, res) => {
  const validation = validateBooking(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors
    });
  }

  const booking = createBooking(req.body);
  bookingsInMemory.push(booking);

  return res.status(201).json({
    success: true,
    booking
  });
});

export default router;
