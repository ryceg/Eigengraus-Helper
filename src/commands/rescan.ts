import {CommandOptionType, SlashCommand} from "slash-create"
import {Channel} from "../entity/Channel"
import {DiscordUtility} from "../utility/DiscordUtility"
import {List} from "../entity/List"

const { GUILD_ID } = require("../../config.json")

const LIST_REGEX = new RegExp("^[0-9]+\\..")
const LIST_TITLE_REGEX = new RegExp("\\*\\*.+\\*\\*")
const LIST_TITLE_CONTENT_REGEX = new RegExp("(?<=\\*\\*)(.*)(?=\\*\\*)")
const LIST_INDEX_REGEX = new RegExp("^(.*)(?=\\.)")
const CONTENT_REGEX = new RegExp("(?<=\\.)(.*)(?=$)", "s")

export class RescanCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "rescan",
            description: "Update the latest list with any missed entries.",
            guildID: GUILD_ID,
            options: [
                {
                    name: "start",
                    type: CommandOptionType.STRING,
                    description: "The message to start the rescan from."
                }
            ]
        })
    }

  async run(ctx) {
    const channelId = ctx.channelID
    const result = await Channel.getChannel(channelId)
    if (result === null || result.lastListId === null) {
      return "There are no lists in this channel."
    }
    const list = await List.getList(result.lastListId)
    const channel = await DiscordUtility.getChannelFromId(channelId)
    const startValue = ctx.data.options.options.filter((object) => object.name === "start")[0];
    const start = startValue != undefined ? startValue : list.messageId;
    // const messages = await channel.messages.fetch({ after: list.messageId })
    const messages = await channel.messages.fetch({ after: start })
    console.log(messages)
    const contentMap = messages.map((message) => message.content).reverse()
    let filtered = []
    for (let i in contentMap) {
      let filter = false
      if (LIST_REGEX.test(contentMap[i])) filter = true
      if (LIST_TITLE_REGEX.test(contentMap[i])) filter = true
      if (contentMap[i].length === 0) break;

      if (filter) filtered.push(contentMap[i])
    }
    let finishedLists = new Map<string, string[]>()
    let title = ""
    let items: string[] = []
    filtered.forEach((m: string) => {
      if (m.startsWith("**")) {
        if (title.length !== 0) {
          finishedLists.set(title, items)
          items = []
        }
        title = LIST_TITLE_CONTENT_REGEX.exec(m)[0]
        return
      }
      const dotIndex = m.indexOf(".")
      const index: number = parseInt(m.substring(0, dotIndex))
      items[index - 1] = CONTENT_REGEX.exec(m)[0]
        .substr(index.toString().length - 1)
        .trim()
    })
    console.log(items)
    for (let i = 0; i < list.target; i++) {
      if (items[i] === null) {
        items[i] = ""
      }
    }
    list.items = items
    await List.updateList(list)
    await (await channel.messages.fetch(list.messageId)).edit(
      list.generateEmbedPaginated()
    )
  }
}
