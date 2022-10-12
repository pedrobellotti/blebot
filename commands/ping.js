module.exports = {
  name: "ping",
  description: "Mostra a latência da API e do BOT",
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
    const apiPing = client.ws.ping;
    const botPing = sent.createdTimestamp - interaction.createdTimestamp;
    const str = `Pong!\n:green_circle: Latência da API: ${apiPing} ms\n:orange_circle: Latência do BOT: ${botPing} ms`
    interaction.editReply(str);
  },
};
