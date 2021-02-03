import * as fs from "fs"
import { Command } from "../objects/Command"
import { Message } from "discord.js"
import { Db } from "../utility/Db"

export class CommandHandler {
  private readonly directory: string
  private readonly db: Db
  private commands: Map<string, Command> = new Map<string, Command>()
  private categories: Array<string> = new Array<string>()

  constructor(directory: string, db: Db) {
    this.directory = directory
    this.db = db
    this.loadCommands()
  }

  public handleCommand = async (message: Message): Promise<void> => {
    if (message.author.bot) {
      return
    }

    const prefix: string = "!"

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command: string = args[0].toLowerCase()
    console.log(command)
    const cmd = this.commands.get(command)
    console.log(cmd)
    if (cmd === null || cmd === undefined) {
      console.log(cmd + " is not found.")
      return
    }
    console.log("Running cmd " + cmd.$name)
    cmd.$run(message, this)

    // const command: Array<Command> = [...this.commands].filter((commands) => commands[1].$name === command);
  }

  private loadCommands = (): void => {
    fs.readdir(this.directory, (err, files) => {
      if (err) {
        console.error(err)
      }

      files.forEach((file) => {
        if (
          !file.endsWith(".js") &&
          !file.endsWith(".gitignore") &&
          !file.endsWith(".ts")
        ) {
          // "file" is a directory
          fs.readdir(this.directory + file + "/", (err, files) => {
            files.forEach((innerFile) => {
              this.parseCommand(innerFile, file)
            })
          })
        }
        this.parseCommand(file)
      })
    })
  }

  private parseCommand(file: string, directory?: string) {
    if (!file.endsWith(".js")) {
      return
    }
    console.log(file)
    file = directory
      ? this.directory + directory + "/" + file
      : this.directory + file
    // const command = require(directory ? this.directory + directory + "/" + file : this.directory + file);
    const command = require(file)
    if (command.info === undefined || command.info === null) {
      return console.log(`${file} is not a valid command file.`)
    }
    const cmdInfo = new Command(
      command.info.name,
      command.info.description,
      command.info.usage,
      file
        .replace(this.directory, "")
        .substring(0, file.replace(this.directory, "").lastIndexOf("/")),
      command.info.run
    )

    this.commands.set(cmdInfo.$name, cmdInfo)
    if (!this.categories.includes(cmdInfo.$category)) {
      this.categories.push(cmdInfo.$category)
    }
  }

  public get $commands(): Map<string, Command> {
    return this.commands
  }

  public get $categories(): Array<string> {
    return this.categories
  }

  public get $db(): Db {
    return this.db
  }
}
