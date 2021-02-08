import {
  CommandContext,
  CommandOption,
  CommandOptionType,
  SlashCommand,
} from "slash-create"
import { AnyChannel } from "../entity/AnyChannel"
const { GUILD_ID } = require("../../config.json")

export class PointsRate extends SlashCommand {
  constructor(creator) {
    super(creator, {
      // TODO: is this meant to be "points-rate?"
      name: "pointsrate",
      description: "[ADMIN-ONLY] Changes the point rate of a channel.",
      guildID: GUILD_ID,
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

  // TODO: Specify type of ctx
  async run(ctx: CommandContext) {
    const commandOption: CommandOption[] = ctx.data.data.options
    const channelToChange = commandOption.filter(
      (option) => option.name === "channel"
    )[0].value as string
    const pointsRate = commandOption.filter(
      (option) => option.name === "points-rate"
    )[0].value as number
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
