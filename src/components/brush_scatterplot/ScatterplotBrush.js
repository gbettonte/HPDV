import '../scatterplot/Scatterplot.css'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScatterplotD3 from './ScatterBrush-d3';
import { setXAxis, setYAxis } from "../../redux/ControlBarSlice";
import { setSelectedItems, clearSelectedItems } from "../../redux/BrushSlice";



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
        let width, height;
        if (divContainerRef.current !== undefined) {
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight;
        }
        return { width, height };
    };

    useEffect(() => {
        console.log("ScatterplotContainer useEffect [] called once the component did mount");
        const controllerMethods = {
            bikeData: bikeData,       
            xAxis: xAxis,              
            yAxis: yAxis,            
            handleOnClick: (pointData) => {

                const pointDetails = Object.entries(pointData)
                    .map(([key, value]) => `${key}: ${value}`) 
                    .join('\n'); 
                alert(`Clicked point details:\n${pointDetails}`); //print point information
            }
        };


        const scatterplotD3 = new ScatterplotD3(divContainerRef.current, dispatch);
        scatterplotD3.create({ size: getCharSize() }, controllerMethods); 
        scatterplotD3Ref.current = scatterplotD3;

        return () => {
            console.log("ScatterplotContainer useEffect [] return function, called when the component did unmount...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear();
        }
    }); 

    useEffect(() => {


        if (bikeData && xAxis && yAxis) {

            const validBikeData = bikeData.filter(item => !isNaN(item[xAxis]) && !isNaN(item[yAxis]));

            if (validBikeData.length === 0) {
                console.error("No valid data for selected axes.");
                return;
            }

            console.log("Valid data to render (Brush):", validBikeData);

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
    });

    return (
        <div ref={divContainerRef} className="scatterplotDivContainer col2"></div>
    )
}

export default ScatterplotContainer;