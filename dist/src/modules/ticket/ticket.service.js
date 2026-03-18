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
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TicketService = class TicketService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTicketDto) {
        return this.prisma.ticket.create({
            data: createTicketDto,
        });
    }
    async findAll() {
        return this.prisma.ticket.findMany({
            include: { trip: { include: { bus: true } }, user: true, payments: true },
            orderBy: { bookingDate: 'desc' },
        });
    }
    async findMine(userId) {
        return this.prisma.ticket.findMany({
            where: { userId },
            include: {
                trip: { include: { bus: true } },
                payments: true,
            },
            orderBy: { bookingDate: 'desc' },
        });
    }
    async book(userId, createBookingDto) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: createBookingDto.tripId },
            include: { bus: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const existingSeat = await this.prisma.ticket.findFirst({
            where: {
                tripId: createBookingDto.tripId,
                seatNumber: createBookingDto.seatNumber,
            },
        });
        if (existingSeat) {
            throw new common_1.BadRequestException('This seat has already been booked');
        }
        return this.prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.create({
                data: {
                    seatNumber: createBookingDto.seatNumber,
                    userId,
                    tripId: createBookingDto.tripId,
                    bookingDate: createBookingDto.bookingDate
                        ? new Date(createBookingDto.bookingDate)
                        : new Date(),
                },
                include: {
                    trip: { include: { bus: true } },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            phone: true,
                            role: true,
                        },
                    },
                },
            });
            const payment = await tx.payment.create({
                data: {
                    amount: trip.price,
                    method: createBookingDto.paymentMethod,
                    status: createBookingDto.paymentStatus,
                    paymentDate: createBookingDto.paymentDate
                        ? new Date(createBookingDto.paymentDate)
                        : new Date(),
                    ticketId: ticket.id,
                },
            });
            return {
                ...ticket,
                payments: [payment],
            };
        });
    }
    async findOne(id) {
        return this.prisma.ticket.findUnique({
            where: { id },
            include: { trip: { include: { bus: true } }, user: true, payments: true },
        });
    }
    async update(id, updateTicketDto) {
        return this.prisma.ticket.update({
            where: { id },
            data: updateTicketDto,
        });
    }
    async remove(id) {
        return this.prisma.ticket.delete({
            where: { id },
        });
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketService);
//# sourceMappingURL=ticket.service.js.map