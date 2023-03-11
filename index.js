const fs = require("fs");
const { Collection, ActivityType } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const Client = require("./client/Client");
const config = require("./config.json");
const { Player } = require("discord-player");
const client = new Client();
client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on("error", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});

player.on("connectionError", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

player.on("trackStart", (queue, track) => {
  queue.metadata.send(
    `▶️ | Começando a tocar: **${track.title}** em **${queue.connection.channel.name}**!`
  );
});

player.on("trackAdd", (queue, track) => {
  queue.metadata.send(`🎶 | Música **${track.title}** enfileirada!`);
});

player.on("botDisconnect", (queue) => {
  queue.metadata.send(
    "❌ | Fui desconectado manualmente do canal, limpando a fila!"
  );
});

player.on("channelEmpty", (queue) => {
  queue.metadata.send("❌ | Ninguém está no canal de voz, saindo...");
});

player.on("queueEnd", (queue) => {
  queue.metadata.send("✅ | Fila terminada!");
});

client.once("ready", (c) => {
  console.log(
    `Logged in as ${c.user.tag}. Setting activity to '${config.activity}' and activity type to '${ActivityType.Playing}'`
  );
  client.user.setActivity(config.activity, { type: ActivityType.Playing });
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (
    message.content === "!deploy" &&
    message.author.id === client.application?.owner?.id
  ) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply("Deploy executado!");
      })
      .catch((err) => {
        message.reply(
          "Erro ao fazer deploy dos comandos! Verifique se o bot possui a permissão de application.commands!"
        );
        console.error(err);
      });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = client.commands.get(interaction.commandName.toLowerCase());
    console.log(
      `${new Date().toISOString()} | User ${interaction.user.tag} in #${
        interaction.channel.name
      } used command ${interaction.commandName}.`
    );
    const commandType = getCommandType(interaction.commandName);
    switch (commandType) {
      case "client":
        command.execute(interaction, client);
        break;
      case "player":
        command.execute(interaction, player);
        break;
      default:
        command.execute(interaction);
        break;
    }
  } catch (error) {
    console.log(`${new Date().toISOString()} | General error: ${error}`);
    interaction.reply({
      content: "Algum erro aconteceu ao tentar executar o comando!",
    });
  }
});

function getCommandType(commandName) {
  if (commandName === "userinfo" || commandName === "ping") {
    return "client";
  } else if (
    commandName === "help" ||
    commandName === "wowtoken" ||
    commandName === "sysinfo"
  ) {
    return "none";
  } else {
    return "player";
  }
}

client.login(config.token);
