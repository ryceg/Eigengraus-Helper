"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const slash_create_1 = require("slash-create");
const path = require("path");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Channel_1 = require("./entity/Channel");
const List_1 = require("./entity/List");
const Activity_1 = require("./entity/Activity");
const DiscordUtility_1 = require("./utility/DiscordUtility");
const Member_1 = require("./entity/Member");
const AnyChannel_1 = require("./entity/AnyChannel");
const { POINTS_PER_ENTRY, POINTS_PER_MESSAGE, TOKEN, PUBLIC_KEY, APPLICATION_ID } = require("../config.json");
const CatLoggr = require('cat-loggr');
const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
const LIST_REGEX = new RegExp("^[0-9]+\..");
const LIST_INDEX_REGEX = new RegExp("^(.*)(?=\.)");
const CONTENT_REGEX = new RegExp("(?<=\.)(.*)(?=$)");
const client = new Discord.Client();
global.CLIENT = client;
(async () => {
    global.CONNECTION = await typeorm_1.createConnection({
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
    });
    console.log("Connection");
})();
// const commandHandler = new CommandHandler()
const creator = new slash_create_1.SlashCreator({
    applicationID: APPLICATION_ID,
    publicKey: PUBLIC_KEY,
    token: TOKEN
});
creator.registerCommandsIn(path.join(__dirname, 'commands')).syncCommands();
creator.withServer(new slash_create_1.GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)));
creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) => logger.info(`${ctx.member.user.username}#${ctx.member.user.discriminator} (${ctx.member.id}) ran command ${command.commandName}`));
creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));
client.on("ready", () => {
    console.log("Ready.");
});
client.on("message", async (message) => {
    if (message.author.bot)
        return;
    if (!LIST_REGEX.test(message.content)) {
        const anyChannel = await AnyChannel_1.AnyChannel.getAnyChannel(message.channel.id);
        const member = await Member_1.Member.getMember(message.author.id);
        const points = anyChannel == null ? POINTS_PER_ENTRY : anyChannel.pointsRate;
        await member.addPoints(points);
        const activity = new Activity_1.Activity(message.author.id, points);
        activity.channel = message.channel.id;
        await activity.createActivity();
        return;
    }
    console.log(message.content);
    const result = await typeorm_1.getConnection().getRepository(Channel_1.Channel).createQueryBuilder("channel").where("channel.id = :id", { id: message.channel.id }).getOne();
    if (result == null || result.lastListId == null) {
        return;
    }
    const lastList = result.lastListId;
    const list = await List_1.List.getList(lastList);
    const index = parseInt(LIST_INDEX_REGEX.exec(message.content)[0]) + 1;
    console.log(LIST_INDEX_REGEX.exec(message.content)[0], list);
    list.items[index - 2] = CONTENT_REGEX.exec(message.content)[0].substr(index.toString().length).trim();
    const activity = new Activity_1.Activity(message.author.id, list.bounty + POINTS_PER_ENTRY);
    activity.channel = message.channel.id;
    await activity.createActivity();
    await List_1.List.updateList(list);
    const dChannel = await DiscordUtility_1.DiscordUtility.getChannelFromId(message.channel.id);
    await (await dChannel.messages.fetch(list.messageId)).edit(list.generateEmbed());
    const member = await Member_1.Member.getMember(message.author.id);
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
}, 60000);
//# sourceMappingURL=index.js.map