const { SlashCommandBuilder } = require('discord.js');
const { requireMod } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages from a channel')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete (1-100)').setMinValue(1).setMaxValue(100).setRequired(true)),

  async execute(interaction) {
    if (!await requireMod(interaction)) return;

    const amount = interaction.options.getInteger('amount');

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🗑️ Deleted **${deleted.size}** messages.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.', ephemeral: true });
    }
  }
};
