const { SlashCommandBuilder } = require('discord.js');
const { requireSenior } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(o => o.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for kick').setRequired(false)),

  async execute(interaction, client) {
    if (!requireSenior(interaction)) return;

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ I cannot kick that user.', ephemeral: true });

    try {
      await target.send(`👢 You have been **kicked** from **Frontline Networks**.\n**Reason:** ${reason}`).catch(() => {});
      await target.kick(reason);
      await modLog(client, 'KICK', target.user, interaction.member, reason);
      await interaction.reply({ content: `✅ **${target.user.tag}** has been kicked.\n**Reason:** ${reason}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to kick that user.', ephemeral: true });
    }
  }
};
