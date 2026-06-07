const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('store')
    .setDescription('View the Frontline Networks store'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle('🛒 Frontline Networks Store')
      .setDescription('Support the server and unlock exclusive perks, ranks, and cosmetics.')
      .addFields(
        { name: '⭐ Recruit Package', value: 'Custom name colour, donor tag, priority queue', inline: true },
        { name: '🔥 Officer Package', value: 'Exclusive jobs, vehicle skin, VIP channel', inline: true },
        { name: '💎 Commander Package', value: 'Custom model, server credits, early access', inline: true },
      )
      .setFooter({ text: 'Store is launching soon — join Discord to get notified first' })
      .setTimestamp();

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Visit Store')
        .setURL(process.env.STORE_URL || 'https://frontlinenetx.net/#store')
        .setStyle(ButtonStyle.Link),
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
