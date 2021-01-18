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
var Activity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberResult = exports.TopMemberResult = exports.TopChannelResult = exports.Activity = void 0;
const typeorm_1 = require("typeorm");
let Activity = Activity_1 = class Activity {
    constructor(member, points) {
        this.member = member;
        this.points = points;
    }
    async createActivity() {
        await typeorm_1.getConnection().getRepository(Activity_1).createQueryBuilder("activity").insert().into(Activity_1).values([this]).execute();
    }
    static async getTopMembers() {
        const rawData = await typeorm_1.getConnection().manager.query("select \"member\", count(*), (select sum(points) from public.activity where activity.ts > (current_date - interval '30' day) ) as \"points\" from (select * from public.activity where activity.ts > (current_date - interval '30' day) ) as \"foo\" group by \"member\" order by count desc limit 5;  ");
        console.log("Raw data: ", rawData);
        const activities = [];
        rawData.forEach((data) => {
            activities.push(new TopMemberResult(data.member, data.points, data.count));
        });
        return activities;
    }
    static async getTopChannels() {
        const rawData = await typeorm_1.getConnection().manager.query("select channel, count(*) from activity group by channel;");
        const activities = [];
        rawData.forEach((data) => {
            activities.push(new TopChannelResult(data.channel, data.count));
        });
        return activities;
    }
    static async getPointsForMemberLast30Days(member) {
        const rawData = await typeorm_1.getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member + "'");
        return rawData[0].sum;
    }
    static async getMemberContributions(member) {
        const memberResult = new MemberResult();
        const topChannelContributionsRaw = await typeorm_1.getConnection().manager.query("select channel, sum(points) from activity where \"member\" = '" + member + "' group by channel order by sum desc limit 10;");
        const totPointsRaw = await typeorm_1.getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member + "'");
        const totPoints7Days = await typeorm_1.getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member + "' and ts > (current_date - interval '7' day) ;");
        console.log(topChannelContributionsRaw.length, totPointsRaw.length, totPoints7Days.length);
        if (topChannelContributionsRaw.length === 0 || totPointsRaw.length === 0 || totPoints7Days.length === 0) {
            console.log("Returning");
            return null;
        }
        memberResult.member = member;
        memberResult.points7Days = totPoints7Days[0].sum;
        memberResult.totPoints = totPointsRaw[0].sum;
        var map = new Map();
        for (let contr in topChannelContributionsRaw) {
            // @ts-ignore
            map.set(topChannelContributionsRaw[contr].channel, topChannelContributionsRaw[contr].sum);
        }
        memberResult.top10Channels = map;
        return memberResult;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Activity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp", {
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Activity.prototype, "ts", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Activity.prototype, "member", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "channel", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "points", void 0);
Activity = Activity_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number])
], Activity);
exports.Activity = Activity;
class TopChannelResult {
    constructor(channel, points) {
        this.channel = channel;
        this.points = points;
    }
}
exports.TopChannelResult = TopChannelResult;
class TopMemberResult {
    constructor(member, points, count) {
        this.member = member;
        this.points = points;
        this.count = count;
    }
}
exports.TopMemberResult = TopMemberResult;
class MemberResult {
}
exports.MemberResult = MemberResult;
//# sourceMappingURL=Activity.js.map