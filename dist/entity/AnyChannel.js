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
var AnyChannel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyChannel = void 0;
const typeorm_1 = require("typeorm");
let AnyChannel = AnyChannel_1 = class AnyChannel {
    static async getAnyChannel(id) {
        return typeorm_1.getConnection().getRepository(AnyChannel_1).createQueryBuilder("any_channel").where("any_channel.channel_id = :id", { id: id }).getOne();
    }
    async updateChannel() {
        await typeorm_1.getConnection().getRepository(AnyChannel_1).createQueryBuilder("any_channel").update().set(this).where("any_channel.channel_id = :id", { id: this.channelId }).execute();
    }
    async createChannel() {
        await typeorm_1.getConnection().getRepository(AnyChannel_1).createQueryBuilder("any_channel").insert().into(AnyChannel_1).values([this]).execute();
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "channel_id" }),
    __metadata("design:type", String)
], AnyChannel.prototype, "channelId", void 0);
__decorate([
    typeorm_1.Column({ name: "points_rate" }),
    __metadata("design:type", Number)
], AnyChannel.prototype, "pointsRate", void 0);
AnyChannel = AnyChannel_1 = __decorate([
    typeorm_1.Entity()
], AnyChannel);
exports.AnyChannel = AnyChannel;
//# sourceMappingURL=AnyChannel.js.map