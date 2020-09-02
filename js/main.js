loadData();

var selectArea = document.getElementById("season-filter");
var selectedSeason = selectArea.options[selectArea.selectedIndex].value;

function loadData() {

    Promise.all([
        d3.csv('data/ratings-per-ep.csv', d3.autoType),
        d3.csv('data/mainspeakerlines2.csv', d3.autoType)
    ])
        .then(([data1, data2]) => {
            allData = data1;
            pctsData = data2;

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