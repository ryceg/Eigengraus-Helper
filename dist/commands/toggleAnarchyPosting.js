"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnarchyPostingCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const Settings_1 = require("../entity/Settings");
const { GUILD_ID } = require("../../config.json");
class AnarchyPostingCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "anarchyposting",
            description: "Toggles anarchyposting.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "value",
                    description: "Whether anarchyposting should be on or off",
                    type: constants_1.CommandOptionType.BOOLEAN,
                }
            ]
        });
    }
    async run(ctx) {
        if (!await DiscordUtility_1.DiscordUtility.isAdmin(ctx.member.roles))
            return;
        (await Settings_1.Settings.getSettings()).anarchyPosting = ctx.data.data.options.filter(option => option.name == "value")[0].value;
        return "Anarchy posting updated.";
    }
}
exports.AnarchyPostingCommand = AnarchyPostingCommand;
//# sourceMappingURL=toggleAnarchyPosting.js.map