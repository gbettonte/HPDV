import '../scatterplot/Scatterplot.css'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScatterplotD3 from './ScatterBrush-d3';
import { setXAxis, setYAxis } from "../../redux/ControlBarSlice";
import { setSelectedItems, clearSelectedItems } from "../../redux/BrushSlice";

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

function ScatterplotContainer() {
    const dispatch = useDispatch();
    const bikeData = useSelector(state => state.dataSet.data); // Ottieni il dataset di biciclette
    const xAxis = useSelector(state => state.controlbar.xAxis); // Ottieni l'asse X dal Redux store
    const yAxis = useSelector(state => state.controlbar.yAxis); // Ottieni l'asse Y dal Redux store
    const filterType = useSelector(state => state.controlbar.filterType); // Ottieni il filtro dal Redux store
    const selectedItems = useSelector(state => state.brushslice.selectedItems); // Ottieni gli items selezionati tramite il brush
    const divContainerRef = useRef(null);
    const scatterplotD3Ref = useRef(null);

    const getCharSize = function () {
        let width, height;
        if (divContainerRef.current !== undefined) {
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight;
        }
        return { width, height };
    };

    useEffect(() => {
        console.log("ScatterplotContainer useEffect [] called once the component did mount");

        // Definisci controllerMethods
        const controllerMethods = {
            bikeData: bikeData,        // Dati delle biciclette
            xAxis: xAxis,              // Asse X
            yAxis: yAxis,              // Asse Y
            handleOnClick: (pointData) => {
                // Crea una stringa formattata con tutte le proprietà del punto
                const pointDetails = Object.entries(pointData)
                    .map(([key, value]) => `${key}: ${value}`) // Trasforma ogni coppia chiave-valore in una stringa
                    .join('\n'); // Unisci tutte le stringhe con un a capo per renderle leggibili

                // Mostra l'alert con i dettagli del punto
                alert(`Clicked point details:\n${pointDetails}`);
            }
        };

        // Crea l'istanza di ScatterplotD3 e passale controllerMethods
        const scatterplotD3 = new ScatterplotD3(divContainerRef.current, dispatch);
        scatterplotD3.create({ size: getCharSize() }, controllerMethods);  // Passa controllerMethods qui
        scatterplotD3Ref.current = scatterplotD3;

        return () => {
            console.log("ScatterplotContainer useEffect [] return function, called when the component did unmount...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear();
        }
    }); // useEffect eseguito solo al montaggio del componente

    useEffect(() => {


        // Filtra i dati in base al filterType (All, Holiday, FunctioningDay)
        const filteredData = (() => {
            if (filterType === "All") {
                return bikeData;
            } else if (filterType === "Holiday") {
                return bikeData.filter((point) => point.Holiday === "Holiday");
            } else if (filterType === "FunctioningDay") {
                return bikeData.filter((point) => point.FunctioningDay === "Yes");
            } else {
                return bikeData;
            }
        })();

        // Verifica che i dati filtrati siano validi e che gli assi siano selezionati
        if (filteredData && xAxis && yAxis) {
            // Converte i dati in numerici se non lo sono
            const validBikeData = filteredData.filter(item => !isNaN(item[xAxis]) && !isNaN(item[yAxis]));

            if (validBikeData.length === 0) {
                console.error("No valid data for selected axes.");
                return;
            }

            console.log("Valid data to render (Brush):", validBikeData);

            // Passa i dati e gestisci il rendering del grafico
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.renderScatterplot(validBikeData, xAxis, yAxis, {
                handleOnClick: (pointData) => {
                    const pointDetails = Object.entries(pointData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                    alert(`Clicked point details:\n${pointDetails}`);
                }
            });
        } else {
            console.warn("No data available for selected axes.");
        }
    });//, [bikeData, xAxis, yAxis, filterType, selectedItems, dispatch]); // Aggiornamento ogni volta che i dati o gli assi cambiano

    return (
        <div ref={divContainerRef} className="scatterplotDivContainer col2"></div>
    )
}

export default ScatterplotContainer;
