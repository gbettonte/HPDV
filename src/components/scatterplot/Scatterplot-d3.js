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
    transitionDuration=10;
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
        console.log("SVG created:", this.matSvg); // Log per verificare la creazione dell'elemento SVG


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

    updateDots(selection,xAttribute,yAttribute){
        // transform selection
        selection
            .transition().duration(this.transitionDuration)
            .attr("transform", (item)=>{
                // use scales to return shape position from data values
                const xPos = this.xScale(item[xAttribute]);
                const yPos = this.yScale(item[yAttribute]);
                return "translate("+xPos+","+yPos+")";
            })
            // Aggiorna il colore basato su `Seasons`
        selection.select(".dotCircle")
            .attr("fill", (item) => this.colorScale(item.Seasons));
        this.changeBorderAndOpacity(selection)
    }

    highlightSelectedItems(selectedItems){
        // this.changeBorderAndOpacity(updateSelection);
        this.matSvg.selectAll(".dotG")
            // all elements with the class .cellG (empty the first time)
            .data(selectedItems,(itemData)=>itemData.index)
            .join(
                enter=>enter,
                update=>{
                    this.changeBorderAndOpacity(update);
                },
                exit => exit
            )
        ;
    }

    updateAxis = function(visData,xAttribute,yAttribute){
        const minX = d3.min(visData.map(item=>item[xAttribute]));
        const maxX = d3.max(visData.map(item=>item[xAttribute]));
        // this.xScale.domain([0, maxX]);
        this.xScale.domain([minX, maxX]);
        const minY = d3.min(visData.map(item=>item[yAttribute]));
        const maxY = d3.max(visData.map(item=>item[yAttribute]));
        // this.yScale.domain([0, maxY]);
        this.yScale.domain([minY, maxY]);
        console.log("xScale domain:", this.xScale.domain()); // Verifica il dominio della scala X
    console.log("yScale domain:", this.yScale.domain()); // Verifica il dominio della scala Y
        this.matSvg.select(".xAxisG")
            .transition().duration(this.transitionDuration)
            .call(d3.axisBottom(this.xScale))
        ;
        this.matSvg.select(".yAxisG")
            .transition().duration(this.transitionDuration)
            .call(d3.axisLeft(this.yScale))
        ;
    }

    renderScatterplot = function (visData, xAttribute, yAttribute, controllerMethods){
        // build the size scales and x,y axis
            // Verifica che i dati siano corretti per i parametri selezionati
        visData.forEach(item => {
            console.log(`x: ${item[xAttribute]}, y: ${item[yAttribute]}`);
        });
        console.log("Rendering scatterplot with data:", visData); // Log per verificare che i dati siano passati
        this.updateAxis(visData,xAttribute,yAttribute);

        this.matSvg.selectAll(".dotG")
            // all elements with the class .cellG (empty the first time)
            .data(visData,(itemData)=>itemData.index)
            .join(
                enter=>{
                    // all data items to add:
                    // doesn’exist in the select but exist in the new array
                    const itemG=enter.append("g")
                        .attr("class","dotG")
                        .style("opacity",this.defaultOpacity)
                        .on("click", (event,itemData)=>{
                            controllerMethods.handleOnClick(itemData);
                        })
                    ;
                    // render element as child of each element "g"
                    itemG.append("circle")
                        .attr("class","dotCircle")
                        .attr("r",this.circleRadius)
                        .attr("stroke","red")
                        .attr("fill", (item) => this.colorScale(item.Seasons)); // Usa la scala di colori qui!
                    ;
                    this.updateDots(itemG,xAttribute,yAttribute);
                },
                update=>{
                    this.updateDots(update,xAttribute,yAttribute)
                },
                exit =>{
                    exit.remove()
                    ;
                }

            )
            //console.log("Dot elements rendered:", dotSelection); // Verifica se i cerchi sono stati aggiunti
    }

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}

export default ScatterplotD3;