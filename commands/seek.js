const { GuildMember, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "seek",
  description: "Coloca a música em um tempo especificado.",
  options: [
    {
      name: "tempo",
      description: "Tempo (em segundos)",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
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

    const time = interaction.options.getInteger("tempo");
    if (time <= 0) {
      return void interaction.followUp({
        content: "❌ | Tempo inválido, use apenas números maiores que zero!",
      });
    }
    const timeMS = time * 1000;
    await queue.seek(timeMS);

    return void interaction.followUp({
      content: `⏩ | Playback ajustado para ${time} segundos!`,
    });
  },
};
