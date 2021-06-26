import { CommandContext, CommandOptionType, SlashCommand } from "slash-create"
import { Activity } from "../entity/Activity"
import { MessageEmbed, TextChannel } from "discord.js"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Member } from "../entity/Member"
const { GUILD_ID } = require("../../config.json")

export class MeCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "stats",
      description:
        "Get the stats of your recent messages and contributions to the hivemind.",
      guildIDs: GUILD_ID,
    })
  }


  async run(ctx: CommandContext) {
    const contributions = await Activity.getMemberContributions(ctx.member.id)
    const member = await Member.getMember(ctx.member.id)
    let embed = new MessageEmbed()
    embed.addField("User", ctx.member.displayName, true)
    embed.addField("Total points", member.points + " points.", true)
    embed.addField(
      "Total points last 7 days",
      contributions.points7Days === null
        ? "0"
        : contributions.points7Days + " points",
      true
    )
    let channels = ""
    let index = 0
    contributions.top10Channels.forEach((v, k) => {
      index++
      channels += `${index}. <#${k}> - ${v} points\n`
    })
    embed.addField("Most active channels", channels)
    await ((await DiscordUtility.getChannelFromId(
      ctx.channelID
    )) as TextChannel).send(embed)
  }
}
