const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { isSenior, isMod } = require('../utils/permissions');
const { modLog } = require('../utils/modLog');

async function handleButton(interaction, client) {
  const id = interaction.customId;

  // ── APPLICATION BUTTONS ──
  if (id.startsWith('app_')) {
    const [, action, channelId, applicantId] = id.split('_');

    if (!isSenior(interaction.member)) {
      return interaction.reply({ content: '🚫 Only Senior Staff can action applications.', ephemeral: true });
    }

    const appChannel = await client.channels.fetch(channelId).catch(() => null);
    const applicant = await interaction.guild.members.fetch(applicantId).catch(() => null);

    if (action === 'accept') {
      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle('✅ Application Accepted')
        .setDescription(`Congratulations **${applicant?.user.username || 'Applicant'}**! Your staff application has been **accepted**.\n\nWelcome to the Frontline Networks team. A senior staff member will be in touch shortly with next steps.`)
        .setFooter({ text: `Accepted by ${interaction.user.tag}` })
        .setTimestamp();

      await appChannel?.send({ embeds: [embed] });
      await applicant?.send(`✅ Your staff application at **Frontline Networks** has been **accepted**! Check ${appChannel} for details.`).catch(() => {});
      await interaction.reply({ content: `✅ Application accepted.`, ephemeral: true });

    } else if (action === 'deny') {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('❌ Application Denied')
        .setDescription(`Thank you for applying **${applicant?.user.username || 'Applicant'}**. Unfortunately your application has been **denied** at this time.\n\nYou are welcome to apply again in the future. If you have questions, please contact a staff member.`)
        .setFooter({ text: `Denied by ${interaction.user.tag}` })
        .setTimestamp();

      await appChannel?.send({ embeds: [embed] });
      await applicant?.send(`❌ Your staff application at **Frontline Networks** has been **denied**. You may apply again in the future.`).catch(() => {});
      await interaction.reply({ content: `❌ Application denied.`, ephemeral: true });

      setTimeout(async () => {
        await appChannel?.delete('Application denied — auto-cleanup').catch(() => {});
      }, 10000);

    } else if (action === 'close') {
      const embed = new EmbedBuilder()
        .setColor(0x95a5a6)
        .setTitle('🔒 Application Closed')
        .setDescription('This application has been closed by staff.')
        .setFooter({ text: `Closed by ${interaction.user.tag}` })
        .setTimestamp();

      await appChannel?.send({ embeds: [embed] });
      await interaction.reply({ content: '🔒 Application closed. Channel will delete in 10 seconds.', ephemeral: true });

      setTimeout(async () => {
        await appChannel?.delete('Application closed').catch(() => {});
      }, 10000);
    }
  }

  // ── TICKET BUTTONS ──
  if (id.startsWith('ticket_')) {
    const [, action, channelId, openerId] = id.split('_');

    if (!isMod(interaction.member)) {
      return interaction.reply({ content: '🚫 Only staff can action tickets.', ephemeral: true });
    }

    const ticketChannel = await client.channels.fetch(channelId).catch(() => null);

    if (action === 'close') {
      const embed = new EmbedBuilder()
        .setColor(0x95a5a6)
        .setTitle('🔒 Ticket Closed')
        .setDescription('This ticket has been closed. Channel will be deleted in 10 seconds.')
        .setFooter({ text: `Closed by ${interaction.user.tag}` })
        .setTimestamp();

      await ticketChannel?.send({ embeds: [embed] });
      await modLog(client, 'CLOSE', { tag: `Ticket ${channelId}`, id: channelId }, interaction.member, 'Ticket closed');
      await interaction.reply({ content: '🔒 Ticket closed.', ephemeral: true });

      setTimeout(async () => {
        await ticketChannel?.delete('Ticket closed').catch(() => {});
      }, 10000);

    } else if (action === 'claim') {
      const embed = new EmbedBuilder()
        .setColor(0x4fc3f7)
        .setTitle('✋ Ticket Claimed')
        .setDescription(`This ticket has been claimed by **${interaction.user.tag}**.\n\nThey will be assisting you shortly.`)
        .setTimestamp();

      await ticketChannel?.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ You have claimed this ticket.`, ephemeral: true });
    }
  }
}

module.exports = { handleButton };
