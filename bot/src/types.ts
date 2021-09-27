export interface aggregatedOB {
  Buy: { [price: number]: number };
  Sell: { [price: number]: number };
}

export interface order {
  username: string;
  action: string;
  volume: number;
  price: number;
}

export interface resorder {
  action: string;
  username: string;
  volume: number;
  price: number;
  timestamp: string;
  id: number;
}

export interface trade {
  buyer: string;
  seller: string;
  volume: number;
  price: number;
  timestamp: string;
  id: number;
}

export interface aggregatedOB {
  Buy: { [price: number]: number };
  Sell: { [price: number]: number };
}

export interface personalOB {
  Buy: resorder[];
  Sell: resorder[];
}

export interface balances {
  GBP: number;
  BTC: number;
}

export interface userData {
  GBP: number;
  BTC: number;
}

export interface incomingresponse {
  aggregatedOrderBook: aggregatedOB;
  personalOrderBook: personalOB;
  tradeHistory: trade[];
  userData: { gbp: number; btc: number };
}

export interface response {
  aggregatedOrderBook: aggregatedOB;
  personalOrderBook: personalOB;
  tradeHistory: trade[];
  userData: userData;
}
