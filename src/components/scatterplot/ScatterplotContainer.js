import './Scatterplot.css'
import { useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import ScatterplotD3 from './Scatterplot-d3';
import {setXAxis, setYAxis, updateSelectedItem} from "../../redux/ControlBarSlice";

// Lista delle variabili numeriche che l'utente può scegliere
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
function ScatterplotContainer(){
    const dispatch = useDispatch();
    const bikeData = useSelector(state => state.dataSet.data); // Ottieni il dataset di biciclette
    const xAxis = useSelector(state => state.controlbar.xAxis); // Ottieni l'asse X dal Redux store
    const yAxis = useSelector(state => state.controlbar.yAxis); // Ottieni l'asse Y dal Redux store

    // every time the component re-render
    useEffect(()=>{
        console.log("ScatterplotContainer useEffect (called each time render)");
    }); // if no dependencies, useEffect is called at each re-render
    
    const divContainerRef=useRef(null);
    const scatterplotD3Ref = useRef(null)
    
    const getCharSize = function(){
        // fixed size
        // return {width:900, height:900};
        // getting size from parent item
        let width;// = 800;
        let height;// = 100;
        if(divContainerRef.current!==undefined){
        width=divContainerRef.current.offsetWidth;
        // width = '100%';
        height=divContainerRef.current.offsetHeight;
        // height = '100%';
        }
        return {width:width,height:height};
    }

    // did mount called once the component did mount
    useEffect(()=>{
        console.log("ScatterplotContainer useEffect [] called once the component did mount");
        const scatterplotD3 = new ScatterplotD3(divContainerRef.current);
        scatterplotD3.create({size:getCharSize()});
        scatterplotD3Ref.current = scatterplotD3;
        return ()=>{
            // did unmout, the return function is called once the component did unmount (removed for the screen)
            console.log("ScatterplotContainer useEffect [] return function, called when the component did unmount...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear()
        }
    },[]);// if empty array, useEffect is called after the component did mount (has been created)

    useEffect(() => {
        console.log("ScatterplotContainer: Updating data...");
        console.log("Selected X Axis:", xAxis, "Selected Y Axis:", yAxis); // Log degli assi selezionati
        console.log("Bike data:", bikeData); // Log dei dati delle biciclette

        // Verifica che i dati e gli assi non siano vuoti o non validi
        if (bikeData && xAxis && yAxis) {
            // Converte i dati in numerici se non lo sono
            const validBikeData = bikeData.filter(item => !isNaN(item[xAxis]) && !isNaN(item[yAxis]));

            if (validBikeData.length === 0) {
                console.error("No valid data for selected axes.");
                return;
            }

            console.log("Valid data to render:", validBikeData);

            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.renderScatterplot(validBikeData, xAxis, yAxis, {
                handleOnClick: (pointData) => {
                    //alert("Clicked point:", pointData); // Log del punto cliccato
                    alert(`Clicked point: X = ${pointData[xAxis]}, Y = ${pointData[yAxis]}`);
                }
            });
        } else {
            console.warn("No data available for selected axes.");
        }
    },[bikeData, xAxis, yAxis, dispatch]); // Aggiornamento ogni volta che i dati o gli assi cambiano

    return(
        <div ref={divContainerRef} className="scatterplotDivContainer col2"></div>
    )
}

export default ScatterplotContainer;