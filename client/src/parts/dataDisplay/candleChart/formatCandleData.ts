import { range } from "d3-array";
import type * as types from "src/types";

export function formatCandleData(
  tradeHistory: types.trade[],
  aggregation = 2
): types.candle[] {
  const currentTime = new Date();
  let candleData: types.candle[] = [];
  const grouping = 5 * aggregation;
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
  candleData = candleData.map((d, i) => {
    return { ...d, time: new Date(2021, 9, 8, 10, i * grouping) };
  });
  // console.log(candleData.length);
  // candleData.reverse();
  // for (let i = 0; i < 100 && i < candleData.length; i++) {
  //   let time = currentTime.getTime() - grouping * i * 100000;
  //   let date = new Date();
  //   date.setTime(time);
  //   candleData[i].time = date;
  // }
  // candleData.reverse();
  if (candleData.length < 100) {
    return candleData;
  }
  return candleData.slice(candleData.length - 100, candleData.length);
}
