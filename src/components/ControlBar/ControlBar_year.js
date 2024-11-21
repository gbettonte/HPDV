import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setYear} from "../../redux/ControlBarSlice"; // Correzione: `setFilterType` invece di `filterType`

// Lista delle variabili numeriche
const numericVariables = [
    "YEAR 2018",
    "YEAR 2017",
];


function ControlBar_year() {
  const dispatch = useDispatch();

  // Selectors
  const Year = useSelector((state) => {  console.log("State in ControlBar_year:", state.controlbar);
    return state.controlbar.Year;});

  // Funzione per cambiare l'asse X
  const handleYearChange = (event) => {
    dispatch(setYear(event.target.value)); // Cambia l'asse X
  };


  return (
    <div className="control-bar">
      <div className="control-item">
        <label htmlFor="year1Select">Year1:</label>
        <select id="year1Select" value={Year} onChange={handleYearChange}>
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

export default ControlBar_year;
