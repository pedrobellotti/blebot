const fs = require("fs");

module.exports = {
  name: "help",
  description: "Lista todos os comandos disponívels.",
  execute(interaction) {
    let str = "";
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `Comando: ${command.name}, Descrição: ${command.description} \n`;
    }

    return void interaction.reply({
      content: str,
      ephemeral: true,
    });
  },
};
