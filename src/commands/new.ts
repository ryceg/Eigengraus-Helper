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
            description: "Starts a new list. If called without an argument, posts an unfinished list from the pool.",
            guildID: GUILD_ID,
        });
    }

    async run(ctx) {
        return await ListUtility.newList(ctx.channelID);
    }
}

