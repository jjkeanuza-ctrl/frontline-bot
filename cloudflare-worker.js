// Frontline Networks — GMOD Server Status Worker
// deploy at: frontline-status.jjkeanuza.workers.dev

const SERVER_IP   = '5.9.32.206';
const SERVER_PORT = 27580;

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type':                 'application/json',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    const result = await queryServer(env.STEAM_API_KEY);
    return new Response(JSON.stringify(result), { headers: corsHeaders });
  }
};

async function queryServer(apiKey) {
  if (!apiKey) {
    return offline('No Steam API key configured');
  }

  try {
    const filter = `\\addr\\${SERVER_IP}:${SERVER_PORT}`;
    const url    = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${apiKey}&filter=${encodeURIComponent(filter)}&limit=1`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'FrontlineNetworks/1.0' },
      signal:  AbortSignal.timeout(8000),
    });

    if (!res.ok) return offline(`Steam API ${res.status}`);

    const data    = await res.json();
    const servers = data?.response?.servers;

    if (!servers || servers.length === 0) return offline('Server not listed');

    const s = servers[0];

    return {
      online:     true,
      players:    s.players    ?? 0,
      maxplayers: s.max_players ?? 32,
      map:        s.map        ?? null,
      name:       s.name       ?? 'Frontline Networks',
      gamemode:   cleanGamemode(s.gametype ?? s.game ?? null),
    };

  } catch (err) {
    return offline(err.message);
  }
}

function offline(reason) {
  return { online: false, players: 0, maxplayers: 0, map: null, name: null, gamemode: null, reason };
}

function cleanGamemode(raw) {
  if (!raw) return null;

  // Steam gametype looks like: "Gm:DarkRP Gmws:248302805 Gmc:Rp Ver:260508"
  // Extract just the Gm: value
  const gmMatch = raw.match(/\bGm:([^\s,]+)/i);
  if (gmMatch) {
    return titleCase(gmMatch[1]);
  }

  // Fallback — clean the whole string
  // Remove anything that looks like "Key:Value"
  const stripped = raw
    .replace(/\b\w+:[^\s]*/g, '')  // remove Key:Value tokens
    .replace(/\s+/g, ' ')
    .trim();

  return stripped ? titleCase(stripped.split(/[\s,]+/)[0]) : null;
}

function titleCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → words
    .replace(/[_-]/g, ' ')               // underscores/dashes → spaces
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalise each word
}
