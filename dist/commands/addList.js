"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddListCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
const List_1 = require("../entity/List");
const Channel_1 = require("../entity/Channel");
const DiscordUtility_1 = require("../utility/DiscordUtility");
const PendingList_1 = require("../entity/PendingList");
const { GUILD_ID } = require("../../config.json");
const regex = new RegExp("<#[0-9]{18}>");
const matchRegex = new RegExp("(?<=\#)(.*?)(?=\>)");
class AddListCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "addlist",
            description: "Adds a new list.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "admin-only-bounty",
                    description: "[ADMIN-ONLY] Bounty",
                    type: constants_1.CommandOptionType.INTEGER,
                },
                {
                    name: "target",
                    description: "Channel",
                    type: constants_1.CommandOptionType.STRING,
                },
                {
                    name: "list-title",
                    description: "The title of the list",
                    type: constants_1.CommandOptionType.STRING,
                }
            ]
        });
    }
    async run(ctx) {
        const connection = global.CONNECTION;
        const listTitle = ctx.data.data.options.filter(option => option.name == "list-title")[0].value;
        const targetTemp = ctx.data.data.options.filter(option => option.name == "target")[0].value;
        const bountyTemp = ctx.data.data.options.filter(option => option.name == "admin-only-bounty");
        console.log(targetTemp);
        const bounty = bountyTemp[0] ? bountyTemp[0].value : 0;
        const list = new List_1.List();
        list.name = listTitle;
        if (await DiscordUtility_1.DiscordUtility.isAdmin(ctx.member.roles)) {
            list.bounty = bounty;
        }
        else {
            list.bounty = 0;
        }
        if (typeof targetTemp === "string") {
            if (!regex.test(targetTemp.trim())) {
                return "Invalid channel.";
            }
            const target = matchRegex.exec(targetTemp)[0];
            console.log("Target: ", target);
            try {
                const result = await connection.getRepository(Channel_1.Channel).createQueryBuilder("channel").where("channel.id = :id", { id: target }).getOne();
                list.target = result.length;
            }
            catch {
                return "Invalid channel.";
            }
        }
        else {
            console.log("Target Temp: ", targetTemp);
            list.target = targetTemp;
        }
        list.items = [];
        list.items.length = list.target;
        list.items = list.items.fill("", 0, list.target);
        console.log(list);
        if (await DiscordUtility_1.DiscordUtility.isAdmin(ctx.member.roles)) {
            await connection.getRepository(List_1.List).createQueryBuilder("list").insert().into(List_1.List).values([list]).execute();
        }
        else {
            const pendingList = new PendingList_1.PendingList();
            pendingList.name = list.name;
            pendingList.target = list.target;
            const message = await (await DiscordUtility_1.DiscordUtility.getChannelFromName("pending-lists")).send(pendingList.generateEmbed());
            await message.react("✅");
            await message.react("❌");
            const collected = await message.awaitReactions((reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌" && DiscordUtility_1.DiscordUtility.isAdminId(user.id), { max: 1 });
            collected.forEach(async (reaction) => {
                if (reaction.emoji.name === "❌") {
                    message.delete();
                    return;
                }
                await connection.getRepository(List_1.List).createQueryBuilder("list").insert().into(List_1.List).values([list]).execute();
                await message.delete();
            });
        }
    }
}
exports.AddListCommand = AddListCommand;
//# sourceMappingURL=addList.js.map