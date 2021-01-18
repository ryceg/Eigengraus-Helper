"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const fs = require("fs");
const Command_1 = require("../objects/Command");
class CommandHandler {
    constructor(directory, db) {
        this.commands = new Map();
        this.categories = new Array();
        this.handleCommand = async (message) => {
            if (message.author.bot) {
                return;
            }
            const prefix = "!";
            const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/g);
            const command = args[0].toLowerCase();
            console.log(command);
            const cmd = this.commands.get(command);
            console.log(cmd);
            if (cmd === null || cmd === undefined) {
                console.log(cmd + " is not found.");
                return;
            }
            console.log("Running cmd " + cmd.$name);
            cmd.$run(message, this);
            // const command: Array<Command> = [...this.commands].filter((commands) => commands[1].$name === command);
        };
        this.loadCommands = () => {
            fs.readdir(this.directory, (err, files) => {
                if (err) {
                    console.error(err);
                }
                files.forEach(file => {
                    if (!file.endsWith(".js") && !file.endsWith(".gitignore") && !file.endsWith(".ts")) {
                        // "file" is a directory
                        fs.readdir(this.directory + file + "/", (err, files) => {
                            files.forEach(innerFile => {
                                this.parseCommand(innerFile, file);
                            });
                        });
                    }
                    this.parseCommand(file);
                });
            });
        };
        this.directory = directory;
        this.db = db;
        this.loadCommands();
    }
    parseCommand(file, directory) {
        if (!file.endsWith((".js"))) {
            return;
        }
        console.log(file);
        file = directory ? this.directory + directory + "/" + file : this.directory + file;
        // const command = require(directory ? this.directory + directory + "/" + file : this.directory + file);
        const command = require(file);
        if (command.info === undefined || command.info === null) {
            return console.log(`${file} is not a valid command file.`);
        }
        const cmdInfo = new Command_1.Command(command.info.name, command.info.description, command.info.usage, file.replace(this.directory, "").substring(0, file.replace(this.directory, "").lastIndexOf("/")), command.info.run);
        this.commands.set(cmdInfo.$name, cmdInfo);
        if (!this.categories.includes(cmdInfo.$category)) {
            this.categories.push(cmdInfo.$category);
        }
    }
    get $commands() {
        return this.commands;
    }
    get $categories() {
        return this.categories;
    }
    get $db() {
        return this.db;
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map