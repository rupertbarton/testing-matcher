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
