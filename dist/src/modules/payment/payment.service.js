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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto) {
        return this.prisma.payment.create({
            data: createPaymentDto,
        });
    }
    async findAll() {
        return this.prisma.payment.findMany({
            include: { ticket: { include: { trip: { include: { bus: true } }, user: true } } },
            orderBy: { paymentDate: 'desc' },
        });
    }
    async getSummary() {
        const [payments, tickets, trips, users] = await Promise.all([
            this.prisma.payment.findMany({
                where: { status: 'SUCCESS' },
                include: { ticket: { include: { trip: { include: { bus: true } } } } },
            }),
            this.prisma.ticket.count(),
            this.prisma.trip.count(),
            this.prisma.user.count(),
        ]);
        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const revenueByTrip = payments.reduce((acc, payment) => {
            const tripId = payment.ticket.tripId;
            if (!acc[tripId]) {
                acc[tripId] = {
                    tripId,
                    revenue: 0,
                    bookings: 0,
                    departureTime: payment.ticket.trip.departureTime,
                    arrivalTime: payment.ticket.trip.arrivalTime,
                    busType: payment.ticket.trip.bus.type,
                };
            }
            acc[tripId].revenue += Number(payment.amount);
            acc[tripId].bookings += 1;
            return acc;
        }, {});
        return {
            totals: {
                revenue: totalRevenue,
                tickets,
                trips,
                users,
            },
            revenueByTrip: Object.values(revenueByTrip).sort((left, right) => right.revenue - left.revenue),
        };
    }
    async findOne(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: { ticket: { include: { trip: { include: { bus: true } }, user: true } } }
        });
    }
    async update(id, updatePaymentDto) {
        return this.prisma.payment.update({
            where: { id },
            data: updatePaymentDto,
        });
    }
    async remove(id) {
        return this.prisma.payment.delete({
            where: { id },
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map