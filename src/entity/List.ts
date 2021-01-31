import {Entity, Column, PrimaryGeneratedColumn, getConnection} from "typeorm";
import {MessageEmbed, TextChannel} from "discord.js";
import {Channel} from "./Channel";
import {DiscordUtility} from "../utility/DiscordUtility";
import {Settings} from "./Settings";
import {NewCommand} from "../commands/new";
import {ListUtility} from "../utility/ListUtility";
const {FINISHED_LISTS_CHANNEL, FINISHED_ARRAYS_CHANNEL, TICK_EMOJI} = require("../../config.json");

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    target: number;

    @Column()
    bounty: number;

    @Column("text", { array: true })
    items: string[];

    @Column({default: false})
    taken: boolean;

    @Column({nullable: true})
    messageId: string;

    @Column({nullable: true, default: false})
    finished: boolean;

    public static async getList(id: number): Promise<List> {
        return global.CONNECTION.getRepository(List).createQueryBuilder("list").where("list.id = :id", {id: id}).getOne();
    }

    public static async getNonTakenList(length: number, targetMatters: boolean = false): Promise<List> {
        if (targetMatters) {
            return getConnection().getRepository(List).createQueryBuilder("list").where("list.taken = false AND list.finished = false AND list.target = :length", {length: length}).getOne();
        } else {
            return getConnection().getRepository(List).createQueryBuilder("list").where("list.taken = false AND list.finished = false").getOne();
        }
    }

    public static async updateList(list: List) {
        return global.CONNECTION.getRepository(List).createQueryBuilder("list").update(List).set(list).where("list.id = :id", {id: list.id}).execute();
    }

    public generateEmbed(finished: boolean = false): MessageEmbed {
        let embed = new MessageEmbed();
        embed.setTitle(this.name);
        !finished ? embed.addField("Target", this.target) : {};
        !finished && this.bounty !== 0 ? embed.addField("Bounty", this.bounty) : {};
        if (this.items.length !== 0) {
            embed.addField("Items", this.items.map((val, index) => `${index+1}. ${val}`))
        }
        return embed;
    }

    public isFinished(): boolean {
        return this.items.filter((val) => val.length > 0).length === this.items.length
    }

    public async finish(channel: Channel) {
        const list = this;
        list.finished = true;
           await List.updateList(list);
           channel.lastListId = null;
           await Channel.updateChannel(channel);
           const finishedChannel = await DiscordUtility.getChannelFromName(FINISHED_LISTS_CHANNEL);
        const arraysChannel = await DiscordUtility.getChannelFromName(FINISHED_ARRAYS_CHANNEL);
        const dChannel = await DiscordUtility.getChannelFromId(channel.id) as TextChannel;
        await finishedChannel.send(list.generateEmbed(true));

        let content = `**${this.name}**\n\`\`\``;
        this.items.forEach((item) => {
            content += `"${item}",\n`
        });
        content += `\`\`\``
        await arraysChannel.send(content);

        await(await dChannel.messages.fetch(list.messageId)).react(TICK_EMOJI);
           if ((await Settings.getSettings()).autoPosting) {
              await ListUtility.newList(channel.id);
           } else {
               await dChannel.send("The list has been finished. Get a new list by using /new");
           }
    }
}
