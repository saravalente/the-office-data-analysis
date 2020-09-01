loadData();

var selectArea = document.getElementById("season-filter");
var selectedSeason = selectArea.options[selectArea.selectedIndex].value;

function loadData() {

    Promise.all([
        d3.csv('data/ratings-per-ep.csv'),
        d3.csv('data/spkr-percents-by-ep.csv')
    ])
        .then(([data1, data2]) => {
            allData = data1;
            pctsData = data2;

            var parser = d3.timeParse("%Y-%m-%d");

            // Convert to correct data types.
            allData.forEach(function (d) {
                d.season = +d.season;
                d.episode = +d.episode;
                d.rating = +d.rating;
                d.airdate = parser(d.airdate);
            });

            pctsData.forEach(function (d) {
                d.season = +d.season;
                d.episode = +d.episode;
                d.percent = +d.percent;
            });

            createVis();

        });
}

function createVis() {
    linechart = new LineChart("line-chart", allData);
    // timeline = new Timeline("timeline", allData.years);
    pchart = new PChart("p-chart", pctsData);

}

//
// maybe wrong
function seasonChanged() {
    // Convert the extent into the corresponding domain values
    selectedSeason = selectArea.options[selectArea.selectedIndex].value;

    linechart.wrangleData();
}