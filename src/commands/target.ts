import { CommandContext, CommandIntegerOption, CommandOptionType, CommandStringOption, SlashCommand } from "slash-create"
import { getConnection } from "typeorm"
import { List } from "../entity/List"
import { Channel } from "../entity/Channel"
import { MessageEmbed, TextChannel } from "discord.js"
import { DiscordUtility } from "../utility/DiscordUtility"
import { ListUtility } from "../utility/ListUtility"
const { GUILD_ID } = require("../../config.json")

export class TargetCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "target",
      description: "[ADMIN-ONLY] Sets the target for a channel.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "channel",
          description: "The channel.",
          type: CommandOptionType.CHANNEL,
          required: true,
        },
        {
          name: "target",
          description: "Target list size of the channel",
          type: CommandOptionType.INTEGER,
          required: true,
        },
      ],
    })
  }


  async run(ctx: CommandContext) {
    const commandOptionChannelToChange = ctx.data.data.options.find(
      (option) => option.name === "channel"
    ) as CommandStringOption | undefined
    const commandOptionTarget = ctx.data.data.options.find(
      (option) => option.name === "channel"
    ) as CommandIntegerOption | undefined

    const target = commandOptionTarget.value
    const channelToChange = commandOptionChannelToChange.value
    let channel = await Channel.getChannel(channelToChange)
    if (channel === null) {
      channel = new Channel()
      channel.id = channelToChange
      channel.length = target
      await channel.createChannel()
      return
    }
    channel.length = target
    await Channel.updateChannel(channel)
  }
}
