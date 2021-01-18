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
var List_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const typeorm_1 = require("typeorm");
const discord_js_1 = require("discord.js");
const Channel_1 = require("./Channel");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const Settings_1 = require("./Settings");
const ListUtility_1 = require("../utility/ListUtility");
let List = List_1 = class List {
    static async getList(id) {
        return global.CONNECTION.getRepository(List_1).createQueryBuilder("list").where("list.id = :id", { id: id }).getOne();
    }
    static async getNonTakenList(length, targetMatters = false) {
        if (targetMatters) {
            return typeorm_1.getConnection().getRepository(List_1).createQueryBuilder("list").where("list.taken = false AND list.finished = false AND list.target = :length", { length: length }).getOne();
        }
        else {
            return typeorm_1.getConnection().getRepository(List_1).createQueryBuilder("list").where("list.taken = false AND list.finished = false").getOne();
        }
    }
    static async updateList(list) {
        return global.CONNECTION.getRepository(List_1).createQueryBuilder("list").update(List_1).set(list).where("list.id = :id", { id: list.id }).execute();
    }
    generateEmbed(finished = false) {
        let embed = new discord_js_1.MessageEmbed();
        embed.setTitle(this.name);
        !finished ? embed.addField("Target", this.target) : {};
        !finished && this.bounty !== 0 ? embed.addField("Bounty", this.bounty) : {};
        if (this.items.length !== 0) {
            embed.addField("Items", this.items.map((val, index) => `${index + 1}. ${val}`));
        }
        return embed;
    }
    isFinished() {
        return this.items.filter((val) => val.length > 0).length === this.items.length;
    }
    async finish(channel) {
        const list = this;
        list.finished = true;
        await List_1.updateList(list);
        channel.lastListId = null;
        await Channel_1.Channel.updateChannel(channel);
        const finishedChannel = await DiscordUtility_1.DiscordUtility.getChannelFromName("finished");
        const arraysChannel = await DiscordUtility_1.DiscordUtility.getChannelFromName("arrays");
        await finishedChannel.send("A list has been finished!");
        const dChannel = await DiscordUtility_1.DiscordUtility.getChannelFromId(channel.id);
        await finishedChannel.send(list.generateEmbed(true));
        let content = `**${this.name}**\n\`\`\``;
        this.items.forEach((item) => {
            content += `"${item}",\n`;
        });
        content += `\`\`\``;
        await arraysChannel.send(content);
        await (await dChannel.messages.fetch(list.messageId)).react("✅");
        if ((await Settings_1.Settings.getSettings()).autoPosting) {
            await ListUtility_1.ListUtility.newList(channel.id);
        }
        else {
            await dChannel.send("The list has been finished. Get a new list by using /new");
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], List.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], List.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], List.prototype, "target", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], List.prototype, "bounty", void 0);
__decorate([
    typeorm_1.Column("text", { array: true }),
    __metadata("design:type", Array)
], List.prototype, "items", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], List.prototype, "taken", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], List.prototype, "messageId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], List.prototype, "finished", void 0);
List = List_1 = __decorate([
    typeorm_1.Entity()
], List);
exports.List = List;
//# sourceMappingURL=List.js.map