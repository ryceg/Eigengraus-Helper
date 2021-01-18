"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeCommand = void 0;
const slash_create_1 = require("slash-create");
const Activity_1 = require("../entity/Activity");
const discord_js_1 = require("discord.js");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const Member_1 = require("../entity/Member");
const { GUILD_ID } = require("../../config.json");
class MeCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "stats",
            description: "Get your contributions",
            guildID: GUILD_ID,
        });
    }
    async run(ctx) {
        const contributions = await Activity_1.Activity.getMemberContributions(ctx.member.id);
        const member = await Member_1.Member.getMember(ctx.member.id);
        let embed = new discord_js_1.MessageEmbed();
        embed.addField("Total points", member.points + " points.", true);
        embed.addField("Total points last 7 days", contributions.points7Days === null ? "0" : contributions.points7Days + " points", true);
        let channels = "";
        let index = 0;
        contributions.top10Channels.forEach((v, k) => {
            index++;
            channels += `${index}. <#${k}> - ${v} points\n`;
        });
        embed.addField("Most active channels", channels);
        await (await DiscordUtility_1.DiscordUtility.getChannelFromId(ctx.channelID)).send(embed);
    }
}
exports.MeCommand = MeCommand;
//# sourceMappingURL=me.js.map