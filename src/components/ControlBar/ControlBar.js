import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSeoulBikeData } from '../../redux/DataSetSlice';
import {setXAxis, setYAxis} from '../../redux/ControlBarSlice';


// Lista of numerical variables
const numericVariables = [
    'RentedBikeCount',
    'Hour',
    'Temperature',
    'Humidity',
    'WindSpeed',
    'Visibility',
    'DewPointTemperature',
    'SolarRadiation',
    'Rainfall',
    'Snowfall'
  ];

function ControlBar(){
    const dispatch = useDispatch();

    // Select axis
    const xAxis = useSelector(state => state.controlbar.xAxis);
    const yAxis = useSelector(state => state.controlbar.yAxis);

    // function to change X
    const handleXAxisChange = (event) => {
        dispatch(setXAxis(event.target.value)); // Cambia l'asse X
    };

    // Function to change Y
    const handleYAxisChange = (event) => {
        dispatch(setYAxis(event.target.value)); // Cambia l'asse Y
    };

    return (
        <div className="control-bar">
          <div className="control-item">
            <label htmlFor="xAxisSelect">Scegli Asse X:</label>
            <select id="xAxisSelect" value={xAxis} onChange={handleXAxisChange}>
              {numericVariables.map((variable) => (
                <option key={variable} value={variable}>
                  {variable}
                </option>
              ))}
            </select>
          </div>
    
          <div className="control-item">
            <label htmlFor="yAxisSelect">Scegli Asse Y:</label>
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