import { Entity, Column, PrimaryGeneratedColumn, getConnection } from "typeorm"
import { MessageEmbed, TextChannel } from "discord.js"
import { Channel } from "./Channel"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Settings } from "./Settings"
import { NewCommand } from "../commands/new"
import { ListUtility } from "../utility/ListUtility"

@Entity()
export class PendingList {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  target: number

  @Column({ nullable: true })
  messageId: string

  public static async getList(id: number): Promise<PendingList> {
    return getConnection()
      .getRepository(PendingList)
      .createQueryBuilder("pendinglist")
      .where("pendinglist.id = :id", { id: id })
      .getOne()
  }

  public static async updateList(list: PendingList) {
    return getConnection()
      .getRepository(PendingList)
      .createQueryBuilder("pendinglist")
      .update(PendingList)
      .set(list)
      .where("pendinglist.id = :id", { id: list.id })
      .execute()
  }

  public generateEmbed(finished: boolean = false): MessageEmbed {
    let embed = new MessageEmbed()
    embed.setTitle(this.name)
    embed.setDescription("A new list has been suggested.")
    embed.addField("Target", this.target)
    return embed
  }
}
