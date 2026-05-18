const axios = require('axios');
const fs = require('fs');
const path = require('path');
const settings = require('../../config/settings');

const { authBase } = settings.allegro;
const { tokens: tokensPath } = settings.paths;

function getCredentials() {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      'Brak ALLEGRO_CLIENT_ID lub ALLEGRO_CLIENT_SECRET w pliku .env'
    );
  }
  return { clientId, clientSecret };
}

function basicAuthHeader(clientId, clientSecret) {
  return 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
}

// Krok 1 device flow: pobierz device_code i URL do zatwierdzenia przez uzytkownika
async function startDeviceFlow() {
  const { clientId, clientSecret } = getCredentials();

  const response = await axios.post(
    `${authBase}/device`,
    new URLSearchParams({ client_id: clientId }),
    {
      headers: {
        Authorization: basicAuthHeader(clientId, clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: settings.allegro.requestTimeoutMs,
    }
  );

  return {
    deviceCode: response.data.device_code,
    userCode: response.data.user_code,
    verificationUri: response.data.verification_uri_complete || response.data.verification_uri,
    expiresIn: response.data.expires_in,
    interval: response.data.interval || settings.deviceFlowPollIntervalSec,
  };
}

// Krok 2 device flow: odpytuj Allegro az uzytkownik zatwierdzi w przegladarce
async function pollForToken(deviceCode, intervalSec) {
  const { clientId, clientSecret } = getCredentials();
  const timeoutMs = settings.deviceFlowTimeoutSec * 1000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    await sleep(intervalSec * 1000);

    try {
      const response = await axios.post(
        `${authBase}/token`,
        new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code: deviceCode,
        }),
        {
          headers: {
            Authorization: basicAuthHeader(clientId, clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: settings.allegro.requestTimeoutMs,
        }
      );

      return response.data;
    } catch (err) {
      const errorCode = err.response?.data?.error;
      if (errorCode === 'authorization_pending') {
        continue;
      }
      if (errorCode === 'slow_down') {
        intervalSec += 5;
        continue;
      }
      if (errorCode === 'expired_token') {
        throw new Error('Czas na zatwierdzenie minal. Uruchom program ponownie.');
      }
      throw err;
    }
  }

  throw new Error('Timeout: uzytkownik nie zatwierdzil autoryzacji w czasie.');
}

function saveTokens(tokenData) {
  const dir = path.dirname(tokensPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const payload = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + tokenData.expires_in,
  };

  fs.writeFileSync(tokensPath, JSON.stringify(payload, null, 2), 'utf8');
}

function loadTokens() {
  if (!fs.existsSync(tokensPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  } catch {
    return null;
  }
}

async function refreshTokens(refreshToken) {
  const { clientId, clientSecret } = getCredentials();

  const response = await axios.post(
    `${authBase}/token`,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: basicAuthHeader(clientId, clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: settings.allegro.requestTimeoutMs,
    }
  );

  return response.data;
}

async function refreshIfNeeded(tokens) {
  const nowSec = Math.floor(Date.now() / 1000);
  if (tokens.expires_at - nowSec > 60) return tokens;

  console.log('[auth] Token wygasa wkrotce - odswiezam...');
  const fresh = await refreshTokens(tokens.refresh_token);
  saveTokens(fresh);
  console.log('[auth] Token odswiezony.');
  return loadTokens();
}

async function getValidToken() {
  let tokens = loadTokens();

  if (!tokens) {
    console.log('\n[auth] Brak zapisanych tokenow - uruchamiam autoryzacje Allegro.\n');
    const flow = await startDeviceFlow();

    console.log('Otworz ponizszy link w przegladarce i zatwierdz dostep dla aplikacji:');
    console.log(`\n  ${flow.verificationUri}\n`);
    if (flow.userCode) {
      console.log(`Kod weryfikacyjny (wpisz na stronie jesli wymagany): ${flow.userCode}\n`);
    }
    console.log('Czekam na zatwierdzenie...');

    const tokenData = await pollForToken(flow.deviceCode, flow.interval);
    saveTokens(tokenData);
    console.log('[auth] Autoryzacja zakonczona. Tokeny zapisane.\n');
    tokens = loadTokens();
  }

  tokens = await refreshIfNeeded(tokens);
  return tokens.access_token;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { getValidToken, saveTokens, loadTokens };
