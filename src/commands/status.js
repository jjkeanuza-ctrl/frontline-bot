const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { queryServer } = require('../tasks/statusMonitor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the current GMOD server status'),

  async execute(interaction) {
    await interaction.deferReply();

    const result = await queryServer();

    const embed = new EmbedBuilder()
      .setColor(result.online ? 0x2ecc71 : 0xe74c3c)
      .setTitle(`${result.online ? '🟢' : '🔴'} Frontline Networks — GMOD PoliceRP`)
      .addFields(
        { name: 'Status',  value: result.online ? '**Online**' : '**Offline**', inline: true },
        { name: 'Players', value: result.online ? `**${result.players}/${result.maxPlayers}**` : '**0/0**', inline: true },
        { name: 'Map',     value: result.online ? (result.map || 'Unknown') : 'N/A', inline: true },
      )
      .setFooter({ text: result.online ? `IP: ${process.env.GMOD_IP}:${process.env.GMOD_PORT}` : 'Server is currently offline' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
