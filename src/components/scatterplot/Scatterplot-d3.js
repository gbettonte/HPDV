import * as d3 from 'd3'
import { getDefaultFontSize } from '../../utils/helper';

class ScatterplotD3{
    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    // add specific class properties used for the vis render/updates
    defaultOpacity=0.3;
    transitionDuration=1;
    circleRadius = 3;
    xScale;
    yScale;

    constructor(el) {
        this.el = el;
    
        // Definisci la scala di colori per la variabile "Seasons"
        this.colorScale = d3.scaleOrdinal()
            .domain(['Spring', 'Summer', 'Autumn', 'Winter']) // Valori categoriali
            .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']); // Colori corrispondenti
    }
    
    

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};

        // get the effect size of the view by subtracting the margin
        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;

        // initialize the svg and keep it in a class property to reuse it in renderMatrix()
        this.matSvg=d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class","matSvgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        ;
        //console.log("SVG created:", this.matSvg); // Log per verificare la creazione dell'elemento SVG


        this.xScale = d3.scaleLinear().range([0,this.width]);
        this.yScale = d3.scaleLinear().range([this.height,0]);

        // build xAxisG
        this.matSvg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0,"+this.height+")")
        ;
        this.matSvg.append("g")
            .attr("class","yAxisG")
        ;
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

    updateDots(selection,xAttribute,yAttribute, selectedItems){
        // transform selection
        selection
            .transition().duration(this.transitionDuration)
            .attr("transform", (item)=>{
                // use scales to return shape position from data values
                const xPos = this.xScale(item[xAttribute]);
                const yPos = this.yScale(item[yAttribute]);
                return "translate("+xPos+","+yPos+")";
            })
        selection.select(".dotCircle")
        .attr("fill", (item) => {
            // Check if the current item is in selectedItems
            if (selectedItems.find(selectedItem => selectedItem.index === item.index)) {
                return this.colorScale(item.Seasons);  // Color for selected items
            }
            return 'black'; // Default color scale
        });
        this.changeBorderAndOpacity(selection)
    }

    highlightSelectedItems(selectedItems){
        const selectedIndices = new Set(selectedItems.map(item => item.index));
        
        this.matSvg.selectAll(".dotG")
            .data(selectedItems, (itemData) => itemData.index)
            .join(
                enter => enter,
                update => {
                    // change color for selectedItems
                    update.select(".dotCircle")
                        .attr("fill", (item) => {
                            return selectedIndices.has(item.index) ? this.colorScale(item.Seasons) : 'black';
                        });
                    this.changeBorderAndOpacity(update);
                },
                exit => exit
            );
    }
    

    updateAxis = function(visData,xAttribute,yAttribute){
        const paddingFactor = 0.1; // 10% di padding

        // Calcola il dominio con il padding per l'asse X
        const minX = d3.min(visData.map(item => item[xAttribute]));
        const maxX = d3.max(visData.map(item => item[xAttribute]));
        const xPadding = (maxX - minX) * paddingFactor; // Calcolo del padding
        this.xScale.domain([minX - xPadding, maxX + xPadding]); // Applica il padding
        
        // Calcola il dominio con il padding per l'asse Y
        const minY = d3.min(visData.map(item => item[yAttribute]));
        const maxY = d3.max(visData.map(item => item[yAttribute]));
        const yPadding = (maxY - minY) * paddingFactor; // Calcolo del padding
        this.yScale.domain([minY - yPadding, maxY + yPadding]); // Applica il padding
        
        // Aggiorna gli assi
        this.matSvg.select(".xAxisG")
            .transition()
            .duration(this.transitionDuration)
            .call(d3.axisBottom(this.xScale));
        
        this.matSvg.select(".yAxisG")
            .transition()
            .duration(this.transitionDuration)
            .call(d3.axisLeft(this.yScale));
        
    }

    renderScatterplot = function (visData, xAttribute, yAttribute, selectedItems, controllerMethods){
        // Crea un Set per gli indici selezionati, per una ricerca più veloce
        const selectedIndices = new Set(selectedItems.map(item => item.index));
    
        // Aggiorna gli assi
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
                        .attr("fill", (item) => {
                            return selectedIndices.has(item.index) ? this.colorScale(item.Seasons) : 'black';
                        });
    
                    this.updateDots(itemG, xAttribute, yAttribute, selectedItems);
                },
                update => {
                    this.updateDots(update, xAttribute, yAttribute, selectedItems);
                },
                exit => {
                    exit.remove();
                }
            );
    }
    

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}

export default ScatterplotD3;