import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Somchai Jaidee',
        phone: '0812345678',
        role: 'USER',
        active: true,
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin Kornkanok',
        phone: '0899999999',
        role: 'ADMIN',
        active: true,
      },
      {
        email: 'manager@example.com',
        password: hashedPassword,
        name: 'Manager Kornkanok',
        phone: '0888888888',
        role: 'MANAGER',
        active: true,
      },
    ],
  });

  // Create Bus
  const bus1 = await prisma.bus.create({
    data: {
      type: 'VIP 24 Seats',
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      type: 'Air-conditioned 1st Class',
    },
  });

  // Create Trips
  const today = new Date();
  const trip1Date = new Date(today);
  trip1Date.setHours(8, 0, 0, 0);
  
  const trip1Arrival = new Date(today);
  trip1Arrival.setHours(20, 0, 0, 0); // 12 hours later

  await prisma.trip.create({
    data: {
      price: 850,
      departureTime: trip1Date,
      arrivalTime: trip1Arrival,
      busId: bus1.id,
    },
  });

  const trip2Date = new Date(today);
  trip2Date.setHours(20, 0, 0, 0);
  
  const trip2Arrival = new Date(today);
  trip2Arrival.setDate(today.getDate() + 1);
  trip2Arrival.setHours(8, 0, 0, 0);

  await prisma.trip.create({
    data: {
      price: 650,
      departureTime: trip2Date,
      arrivalTime: trip2Arrival,
      busId: bus2.id,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
