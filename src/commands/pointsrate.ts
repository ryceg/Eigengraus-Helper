import {
  CommandContext,
  CommandIntegerOption,
  CommandOptionType,
  CommandStringOption,
  SlashCommand,
} from "slash-create"
import { AnyChannel } from "../entity/AnyChannel"
const { GUILD_ID } = require("../../config.json")

export class PointsRate extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "points-rate",
      description: "[ADMIN-ONLY] Changes the point rate of a channel.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "channel",
          description: "The channel to change the points rate of.",
          type: CommandOptionType.CHANNEL,
        },
        {
          name: "points-rate",
          description: "The points rate to set the channel to.",
          type: CommandOptionType.INTEGER,
        },
      ],
    })
  }


  async run(ctx: CommandContext) {
    const commandOption = ctx.data.data.options
    const optionChannel = commandOption.find(
      (option) => option.name === "channel"
    ) as CommandStringOption
    const channelToChange = optionChannel.value
    const optionPointsRate = commandOption.find(
      (option) => option.name === "points-rate"
    ) as CommandIntegerOption
    const pointsRate = optionPointsRate.value
    console.log(channelToChange)
    let anyChannel = await AnyChannel.getAnyChannel(channelToChange.toString())
    console.log(anyChannel)
    if (anyChannel === null) {
      anyChannel = new AnyChannel()
      anyChannel.channelId = channelToChange
      anyChannel.pointsRate = pointsRate
      await anyChannel.createChannel()
      return
    }
    anyChannel.pointsRate = pointsRate
    await anyChannel.updateChannel()
  }
}
