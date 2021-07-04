import { CommandContext, SlashCommand } from "slash-create"
import { CommandBooleanOption, CommandOptionType } from "slash-create/lib/constants"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Settings } from "../entity/Settings"
const { GUILD_ID } = require("../../config.json")

export class AutoPostingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "autoposting",
      description:
        "[ADMIN-ONLY] Toggles autoposting, automatically posts any available lists when a list is finished.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "value",
          description: "Whether autoposting should be on or off.",
          type: CommandOptionType.BOOLEAN,
        },
      ],
    })
  }

  async run(ctx: CommandContext) {
    if (!(await DiscordUtility.isAdmin(ctx.member.roles))) return
    const optionValue = ctx.data.data.options.find(
      (option) => option.name === "value"
    ) as CommandBooleanOption
    const value = optionValue.value
      ; (
        await Settings.getSettings()
      ).autoPosting = value
    return "Autoposting updated."
  }
}
