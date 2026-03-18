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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusController = void 0;
const common_1 = require("@nestjs/common");
const bus_service_1 = require("./bus.service");
const create_bus_dto_1 = require("./dto/create-bus.dto");
const update_bus_dto_1 = require("./dto/update-bus.dto");
let BusController = class BusController {
    busService;
    constructor(busService) {
        this.busService = busService;
    }
    create(createBusDto) {
        return this.busService.create(createBusDto);
    }
    findAll() {
        return this.busService.findAll();
    }
    findOne(id) {
        return this.busService.findOne(id);
    }
    update(id, updateBusDto) {
        return this.busService.update(id, updateBusDto);
    }
    remove(id) {
        return this.busService.remove(id);
    }
};
exports.BusController = BusController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bus_dto_1.CreateBusDto]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bus_dto_1.UpdateBusDto]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "remove", null);
exports.BusController = BusController = __decorate([
    (0, common_1.Controller)('bus'),
    __metadata("design:paramtypes", [bus_service_1.BusService])
], BusController);
//# sourceMappingURL=bus.controller.js.map