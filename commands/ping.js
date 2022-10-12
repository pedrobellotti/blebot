module.exports = {
  name: "ping",
  description: "Responde com pong!",
  execute(interaction) {
    interaction.reply({
      content: "pong",
      ephemeral: false,
    });
  },
};
