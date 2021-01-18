"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordUtility = void 0;
require("../index");
class DiscordUtility {
    static async getUserFromId(id) {
        return await global.CLIENT.users.fetch(id);
    }
    static async getChannelFromId(id) {
        return await global.CLIENT.channels.fetch(id);
    }
    static async getChannelFromName(name) {
        return await global.CLIENT.channels.cache.find((channel) => channel.type === "text" && channel.name === name);
    }
    // TODO: Implement
    static async isAdmin(roles) {
        return true;
    }
    static async isAdminId(id) {
        return true;
    }
}
exports.DiscordUtility = DiscordUtility;
//# sourceMappingURL=DiscordUtility.js.map