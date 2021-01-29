import {Channel, TextChannel, User} from "discord.js";
import "../index";

export class DiscordUtility {
    static async getUserFromId(id: string): Promise<User> {
        return await global.CLIENT.users.fetch(id);
    }


    static async getChannelFromId(id: string): Promise<TextChannel> {
        return await global.CLIENT.channels.fetch(id) as TextChannel;
    }

    static async getChannelFromName(name: string): Promise<TextChannel> {
        return await global.CLIENT.channels.cache.find((channel) => channel.type === "text" && (channel as TextChannel).name === name) as TextChannel;
    }

// TODO: Implement

    static async isAdmin(roles: string[]): Promise<boolean> {
        return true;
    }

    static async isAdminId(id: string): Promise<boolean> {
        return true;
    }
}