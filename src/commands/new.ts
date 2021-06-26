import { CommandContext, CommandOptionType, CommandStringOption, CommandSubcommandOption, SlashCommand } from "slash-create"
import { getConnection } from "typeorm"
import { List } from "../entity/List"
import { Channel } from "../entity/Channel"
import { MessageEmbed, TextChannel } from "discord.js"
import { DiscordUtility } from "../utility/DiscordUtility"
import { ListUtility } from "../utility/ListUtility"
const { GUILD_ID } = require("../../config.json")

const newCommand = 'new'
const customList = 'custom-list'
const customTargetAmount = 'target-amount'

export class NewCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: newCommand,
      description:
        "Starts a new list. If called without an argument, posts an unfinished list from the pool.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: customList,
          description: "The manual new list",
          type: CommandOptionType.STRING,
        },
        {
          name: customTargetAmount,
          description: "Target number of entries for the list.",
          type: CommandOptionType.INTEGER,
        },
      ]
    })
  }
  // TODO: `/new` does not currently use an argument.

  async run(ctx: CommandContext) {
    const commandOption = ctx.data.data.options
    const subcommand: CommandSubcommandOption = ctx.data.data.options[0][CommandOptionType.SUB_COMMAND]
    const optionChannel = commandOption.find(
      (option) => option.name === newCommand
    ) as CommandStringOption

    const channelToChange = optionChannel.value

    return await ListUtility.newList(ctx.channelID)
  }
}
