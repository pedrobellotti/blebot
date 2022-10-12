const { GuildMember } = require("discord.js");

module.exports = {
  name: "bassboost",
  description: "Liga ou desliga o bassboost",
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

    await queue.setFilters({
      bassboost: !queue.getFiltersEnabled().includes("bassboost"),
      normalizer2: !queue.getFiltersEnabled().includes("bassboost"),
    });

    setTimeout(() => {
      return void interaction.followUp({
        content: `🔊 | Bassboost ${
          queue.getFiltersEnabled().includes("bassboost")
            ? "ligado"
            : "desligado"
        }!`,
      });
    }, queue.options.bufferingTimeout);
  },
};
