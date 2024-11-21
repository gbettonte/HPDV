import '../scatterplot/Scatterplot.css'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScatterplotD3 from '../scatterplot/Scatterplot-d3';
import { setXAxis, setYAxis } from "../../redux/ControlBarSlice";
import { selectedItems } from "../../redux/BrushSlice";



function ScatterplotContainer() {
    const dispatch = useDispatch();
    const bikeData = useSelector(state => state.dataSet.data); 
    const xAxis = useSelector(state => state.controlbar.xAxis);
    const yAxis = useSelector(state => state.controlbar.yAxis); 
    const filterType = useSelector(state => state.controlbar.filterType); 
    const selectedItems = useSelector(state => state.brushslice.selectedItems); 

    const divContainerRef = useRef(null);
    const scatterplotD3Ref = useRef(null);

    const getCharSize = function () {
        let width;
        let height;
        if (divContainerRef.current !== undefined) {
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight;
        }
        return { width: width, height: height };
    }
    //render
    useEffect(() => {

        const scatterplotD3 = new ScatterplotD3(divContainerRef.current, dispatch);
        scatterplotD3.create({ size: getCharSize() });
        scatterplotD3Ref.current = scatterplotD3;
        return () => {

            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear();
        }
    }, []); 

    useEffect(() => {


        // Verifica che i dati filtrati siano validi e che gli assi siano selezionati
        if (bikeData && xAxis && yAxis) {
            const validBikeData = bikeData.filter(item => !isNaN(item[xAxis]) && !isNaN(item[yAxis]));

            if (validBikeData.length === 0) {
                console.error("No valid data for selected axes.");
                return;
            }

            const scatterplotD3 = scatterplotD3Ref.current;
            //check selected items
            const dataToRender = selectedItems.length > 0 ? selectedItems : validBikeData;

            scatterplotD3.renderScatterplot(dataToRender, xAxis, yAxis, selectedItems,{
                handleOnClick: (pointData) => {
                    const pointDetails = Object.entries(pointData)
                        .map(([key, value]) => `${key}: ${value}`) 
                        .join('\n'); 
                    alert(`Clicked point details:\n${pointDetails}`); //point information
                }
            });
        } else {
            console.warn("No data available for selected axes.");
        }
    });

    return (
        <div ref={divContainerRef} className="scatterplotDivContainer col2"></div>
    )
}

export default ScatterplotContainer;