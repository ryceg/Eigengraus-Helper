import { Message } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";

export class Command {
    private name: string;
    private description: string;
    private usage: string;
    private category: string;
    private run: (message: Message) => void;

    constructor(name: string, description: string, usage: string, category: string, run: (messge: Message) => void) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.category = category;
        this.run = run;
    }


    /**
     * Getter $name
     * @return {string}
     */
    public get $name(): string {
        return this.name;
    }

    /**
     * Getter $description
     * @return {string}
     */
    public get $description(): string {
        return this.description;
    }

    /**
     * Getter $usage
     * @return {string}
     */
    public get $usage(): string {
        return this.usage;
    }

    /**
     * Getter $usage
     * @return {string}
     */
    public get $category(): string {
        return this.category;
    }

    /**
     * Getter $run
     * @return {() => void}
     */
    public get $run(): (message: Message, cmdHandler?: CommandHandler) => void {
        return this.run;
    }
}