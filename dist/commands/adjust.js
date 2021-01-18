"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnarchyPostingCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const Member_1 = require("../entity/Member");
const { GUILD_ID } = require("../../config.json");
class AnarchyPostingCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "adjust",
            description: "Changes a member's points.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "user",
                    description: "The user to change the points of.",
                    type: constants_1.CommandOptionType.USER
                },
                {
                    name: "value",
                    description: "The points to change a member by. Either +X or -X",
                    type: constants_1.CommandOptionType.STRING,
                }
            ]
        });
    }
    async run(ctx) {
        if (!await DiscordUtility_1.DiscordUtility.isAdmin(ctx.member.roles))
            return;
        console.log(ctx.data.data.options);
        const value = ctx.data.data.options.filter(option => option.name == "value")[0].value;
        const user = ctx.data.data.options.filter(option => option.name == "user")[0].value;
        if (!["+", "-"].includes(value.charAt(0)))
            return "You're missing a + or - at the beginning of the points";
        const member = await Member_1.Member.getMember(user);
        if (value.charAt(0) == "+") {
            member.points += parseInt(value.substr(1));
        }
        else {
            member.points -= parseInt(value.substr(1));
        }
        await member.updateMember();
        return "Points updated.";
    }
}
exports.AnarchyPostingCommand = AnarchyPostingCommand;
//# sourceMappingURL=adjust.js.map