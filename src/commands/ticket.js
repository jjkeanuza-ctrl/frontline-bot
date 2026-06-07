const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { nextTicket } = require('../utils/counter');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a support ticket with Frontline Networks staff')
    .addStringOption(opt =>
      opt.setName('reason')
        .setDescription('Brief reason for opening this ticket')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const user = interaction.member;
    const reason = interaction.options.getString('reason');
    const num = nextTicket();
    const channelName = `ticket-fn${num}`;

    const SENIOR_ROLES = [process.env.SENIOR_ROLE_1, process.env.SENIOR_ROLE_2];
    const MOD_ROLE = process.env.MOD_ROLE;

    const permOverwrites = [
      { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      {
        id: user.id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
      },
      ...SENIOR_ROLES.map(r => ({
        id: r,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageMessages],
      })),
      {
        id: MOD_ROLE,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
      },
    ];

    let ticketChannel;
    try {
      ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: permOverwrites,
        topic: `Ticket #${num} — ${user.user.tag} — ${reason}`,
      });
    } catch (err) {
      console.error('Failed to create ticket channel:', err);
      return interaction.editReply({ content: '❌ Could not create your ticket channel. Please contact staff directly.' });
    }

    const embed = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle(`🎫 Ticket #FN${num}`)
      .setDescription(`Hey ${user}! A staff member will be with you shortly.\n\nPlease describe your issue in as much detail as possible.`)
      .addFields(
        { name: 'Opened by', value: `${user.user.tag}`, inline: true },
        { name: 'Ticket #', value: `FN${num}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setFooter({ text: 'Frontline Networks Support' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ticket_close_${ticketChannel.id}_${user.id}`)
        .setLabel('🔒 Close Ticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`ticket_claim_${ticketChannel.id}_${user.id}`)
        .setLabel('✋ Claim')
        .setStyle(ButtonStyle.Primary),
    );

    await ticketChannel.send({ content: `${user} — <@&${process.env.MOD_ROLE}>`, embeds: [embed], components: [row] });
    await interaction.editReply({ content: `✅ Your ticket has been created: ${ticketChannel}` });
  }
};
