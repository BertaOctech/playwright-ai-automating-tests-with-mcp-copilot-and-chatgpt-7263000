const apiBaseUrl = process.env.BUGGYBOARD_API_URL ?? 'http://localhost:3000';
const fixturePrefix = 'Severity test fixture';
const severities = ['high', 'mid', 'low'];

const listResponse = await fetch(`${apiBaseUrl}/api/bugs`);
if (!listResponse.ok) {
  throw new Error(`Could not list bugs: ${listResponse.status} ${listResponse.statusText}`);
}

const existingBugs = await listResponse.json();
const existingTitles = new Set(existingBugs.map((bug) => bug.title));

for (const severity of severities) {
  const title = `${fixturePrefix} - ${severity.toUpperCase()}`;
  if (existingTitles.has(title)) {
    console.log(`Already exists: ${title}`);
    continue;
  }

  const response = await fetch(`${apiBaseUrl}/api/bugs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      severity,
      owner: 'buggy',
      description: `Persistent test fixture for ${severity.toUpperCase()} severity.`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Could not create ${title}: ${response.status} ${details}`);
  }

  const bug = await response.json();
  console.log(`Created: #${bug.id} ${bug.severity.toUpperCase()} ${bug.title}`);
}
