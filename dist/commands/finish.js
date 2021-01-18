"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishCommand = void 0;
const slash_create_1 = require("slash-create");
const List_1 = require("../entity/List");
const Channel_1 = require("../entity/Channel");
const Settings_1 = require("../entity/Settings");
const { GUILD_ID } = require("../../config.json");
class FinishCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "finish",
            description: "Finishes the list in the channel.",
            guildID: GUILD_ID,
        });
    }
    async run(ctx) {
        const result = await Channel_1.Channel.getChannel(ctx.channelID);
        if (result == null || result.lastListId == null) {
            return;
        }
        const lastList = result.lastListId;
        const list = await List_1.List.getList(lastList);
        if (await list.isFinished() || (await Settings_1.Settings.getSettings()).anarchyPosting) {
            console.log("Finishing list..");
            await list.finish(result);
        }
        else {
            console.log("List ");
            return "List is not finished.";
        }
    }
}
exports.FinishCommand = FinishCommand;
//# sourceMappingURL=finish.js.map