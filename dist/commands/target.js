"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargeCommand = void 0;
const slash_create_1 = require("slash-create");
const Channel_1 = require("../entity/Channel");
const { GUILD_ID } = require("../../config.json");
class TargeCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "target",
            description: "Sets the target for a channel.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "channel",
                    description: "The channel",
                    type: slash_create_1.CommandOptionType.CHANNEL
                },
                {
                    name: "target",
                    description: "Target of the channel",
                    type: slash_create_1.CommandOptionType.INTEGER
                }
            ]
        });
    }
    async run(ctx) {
        const channelToChange = ctx.data.data.options.filter(option => option.name == "channel")[0].value;
        const target = ctx.data.data.options.filter(option => option.name == "target")[0].value;
        let channel = await Channel_1.Channel.getChannel(channelToChange);
        if (channel == null) {
            channel = new Channel_1.Channel();
            channel.id = channelToChange;
            channel.length = target;
            await channel.createChannel();
            return;
        }
        channel.length = target;
        await Channel_1.Channel.updateChannel(channel);
    }
}
exports.TargeCommand = TargeCommand;
//# sourceMappingURL=target.js.map