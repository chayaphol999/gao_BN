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