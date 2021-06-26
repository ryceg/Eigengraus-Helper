import {
  CommandContext,
  CommandIntegerOption,
  CommandOptionType,
  CommandStringOption,
  CommandSubcommandOption,
  SlashCommand,
} from "slash-create"
import { List } from "../entity/List"
import { Channel } from "../entity/Channel"
import { DiscordUtility } from "../utility/DiscordUtility"
import { PendingList } from "../entity/PendingList"
const {
  PENDING_LISTS_CHANNEL,
  TICK_EMOJI,
  CROSS_EMOJI,
} = require("../../config.json")

const { GUILD_ID } = require("../../config.json")
const regex = new RegExp("<#[0-9]{18}>")
const matchRegex = new RegExp("(?<=#)(.*?)(?=>)")

const commandOptionTargetAmount = 'target-amount'
const commandOptionTargetChannel = 'target'
const commandOptionListTitle = 'list-title'
const commandOptionListTitleDescription = "The title of the list."


export class AddListCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "addlist",
      description:
        "Adds a new list to the pool of lists for the specified target channel.",
      guildIDs: GUILD_ID,
      options: [
        {
          name: "channel",
          type: CommandOptionType.SUB_COMMAND,
          description: "Use a channel to get the target.",
          options: [
            {
              name: commandOptionTargetChannel,
              description: "Targeted channel.",
              type: CommandOptionType.CHANNEL,
              required: true,
            },
            {
              name: commandOptionListTitle,
              description: commandOptionListTitleDescription,
              type: CommandOptionType.STRING,
              required: true,
            },
            {
              name: "bounty",
              description:
                "[ADMIN-ONLY] Extra points to be awarded for entries to this list.",
              type: CommandOptionType.INTEGER,
            },
          ],
        },
        {
          name: "number",
          type: CommandOptionType.SUB_COMMAND,
          description:
            "Manually specify a list target (which will post in any channel that fits).",
          options: [
            {
              name: commandOptionTargetAmount,
              description: "Target number of entries for the list.",
              type: CommandOptionType.INTEGER,
            },
            {
              name: commandOptionListTitle,
              description: commandOptionListTitleDescription,
              type: CommandOptionType.STRING,
            },
            {
              name: "bounty",
              description:
                "[ADMIN-ONLY] Extra points to be awarded for entries to this list.",
              type: CommandOptionType.INTEGER,
            },
          ],
        },
      ]
    })
  }

  async run(ctx: CommandContext) {
    const connection = global.CONNECTION
    const subcommand: CommandSubcommandOption = ctx.data.data.options[0][CommandOptionType.SUB_COMMAND]
    console.log(JSON.stringify(subcommand))

    const optionTargetNumber = subcommand.options.find(
      (option) => option.name === commandOptionTargetAmount
    ) as CommandIntegerOption | undefined

    const optionTargetTitle = subcommand.options.find(
      (option) => option.name === commandOptionTargetChannel
    ) as CommandStringOption | undefined

    const optionListTitle = subcommand.options.find(
      (option) => option.name === commandOptionListTitle
    ) as CommandStringOption | undefined

    const optionBounty = subcommand.options.find(
      (option) => option.name === "bounty"
    ) as CommandIntegerOption | undefined

    const bounty = optionBounty.value || 0
    const targetNumber = optionTargetNumber.value
    const targetChannel = optionTargetTitle.value
    const listTitle = optionListTitle.value

    const targetTemp = targetNumber || targetChannel

    console.log(targetTemp)
    const list = new List()
    list.name = listTitle.toString()

    // if the person firing the command is an admin, add the bounty
    if (await DiscordUtility.isAdmin(ctx.member.roles)) {
      list.bounty = bounty
    } else {
      list.bounty = 0
    }

    if (typeof targetTemp === "string") {
      const target = matchRegex.exec(targetTemp)[0]
      console.log("Target: ", target)
      try {
        const result = await connection
          .getRepository(Channel)
          .createQueryBuilder("channel")
          .where("channel.id = :id", { id: target })
          .getOne()
        list.target = result.length
      } catch {
        return "Invalid channel."
      }
    } else {
      console.log("Target Temp: ", targetTemp)
      list.target = targetTemp
    }

    list.items = []
    list.items.length = list.target
    // fill the list up with empty values
    list.items = list.items.fill("", 0, list.target)
    console.log(list)
    if (await DiscordUtility.isAdmin(ctx.member.roles)) {
      await connection
        .getRepository(List)
        .createQueryBuilder("list")
        .insert()
        .into(List)
        .values([list])
        .execute()
      return `${ctx.member.displayName} has added "${list.name}" to the pool for lists with a target of ${list.target}`
    } else {
      const pendingList = new PendingList()
      pendingList.name = list.name
      pendingList.target = list.target
      const message = await (
        await DiscordUtility.getChannelFromName(PENDING_LISTS_CHANNEL)
      ).send(pendingList.generateEmbed())
      await message.react(TICK_EMOJI)
      await message.react(CROSS_EMOJI)
      const collected = await message.awaitReactions(
        (reaction, user) =>
          reaction.emoji.name === TICK_EMOJI ||
          (reaction.emoji.name === CROSS_EMOJI &&
            DiscordUtility.isAdminId(user.id)),
        { max: 1 }
      )
      collected.forEach(async (reaction) => {
        if (reaction.emoji.name === CROSS_EMOJI) {
          message.delete()
          return
        }
        await connection
          .getRepository(List)
          .createQueryBuilder("list")
          .insert()
          .into(List)
          .values([list])
          .execute()
        await message.delete()
      })
      return `${ctx.member.displayName} has added "${list.name}" to the pool of pending lists.`
    }
  }
}
