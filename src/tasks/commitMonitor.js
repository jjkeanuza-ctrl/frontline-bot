const { EmbedBuilder } = require('discord.js');

const GITHUB_USER = 'YOUR_GITHUB_USERNAME';
const GITHUB_REPO = 'frontline-bot';
const COMMITS_CHANNEL = '1513246915263991928';
const CHECK_INTERVAL = 5 * 60 * 1000; // every 5 minutes

let lastCommitSha = null;

async function fetchLatestCommits() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?per_page=5`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FrontlineBot/1.0',
      }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('GitHub fetch error:', err);
    return null;
  }
}

async function startCommitMonitor(client) {
  async function check() {
    try {
      const commits = await fetchLatestCommits();
      if (!commits || !commits.length) return;

      const latest = commits[0];
      if (latest.sha === lastCommitSha) return;

      // First run — just store the sha, don't announce old commits
      if (!lastCommitSha) {
        lastCommitSha = latest.sha;
        console.log(`Commit monitor started. Latest commit: ${latest.sha.slice(0, 7)}`);
        return;
      }

      // Find all new commits since last known sha
      const newCommits = [];
      for (const commit of commits) {
        if (commit.sha === lastCommitSha) break;
        newCommits.push(commit);
      }

      if (!newCommits.length) return;

      lastCommitSha = commits[0].sha;

      const channel = await client.channels.fetch(COMMITS_CHANNEL).catch(() => null);
      if (!channel) return;

      // Post newest last so they read top to bottom in order
      for (const commit of newCommits.reverse()) {
        const sha = commit.sha.slice(0, 7);
        const message = commit.commit.message.split('\n')[0];
        const author = commit.commit.author.name;
        const date = new Date(commit.commit.author.date);
        const url = commit.html_url;

        const embed = new EmbedBuilder()
          .setColor(0x4fc3f7)
          .setTitle(`📦 New Commit — \`${sha}\``)
          .setDescription(`\`\`\`${message}\`\`\``)
          .addFields(
            { name: '👤 Author', value: author, inline: true },
            { name: '📁 Repository', value: `${GITHUB_USER}/${GITHUB_REPO}`, inline: true },
            { name: '🔗 View', value: `[Open on GitHub](${url})`, inline: true },
          )
          .setFooter({ text: 'Frontline Networks • GitHub' })
          .setTimestamp(date);

        await channel.send({ embeds: [embed] });
      }

    } catch (err) {
      console.error('Commit monitor error:', err);
    }
  }

  await check();
  setInterval(check, CHECK_INTERVAL);
}

module.exports = { startCommitMonitor };
