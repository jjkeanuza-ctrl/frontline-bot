const { SlashCommandBuilder } = require('discord.js');
const { requireMod } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a member')
    .addUserOption(o => o.setName('user').setDescription('Member to unmute').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),

  async execute(interaction, client) {
    if (!await requireMod(interaction)) return;

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });

    try {
      await target.timeout(null, reason);
      await modLog(client, 'UNMUTE', target.user, interaction.member, reason);
      await interaction.reply({ content: `🔊 **${target.user.tag}** has been unmuted.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to unmute that user.', ephemeral: true });
    }
  }
};
