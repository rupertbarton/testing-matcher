import React, { useEffect } from "react";
//import type * as d3Types from "./d3Types";
import * as d3 from "d3";
import dataStyle from "../dataDisplay.module.css";

export const LineChart = (props) => {
  const { data, width, height } = props;

  useEffect(() => {
    drawChart();
  }, [data]);

  function formatData(data) {
    const buyPrices = Object.keys(data.Buy);
    const sellPrices = Object.keys(data.Sell);
    const buyData = buyPrices.map((price) => {
      return {
        price: Number(price),
        volume: Number(data.Buy[price]),
      };
    });
    const sellData = sellPrices.map((price) => {
      return {
        price: Number(price),
        volume: Number(data.Sell[price]),
      };
    });
    const formattedData = { buyData, sellData };
    return formattedData;
  }

  function cumulateData(formattedData, xmin, xmax, action, aggregation = 0.2) {
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
            Math.round(i + "e2") + "e-2"
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
            Math.round(i + "e2") + "e-2"
          )}<br><b>Volume: </b>${volume}`,
        };
        cumulativeData.push(newDataPoint);
      }
    }
    return cumulativeData;
  }

  function drawChart() {
    d3.select("#depthContainer").select("svg").remove();
    d3.select("#depthContainer").select(".tooltip").remove();

    const formattedData = formatData(data);

    const margin = { top: 0, bottom: 35, left: 40, right: 5 };

    const xMinValue = d3.min(formattedData.buyData, (d) => d.price) - 1;
    const xMaxValue = d3.max(formattedData.sellData, (d) => d.price) + 1;

    const buyPoints = cumulateData(
      formattedData.buyData,
      xMinValue,
      xMaxValue,
      "Buy"
    );

    const sellPoints = cumulateData(
      formattedData.sellData,
      xMinValue,
      xMaxValue,
      "Sell"
    );

    const yMinValue = 0;
    const yMaxValue = d3.max(sellPoints, (d) => d.volume) + 5;

    const offset = yMaxValue / height;

    const buyPointsHigh = buyPoints.map((point) => {
      return { ...point, volume: point.volume + offset };
    });

    const buyPointsLow = buyPoints.map((point) => {
      return { ...point, volume: point.volume - offset };
    });

    const sellPointsHigh = sellPoints.map((point) => {
      return { ...point, volume: point.volume + offset };
    });

    const sellPointsLow = sellPoints.map((point) => {
      return { ...point, volume: point.volume - offset };
    });

    const svg = d3
      .select("#depthContainer")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([xMinValue, xMaxValue]);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([yMinValue, yMaxValue]);

    const line = d3
      .line()
      .x((d) => xScale(d.price))
      .y((d) => yScale(d.volume));

    const area = d3
      .area()
      .x((d) => xScale(d.price))
      .y0(height)
      .y1((d) => yScale(d.volume));

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", dataStyle.tooltip)
      .style("opacity", 0);

    const focus = svg
      //.select("#depthContainer")
      .append("g")
      .attr("class", "focus");

    focus
      .append("circle")
      .attr("r", 5)
      .attr("class", "circle")
      .attr("r", 3)
      .style("fill", "#f0fff0");

    function mousemove(event) {
      const bisect = d3.bisector((d) => d.price).left;
      const xPos = d3.pointer(event)[0];
      const x0 = bisect(buyPoints, xScale.invert(xPos));
      const buyPoint = buyPoints[x0];
      const sellPoint = sellPoints[x0];

      if (sellPoint.volume > buyPoint.volume) {
        const d0 = sellPoint;

        focus.style("opacity", 1);

        focus.style(
          "transform",
          `translate(${xScale(d0.price)}px,${yScale(d0.volume)}px)`
        );

        tooltip.transition().duration(50).style("opacity", 0.9);
        tooltip
          .classed(dataStyle.buy, false)
          .classed(dataStyle.sell, true)
          .html(d0.tooltipContent || d0.price)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 35 + "px");
      } else {
        const d0 = buyPoint;

        focus.style("opacity", 1);

        focus.style(
          "transform",
          `translate(${xScale(d0.price)}px,${yScale(d0.volume)}px)`
        );

        tooltip.transition().duration(50).style("opacity", 0.9);
        tooltip
          .classed(dataStyle.sell, false)
          .classed(dataStyle.buy, true)
          .html(d0.tooltipContent || d0.price)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 35 + "px");
      }
    }

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .scale(xScale)
          .ticks(width / 25)
      );

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 3)
      .style("text-anchor", "middle")
      .style("fill", "#f0fff0")
      .text("Price [GBP]");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .style("text-anchor", "middle")
      .style("fill", "#f0fff0")
      .text("Cum. Volume");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(height / 25)
          .tickSizeOuter(0)
      );

    svg
      .append("path")
      .datum(sellPointsLow)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", "#ff7b7b88");

    svg
      .append("path")
      .datum(buyPointsLow)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", "#7bff7b88");

    svg
      .append("path")
      .datum(sellPointsHigh)
      .attr("fill", "none")
      .attr("stroke", "#ff7b7b")
      .attr("stroke-width", 1)
      .attr("class", "line")
      .attr("d", line);

    svg
      .append("path")
      .datum(sellPointsLow)
      .attr("fill", "none")
      .attr("stroke", "#ff7b7b")
      .attr("stroke-width", 1)
      .attr("class", "line")
      .attr("d", line);

    svg
      .append("path")
      .datum(buyPointsHigh)
      .attr("fill", "none")
      .attr("stroke", "#7bff7b")
      .attr("stroke-width", 1)
      .attr("class", "line")
      .attr("d", line);

    svg
      .append("path")
      .datum(buyPointsLow)
      .attr("fill", "none")
      .attr("stroke", "#7bff7b")
      .attr("stroke-width", 1)
      .attr("class", "line")
      .attr("d", line);

    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("opacity", 0)
      .on("mouseover", () => {
        focus.style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      })
      .on("mousemove", mousemove);
  }

  return <div id="depthContainer" />;
};

/*export const Svg = () => {
  const ref = useRef();

  useEffect(() => {}, []);
  return (
    <svg ref={ref} style={{ border: "2px solid honeydew" }}>
      <circle cx="150" cy="70" r="50" fill="honeydew" />
    </svg>
  );
};*/
