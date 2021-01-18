import * as Discord from "discord.js";
import {CommandHandler} from "./handlers/CommandHandler";
import { GatewayServer, SlashCreator } from "slash-create";
import * as path from "path";
import {Client, TextChannel, WSEventType} from "discord.js";
import "reflect-metadata";
import {Connection, createConnection, getConnection} from "typeorm";
import {Channel} from "./entity/Channel";
import {List} from "./entity/List";
import {Activity} from "./entity/Activity";
import {DiscordUtility} from "./utility/DiscordUtility";
import {Member} from "./entity/Member";
import {Settings} from "./entity/Settings";
import {AnyChannel} from "./entity/AnyChannel";
const {POINTS_PER_ENTRY, POINTS_PER_MESSAGE, TOKEN, PUBLIC_KEY, APPLICATION_ID} = require("../config.json");

const CatLoggr = require('cat-loggr');
const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');

const LIST_REGEX = new RegExp("^[0-9]+\..");
const LIST_INDEX_REGEX = new RegExp("^(.*)(?=\.)");
const CONTENT_REGEX = new RegExp("(?<=\.)(.*)(?=$)")

const client = new Discord.Client();
global.CLIENT = client;
declare global {
   var CONNECTION: Connection;
   var CLIENT: Client;
}

(async () => {
global.CONNECTION = await createConnection({
   type: "postgres",
   host: "localhost",
   port: 5864,
   username: "postgres",
   password: "postgres",
   database: "eigengrau",
   entities: [
       __dirname + "/entity/*.js",
   ],
   synchronize: true
})
       console.log("Connection");
}
)();
// const commandHandler = new CommandHandler()

const creator = new SlashCreator({
   applicationID: APPLICATION_ID,
   publicKey: PUBLIC_KEY,
   token: TOKEN
});
creator.registerCommandsIn(path.join(__dirname, 'commands')).syncCommands();
creator.withServer(new GatewayServer(
    (handler) => client.ws.on(<WSEventType>'INTERACTION_CREATE', handler)
));

creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
    logger.info(`${ctx.member.user.username}#${ctx.member.user.discriminator} (${ctx.member.id}) ran command ${command.commandName}`));
creator.on('commandRegister', (command) =>
    logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

client.on("ready", () => {
   console.log("Ready.");
});

client.on("message", async (message) => {
   if (message.author.bot)
      return;

   if (!LIST_REGEX.test(message.content)) {
      const anyChannel = await AnyChannel.getAnyChannel(message.channel.id);
      const member = await Member.getMember(message.author.id);
      const points = anyChannel == null ? POINTS_PER_ENTRY : anyChannel.pointsRate;
      await member.addPoints(points);
      const activity = new Activity(message.author.id, points);
      activity.channel = message.channel.id;
      await activity.createActivity();
      return;
   }
   console.log(message.content);
   const result = await getConnection().getRepository(Channel).createQueryBuilder("channel").where("channel.id = :id", {id: message.channel.id}).getOne();
   if (result == null || result.lastListId == null) {
      return;
   }
   const lastList = result.lastListId;
   const list = await List.getList(lastList);
   const index = parseInt(LIST_INDEX_REGEX.exec(message.content)[0]) + 1;
   console.log(LIST_INDEX_REGEX.exec(message.content)[0], list);
   list.items[index-2] = CONTENT_REGEX.exec(message.content)[0].substr(index.toString().length).trim();

   const activity = new Activity(message.author.id, list.bounty + POINTS_PER_ENTRY);
   activity.channel = message.channel.id;
   await activity.createActivity();
   await List.updateList(list);
   const dChannel = await DiscordUtility.getChannelFromId(message.channel.id) as TextChannel;
   await (await dChannel.messages.fetch(list.messageId)).edit(list.generateEmbed());

   const member = await Member.getMember(message.author.id);
   await member.addPoints(list.bounty + POINTS_PER_ENTRY);

   // if (list.isFinished()) {
   //    list.finished = true;
   //    await List.updateList(list);
   //    const channel = await Channel.getChannel(message.channel.id);
   //    channel.lastListId = null;
   //    await Channel.updateChannel(channel);
   //    const finishedChannel = await DiscordUtility.getChannelFromName("finished");
   //    await finishedChannel.send("A list has been finished!");
   //    await finishedChannel.send(list.generateEmbed(true));
   //    if ((await Settings.getSettings()).autoPosting) {
   //       await newList(message.channel.id);
   //    } else {
   //       await dChannel.send("The list has been finished. Get a new list by using /new");
   //    }
   //
   // }
});


client.login(TOKEN);

setInterval(() => {

}, 60000)