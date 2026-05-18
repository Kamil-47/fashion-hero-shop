const path = require('path');

const isProd = process.env.ALLEGRO_ENV !== 'sandbox';

module.exports = {
  allegro: {
    apiBase: isProd
      ? 'https://api.allegro.pl'
      : 'https://api.allegro.pl.allegrosandbox.pl',
    authBase: isProd
      ? 'https://allegro.pl/auth/oauth'
      : 'https://allegro.pl.allegrosandbox.pl/auth/oauth',
    // Ile wynikow pobrac na jedno zapytanie (max 100 wg dokumentacji Allegro)
    pageLimit: 60,
    // Timeout HTTP w ms
    requestTimeoutMs: 15000,
  },
  paths: {
    tokens: path.resolve(__dirname, '../../data/tokens.json'),
    seenOffers: path.resolve(__dirname, '../../data/seen-offers.json'),
  },
  // Ile sekund czekac miedzy kolejnymi pollami podczas device flow
  deviceFlowPollIntervalSec: 5,
  // Jak dlugo czekac na zatwierdzenie przez uzytkownika (10 minut)
  deviceFlowTimeoutSec: 600,
};
