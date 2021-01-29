import {SlashCommand} from "slash-create";
import {CommandOptionType} from "slash-create/lib/constants";
import {Channel} from "../entity/Channel";
import {DiscordUtility} from "../utility/DiscordUtility";
import {List} from "../entity/List";
const { GUILD_ID } = require("../../config.json");

const LIST_REGEX = new RegExp("^[0-9]+\\..");
const LIST_TITLE_REGEX = new RegExp("\\*\\*.+\\*\\*");
const LIST_TITLE_CONTENT_REGEX = new RegExp("(?<=\\*\\*)(.*)(?=\\*\\*)");
const LIST_INDEX_REGEX = new RegExp("^(.*)(?=\\.)");
const CONTENT_REGEX = new RegExp("(?<=\\.)(.*)(?=$)", "s");

export class RescanCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "rescan",
            description: "Update the latest list with any missed entries.",
            guildID: GUILD_ID,
        });
    }

    async run(ctx) {
        const channelId = ctx.channelID;
        const result = await Channel.getChannel(channelId);
        if (result == null || result.lastListId == null) {
            return "There are no lists in this channel.";
        }
        const list = await List.getList(result.lastListId);
        const channel = await DiscordUtility.getChannelFromId(channelId);
        const messages = await channel.messages.fetch({after: list.messageId})
        console.log(messages);

        const contentMap = messages.map((message) => message.content).reverse();
        let filtered = [];
        for (let i in contentMap) {
            let filter = false;
            // console.log(contentMap[i], LIST_REGEX.test(contentMap[i]));
            if (LIST_REGEX.test(contentMap[i]))
                filter = true;
            if (LIST_TITLE_REGEX.test(contentMap[i]))
                filter = true;

            if (filter)
                filtered.push(contentMap[i]);

        }

        // const filtered = contentMap.filter((content) => (LIST_REGEX.test(content) || LIST_TITLE_REGEX.test(content)) === true);
        let finishedLists = new Map<string, string[]>();
        let title = "";
        let items: string[] = [];
        filtered.forEach((m: string) => {
            // console.log(title, items);
            if(m.startsWith("**")) {
                if (title.length !== 0) {
                    finishedLists.set(title, items);
                    items = [];
                }
                // console.log(m);
                title = LIST_TITLE_CONTENT_REGEX.exec(m)[0];
                return;
            }
            // console.log(m);
            // const index: number = LIST_INDEX_REGEX.exec(m)[0] as unknown as number;
            const dotIndex = m.indexOf(".");
            const index: number = parseInt(m.substring(0, dotIndex));
            // console.log("Index: " + index);
            // const firstPeriod = m.indexOf(".");
            // console.log(index);
            // console.log(m.substr(firstPeriod+1).trim());
            // items[index-1] = m.substr(index.toString().length - 2).trim();

            items[index-1] = CONTENT_REGEX.exec(m)[0].substr(index.toString().length - 1).trim();
            // console.log("Content: " + CONTENT_REGEX.exec(m)[0].substr(index.toString().length - 1).trim());
        });
        console.log(items);
        for (let i = 0; i < list.target; i++) {
            if (items[i] == null) {
                items[i] = "";
            }
        }
        list.items = items;
        await List.updateList(list);
        await (await channel.messages.fetch(list.messageId)).edit(list.generateEmbed());

    }
}