import {Channel} from "../entity/Channel";
import {List} from "../entity/List";
import {DiscordUtility} from "./DiscordUtility";
const {LIST_MAKER_ROLE_NAME} = require("../../config.json");

export class ListUtility {
    public static async newList(channelID: string): Promise<string> {
        const channel = await Channel.getChannel(channelID)
        console.log("Channel", channel);
        if (channel === null || channel.lastListId !== null) {
            return "This channel does not have a target set. Please set one first.";
        }
        const list = await List.getNonTakenList(channel.length, channel.length !== 0);
        if (list === null) {
            const channel = await DiscordUtility.getChannelFromId(channelID);
            return "There are no lists that meet the criteria. <@&" + channel.guild.roles.cache.find((role) => role.name === LIST_MAKER_ROLE_NAME).id + ">";
        }
        console.log(list);
        const dChannel = await DiscordUtility.getChannelFromId(channelID);
        const message  = await dChannel.send(list.generateEmbed());
        channel.lastListId = list.id;
        list.messageId = message.id;
        await List.updateList(list);
        await Channel.updateChannel(channel);

    }
}
