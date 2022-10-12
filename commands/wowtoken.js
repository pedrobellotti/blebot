const axios = require("axios");
const { ApplicationCommandOptionType } = require("discord.js");

function formatNumber(number) {
  return number.toLocaleString("pt-BR");
}

module.exports = {
  name: "wowtoken",
  description: "Preço do WoW token na região US.",
  options: [
    {
      name: "region",
      type: ApplicationCommandOptionType.String,
      description: "Região para listar o preço",
      required: false,
    },
  ],
  async execute(interaction, player) {
    const region = interaction.options.getString("region") || "us";
    let responseString = "";
    try {
      switch (region) {
        case "us":
          responseString += "Preços para a região US:\n";
          break;
        case "eu":
          responseString += "Preços para a região EU:\n";
          break;
        case "china":
          responseString += "Preços para a região China:\n";
          break;
        case "taiwan":
          responseString += "Preços para a região Taiwan:\n";
          break;
        case "korea":
          responseString += "Preços para a região Korea:\n";
          break;
        default:
          throw new Error(
            "Região não identificada! As regiões válidas são: us, eu, china, taiwan, korea."
          );
      }
      const request = await axios.get(
        "https://wowtokenprices.com/current_prices.json"
      );
      const data = request.data[region];
      responseString += `💰 | Preço atual: ${formatNumber(
        data.current_price
      )} gold \n💰 | Nos últimos 30 dias, o menor preço foi ${formatNumber(
        data["30_day_low"]
      )} gold e o maior foi ${formatNumber(data["30_day_high"])} gold`;
    } catch (error) {
      console.log("Error while requesting wow token prices: ", error);
      responseString = `Erro ao recuperar preços do token: ${error.message}`;
    }
    interaction.reply({
      content: responseString,
      ephemeral: false,
    });
  },
};
