var osu = require("node-os-utils");
var cpu = osu.cpu;
var drive = osu.drive;
var mem = osu.mem;

module.exports = {
  name: "sysinfo",
  description: "Informações de uso dá máquina do bot!",
  async execute(interaction, player) {
    const memoryInfo = await mem.info();
    const cpuUsage = await cpu.usage();
    const driveInfo = await drive.info();
    const str = `🤖 | Uso de memória: ${memoryInfo.usedMemPercentage}% \n🧮 | Uso de CPU: ${cpuUsage}% \n💽 | Uso de disco: ${driveInfo.usedPercentage}%`;
    interaction.reply({
      content: str,
      ephemeral: false,
    });
  },
};
