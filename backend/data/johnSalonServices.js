const johnSalonServices = [
  {
    id: "hair-styling",
    salonId: "john_salon_kkd",
    name: "Hair Styling",
    description:
      "Hair styling service. Final price depends on the selected style or service.",
    price: 250,
    priceType: "starting",
    duration: 30,
    available: true,
  },

  {
    id: "haircut",
    salonId: "john_salon_kkd",
    name: "Haircut",
    description:
      "Haircut service available at John Salon. Please contact the salon for the current price.",
    price: null,
    priceType: "not_available",
    duration: 30,
    available: true,
  },

  {
    id: "beard-styling",
    salonId: "john_salon_kkd",
    name: "Beard Styling",
    description:
      "Beard styling service available at John Salon. Please contact the salon for the current price.",
    price: null,
    priceType: "not_available",
    duration: 20,
    available: true,
  },

  {
    id: "hair-grooming",
    salonId: "john_salon_kkd",
    name: "Hair Grooming",
    description:
      "Hair grooming service available at John Salon. Please contact the salon for the current price.",
    price: null,
    priceType: "not_available",
    duration: 30,
    available: true,
  },

  {
    id: "other-salon-services",
    salonId: "john_salon_kkd",
    name: "Other Salon Services",
    description:
      "Other salon services may be available. Please contact John Salon for details.",
    price: null,
    priceType: "not_available",
    duration: null,
    available: true,
  },
];

export default johnSalonServices;
