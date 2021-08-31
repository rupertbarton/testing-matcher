import type * as types from "src/types";

export function formatCandleData(tradeHistory: types.trade[]): types.candle[] {
  let candleData: types.candle[] = [];
  const grouping = 10;
  for (let i = 0; i * grouping < tradeHistory.length; i++) {
    const sample = tradeHistory.slice(grouping * i, grouping * (i + 1) + 1);
    const direction =
      sample[sample.length - 1].price < sample[0].price
        ? "down"
        : sample[sample.length - 1].price > sample[0].price
        ? "up"
        : "flat";
    const tradeOpen = sample[0].price;
    const tradeClose = sample[sample.length - 1].price;
    sample.sort((a, b) => a.price - b.price);
    const low = sample[0].price;
    const high = sample[sample.length - 1].price;
    const candle: types.candle = {
      direction,
      high,
      open: tradeOpen,
      close: tradeClose,
      low,
    };

    candleData.push(candle);
  }
  return candleData;
}
