
/*
 * LineChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

PChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;// see data wrangling

    this.displayData = this.data;

    // DEBUG RAW DATA
    // console.log(this.data);

    this.initVis();

}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

PChart.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 40, right: 50, bottom: 60, left: 50};
    vis.innerwidth = 1200 - vis.margin.left - vis.margin.right;
    vis.innerheight = 350 - vis.margin.top - vis.margin.bottom;

    vis.width = vis.innerwidth,
        vis.height = vis.innerheight;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();
}


PChart.prototype.wrangleData = function(){
    var vis = this;

    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.data;
    console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
}

PChart.prototype.updateVis = function() {
    var vis = this;

}