const { SlashCommandBuilder } = require('discord.js');
const { requireSenior } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(o => o.setName('user').setDescription('Member to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban').setRequired(false))
    .addIntegerOption(o => o.setName('days').setDescription('Delete message history (days)').setMinValue(0).setMaxValue(7).setRequired(false)),

  async execute(interaction, client) {
    if (!await requireSenior(interaction)) return;

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('days') || 0;

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: '❌ I cannot ban that user.', ephemeral: true });

    try {
      await target.send(`🚫 You have been **banned** from **Frontline Networks**.\n**Reason:** ${reason}`).catch(() => {});
      await target.ban({ reason, deleteMessageSeconds: days * 86400 });
      await modLog(client, 'BAN', target.user, interaction.member, reason);
      await interaction.reply({ content: `✅ **${target.user.tag}** has been banned.\n**Reason:** ${reason}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to ban that user.', ephemeral: true });
    }
  }
};
