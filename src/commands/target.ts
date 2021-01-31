import {CommandOptionType, SlashCommand} from "slash-create";
import {getConnection} from "typeorm";
import {List} from "../entity/List";
import {Channel} from "../entity/Channel";
import {MessageEmbed, TextChannel} from "discord.js";
import {DiscordUtility} from "../utility/DiscordUtility";
import {ListUtility} from "../utility/ListUtility";
const { GUILD_ID } = require("../../config.json");

export class TargetCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "target",
            description: "[ADMIN-ONLY] Sets the target for a channel.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "channel",
                    description: "The channel.",
                    type: CommandOptionType.CHANNEL,
                    required: true
                },
                {
                    name: "target",
                    description: "Target list size of the channel",
                    type: CommandOptionType.INTEGER,
                    required: true
                }
            ]
        });
    }

    async run(ctx) {
        const channelToChange = ctx.data.data.options.filter(option => option.name == "channel")[0].value;
        const target = ctx.data.data.options.filter(option => option.name == "target")[0].value;

        let channel = await Channel.getChannel(channelToChange);
        if (channel == null) {
           channel = new Channel();
           channel.id = channelToChange;
           channel.length = target;
           await channel.createChannel();
           return;
        }
        channel.length = target;
        await Channel.updateChannel(channel);
    }
}

