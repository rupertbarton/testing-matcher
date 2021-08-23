export interface order {
  action: "Buy" | "Sell";
  username: string;
  volume: number;
  price: number;
  timestamp: Date;
  id: string;
}

export interface trade {
  buyer: string;
  seller: string;
  volume: number;
  price: number;
  timestamp: Date;
  id: string;
}

export interface aggregatedOB {
  Buy: { [price: number]: number };
  Sell: { [price: number]: number };
}

export interface personalOB {
  Buy: order[];
  Sell: order[];
}

export interface matcherState {
  aggregatedOrderBook: aggregatedOB;
  personalOrderBook: personalOB;
  tradeHistory: trade[];
}
