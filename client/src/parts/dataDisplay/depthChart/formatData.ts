import type * as types from "src/types";

export function formatData(data: types.aggregatedOB): types.formattedData {
  const buyPrices = Object.keys(data.Buy);
  const sellPrices = Object.keys(data.Sell);
  const buyData = buyPrices.map((price) => {
    return {
      price: Number(price),
      volume: Number(data.Buy[Number(price)]),
    };
  });
  const sellData = sellPrices.map((price) => {
    return {
      price: Number(price),
      volume: Number(data.Sell[Number(price)]),
    };
  });
  const formattedData = { buyData, sellData };
  return formattedData;
}

export function cumulateData(
  formattedData: types.formattedDatum[],
  xmin: number,
  xmax: number,
  action: types.orderAction,
  aggregation = 0.01
) {
  let cumulativeData = [];
  for (let i = Math.floor(xmin); i < xmax + 1; i += aggregation) {
    if (action === "Sell") {
      const lowerPrice = formattedData.filter((datum) => datum.price <= i);
      let volume = 0;
      for (let datum of lowerPrice) {
        volume += datum.volume;
      }
      const newDataPoint = {
        price: i,
        volume: volume,
        tooltipContent: `<span>Sell orders</span><br><b>Price: </b>${Number(
          Math.round(Number(i + "e2")) + "e-2"
        )}<br><b>Volume: </b>${volume}</div>`,
      };
      cumulativeData.push(newDataPoint);
    } else if (action === "Buy") {
      const higherPrice = formattedData.filter((datum) => datum.price >= i);
      let volume = 0;
      for (let datum of higherPrice) {
        volume += datum.volume;
      }
      const newDataPoint = {
        price: i,
        volume: volume,
        tooltipContent: `<span>Buy orders</span><br><b>Price: </b>${Number(
          Math.round(Number(i + "e2")) + "e-2"
        )}<br><b>Volume: </b>${volume}`,
      };
      cumulativeData.push(newDataPoint);
    }
  }
  return cumulativeData;
}
