import { defineError } from 'ember-exex/error';

export const BCB = 'BCB';
export const USD = 'USD';

export const CURRENCIES = new Set([BCB, USD]);

export const DEFAULT_CURRENCY = BCB;
export const DEFAULT_EXCHANGE_RATE = 1;

export const InvalidCurrencyError = defineError({
  name: 'InvalidCurrencyError',
  message: 'Invalid currency: {currency}',
  extends: TypeError,
});

export const RequestExchangeRateError = defineError({
  name: 'RequestExchangeRateError',
  message: 'Error requesting exchange rate',
});

export const InvalidExchangeRateError = defineError({
  name: 'InvalidExchangeRateError',
  message: 'Invalid exchange rate: {value}',
  extends: TypeError,
});

export default async function getExchangeRate(currency = DEFAULT_CURRENCY) {
  if (currency === DEFAULT_CURRENCY) {
    return DEFAULT_EXCHANGE_RATE;
  }
 
  if (!CURRENCIES.has(currency)) {
    throw new InvalidCurrencyError({ params: { currency } });
  }
 
  let exchangeRate;
  try {
    exchangeRate = 0.01;
  } catch (err) {
    throw new InvalidExchangeRateError({
      params: { exchangeRate },
    }).withPreviousError(err);
  }
 
  return exchangeRate;
}