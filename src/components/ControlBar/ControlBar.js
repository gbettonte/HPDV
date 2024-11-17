import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setXAxis, setYAxis, setFilterType } from "../../redux/ControlBarSlice"; // Correzione: `setFilterType` invece di `filterType`

// Lista delle variabili numeriche
const numericVariables = [
  "RentedBikeCount",
  "Hour",
  "Temperature",
  "Humidity",
  "WindSpeed",
  "Visibility",
  "DewPointTemperature",
  "SolarRadiation",
  "Rainfall",
  "Snowfall",
];

// Lista delle opzioni di filtro
const filterOptions = ["All", "Holiday", "FunctioningDay"];

function ControlBar() {
  const dispatch = useDispatch();

  // Selectors
  const xAxis = useSelector((state) => state.controlbar.xAxis);
  const yAxis = useSelector((state) => state.controlbar.yAxis);
  const filterType = useSelector((state) => state.controlbar.filterType);

  // Funzione per cambiare l'asse X
  const handleXAxisChange = (event) => {
    dispatch(setXAxis(event.target.value)); // Cambia l'asse X
  };

  // Funzione per cambiare l'asse Y
  const handleYAxisChange = (event) => {
    dispatch(setYAxis(event.target.value)); // Cambia l'asse Y
  };

  // Funzione per cambiare il filtro
  const handleFilterChange = (event) => {
    dispatch(setFilterType(event.target.value)); // Cambia il tipo di filtro
  };

  return (
    <div className="control-bar">
      <div className="control-item">
        <label htmlFor="xAxisSelect">Select variable for X axis:</label>
        <select id="xAxisSelect" value={xAxis} onChange={handleXAxisChange}>
          {numericVariables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </select>
      </div>

      <div className="control-item">
        <label htmlFor="yAxisSelect">Select variable for Y axis:</label>
        <select id="yAxisSelect" value={yAxis} onChange={handleYAxisChange}>
          {numericVariables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
}

export default ControlBar;
