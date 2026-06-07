const { SlashCommandBuilder } = require('discord.js');
const { requireMod } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

const DURATIONS = {
  '5m':  5 * 60 * 1000,
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h':  60 * 60 * 1000,
  '6h':  6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d':  7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout (mute) a member')
    .addUserOption(o => o.setName('user').setDescription('Member to mute').setRequired(true))
    .addStringOption(o =>
      o.setName('duration')
        .setDescription('Duration of mute')
        .setRequired(true)
        .addChoices(
          { name: '5 minutes',  value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '30 minutes', value: '30m' },
          { name: '1 hour',     value: '1h' },
          { name: '6 hours',    value: '6h' },
          { name: '12 hours',   value: '12h' },
          { name: '24 hours',   value: '24h' },
          { name: '7 days',     value: '7d' },
        )
    )
    .addStringOption(o => o.setName('reason').setDescription('Reason for mute').setRequired(false)),

  async execute(interaction, client) {
    if (!requireMod(interaction)) return;

    const target = interaction.options.getMember('user');
    const durKey = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const ms = DURATIONS[durKey];

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: '❌ I cannot mute that user.', ephemeral: true });

    try {
      await target.timeout(ms, reason);
      await modLog(client, 'MUTE', target.user, interaction.member, reason, { duration: durKey });
      await interaction.reply({ content: `🔇 **${target.user.tag}** has been muted for **${durKey}**.\n**Reason:** ${reason}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to mute that user.', ephemeral: true });
    }
  }
};
