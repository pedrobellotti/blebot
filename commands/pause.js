const { GuildMember } = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pausa a música atual",
  async execute(interaction, player) {
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return void interaction.reply({
        content: "Você não está em um canal de voz!",
        ephemeral: true,
      });
    }

    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    ) {
      return void interaction.reply({
        content: "Você não está no meu canal de voz!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "❌ | Nenhuma música está tocando!",
      });
    const success = queue.setPaused(true);
    return void interaction.followUp({
      content: success ? "⏸ | Pausado!" : "❌ | Algum erro aconteceu!",
    });
  },
};
