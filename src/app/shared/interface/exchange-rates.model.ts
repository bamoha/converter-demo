export interface StringNumberPair {
    [key: string]: number;
}

export interface ExchangeRatesResponse {
  base_amount: number;
  converted_amount: number;
  exchange_rate: number;
  last_updated: number;
  target: string;
  base: string;
}

export interface MappedCurrencyRateObject {
    currency: string;
    rate: number;
}

export interface Statistics {
    name: string;
    summary: number;
}
