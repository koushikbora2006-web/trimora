export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export function createBooking(data) {
  const timestamp = Date.now();

  return {
    id: `booking_${timestamp}`,

    referenceCode: `TRM-${timestamp
      .toString()
      .slice(-6)}`,

    salonId: data.salonId,
    serviceId: data.serviceId,

    customerName: data.customerName,
    phone: data.phone,

    date: data.date,
    time: data.time,

    notes: data.notes || "",

    status: BookingStatus.PENDING,

    createdAt: new Date().toISOString(),
  };
}

export function validateBooking(data) {
  const errors = {};

  if (!data.customerName || !data.customerName.trim()) {
    errors.customerName = "Customer name is required";
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = "Phone number is required";
  }

  if (!data.serviceId) {
    errors.serviceId = "Service is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.time) {
    errors.time = "Time is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
