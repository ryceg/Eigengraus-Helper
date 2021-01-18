import { Message } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";

export interface ICommand {
    name: string;
    description: string;
    usage: string;
    run: (message: Message, cmdHandler?: CommandHandler) => void;
}