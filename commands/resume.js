const { GuildMember } = require("discord.js");

module.exports = {
  name: "resume",
  description: "Remove o pause!",
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
        content: "❌ | Nenhuma música tocando!",
      });
    const success = queue.setPaused(false);
    return void interaction.followUp({
      content: success ? "▶ | Pause removido!" : "❌ | Algum erro aconteceu!",
    });
  },
};
