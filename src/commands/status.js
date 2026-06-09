const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { queryServer } = require('../tasks/statusMonitor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the current GMOD server status'),

  async execute(interaction) {
    await interaction.deferReply();

    const data = await queryServer();

    const embed = new EmbedBuilder()
      .setColor(data.online ? 0x4fc3f7 : 0xe74c3c)
      .setTitle(`${data.online ? '🟢' : '🔴'} Frontline Networks — GMOD`)
      .addFields(
        { name: '📊 Status',   value: data.online ? '**Online**' : '**Offline**',                           inline: true },
        { name: '👥 Players',  value: data.online ? `**${data.players}/${data.maxplayers}**` : '**0/0**',   inline: true },
        { name: '🕹️ Gamemode', value: data.online && data.gamemode ? `**${data.gamemode}**` : '—',           inline: true },
        { name: '🗺️ Map',      value: data.online && data.map      ? `**${data.map}**`      : '—',           inline: true },
        { name: '🖥️ Server',   value: data.online && data.name     ? data.name              : 'Frontline Networks', inline: true },
        { name: '🌐 Website',  value: '[frontlinenetx.net](https://frontlinenetx.net)',                     inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
