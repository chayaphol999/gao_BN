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
exports.BusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BusService = class BusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBusDto) {
        return this.prisma.bus.create({
            data: createBusDto,
        });
    }
    async findAll() {
        return this.prisma.bus.findMany();
    }
    async findOne(id) {
        return this.prisma.bus.findUnique({
            where: { id },
        });
    }
    async update(id, updateBusDto) {
        return this.prisma.bus.update({
            where: { id },
            data: updateBusDto,
        });
    }
    async remove(id) {
        return this.prisma.bus.delete({
            where: { id },
        });
    }
};
exports.BusService = BusService;
exports.BusService = BusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusService);
//# sourceMappingURL=bus.service.js.map