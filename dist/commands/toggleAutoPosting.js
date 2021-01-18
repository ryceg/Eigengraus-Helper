"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoPostingCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const Settings_1 = require("../entity/Settings");
const { GUILD_ID } = require("../../config.json");
class AutoPostingCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "autposting",
            description: "Toggles autoposting.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "value",
                    description: "Whether autoposting should be on or off",
                    type: constants_1.CommandOptionType.BOOLEAN,
                }
            ]
        });
    }
    async run(ctx) {
        if (!await DiscordUtility_1.DiscordUtility.isAdmin(ctx.member.roles))
            return;
        (await Settings_1.Settings.getSettings()).autoPosting = ctx.data.data.options.filter(option => option.name == "value")[0].value;
        return "Autoposting updated.";
    }
}
exports.AutoPostingCommand = AutoPostingCommand;
//# sourceMappingURL=toggleAutoPosting.js.map