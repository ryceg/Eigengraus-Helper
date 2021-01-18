"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewCommand = void 0;
const slash_create_1 = require("slash-create");
const ListUtility_1 = require("../utility/ListUtility");
const { GUILD_ID } = require("../../config.json");
class NewCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "new",
            description: "If called without an argument, it posts an unfinished list.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "admin-only",
                    description: "Whether the list is admin only.",
                    type: slash_create_1.CommandOptionType.BOOLEAN
                },
                {
                    name: "title",
                    description: "Title of the list",
                    type: slash_create_1.CommandOptionType.STRING
                }
            ]
        });
    }
    async run(ctx) {
        return await ListUtility_1.ListUtility.newList(ctx.channelID);
    }
}
exports.NewCommand = NewCommand;
//# sourceMappingURL=new.js.map