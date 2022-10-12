var osu = require("node-os-utils");
var cpu = osu.cpu;
var drive = osu.drive;
var mem = osu.mem;

module.exports = {
  name: "sysinfo",
  description: "Informações de uso dá máquina do bot",
  async execute(interaction) {
    await interaction.deferReply();
    let str;
    try {
      const memoryInfo = await mem.info();
      const cpuUsage = await cpu.usage();
      const driveInfo = await drive.info();
      str = `🤖 | Uso de memória: ${memoryInfo.usedMemPercentage}% \n🧮 | Uso de CPU: ${cpuUsage}% \n💽 | Uso de disco: ${driveInfo.usedPercentage}%`;
    } catch (error) {
      console.log("Error getting usage info: ", error);
      str = "Erro ao calcular informações de uso da máquina!";
    }
    interaction.editReply({
      content: str,
      ephemeral: false,
    });
  },
};
