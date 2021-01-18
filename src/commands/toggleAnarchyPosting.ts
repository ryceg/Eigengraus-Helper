import {SlashCommand} from "slash-create";
import {CommandOptionType} from "slash-create/lib/constants";
import {DiscordUtility} from "../utility/DiscordUtility";
import {Settings} from "../entity/Settings";
const { GUILD_ID } = require("../../config.json");

export class AnarchyPostingCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "anarchyposting",
            description: "Toggles anarchyposting.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "value",
                    description: "Whether anarchyposting should be on or off",
                    type: CommandOptionType.BOOLEAN,
                }
            ]
        });
    }
    async run(ctx) {
        if (!await DiscordUtility.isAdmin(ctx.member.roles))
            return;
        (await Settings.getSettings()).anarchyPosting = ctx.data.data.options.filter(option => option.name == "value")[0].value;
        return "Anarchy posting updated.";
    }
}