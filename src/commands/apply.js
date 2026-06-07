const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { nextApplication } = require('../utils/counter');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for a staff position at Frontline Networks'),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const applicant = interaction.member;
    const num = nextApplication();
    const channelName = `staff-application-${num}`;

    const SENIOR_ROLES = [process.env.SENIOR_ROLE_1, process.env.SENIOR_ROLE_2];

    const permOverwrites = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: applicant.id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
      },
      ...SENIOR_ROLES.map(roleId => ({
        id: roleId,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageMessages],
      })),
    ];

    let appChannel;
    try {
      appChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: permOverwrites,
        topic: `Staff Application #${num} — ${applicant.user.tag}`,
      });
    } catch (err) {
      console.error('Failed to create application channel:', err);
      return interaction.editReply({ content: '❌ Could not create your application channel. Please contact staff.' });
    }

    const form = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle(`📋 Staff Application #${num}`)
      .setDescription(`Welcome **${applicant.user.username}**! Please answer every question below by typing your answers in this channel.\n\nStaff will review your application and get back to you here.`)
      .addFields(
        { name: '1️⃣  What is your in-game name?', value: '​' },
        { name: '2️⃣  How old are you?', value: '​' },
        { name: '3️⃣  What is your timezone?', value: '​' },
        { name: '4️⃣  How long have you been a member of Frontline Networks?', value: '​' },
        { name: '5️⃣  How many hours per week can you dedicate to staffing?', value: '​' },
        { name: '6️⃣  Have you had any previous staff experience? If yes, describe it.', value: '​' },
        { name: '7️⃣  Why do you want to become staff at Frontline Networks?', value: '​' },
        { name: '8️⃣  What makes you a better candidate than others?', value: '​' },
        { name: '9️⃣  Do you have any current warnings or bans on record?', value: '​' },
        { name: '🔟  Any additional information you want us to know?', value: '​' },
      )
      .setFooter({ text: 'Frontline Networks • Staff Applications' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`app_accept_${appChannel.id}_${applicant.id}`)
        .setLabel('✅ Accept')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`app_deny_${appChannel.id}_${applicant.id}`)
        .setLabel('❌ Deny')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`app_close_${appChannel.id}_${applicant.id}`)
        .setLabel('🔒 Close')
        .setStyle(ButtonStyle.Secondary),
    );

    await appChannel.send({ content: `${applicant}`, embeds: [form], components: [row] });

    const staffNotify = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle('📬 New Staff Application')
      .setDescription(`**${applicant.user.tag}** has submitted a new staff application.`)
      .addFields({ name: 'Channel', value: `${appChannel}`, inline: true }, { name: 'Application #', value: num, inline: true })
      .setTimestamp();

    const staffChannel = await client.channels.fetch(process.env.STAFF_APPS_CHANNEL).catch(() => null);
    if (staffChannel) await staffChannel.send({ embeds: [staffNotify] });

    await interaction.editReply({ content: `✅ Your application channel has been created: ${appChannel}\n\nPlease head there and answer all the questions.` });
  }
};
