import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { IMAGES } from "../src/lib/images";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@premiertransfer.com.br";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
    create: {
      email: adminEmail,
      name: "Admin User",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const vehicles = [
    {
      slug: "saloon",
      name: "Sedan",
      description: "Ideal for solo travellers and couples",
      example: "Toyota Corolla or similar",
      passengers: 4,
      luggage: 2,
      handLuggage: 2,
      multiplier: 1.0,
      sortOrder: 1,
      imageUrl: IMAGES.fleet.saloon,
    },
    {
      slug: "estate",
      name: "Estate",
      description: "Extra boot space for luggage",
      example: "Toyota Fielder or similar",
      passengers: 4,
      luggage: 4,
      handLuggage: 2,
      multiplier: 1.12,
      sortOrder: 2,
      imageUrl: IMAGES.fleet.estate,
    },
    {
      slug: "mpv",
      name: "Van",
      description: "Comfortable for families and groups",
      example: "Chevrolet Spin or similar",
      passengers: 6,
      luggage: 4,
      handLuggage: 4,
      multiplier: 1.28,
      sortOrder: 3,
      imageUrl: IMAGES.fleet.mpv,
    },
    {
      slug: "business",
      name: "Executive",
      description: "Premium executive travel",
      example: "Mercedes E-Class or similar",
      passengers: 4,
      luggage: 2,
      handLuggage: 2,
      multiplier: 1.45,
      sortOrder: 4,
      imageUrl: IMAGES.fleet.business,
    },
    {
      slug: "8-seater",
      name: "8-Seater",
      description: "Large groups and airport runs",
      example: "Mercedes Sprinter or similar",
      passengers: 8,
      luggage: 6,
      handLuggage: 6,
      multiplier: 1.55,
      sortOrder: 5,
      imageUrl: IMAGES.fleet["8-seater"],
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicleType.upsert({
      where: { slug: v.slug },
      update: v,
      create: v,
    });
  }

  const existingPricing = await prisma.pricingRule.findFirst();
  if (!existingPricing) {
    await prisma.pricingRule.create({
      data: {
        name: "Standard Brazil Rates",
        baseFare: 65,
        perMileRate: 3.5,
        perMinuteRate: 0.8,
        minimumFare: 89,
        airportFee: 15,
        nightMultiplier: 1.15,
        nightStartHour: 22,
        nightEndHour: 6,
        isActive: true,
      },
    });
  }

  await prisma.surgeRule.upsert({
    where: { id: "default-surge" },
    update: {},
    create: {
      id: "default-surge",
      name: "No Surge Policy",
      multiplier: 1.0,
      isActive: false,
      description: "Premier Transfer Brasil never applies surge pricing",
    },
  });

  const settings = [
    { key: "google_maps_api_key", value: "", label: "Google Maps API Key" },
    { key: "stripe_public_key", value: "", label: "Stripe Public Key" },
    { key: "stripe_secret_key", value: "", label: "Stripe Secret Key" },
    { key: "twilio_account_sid", value: "", label: "Twilio Account SID" },
    { key: "twilio_auth_token", value: "", label: "Twilio Auth Token" },
    { key: "twilio_phone_number", value: "", label: "Twilio Phone Number" },
    { key: "sendgrid_api_key", value: "", label: "SendGrid API Key" },
    { key: "notification_email", value: "reservas@premiertransfer.com.br", label: "Notification Email" },
  ];

  for (const s of settings) {
    await prisma.apiSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  const saloon = await prisma.vehicleType.findUnique({ where: { slug: "saloon" } });
  if (saloon) {
    const existingBookings = await prisma.booking.count();
    if (existingBookings === 0) {
      const customer = await prisma.customer.create({
        data: {
          email: "ana.silva@example.com",
          phone: "+55 11 98765-4321",
          firstName: "Ana",
          lastName: "Silva",
        },
      });

      await prisma.booking.createMany({
        data: [
          {
            reference: "PTB-K7M2NP",
            status: "CONFIRMED",
            pickupAddress: "Aeroporto Internacional de Guarulhos (GRU), Guarulhos, SP",
            pickupLat: -23.4356,
            pickupLng: -46.4731,
            dropoffAddress: "Centro de São Paulo, Sé, São Paulo, SP",
            dropoffLat: -23.5505,
            dropoffLng: -46.6333,
            pickupDate: new Date(Date.now() + 86400000 * 2),
            pickupTime: "14:30",
            distanceMiles: 28.0,
            durationMinutes: 45,
            basePrice: 189.5,
            vehiclePrice: 189.5,
            totalPrice: 189.5,
            paymentMethod: "ONLINE",
            paymentStatus: "PAID",
            flightNumber: "LA8084",
            passengers: 2,
            luggage: 2,
            customerId: customer.id,
            vehicleTypeId: saloon.id,
          },
          {
            reference: "PTB-R4T8WX",
            status: "COMPLETED",
            pickupAddress: "Aeroporto Internacional do Galeão (GIG), Rio de Janeiro, RJ",
            pickupLat: -22.809,
            pickupLng: -43.2506,
            dropoffAddress: "Copacabana, Rio de Janeiro, RJ",
            dropoffLat: -22.9711,
            dropoffLng: -43.1822,
            pickupDate: new Date(Date.now() - 86400000 * 3),
            pickupTime: "06:00",
            distanceMiles: 22.0,
            durationMinutes: 40,
            basePrice: 162.0,
            vehiclePrice: 162.0,
            totalPrice: 162.0,
            paymentMethod: "CARD_TO_DRIVER",
            paymentStatus: "PAID",
            passengers: 1,
            luggage: 1,
            customerId: customer.id,
            vehicleTypeId: saloon.id,
          },
        ],
      });
    }
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
