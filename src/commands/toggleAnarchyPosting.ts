import { CommandContext, SlashCommand } from "slash-create"
import { CommandBooleanOption, CommandOptionType } from "slash-create/lib/constants"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Settings } from "../entity/Settings"
const { GUILD_ID } = require("../../config.json")

export class AnarchyPostingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "anarchyposting",
      description:
        "[ADMIN-ONLY] Toggles anarchyposting, where lists have no limit, and can be finished at any time.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "value",
          description: "Whether anarchyposting should be on or off.",
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
      ).anarchyPosting = value

    return "Anarchy posting updated."
  }
}
