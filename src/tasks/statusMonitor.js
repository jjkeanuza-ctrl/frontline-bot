const { EmbedBuilder } = require('discord.js');

const WORKER_URL = 'https://frontline-status.jjkeanuza.workers.dev';

let statusMessageId = null;

// Query via the same Cloudflare Worker the website uses — single source of truth
async function queryServer() {
  try {
    const res = await fetch(WORKER_URL, {
      headers: { 'User-Agent': 'FrontlineBot/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Worker returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Status query failed:', err.message);
    return { online: false, players: 0, maxplayers: 0, map: null, name: null, gamemode: null };
  }
}

function buildEmbed(data) {
  const embed = new EmbedBuilder()
    .setColor(data.online ? 0x4fc3f7 : 0x4a6a80)
    .setTitle('📡 Frontline Networks — Server Status')
    .setDescription(data.online
      ? '🟢 **The server is online and accepting players.**'
      : '🔴 **The server is currently offline.**')
    .addFields(
      { name: '🎮 Game',     value: "Garry's Mod",                                       inline: true },
      { name: '📊 Status',   value: data.online ? '**Online**' : '**Offline**',          inline: true },
      { name: '👥 Players',  value: data.online ? `**${data.players}/${data.maxplayers}**` : '**0/0**', inline: true },
      { name: '🕹️ Gamemode', value: data.online && data.gamemode ? `**${data.gamemode}**` : '—',  inline: true },
      { name: '🗺️ Map',      value: data.online && data.map      ? `**${data.map}**`     : '—',  inline: true },
      { name: '🌐 Website',  value: '[frontlinenetx.net](https://frontlinenetx.net)',    inline: true },
    )
    .setTimestamp();

  if (data.online && data.name) {
    embed.setFooter({ text: data.name });
  }

  return embed;
}

async function startStatusMonitor(client) {
  async function update() {
    try {
      const channel = await client.channels.fetch(process.env.SERVER_STATUS_CHANNEL).catch(() => null);
      if (!channel) { console.warn('Status channel not found'); return; }

      const data  = await queryServer();
      const embed = buildEmbed(data);

      // Try to edit existing message first
      if (statusMessageId) {
        const existing = await channel.messages.fetch(statusMessageId).catch(() => null);
        if (existing) {
          await existing.edit({ embeds: [embed] });
          return;
        }
      }

      // No existing message — clear channel and post fresh
      await channel.bulkDelete(10, true).catch(() => {});
      const msg = await channel.send({ embeds: [embed] });
      statusMessageId = msg.id;

    } catch (err) {
      console.error('Status monitor error:', err.message);
    }
  }

  // Run immediately then every 60 seconds
  await update();
  setInterval(update, 60 * 1000);
}

module.exports = { startStatusMonitor, queryServer };
