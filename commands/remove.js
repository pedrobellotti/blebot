const { GuildMember, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove uma música da fila",
  options: [
    {
      name: "number",
      type: ApplicationCommandOptionType.Integer,
      description: "A posição da fila para remover",
      required: true,
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
    const number = interaction.options.getInteger("number") - 1;
    if (number > queue.tracks.length)
      return void interaction.followUp({
        content: "❌ | Número da música inválido!",
      });
    const removedTrack = queue.remove(number);
    return void interaction.followUp({
      content: removedTrack
        ? `✅ | **${removedTrack}** removida!`
        : "❌ | Algum erro aconteceu!",
    });
  },
};
