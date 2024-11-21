import './Scatterplot.css'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScatterplotD3 from './Scatterplot-d3';
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

    //Size 
    const getCharSize = function () {
        let width;
        let height;
        if (divContainerRef.current !== undefined) {
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight;
        }
        return { width: width, height: height };
    }

    //mount
    useEffect(() => {
        const scatterplotD3 = new ScatterplotD3(divContainerRef.current, dispatch);
        scatterplotD3.create({ size: getCharSize() });
        scatterplotD3Ref.current = scatterplotD3;
        return () => {
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear();
        }
    }, []); 

    //rendering
    useEffect(() => {
        if (bikeData && xAxis && yAxis) { //check if data exists
            const validBikeData = bikeData.filter(item => !isNaN(item[xAxis]) && !isNaN(item[yAxis])); //filter NaN
            if (validBikeData.length === 0) {
                console.error("No valid data for selected axes.");
                return;
            }
            const scatterplotD3 = scatterplotD3Ref.current;
            //call the render
            scatterplotD3.renderScatterplot(validBikeData, xAxis, yAxis, selectedItems,{
                handleOnClick: (pointData) => {
                    const pointDetails = Object.entries(pointData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n'); 
                    alert(`Clicked point details:\n${pointDetails}`); //display point information
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