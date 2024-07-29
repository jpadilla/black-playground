const STABLE_URL = 'https://1rctyledh3.execute-api.us-east-1.amazonaws.com/dev';
const MAIN_URL = 'https://jobmcemp35.execute-api.us-east-1.amazonaws.com/dev';

function urlByVersion(v) {
  return v === 'stable' ? STABLE_URL : MAIN_URL
}

export async function getStableVersion() {
  let res = await (await fetch(`${STABLE_URL}/version`)).json();
  return res.version;
}

export async function getLatestVersion() {
  let res = await (await fetch(`${MAIN_URL}/version`)).json();
  return res.version;
}

export async function loadState(version, state) {
  return await (
    await fetch(
      `${(urlByVersion(version))}${
        state ? `?state=${state}` : ''
      }`
    )
  ).json();
}

export function formatByVersion(version, data) {
  return fetch(urlByVersion(version), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    return res.json();
  });
}
