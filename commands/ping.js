module.exports = {
  name: "ping",
  description: "Responde com pong!",
  execute(interaction, player) {
    interaction.reply({
      content: "pong",
      ephemeral: false,
    });
  },
};
