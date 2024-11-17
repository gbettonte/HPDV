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
        this.dispatch = dispatch;  // Aggiungi il dispatch per inviare l'azione Redux
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

        this.createBrush(controllerMethods); // Crea il brush solo se i dati sono disponibili
    }
    

    createBrush(controllerMethods) {
        const brush = d3.brush()
            .extent([[0, 0], [this.width, this.height]])  // Imposta l'area di selezione
            .on("end", (event) => {
                // Verifica che i dati siano disponibili prima di chiamare handleBrush
                if (!controllerMethods.bikeData || controllerMethods.bikeData.length === 0) {
                    console.error("Bike data is not available yet.");
                    return; // Non procedere se i dati non sono disponibili
                }
    
                // Passa xAxis, yAxis e bikeData a handleBrush
                this.handleBrush(event, controllerMethods, controllerMethods.xAxis, controllerMethods.yAxis, controllerMethods.bikeData);
            });
    
        // Aggiungi il brush al grafico
        this.matSvg.append("g")
            .attr("class", "brush")
            .call(brush);
    }
    
    
    
    
    handleBrush(event, controllerMethods, xAxis, yAxis, bikeData) {
        if (!event.selection) {
            console.warn("No selection made in the brush area.");
            return;  // Se non è stata fatta alcuna selezione, esci
        }
    
        const [[x0, y0], [x1, y1]] = event.selection;
    
        // Log dei limiti di selezione
        console.log("xAxis:", xAxis, "yAxis:", yAxis);
        console.log("Selection limits:", [x0, y0], [x1, y1]);
    
        // Verifica che le scale esistano
        if (!this.xScale || !this.yScale) {
            console.error("Scale functions not found. Cannot apply the brush selection.");
            return;
        }
    
        // Converti le coordinate del brush da pixel a valore dei dati
        const scaledX0 = this.xScale.invert(x0);
        const scaledY0 = this.yScale.invert(y0);
        const scaledX1 = this.xScale.invert(x1);
        const scaledY1 = this.yScale.invert(y1);
    
        // Ordina correttamente i limiti Y
        const [yMin, yMax] = scaledY0 > scaledY1 ? [scaledY1, scaledY0] : [scaledY0, scaledY1];
    
        // Log dei limiti corretti
        console.log("Corrected Y selection:", yMin, yMax);
    
        // Verifica che xAxis e yAxis siano validi e corrispondano ai dati
        if (!xAxis || !yAxis) {
            console.error("xAxis or yAxis is not defined.");
            return;
        }
    
        // Filtro dei dati
        const brushedData = bikeData.filter(d => {
            const xValue = Number(d[xAxis]);
            const yValue = Number(d[yAxis]);
    
            // Log dei valori originali e convertiti
            console.log(`Original point: x: ${d[xAxis]}, y: ${d[yAxis]}`);
            console.log(`Converted point: x: ${xValue}, y: ${yValue}`);
    
            // Log dei valori filtrati
            console.log(`Filtering point: x: ${xValue}, y: ${yValue}`);
    
            // Filtra solo se i valori sono numerici e rientrano nei limiti di selezione
            return !isNaN(xValue) && !isNaN(yValue) && xValue >= scaledX0 && xValue <= scaledX1 && yValue >= yMin && yValue <= yMax;
        });
    
        // Log dei dati selezionati
        console.log("Brushed Data:", brushedData);
    
        // Se ci sono dati validi, aggiorna lo stato di Redux
        if (brushedData.length > 0) {
            this.dispatch(setSelectedItems(brushedData)); // Aggiorna Redux con i dati selezionati
        } else {
            console.warn("No valid data found for the selected area.");
        }
    }
    
    
    

    // Aggiungi il metodo changeBorderAndOpacity
    changeBorderAndOpacity(selection) {
        selection.selectAll("circle")
            .transition().duration(this.transitionDuration)
            .style("opacity", this.defaultOpacity)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }

    updateDots(selection, xAttribute, yAttribute) {
        // trasformazione e aggiornamento dei punti
        selection.transition().duration(this.transitionDuration)
            .attr("transform", (item) => {
                const xPos = this.xScale(item[xAttribute]);
                const yPos = this.yScale(item[yAttribute]);
                return "translate(" + xPos + "," + yPos + ")";
            });

        // Aggiorna il colore dei punti in base alla variabile "Seasons"
        selection.select(".dotCircle")
            .attr("fill", (item) => this.colorScale(item.Seasons));

        this.changeBorderAndOpacity(selection);
    }

    updateAxis(visData, xAttribute, yAttribute) {
        const minX = d3.min(visData.map(item => item[xAttribute]));
        const maxX = d3.max(visData.map(item => item[xAttribute]));
        this.xScale.domain([minX, maxX]);

        const minY = d3.min(visData.map(item => item[yAttribute]));
        const maxY = d3.max(visData.map(item => item[yAttribute]));
        this.yScale.domain([minY, maxY]);

        this.matSvg.select(".xAxisG")
            .transition().duration(this.transitionDuration)
            .call(d3.axisBottom(this.xScale));

        this.matSvg.select(".yAxisG")
            .transition().duration(this.transitionDuration)
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
