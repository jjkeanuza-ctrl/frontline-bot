const { EmbedBuilder } = require('discord.js');

let statusMessageId = null;

async function queryServer() {
  const ip = process.env.GMOD_IP;
  const port = parseInt(process.env.GMOD_PORT || '27015');

  if (!ip || ip === 'YOUR_SERVER_IP') {
    return { online: false, players: 0, maxPlayers: 0, map: null };
  }

  try {
    const Gamedig = require('gamedig');
    const state = await Gamedig.query({
      type: 'garrysmod',
      host: ip,
      port: port,
    });
    return {
      online: true,
      players: state.players.length,
      maxPlayers: state.maxplayers,
      map: state.map,
      name: state.name,
    };
  } catch {
    return { online: false, players: 0, maxPlayers: 0, map: null };
  }
}

function buildEmbed(result) {
  const embed = new EmbedBuilder()
    .setColor(result.online ? 0x4fc3f7 : 0x4a6a80)
    .setTitle('📡 Frontline Networks — Server Status')
    .setDescription(result.online
      ? '🟢 **The server is online and accepting players.**'
      : '🔴 **The server is currently offline.**')
    .addFields(
      { name: '🎮 Game',    value: "Garry's Mod — PoliceRP", inline: true },
      { name: '📊 Status',  value: result.online ? '**Online**' : '**Offline**', inline: true },
      { name: '👥 Players', value: result.online ? `**${result.players}/${result.maxPlayers}**` : '**0/0**', inline: true },
      { name: '🗺️ Map',     value: result.online ? (result.map || 'Unknown') : '—', inline: true },
      { name: '🌐 Website', value: '[frontlinenetx.net](https://frontlinenetx.net)', inline: true },
    )
    .setTimestamp();

  return embed;
}

async function startStatusMonitor(client) {
  async function update() {
    try {
      const channel = await client.channels.fetch(process.env.SERVER_STATUS_CHANNEL).catch(() => null);
      if (!channel) return;

      const result = await queryServer();
      const embed = buildEmbed(result);

      if (statusMessageId) {
        const existing = await channel.messages.fetch(statusMessageId).catch(() => null);
        if (existing) {
          await existing.edit({ embeds: [embed] });
          return;
        }
      }

      await channel.bulkDelete(10, true).catch(() => {});
      const msg = await channel.send({ embeds: [embed] });
      statusMessageId = msg.id;

    } catch (err) {
      console.error('Status monitor error:', err);
    }
  }

  await update();
  setInterval(update, 60 * 1000);
}

module.exports = { startStatusMonitor, queryServer };
