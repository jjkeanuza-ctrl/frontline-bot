const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { requireMod } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a member')
    .addUserOption(o => o.setName('user').setDescription('Member to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for warning').setRequired(true)),

  async execute(interaction, client) {
    if (!requireMod(interaction)) return;

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('⚠️ Warning Issued')
      .setDescription(`You have received a warning in **Frontline Networks**.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Issued by', value: interaction.user.tag },
      )
      .setTimestamp();

    await target.send({ embeds: [embed] }).catch(() => {});
    await modLog(client, 'WARN', target.user, interaction.member, reason);
    await interaction.reply({ content: `⚠️ **${target.user.tag}** has been warned.\n**Reason:** ${reason}`, ephemeral: true });
  }
};
