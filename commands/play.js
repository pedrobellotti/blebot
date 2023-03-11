const { GuildMember, ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "play",
  description: "Toca uma música no seu canal atual",
  options: [
    {
      name: "query",
      type: ApplicationCommandOptionType.String,
      description: "A música para tocar",
      required: true,
    },
  ],
  async execute(interaction, player) {
    try {
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

      const query = interaction.options.getString("query");
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({
          content: "Nenhum resultado foi encontrado!",
        });

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
          quality: "highest",
          filter: "audioonly",
          highWaterMark: 1 << 30,
          dlChunkSize: 0,
        },
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: "Não consegui entrar no seu canal de voz!",
        });
      }

      await interaction.followUp({
        content: `⏱ | Carregando a ${
          searchResult.playlist ? "playlist" : "música"
        }...`,
      });
      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
	
	//Random disconnect fix
	const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        	const newUdp = Reflect.get(newNetworkState, 'udp');
        	clearInterval(newUdp?.keepAliveInterval);
	}
    	queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
      		const oldNetworking = Reflect.get(oldState, 'networking');
      		const newNetworking = Reflect.get(newState, 'networking');
   		oldNetworking?.off('stateChange', networkStateChangeHandler);
      		newNetworking?.on('stateChange', networkStateChangeHandler);
		if(oldState.status !== newState.status) {
      			const now = new Date().toISOString();
      			console.log(`${now} | Network state change detected: ${oldState.status} -> ${newState.status}`);
		}
    	});

      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: "Um erro aconteceu ao executar o comando: " + error.message,
      });
    }
  },
};
