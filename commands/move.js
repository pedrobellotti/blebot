const { GuildMember, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "move",
  description: "Move uma música de posição na fila",
  options: [
    {
      name: "track",
      type: ApplicationCommandOptionType.Integer,
      description: "O número da música para mover",
      required: true,
    },
    {
      name: "position",
      type: ApplicationCommandOptionType.Integer,
      description: "A posição para qual mover",
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
        content: "❌ | Nenhuma música está tocando!",
      });
    const queueNumbers = [
      interaction.options.getInteger("track") - 1,
      interaction.options.getInteger("position") - 1,
    ];
    if (
      queueNumbers[0] > queue.tracks.length ||
      queueNumbers[1] > queue.tracks.length
    )
      return void interaction.followUp({
        content: "❌ | Número da música inválido!",
      });

    try {
      const track = queue.remove(queueNumbers[0]);
      queue.insert(track, queueNumbers[1]);
      return void interaction.followUp({
        content: `✅ | **${track}** movida!`,
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: "❌ | Um erro aconteceu ao executar o comando!",
      });
    }
  },
};
