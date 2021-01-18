"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopCommand = void 0;
const slash_create_1 = require("slash-create");
const Activity_1 = require("../entity/Activity");
const discord_js_1 = require("discord.js");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const { GUILD_ID } = require("../../config.json");
class TopCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "top",
            description: "Gets the top members and channels of the las 30 days.",
            guildID: GUILD_ID,
        });
    }
    async run(ctx) {
        const topMemberResults = await Activity_1.Activity.getTopMembers();
        const topChannelResults = await Activity_1.Activity.getTopChannels();
        const embed = new discord_js_1.MessageEmbed();
        let top5Members = "";
        let top5Channels = "";
        let index = 0;
        for (const activity of topMemberResults) {
            index++;
            top5Members += `${index}. <@${activity.member}> - ${await Activity_1.Activity.getPointsForMemberLast30Days(activity.member)} points in the last 30 days\n`;
        }
        index = 0;
        for (const activity of topChannelResults) {
            index++;
            top5Channels += `${index}.${await DiscordUtility_1.DiscordUtility.getChannelFromId(activity.channel)} - ${activity.points} points\n`;
        }
        embed.addField("Top 5 Members", top5Members);
        embed.addField("Top 5 Channels", top5Channels);
        await (await DiscordUtility_1.DiscordUtility.getChannelFromId(ctx.channelID)).send(embed);
    }
}
exports.TopCommand = TopCommand;
//# sourceMappingURL=top.js.map