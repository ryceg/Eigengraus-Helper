"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsRate = void 0;
const slash_create_1 = require("slash-create");
const AnyChannel_1 = require("../entity/AnyChannel");
const { GUILD_ID } = require("../../config.json");
class PointsRate extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "pointsrate",
            description: "Changes the point rate of a command.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "channel",
                    description: "The channel to change the points rate of",
                    type: slash_create_1.CommandOptionType.CHANNEL,
                },
                {
                    name: "points-rate",
                    description: "The points rate to set the channel to.",
                    type: slash_create_1.CommandOptionType.INTEGER,
                }
            ]
        });
    }
    async run(ctx) {
        const channelToChange = ctx.data.data.options.filter(option => option.name == "channel")[0].value;
        const pointsRate = ctx.data.data.options.filter(option => option.name == "points-rate")[0].value;
        console.log(channelToChange);
        let anyChannel = await AnyChannel_1.AnyChannel.getAnyChannel(channelToChange.toString());
        console.log(anyChannel);
        if (anyChannel == null) {
            anyChannel = new AnyChannel_1.AnyChannel();
            anyChannel.channelId = channelToChange;
            anyChannel.pointsRate = pointsRate;
            await anyChannel.createChannel();
            return;
        }
        anyChannel.pointsRate = pointsRate;
        await anyChannel.updateChannel();
    }
}
exports.PointsRate = PointsRate;
//# sourceMappingURL=pointsrate.js.map