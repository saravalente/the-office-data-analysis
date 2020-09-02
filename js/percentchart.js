
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

    vis.margin = {top: 40, right: 20, bottom: 60, left: 50};
    vis.innerwidth = 1000 - vis.margin.left - vis.margin.right;
    vis.innerheight = 2200 - vis.margin.top - vis.margin.bottom;

    vis.width = vis.innerwidth,
        vis.height = vis.innerheight;

    vis.stacked = d3.stack()
        .keys(['michael', 'dwight', 'jim', 'pam', 'andy', 'angela', 'kevin', 'erin',
            'oscar', 'darryl', 'ryan', 'phyllis', 'jan', 'kelly', 'toby', 'stanley',
            'holly', 'meredith', 'nellie', 'gabe', 'robert', 'david', 'creed',
            'karen', 'clark', 'deangelo', 'charles', 'roy', 'pete', 'jo'])
        .offset(d3.stackOffsetExpand);

    vis.stackedSeries = vis.stacked(vis.displayData);

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.y = d3.scaleBand()
        .domain(vis.displayData.map(function(d, i) {
            return i;
        }))
        .range([vis.height - vis.margin.bottom, vis.margin.top])
        .padding(0.1)
        .align(0.1);

    vis.x = d3.scaleLinear()
        .rangeRound([vis.margin.left, vis.width - vis.margin.right])
        .domain([0, d3.max(vis.stackedSeries, d => d3.max(d, d => d[1]))]);

    vis.tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            var thisSpeaker = d3.select(this.parentNode).datum().key;
            var thisSeason = d.data.season;
            var thisEpisode = d.data.episode;
            var thisPercent = (d[1]-d[0]) * 100;
            return thisSpeaker + ": " + thisPercent.toFixed(1) + "% of lines<br>S" + thisSeason + "E" + thisEpisode;
        });


    vis.wrangleData();
}


PChart.prototype.wrangleData = function(){
    var vis = this;

    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.data;

    console.log(vis.stackedSeries);
    // Update the visualization
    vis.updateVis();
}

PChart.prototype.updateVis = function() {
    var vis = this;

    vis.color = d3.scaleOrdinal()
        .domain(vis.stackedSeries.map(d => d.key))
        .range(['#dd4631', '#58e561', '#ffe21f', '#742777',  '#6243cd',
            '#3d08b2', '#9d0703', '#f95668', '#5232cb', '#9282a4', '#cc1d21', '#1ccb8a', '#1c9ee4',
            '#ef32e8', '#28dfc2', '#8ee738', '#3df1e9', '#248faa',  '#75294d', '#863cb0',
            '#3560f6', '#0cd673',  '#e02323', '#7f0246', '#282908', '#b6ea48', '#b0db88', '#6d0804', '#121a7d', '#977d93']);

    console.log(vis.stackedSeries);

    vis.svg.append("g")
        .selectAll("g")
        .data(vis.stackedSeries)
        .join("g")
        .attr("fill", d => vis.color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => vis.x(d[0]))
        .attr("y", function(d, i) {
            return vis.y(i) + vis.margin.top;
        })
        .attr("height", vis.y.bandwidth())
        .attr("width", d => vis.x(d[1]) - vis.x(d[0]))
        .attr("class", "bar");

    vis.svg.selectAll("rect").on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    vis.svg.call(vis.tip);

    vis.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + vis.margin.top +")") 						//  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(vis.y));									//   .call(d3.axisBottom(x));

    vis.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+vis.height+")")				// New line
        .call(d3.axisBottom(vis.x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", vis.x(vis.x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Percent Lines")
        .attr("transform", "translate("+ (-vis.width) +",-10)");   	// Newline




}