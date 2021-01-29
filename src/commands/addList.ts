import {CommandOptionType, SlashCommand} from "slash-create";
import {List} from "../entity/List";
import {Channel} from "../entity/Channel";
import {DiscordUtility} from "../utility/DiscordUtility";
import {PendingList} from "../entity/PendingList";
const {PENDING_LISTS_CHANNEL} = require("../../config.json");

const {GUILD_ID} = require("../../config.json");
const regex = new RegExp("<#[0-9]{18}>")
const matchRegex = new RegExp("(?<=\#)(.*?)(?=\>)")
const tickEmoji = "✅";
const crossEmoji = "❌";

export class AddListCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "addlist",
            description: "Adds a new list to the pool of lists for the specified target channel.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "channel",
                    type: CommandOptionType.SUB_COMMAND,
                    description: "Use a channel to get the target.",
                    options: [
                        {
                            name: "target",
                            description: "Target",
                            type: CommandOptionType.CHANNEL,
                        },
                        {
                            name: "list-title",
                            description: "The title of the list",
                            type: CommandOptionType.STRING,
                        },
                        {
                            name: "admin-only-bounty",
                            description: "[ADMIN-ONLY] Bounty",
                            type: CommandOptionType.INTEGER,
                        }
                    ]
                },
                {
                    name: "number",
                    type: CommandOptionType.SUB_COMMAND,
                    description: "Manually specify a list target.",
                    options: [
                        {
                            name: "target",
                            description: "Target",
                            type: CommandOptionType.INTEGER,
                        },
                        {
                            name: "list-title",
                            description: "The title of the list",
                            type: CommandOptionType.STRING,
                        },
                        {
                            name: "admin-only-bounty",
                            description: "[ADMIN-ONLY] Bounty",
                            type: CommandOptionType.INTEGER,
                        }
                    ]
                }


            ]
            // options: [
            //     {
            //         name: "target",
            //         description: "Channel",
            //         type: CommandOptionType.STRING,
            //     },
            //     {
            //         name: "list-title",
            //         description: "The title of the list",
            //         type: CommandOptionType.STRING,
            //     },
            //     {
            //         name: "admin-only-bounty",
            //         description: "[ADMIN-ONLY] Bounty",
            //         type: CommandOptionType.INTEGER,
            //     }
            // ]

        });
    }

    async run(ctx) {
        const connection = global.CONNECTION;
        console.log(JSON.stringify(ctx.data.data.options[0]));
        const listTitle: string = ctx.data.data.options[0].options.filter(option => option.name == "list-title")[0].value;

        const targetTemp: string = ctx.data.data.options[0].options.filter(option => option.name == "target")[0].value;
        const bountyTemp = ctx.data.data.options[0].options.filter(option => option.name == "admin-only-bounty");
        console.log(targetTemp)
        const bounty = bountyTemp[0] ? bountyTemp[0].value : 0;

        const list = new List();
        list.name = listTitle;
        if (await DiscordUtility.isAdmin(ctx.member.roles)) {
            list.bounty = bounty;
        } else {
            list.bounty = 0;
        }


        if (typeof targetTemp === "string") {
            if (!regex.test(targetTemp.trim())) {
                return "Invalid channel.";
            }
            const target = matchRegex.exec(targetTemp)[0];
            console.log("Target: ", target);
            try {
                const result = await connection.getRepository(Channel).createQueryBuilder("channel").where("channel.id = :id", {id: target}).getOne();
                list.target = result.length;
            } catch {
                return "Invalid channel.";
            }

        } else {
            console.log("Target Temp: ", targetTemp);
            list.target = targetTemp;
        }

        list.items = [];
        list.items.length = list.target;
        list.items = list.items.fill("", 0, list.target);
        console.log(list);
        if (await DiscordUtility.isAdmin(ctx.member.roles)) {
            await connection.getRepository(List).createQueryBuilder("list").insert().into(List).values([list]).execute();
            return `${ctx.member.displayName} has added "${list.name}" to the pool for lists with a target of ${list.target}`;
        } else {
            const pendingList = new PendingList();
            pendingList.name = list.name;
            pendingList.target = list.target;
            const message = await (await DiscordUtility.getChannelFromName(PENDING_LISTS_CHANNEL)).send(pendingList.generateEmbed());
            await message.react(tickEmoji);
            await message.react(crossEmoji);
            const collected = await message.awaitReactions((reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌" && DiscordUtility.isAdminId(user.id), {max: 1});
            collected.forEach(async (reaction) => {
                if (reaction.emoji.name === crossEmoji) {
                    message.delete();
                    return;
                }
                await connection.getRepository(List).createQueryBuilder("list").insert().into(List).values([list]).execute();
                await message.delete();
            })
            return `${ctx.member.displayName} has added "${list.name}" to the pool of pending lists.`;
        }

    }
}
