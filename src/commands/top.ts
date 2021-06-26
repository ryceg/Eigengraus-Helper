import { SlashCommand } from "slash-create"
import { CommandOptionType } from "slash-create/lib/constants"
import { Activity } from "../entity/Activity"
import { MessageEmbed } from "discord.js"
import { DiscordUtility } from "../utility/DiscordUtility"
const { GUILD_ID } = require("../../config.json")

export class TopCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "top",
      description: "Gets the top members and channels of the last 30 days.",
      guildIDs: GUILD_ID,
    })
  }


  async run(ctx: CommandContext) {
    const topMemberResults = await Activity.getTopMembers()
    const topChannelResults = await Activity.getTopChannels()
    const embed = new MessageEmbed()
    let top5Members = ""
    let top5Channels = ""
    let index = 0
    for (const activity of topMemberResults) {
      index++
      top5Members += `${index}. <@${activity.member
        }> - ${await Activity.getPointsForMemberLast30Days(
          activity.member
        )} points in the last 30 days\n`
    }
    index = 0

    for (const activity of topChannelResults) {
      index++
      top5Channels += `${index}.${await DiscordUtility.getChannelFromId(
        activity.channel
      )} - ${activity.points} points\n`
    }
    embed.addField("Top 5 Members", top5Members)
    embed.addField("Top 5 Channels", top5Channels)
    await (await DiscordUtility.getChannelFromId(ctx.channelID)).send(embed)
  }
}
