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
var PendingList_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingList = void 0;
const typeorm_1 = require("typeorm");
const discord_js_1 = require("discord.js");
let PendingList = PendingList_1 = class PendingList {
    static async getList(id) {
        return typeorm_1.getConnection().getRepository(PendingList_1).createQueryBuilder("pendinglist").where("pendinglist.id = :id", { id: id }).getOne();
    }
    static async updateList(list) {
        return typeorm_1.getConnection().getRepository(PendingList_1).createQueryBuilder("pendinglist").update(PendingList_1).set(list).where("pendinglist.id = :id", { id: list.id }).execute();
    }
    generateEmbed(finished = false) {
        let embed = new discord_js_1.MessageEmbed();
        embed.setTitle(this.name);
        embed.setDescription("A new list has been suggested.");
        embed.addField("Target", this.target);
        return embed;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PendingList.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PendingList.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PendingList.prototype, "target", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], PendingList.prototype, "messageId", void 0);
PendingList = PendingList_1 = __decorate([
    typeorm_1.Entity()
], PendingList);
exports.PendingList = PendingList;
//# sourceMappingURL=PendingList.js.map