import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { legendColor } from "d3-svg-legend";

import * as d3 from "d3";

const CalendarChart = ({ }) => {
  const chartRef = useRef();
  const data = useSelector(state => state.dataSet.data); // Ottieni il dataset di biciclette

  useEffect(() => {
    d3.select(chartRef.current).selectAll("*").remove();
  
    const width = 928;
    const cellSize = 17;
    const height = cellSize * 8;
  
// Format functions
const formatValue = d3.format("+.2%"); // Format value as percentage
const formatCount = d3.format(","); // Format count as a comma-separated number
const formatDate = d3.utcFormat("%x"); // Format date as per system locale
const formatDay = i => "S M T W T F S"[i * 2]; // days - now no offset, starting from Sunday
const formatMonth = d3.utcFormat("%b"); // Abbreviated month name

// Time handling for weeks and days
const timeWeek = d3.utcMonday; // Time starts from Monday for week calculation
const countDay = i => i; // Days stay as they are - 0 for Sunday, 6 for Saturday

  




    
    // Compute the extent of the value, ignore the outliers
    // and define a diverging and symmetric color scale.
    const max = d3.quantile(groupedData, 0.85, d => Math.abs(d.value));
    const color = d3.scaleSequential(d3.interpolatePiYG).domain([-max, +max]);
  
    // Group data by year, in reverse input order. (Since the dataset is chronological,
    // this will show years in reverse chronological order.)
    const years = d3.groups(groupedData, d => d.date.getUTCFullYear()).reverse();

  
    // A function that draws a thin white line to the left of each month.
    function pathMonth(t) {
      const d = Math.max(0, Math.min(5, countDay(t.getUTCDay())));
      const w = timeWeek.count(d3.utcYear(t), t);
      return `${d === 0 ? `M${w * cellSize},0`
          : d === 5 ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${5 * cellSize}`;
    }
  
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
  
    const year = svg.selectAll("g")
      .data(years)
      .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);
  
    year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);
  
    year.append("g")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data(d3.range(-1, 8))
      .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);
  
    year.append("g")
      .selectAll("rect")
      .data(([, values]) => values)
      .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date.getUTCDay()) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
      .append("title")
      .text(d => {'${formatDate(d.date)}'
        alert(d.count);  // Controlla il valore di d.count
        const rentedBikes = isNaN(d.value) ? 0 : d.value
        return `${formatDate(d.date)} Rented Bikes: ${formatCount(rentedBikes)}`;
      });
  
    const month = year.append("g")
      .selectAll("g")
      .data(([, values]) => d3.utcMonths(d3.utcMonth(values[0].date), values.at(-1).date))
      .join("g");
  
    month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);
  
    month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);
  
  }, [data]);

  

  return <div ref={chartRef}></div>;
};



export default CalendarChart;
