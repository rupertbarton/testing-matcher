import React, { useEffect } from "react";
//import type * as d3Types from "./d3Types";
import * as d3 from "d3";
import dataStyle from "../dataDisplay.module.css";
import { formatCandleData } from "./formatCandleData";
import { isConstructorDeclaration } from "typescript";

export const CandleChart = (props) => {
  const { data, width, height } = props;

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    d3.select("#candleContainer").select("svg").remove();
    //d3.select("#candleContainer").select(".tooltip").remove();

    const candleData = formatCandleData(data);

    const margin = { top: 10, bottom: 18, left: 28, right: 5 };

    const xMinValue = 0;
    const xMaxValue = candleData.length * 5;
    const yMinValue = d3.min(candleData, (d) => d.low) - 0.5;
    const yMaxValue = d3.max(candleData, (d) => d.high) + 0.5;

    function mousemove(d) {
      //console.log(d);
      //candletip.html();
    }

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom / 2})`)
        .call(
          d3.axisBottom(xScale)
          /*.tickValues(
              d3.utcMonday
                .every(width > 720 ? 1 : 2)
                .range(data[0].date, data[data.length - 1].date)
            )
            .tickFormat(d3.utcFormat("%-m/%-d"))*/
        )
        .call((g) => g.select(".domain").remove());

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(yScale) //.tickFormat(d3.format("$~f")).tickValues(yScale)
        )
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - margin.left - margin.right)
        )
        .call((g) => g.select(".domain").remove());

    const svg = d3
      .select("#candleContainer")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([xMinValue, xMaxValue]);

    const yScale = d3
      .scaleLinear()
      .range([height - margin.bottom, 0])
      .domain([yMinValue, yMaxValue]);

    /*const candletip = d3
      .select("body")
      .append("div")
      .attr("class", dataStyle.tooltip)
      .style("opacity", 0);*/

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .style("fill", "#f0fff0")
      .text("Price [GBP]");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 13)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("fill", "#707070")
      .text("Trade History");

    const g = svg
      .append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke", "#f0fff0e6")
      .selectAll("g")
      .data(candleData)
      .join("g")
      .attr("transform", (d, i) => `translate(${xScale(5 * i + 2.5)},0)`);

    g.append("line")
      .attr("x", 0)
      .attr("y1", (d) => yScale(d.low))
      .attr("y2", (d) => yScale(d.high));

    g.append("line")
      .attr("y1", (d) => yScale(d.open))
      .attr("y2", (d) => yScale(d.close))
      .attr("stroke-width", 4)
      .attr("stroke", (d) =>
        d.direction === "down"
          ? d3.schemeSet1[0]
          : d.direction === "up"
          ? d3.schemeSet1[2]
          : d3.schemeSet1[8]
      );

    /*g.selectAll("g")
      .append("div")
      .attr("class", dataStyle.candletip)
      .style("opacity", 1)
      .html((d) => `<b>Open:</b>${d.open}<br><b>Close:</b>${d.close}<br>`)
      .attr(
        "transform",
        (d) => `translate(${5},${(yScale(d.high) + yScale(d.low)) / 2 - 25})`
      );

    console.log(g);*/

    g.append("rect")
      .attr("class", "overlay")
      .attr("width", 10)
      .attr("height", (d) => yScale(d.low) - yScale(d.high) + 10)
      .attr("id", (d, i) => {
        return i;
      })
      .attr("transform", (d) => `translate(${-5},${yScale(d.high) - 5})`)
      .style("opacity", 0)
      .on("mouseover", function (event, d) {
        const i = event.currentTarget.id; //this.getAttribute("index");
        d3.select("#candletip" + i)
          .transition()
          .duration(50)
          .style("opacity", "1");
        //candletip.transition().duration(200).style("opacity", 0.9);
      })
      .on("mouseout", (event, d) => {
        const i = event.currentTarget.id;
        d3.select("#candletip" + i)
          .transition()
          .duration(300)
          .style("opacity", 0);
        //candletip.transition().duration(300).style("opacity", 0);
      });

    const candletip = g
      .append("g")
      .attr("class", dataStyle.candletip)
      .attr("id", (d, i) => {
        return "candletip" + i;
      })
      .attr("transform", (d) => `translate(${-74},${yScale(d.high) - 5})`)
      .style("opacity", 0);

    d3.select("#candletip0").attr(
      "transform",
      (d) => `translate(${5},${yScale(d.high) - 5})`
    );

    candletip.append("rect").attr("class", dataStyle.candletip);

    candletip
      .append("text")
      .attr("dx", "8px")
      .attr("dy", "1.2em")
      .style("font-weight", "normal")
      .style("text-anchor", "left")
      .style("fill", "#f0fff0")
      .html((d) => `Open: £${d.open}`);
    //.html((d) => `<b>Open:</b>${d.open}</br><b>Close:</b>${d.close}</br>`); Close: £${d.close}

    candletip
      .append("text")
      .attr("dx", "8px")
      .attr("dy", "2.4em")
      .style("text-anchor", "left")
      .style("fill", "#f0fff0")
      .html((d) => `Close: £${d.close}`);

    candletip
      .append("text")
      .attr("dx", "8px")
      .attr("dy", "3.6em")
      .style("text-anchor", "left")
      .style("fill", "#f0fff0")
      .html((d) => `High: £${d.high}`);

    candletip
      .append("text")
      .attr("dx", "8px")
      .attr("dy", "4.8em")
      .style("text-anchor", "left")
      .style("fill", "#f0fff0")
      .html((d) => `Low: £${d.low}`);

    candletip.raise();
  }
  return <div id="candleContainer" />;
};
