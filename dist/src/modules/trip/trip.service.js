"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TripService = class TripService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.ensureDailyTrips();
    }
    startOfDay(date = new Date()) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    endOfDay(date = new Date()) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomPrice() {
        const raw = this.randomInt(450, 990);
        return Math.round(raw / 10) * 10;
    }
    createRandomDepartureTimesForToday(count) {
        const start = this.startOfDay();
        const usedHours = new Set();
        const times = [];
        while (times.length < count) {
            const hour = this.randomInt(6, 22);
            if (usedHours.has(hour)) {
                continue;
            }
            usedHours.add(hour);
            const dt = new Date(start);
            dt.setHours(hour, 0, 0, 0);
            times.push(dt);
        }
        return times.sort((a, b) => a.getTime() - b.getTime());
    }
    async ensureDefaultBuses() {
        const buses = await this.prisma.bus.findMany({
            select: { id: true, type: true },
            orderBy: { createdAt: 'asc' },
        });
        if (buses.length > 0) {
            return buses;
        }
        await this.prisma.bus.createMany({
            data: [
                { type: 'VIP 24 Seats' },
                { type: 'Air-conditioned 1st Class' },
                { type: 'Express 40 Seats' },
            ],
        });
        return this.prisma.bus.findMany({
            select: { id: true, type: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async removePastTrips() {
        const dayStart = this.startOfDay();
        await this.prisma.payment.deleteMany({
            where: {
                ticket: {
                    trip: {
                        departureTime: { lt: dayStart },
                    },
                },
            },
        });
        await this.prisma.ticket.deleteMany({
            where: {
                trip: {
                    departureTime: { lt: dayStart },
                },
            },
        });
        await this.prisma.trip.deleteMany({
            where: {
                departureTime: { lt: dayStart },
            },
        });
    }
    async ensureDailyTrips() {
        await this.removePastTrips();
        const todayTripsCount = await this.prisma.trip.count({
            where: {
                departureTime: {
                    gte: this.startOfDay(),
                    lte: this.endOfDay(),
                },
            },
        });
        if (todayTripsCount >= 10) {
            return;
        }
        const buses = await this.ensureDefaultBuses();
        const departures = this.createRandomDepartureTimesForToday(10 - todayTripsCount);
        const payload = departures.map((departureTime) => {
            const durationHours = this.randomInt(8, 14);
            const arrivalTime = new Date(departureTime);
            arrivalTime.setHours(arrivalTime.getHours() + durationHours);
            const bus = buses[this.randomInt(0, buses.length - 1)];
            return {
                price: this.randomPrice(),
                departureTime,
                arrivalTime,
                busId: bus.id,
            };
        });
        await this.prisma.trip.createMany({ data: payload });
    }
    getSeatCapacity(busType) {
        const match = busType.match(/(\d+)/);
        if (match) {
            return Number(match[1]);
        }
        if (busType.toLowerCase().includes('vip')) {
            return 24;
        }
        return 40;
    }
    toTripView(trip) {
        const bookedSeats = trip.tickets.map((ticket) => ticket.seatNumber);
        const capacity = this.getSeatCapacity(trip.bus.type);
        return {
            ...trip,
            bookedSeats,
            seatCapacity: capacity,
            availableSeats: Math.max(capacity - bookedSeats.length, 0),
        };
    }
    async create(createTripDto) {
        return this.prisma.trip.create({
            data: createTripDto,
        });
    }
    async findAll(date) {
        await this.ensureDailyTrips();
        const where = date
            ? {
                departureTime: {
                    gte: new Date(`${date}T00:00:00.000Z`),
                    lte: new Date(`${date}T23:59:59.999Z`),
                },
            }
            : undefined;
        const trips = await this.prisma.trip.findMany({
            where,
            include: {
                bus: true,
                tickets: {
                    select: { seatNumber: true },
                },
            },
            orderBy: { departureTime: 'asc' },
        });
        return trips.map((trip) => this.toTripView(trip));
    }
    async findOne(id) {
        const trip = await this.prisma.trip.findUnique({
            where: { id },
            include: {
                bus: true,
                tickets: {
                    select: { seatNumber: true },
                },
            },
        });
        if (!trip) {
            return null;
        }
        return this.toTripView(trip);
    }
    async update(id, updateTripDto) {
        return this.prisma.trip.update({
            where: { id },
            data: updateTripDto,
        });
    }
    async remove(id) {
        return this.prisma.trip.delete({
            where: { id },
        });
    }
};
exports.TripService = TripService;
exports.TripService = TripService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripService);
//# sourceMappingURL=trip.service.js.map