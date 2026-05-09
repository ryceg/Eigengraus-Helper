import { Client } from "discord.js"
import { Connection } from "typeorm"

declare global {
  namespace NodeJS {
    interface Global {
      CLIENT: Client
      CONNECTION: Connection
    }
  }
}
