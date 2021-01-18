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
var Member_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const typeorm_1 = require("typeorm");
let Member = Member_1 = class Member {
    static async getMember(discordId) {
        try {
            const result = await typeorm_1.getConnection().getRepository(Member_1).createQueryBuilder("member").where("member.discordId = :id", { id: discordId }).getOne();
            if (result == null) {
                const member = new Member_1();
                member.discordId = discordId;
                await Member_1.createMember(member);
                return member;
            }
            return result;
        }
        catch {
        }
    }
    static async createMember(member) {
        await typeorm_1.getConnection().getRepository(Member_1).createQueryBuilder("member").insert().into(Member_1).values([member]).execute();
    }
    async addPoints(points) {
        this.points += points;
        await this.updateMember();
    }
    async updateMember() {
        return typeorm_1.getConnection().getRepository(Member_1).createQueryBuilder("member").update(Member_1).set(this).where("member.id = :id", { id: this.id }).execute();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Member.prototype, "discordId", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Member.prototype, "points", void 0);
Member = Member_1 = __decorate([
    typeorm_1.Entity()
], Member);
exports.Member = Member;
//# sourceMappingURL=Member.js.map