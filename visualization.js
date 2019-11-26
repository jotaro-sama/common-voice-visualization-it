const CV_IT_STATS_URL = "https://voice.mozilla.org/api/v1/it/clips/stats"

function parseToArray(data) {
    let arr = [];
    for (var i of data) {
        console.log(i);
        arr.push({
            date: new Date(i.date.split('T')[0]),        
            valid: +i.valid,   
            total: +i.total
        });
    } return arr;
}

function drawChart(data) {
    var svgWidth = 600, svgHeight = 400; 
    var margin = { top: 20, right: 20, bottom: 30, left: 50 }; 
    var width = svgWidth - margin.left - margin.right; 
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('svg').attr("width", svgWidth).attr("height", svgHeight);
    
    // Hierarchical element
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    // Validated line
    var vLine = d3.line()   
        .x(function(d) { return x(d.date)})   
        .y(function(d) { return y(d.valid)});
    x.domain(d3.extent(data, function(d) { return d.date }));   
    y.domain(d3.extent(data, function(d) { return d.valid }));

    // Total line
    var tLine = d3.line()   
        .x(function(d) { return x(d.date)})   
        .y(function(d) { return y(d.total)});
    x.domain(d3.extent(data, function(d) { return d.date }));   
    y.domain(d3.extent(data, function(d) { return d.total }));


    // Append bottom axis to hierarchical element
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    // Append left axis
    g.append("g")   
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")   
        .attr("transform", "rotate(-90)")   
        .attr("y", 6)   
        .attr("dy", "0.71em")   
        .attr("text-anchor", "end")   
        .text("Validated sentences");
    
    // Validated path
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", vLine);

    // Total path
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", tLine);
}

function visualization() {

    fetch(CV_IT_STATS_URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {

            let parsedArray = parseToArray(jsonResponse);

            console.log(parsedArray);

            drawChart(parsedArray);
        });
}