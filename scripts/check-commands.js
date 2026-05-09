const path = require("path")
const { SlashCreator } = require("slash-create")

async function main() {
  const creator = new SlashCreator({
    applicationID: "000000000000000000",
    token: "test.token.value",
  })
  const commands = await creator.registerCommandsIn(
    path.join(__dirname, "..", "dist", "commands")
  )
  const commandNames = commands.map((command) => command.commandName).sort()

  if (commandNames.length !== 11) {
    throw new Error(
      `Expected 11 slash commands to load, loaded ${commandNames.length}: ${commandNames.join(", ")}`
    )
  }

  console.log(commandNames.join("\n"))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
