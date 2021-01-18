import {CommandOptionType, SlashCommand} from "slash-create";
import {getConnection} from "typeorm";
import {List} from "../entity/List";
import {Channel} from "../entity/Channel";
import {MessageEmbed, TextChannel} from "discord.js";
import {DiscordUtility} from "../utility/DiscordUtility";
import {ListUtility} from "../utility/ListUtility";
const { GUILD_ID } = require("../../config.json");

export class NewCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "new",
            description: "If called without an argument, it posts an unfinished list.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "admin-only",
                    description: "Whether the list is admin only.",
                    type: CommandOptionType.BOOLEAN
                },
                {
                    name: "title",
                    description: "Title of the list",
                    type: CommandOptionType.STRING
                }
            ]
        });
    }

    async run(ctx) {
        return await ListUtility.newList(ctx.channelID);
    }
}

