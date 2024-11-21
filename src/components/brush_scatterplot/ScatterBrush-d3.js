import * as d3 from 'd3'
import {setSelectedItems, clearSelectedItems} from "../../redux/BrushSlice";


class ScatterplotD3 {
    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    defaultOpacity = 0.3;
    transitionDuration = 1;
    circleRadius = 3;
    xScale;
    yScale;
    colorScale;

    constructor(el, dispatch) {
        this.el = el;
        this.dispatch = dispatch;  
        this.colorScale = d3.scaleOrdinal()
            .domain(['Spring', 'Summer', 'Autumn', 'Winter'])
            .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
    }

    create(config, controllerMethods) {
        this.size = {width: config.size.width, height: config.size.height};
    
        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;
    
        // initialize the svg and keep it in a class property to reuse it in renderMatrix()
        this.matSvg = d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class", "matSvgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
    
        // build xAxisG
        this.matSvg.append("g")
            .attr("class", "xAxisG")
            .attr("transform", "translate(0," + this.height + ")");
        this.matSvg.append("g")
            .attr("class", "yAxisG");

        this.createBrush(controllerMethods); 
    }
    

    createBrush(controllerMethods) {
        const brush = d3.brush()
            .extent([[0, 0], [this.width, this.height]])  
            .on("end", (event) => {

                if (!controllerMethods.bikeData || controllerMethods.bikeData.length === 0) {
                    console.error("Bike data is not available yet.");
                    return; 
                }
    

                this.handleBrush(event, controllerMethods, controllerMethods.xAxis, controllerMethods.yAxis, controllerMethods.bikeData);
            });
    

        this.matSvg.append("g")
            .attr("class", "brush")
            .call(brush);
    }
    
    
    
    
    handleBrush(event, controllerMethods, xAxis, yAxis, bikeData) {
        if (!event.selection) {
            console.warn("No selection made in the brush area.");
            return;  
        }
    
        const [[x0, y0], [x1, y1]] = event.selection;
    

        console.log("xAxis:", xAxis, "yAxis:", yAxis);
        console.log("Selection limits:", [x0, y0], [x1, y1]);
    

        if (!this.xScale || !this.yScale) {
            console.error("Scale functions not found. Cannot apply the brush selection.");
            return;
        }
    

        const scaledX0 = this.xScale.invert(x0);
        const scaledY0 = this.yScale.invert(y0);
        const scaledX1 = this.xScale.invert(x1);
        const scaledY1 = this.yScale.invert(y1);
    
        //ordrr index
        const [yMin, yMax] = scaledY0 > scaledY1 ? [scaledY1, scaledY0] : [scaledY0, scaledY1];
    
        //logs
        console.log("Corrected Y selection:", yMin, yMax);
    
        ///Veirfy axis
        if (!xAxis || !yAxis) {
            console.error("xAxis or yAxis is not defined.");
            return;
        }
    
        const brushedData = bikeData.filter(d => {
            const xValue = Number(d[xAxis]);
            const yValue = Number(d[yAxis]);
    
            //control logs
            console.log(`Original point: x: ${d[xAxis]}, y: ${d[yAxis]}`);
            console.log(`Converted point: x: ${xValue}, y: ${yValue}`);
            console.log(`Filtering point: x: ${xValue}, y: ${yValue}`);
    
            //check data
            return !isNaN(xValue) && !isNaN(yValue) && xValue >= scaledX0 && xValue <= scaledX1 && yValue >= yMin && yValue <= yMax;
        });

        console.log("Brushed Data:", brushedData);
    
        if (brushedData.length > 0) {
            this.dispatch(setSelectedItems(brushedData)); //update Redux store
        } else {
            console.warn("No valid data found for the selected area.");
        }
    }
    
    changeBorderAndOpacity(selection){
        selection.style("opacity", (item)=>{
            return item.selected?1:this.defaultOpacity;
        })
        ;

        selection.select(".dotCircle")
            .attr("stroke-width",(item)=>{
                return item.selected?2:0;
            })
        ;
    }
    
    updateDots(selection, xAttribute, yAttribute) {
        selection.transition().duration(this.transitionDuration)
            .attr("transform", (item) => {
                const xPos = this.xScale(item[xAttribute]);
                const yPos = this.yScale(item[yAttribute]);
                return "translate(" + xPos + "," + yPos + ")";
            });

        selection.select(".dotCircle")
            .attr("fill", (item) => this.colorScale(item.Seasons));

        this.changeBorderAndOpacity(selection);
    }

    updateAxis(visData, xAttribute, yAttribute) {
        const paddingFactor = 0.1; 

        const minX = d3.min(visData.map(item => item[xAttribute]));
        const maxX = d3.max(visData.map(item => item[xAttribute]));
        const xPadding = (maxX - minX) * paddingFactor;
        this.xScale.domain([minX - xPadding, maxX + xPadding]); 
        

        const minY = d3.min(visData.map(item => item[yAttribute]));
        const maxY = d3.max(visData.map(item => item[yAttribute]));
        const yPadding = (maxY - minY) * paddingFactor;
        this.yScale.domain([minY - yPadding, maxY + yPadding]); 

        this.matSvg.select(".xAxisG")
            .transition()
            .duration(this.transitionDuration)
            .call(d3.axisBottom(this.xScale));
        
        this.matSvg.select(".yAxisG")
            .transition()
            .duration(this.transitionDuration)
            .call(d3.axisLeft(this.yScale));
        
    }

    renderScatterplot(visData, xAttribute, yAttribute, controllerMethods) {
        this.updateAxis(visData, xAttribute, yAttribute);

        this.matSvg.selectAll(".dotG")
            .data(visData, (itemData) => itemData.index)
            .join(
                enter => {
                    const itemG = enter.append("g")
                        .attr("class", "dotG")
                        .style("opacity", this.defaultOpacity)
                        .on("click", (event, itemData) => {
                            controllerMethods.handleOnClick(itemData);
                        });

                    itemG.append("circle")
                        .attr("class", "dotCircle")
                        .attr("r", this.circleRadius)
                        .attr("stroke", "red")
                        .attr("fill", (item) => this.colorScale(item.Seasons));

                    this.updateDots(itemG, xAttribute, yAttribute);
                },
                update => {
                    this.updateDots(update, xAttribute, yAttribute);
                },
                exit => {
                    exit.remove();
                }
            );
    }

    clear() {
        d3.select(this.el).selectAll("*").remove();
    }
}

export default ScatterplotD3;