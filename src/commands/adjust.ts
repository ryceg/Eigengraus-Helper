import { CommandContext, SlashCommand } from "slash-create"
import { CommandOptionType, CommandStringOption } from "slash-create/lib/constants"
import { DiscordUtility } from "../utility/DiscordUtility"
import { Settings } from "../entity/Settings"
import { Member } from "../entity/Member"
const { GUILD_ID } = require("../../config.json")

export class AnarchyPostingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "adjust",
      description: "[ADMIN-ONLY] Changes a member's points.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "user",
          description: "The user to change the points of.",
          type: CommandOptionType.USER,
        },
        {
          name: "value",
          description: "The points to change a member by. Either +X or -X",
          type: CommandOptionType.STRING,
        },
      ],
    })
  }

  async run(ctx: CommandContext) {
    if (!(await DiscordUtility.isAdmin(ctx.member.roles))) return
    console.log(ctx.data.data.options)

    const optionValue = ctx.data.data.options.find(
      (option) => option.name === "value"
    ) as CommandStringOption
    const value = optionValue.value

    const optionUser = ctx.data.data.options.find(
      (option) => option.name === "user"
    ) as CommandStringOption
    const user = optionUser.value

    if (!["+", "-"].includes(value.charAt(0)))
      return "You're missing a + or - at the beginning of the points"
    const member = await Member.getMember(user)
    if (value.charAt(0) === "+") {
      member.points += parseInt(value.substr(1))
    } else {
      member.points -= parseInt(value.substr(1))
    }
    await member.updateMember()
    return "Points updated."
  }
}
