export type orderAction = "Buy" | "Sell";
export type currency = "GBP" | "BTC";

export interface order {
  action: orderAction;
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

export type orderkey =
  | "action"
  | "username"
  | "volume"
  | "price"
  | "timestamp"
  | "id";

export type tradekey =
  | "buyer"
  | "seller"
  | "volume"
  | "price"
  | "timestamp"
  | "id";

export type currentObject = order | trade | undefined;

export interface settingsState {
  currentObject: currentObject;
}

export interface aggregatedOB {
  Buy: { [price: number]: number };
  Sell: { [price: number]: number };
}

export interface personalOB {
  Buy: order[];
  Sell: order[];
}

export interface balances {
  GBP: number;
  BTC: number;
}

export interface matcherState {
  aggregatedOrderBook: aggregatedOB;
  personalOrderBook: personalOB;
  tradeHistory: trade[];
}

export interface userState {
  userList: string[];
  currentUser: string;
  userBalance: balances;
}

export interface action<payloadType> {
  type: string;
  payload: payloadType;
}

export interface emptyAction {
  type: string;
}

export interface userData {
  GBP: number;
  BTC: number;
}

export interface response {
  aggregatedOrderBook: aggregatedOB;
  personalOrderBook: personalOB;
  tradeHistory: trade[];
  userData: userData;
}

export interface anonResponse {
  aggregatedOrderBook: aggregatedOB;
  tradeHistory: trade[];
}
