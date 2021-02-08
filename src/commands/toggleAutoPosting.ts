import { SlashCommand } from "slash-create"
import { CommandOptionType } from "slash-create/lib/constants"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Settings } from "../entity/Settings"
const { GUILD_ID } = require("../../config.json")

export class AutoPostingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "autoposting",
      description:
        "[ADMIN-ONLY] Toggles autoposting, automatically posts any available lists when a list is finished.",
      guildID: GUILD_ID,
      options: [
        {
          name: "value",
          description: "Whether autoposting should be on or off.",
          type: CommandOptionType.BOOLEAN,
        },
      ],
    })
  }
  // TODO: Specify type of ctx
  async run(ctx) {
    if (!(await DiscordUtility.isAdmin(ctx.member.roles))) return
    ;(await Settings.getSettings()).autoPosting = ctx.data.data.options.filter(
      (option) => option.name === "value"
    )[0].value
    return "Autoposting updated."
  }
}
