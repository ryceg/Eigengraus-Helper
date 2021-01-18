"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUtility = void 0;
const Channel_1 = require("../entity/Channel");
const List_1 = require("../entity/List");
const DiscordUtility_1 = require("./DiscordUtility");
class ListUtility {
    static async newList(channelID) {
        const channel = await Channel_1.Channel.getChannel(channelID);
        console.log("Channel", channel);
        if (channel == null || channel.lastListId !== null) {
            return "This channel can't take any list.";
        }
        const list = await List_1.List.getNonTakenList(channel.length, channel.length !== 0);
        if (list == null) {
            const channel = await DiscordUtility_1.DiscordUtility.getChannelFromId(channelID);
            return "There are no lists that meet the criteria. <@&" + channel.guild.roles.cache.find((role) => role.name === "List Maker").id + ">";
        }
        console.log(list);
        const dChannel = await DiscordUtility_1.DiscordUtility.getChannelFromId(channelID);
        const message = await dChannel.send(list.generateEmbed());
        channel.lastListId = list.id;
        list.messageId = message.id;
        await List_1.List.updateList(list);
        await Channel_1.Channel.updateChannel(channel);
    }
}
exports.ListUtility = ListUtility;
//# sourceMappingURL=ListUtility.js.map