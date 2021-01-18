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
var Channel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
let Channel = Channel_1 = class Channel {
    static async getChannel(id) {
        return typeorm_1.getConnection().getRepository(Channel_1).createQueryBuilder("channel").where("channel.id = :id", { id: id }).getOne();
    }
    async createChannel() {
        await typeorm_1.getConnection().getRepository(Channel_1).createQueryBuilder("channel").insert().into(Channel_1).values([this]).execute();
    }
    static async updateChannel(channel) {
        return typeorm_1.getConnection().getRepository(Channel_1).createQueryBuilder("channel").update(Channel_1).set(channel).where("channel.id = :id", { id: channel.id }).execute();
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Channel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Channel.prototype, "length", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Channel.prototype, "lastListId", void 0);
Channel = Channel_1 = __decorate([
    typeorm_1.Entity()
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=Channel.js.map