
/*
 * LineChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

LineChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;// see data wrangling

    this.displayData = this.data;

    // DEBUG RAW DATA
    console.log(this.data);

    this.initVis();

}

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

LineChart.prototype.initVis = function(){
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

    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.displayData, function(d) { return d.airdate; }));

    vis.y = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([6, d3.max(vis.displayData, function(d) { return d.rating; })]);

    vis.myColor = d3.scaleOrdinal()
        .domain(d3.map(vis.displayData, function(d){return d.season;}).keys())
        .range(d3.schemeTableau10);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis);

    vis.svg.append('text')
        .attr("class", "label")
        .attr("x", 20)
        .attr("y", 10)
        .attr("fill", "black");

    vis.tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { return "S" + d.season + "E" + d.episode + ": " + d.title + "<br>Airdate: " + vis.dateFormatter(d.airdate) + "<br>Rating: " + d.rating; });

    // define the d3 line generator
    vis.valueline = d3.line()
        .x(function(d) { return vis.x(d.airdate); })
        .y(function(d) { return vis.y(d.rating); });

    vis.svg.append("path")
        .datum(vis.displayData)
        .attr("class", "line")
        // .attr("stroke", function(d,i){
        //         console.log(d[i].season);
        //     })
        .attr('d', vis.valueline);

    vis.dateFormatter = d3.timeFormat("%b %e, %Y");

    vis.svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("IMDB Rating");

    vis.svg.append("text")
        .attr("transform",
            "translate(" + (vis.width/2) + " ," +
            (vis.height + vis.margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Airdate");

    // Initialize brush component
    // vis.brush = d3.brushX()
    //     .extent([[0, 0], [vis.width, vis.height]])
    //     .on("brush", brushed);

    // Append brush component
    // vis.svg.append("g")
    //     .attr("class", "x brush")
    //     .call(vis.brush)
    //     .selectAll("rect")
    //     .attr("y", -6)
    //     .attr("height", vis.height + 7);
    //

    vis.wrangleData();
}

LineChart.prototype.wrangleData = function(){
    var vis = this;
    // In the first step no data wrangling/filtering needed
    // vis.displayData = vis.data;
    // console.log(vis.displayData);

    if (selectedSeason == "all") {
        vis.displayData = vis.data;
    }
    else
    {
        vis.displayData = vis.data.filter(function (d) {
            return d.season == selectedSeason;
        })
        console.log(vis.displayData);
    }
    // Update the visualization
    vis.updateVis();
}

LineChart.prototype.updateVis = function() {
    var vis = this;

    vis.x.domain(d3.extent(vis.displayData, function(d) { return d.airdate; }));

    vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);

    // vis.svg.select("path.line")
    //     .datum(vis.displayData)
    //     .join(
    //         enter => enter.append("path")
    //             .attr('d', vis.valueline)
    //             .style("opacity", "0"),
    //         update => update
    //             .transition()
    //             .duration(500)
    //             .attrTween('d', function (d) {
    //                 var previous = d3.select(this).attr('d');
    //                 var current = vis.valueline(d);
    //                 return d3.interpolatePath(previous, current)
    //             }),
    //         exit => exit
    //             .transition()
    //             .duration(500)
    //             .on('end', function() {
    //                 d3.select(this).remove();
    //             })
    //     );

    vis.svg.select('path.line')
        .datum(vis.displayData)
        .transition()
        .duration(500)
        .attr('d', vis.valueline)
        .attrTween('d', function (d) {
            var previous = d3.select(this).attr('d');
            var current = vis.valueline(d);
            return d3.interpolatePath(previous, current)
        });
    //
    // var curtain = svg.append('rect')
    //     .attr('x', -1 * width)
    //     .attr('y', -1 * height)
    //     .attr('height', height)
    //     .attr('width', width)
    //     .attr('class', 'curtain')
    //     .attr('transform', 'rotate(180)')
    //     .style('fill', '#ffffff');

    vis.svg.selectAll("circle")
        .data(vis.displayData)
        .join(
            enter => enter.append("circle")
                .attr("cx", function(d) { return vis.x(d.airdate) })
                .attr("cy", function(d) { return vis.y(d.rating) })
                .style("opacity", 0)
                .call(enter => enter.transition().duration(500)
                    .style("opacity", 1)
                    .attr("r", 3.5)),
            update => update
                .call(update => update.transition().duration(400)
                    .attr("cx", function(d) { return vis.x(d.airdate) })
                    .attr("cy", function(d) { return vis.y(d.rating) })),
            exit => exit
                .attr('r', 0)
                .style('opacity', 0)
                .call(exit => exit.transition().duration(400)
                    .attr('cx', 1000)
                    .remove())
        )
        .attr("class", "circle")
        .attr("fill", function(d){
            return vis.myColor(d.season);
        });

    vis.svg.selectAll("circle").on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    vis.svg.call(vis.tip);
}