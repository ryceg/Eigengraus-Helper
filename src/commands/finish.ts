import { CommandContext, CommandOptionType, SlashCommand } from "slash-create";
import { List } from "../entity/List";
import { getConnection } from "typeorm";
import { Channel } from "../entity/Channel";
import { Settings } from "../entity/Settings";
const { GUILD_ID } = require("../../config.json");

export class FinishCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "finish",
      description: "Scans and finishes the list in the channel, and posts the results.",
      guildIDs: GUILD_ID,
    })
  }


  async run(ctx: CommandContext) {
    const result = await Channel.getChannel(ctx.channelID)
    if (result === null || result.lastListId === null) {
      return
    }
    const lastList = result.lastListId
    const list = await List.getList(lastList)
    if (
      (await list.isFinished()) ||
      (await Settings.getSettings()).anarchyPosting
    ) {
      console.log("Finishing list...")
      await list.finish(result)
    } else {
      console.log("List not yet finished!")
      return "The list is not yet finished!"
    }
  }
}
