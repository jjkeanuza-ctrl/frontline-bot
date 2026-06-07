const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('website')
    .setDescription('Get the link to the Frontline Networks website'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle('🌐 Frontline Networks')
      .setDescription('Visit our website for server info, store, community forums, and more.')
      .addFields(
        { name: '🎮 Servers', value: 'Live server status and player counts' },
        { name: '🛒 Store', value: 'Exclusive perks and packages' },
        { name: '💬 Community', value: 'Forums, Discord, staff applications' },
      )
      .setFooter({ text: 'frontlinenetx.net' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Visit Website').setURL(process.env.WEBSITE_URL || 'https://frontlinenetx.net').setStyle(ButtonStyle.Link),
      new ButtonBuilder().setLabel('Store').setURL(process.env.STORE_URL || 'https://frontlinenetx.net/#store').setStyle(ButtonStyle.Link),
      new ButtonBuilder().setLabel('Join Discord').setURL('https://discord.gg/7fahT24btF').setStyle(ButtonStyle.Link),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
