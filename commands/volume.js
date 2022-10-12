const { GuildMember, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Altera o volume!",
  options: [
    {
      name: "volume",
      type: ApplicationCommandOptionType.Integer,
      description: "Um número entre 0 e 200",
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

    var volume = interaction.options.getInteger("volume");
    volume = Math.max(0, volume);
    volume = Math.min(200, volume);
    const success = queue.setVolume(volume);

    return void interaction.followUp({
      content: success
        ? `🔊 | Volume alterado para: ${volume}!`
        : "❌ | Algum erro aconteceu!",
    });
  },
};
