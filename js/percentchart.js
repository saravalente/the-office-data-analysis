
/*
 * LineChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

PChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;// see data wrangling

    this.displayData = this.data;

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

    vis.y = d3.scaleBand()
        .rangeRound([0, vis.width])
        .padding(0.1)
        .align(0.1);

    vis.x = d3.scaleLinear()
        .rangeRound([vis.height, 0]);

    vis.z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    vis.stacked = d3.stack()
        .offset(d3.stackOffsetExpand)
        .keys(['michael', 'dwight', 'jim', 'pam', 'andy', 'angela', 'kevin', 'erin',
            'oscar', 'darryl', 'ryan', 'phyllis', 'jan', 'kelly', 'toby', 'stanley',
            'holly', 'meredith', 'nellie', 'gabe', 'robert', 'david', 'creed',
            'karen', 'clark', 'deangelo', 'charles', 'roy', 'pete', 'jo']);

    vis.wrangleData();
}


PChart.prototype.wrangleData = function(){
    var vis = this;

    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.data;
    vis.stackedSeries = vis.stacked(vis.displayData);
    console.log(vis.stackedSeries);
    // Update the visualization
    vis.updateVis();
}

PChart.prototype.updateVis = function() {
    var vis = this;

    vis.serie = vis.svg.selectAll(".serie")
        .data(vis.stackedSeries)
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {
            console.log(d.key);
            return vis.z(d.key);
        });

    vis.serie.selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("y", function(d) {
            return vis.y(d.data.season);
        })
        .attr("x", function(d) {
            return vis.x(d[1]);
        })
        .attr("width", function(d) {
            return vis.x(d[0]) - vis.x(d[1]);
        })
        .attr("height", vis.y.bandwidth());


}