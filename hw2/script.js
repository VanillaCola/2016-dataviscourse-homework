/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
    // ****** TODO: PART II ******
	var rectangles = document.getElementById("BarChart1").children;
	var len = rectangles.length;
	
	//Rotate rectangles
	for(var i = 0; i < len; i++)
	{
		var rect = rectangles[i];
		var y = rect.getAttribute("y");
		var width = rect.getAttribute("width");
		
		if(width == 1) return;
	
		rect.setAttribute("x", y);
		rect.setAttribute("y", 0);
		rect.setAttribute("width", 1);
		rect.setAttribute("height", width);
	}
		
	//Sort rectangles based on the height
	for(var i = 0; i < len; i++)
	{
		for(var j = 1; j < (len-i); j++)
		{
			var h1 = rectangles[j].getAttribute("height");
			var h2 = rectangles[j-1].getAttribute("height");
			if(parseInt(h2) > parseInt(h1))
			{
				rectangles[j].setAttribute("height", h2);
				rectangles[j-1].setAttribute("height", h1);
			}
		}
	}
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }
	
	var rectangles = document.getElementById("BarChart1").children;
	var len = rectangles.length;
	
	//Rotate rectangle
	for(var i = 0; i < len; i++)
	{
		var rect = rectangles[i];
		var x = rect.getAttribute("x");
		var height = rect.getAttribute("height");
		
		if(height == 1) break;
	
		rect.setAttribute("y", x);
		rect.setAttribute("x", 0);
		rect.setAttribute("width", height);
		rect.setAttribute("height", 1);
	}
	

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
	
	
	var BarChart1 = d3.select("#BarChart1");
	
	var Bar1 = BarChart1.selectAll("rect").data(data);
	
	var newBar1 = Bar1.enter().append("rect")
			.attr("width", function(d)
			{
				return d.a;
			})
			.attr("height", 1)
			.attr("x", 1)
			.attr("y", function(d, i)
			{
				return i;
			})
			.style("opacity", 0)
			.style("fill", "steelblue")
			.style("stroke", "darkgray")
			.style("stroke-width", ".1px")
			.on("mouseover", function(){return d3.select(this).style("fill", "seagreen");})
			.on("mouseout", function(){return d3.select(this).style("fill", "steelblue");});
	
	Bar1.exit()
		.style("opacity", 1)
		.transition()
		.duration(2000)
		.style("opacity", 0)
		.remove();	//Remove previous data

	Bar1 = newBar1.merge(Bar1);
	
	Bar1.transition()
		.duration(2000)
		.attr("width", function(d)
			{
				return d.a;
			})
			.attr("height", 1)
			.attr("x", 1)
			.attr("y", function(d, i)
			{
				return i;
			})
			.style("opacity", 1)
			.style("fill", "steelblue")
			.style("stroke", "darkgray")
			.style("stroke-width", ".1px");
			
    // TODO: Select and update the 'b' bar chart bars
	var BarChart2 = d3.select("#BarChart2");
	
	var Bar2 = BarChart2.selectAll("rect").data(data);
	
	var newBar2 = Bar2.enter().append("rect")
			.attr("width", function(d)
			{
				return d.b;
			})
			.attr("height", 1)
			.attr("x", 1)
			.attr("y", function(d, i)
			{
				return i;
			})
			.style("opacity", 0)
			.style("fill", "steelblue")
			.style("stroke", "darkgray")
			.style("stroke-width", ".1px")
			.on("mouseover", function(){return d3.select(this).style("fill", "seagreen");})
			.on("mouseout", function(){return d3.select(this).style("fill", "steelblue");});
	

		Bar2.exit()
		.style("opacity", 1)
		.transition()
		.duration(2000)
		.style("opacity", 0)
		.remove();	//Remove previous data

	Bar2 = newBar2.merge(Bar2);
	
	Bar2.transition()
		.duration(2000)
		.attr("width", function(d)
			{
				return d.b;
			})
			.attr("height", 1)
			.attr("x", 1)
			.attr("y", function(d, i)
			{
				return i;
			})
			.style("opacity", 1)
			.style("fill", "steelblue")
			.style("stroke", "darkgray")
			.style("stroke-width", ".1px");
			
    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });
		
	var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
        });
		
	var LineChart1 = d3.select("#LineChart1")
	.attr("transform", "translate(0, 200) scale(1, -1)");
	
	var Path1 = LineChart1.select("path");
	
	Path1.transition().duration(2000).attr("d", aLineGenerator(data))
		.style("stroke-width", "2px");	

    // TODO: Select and update the 'b' line chart path (create your own generator)
	var LineChart2 = d3.select("#LineChart2")
		.attr("transform", "translate(0, 200) scale(1, -1)");
		
	var Path2 = LineChart2.select("path")
	
	Path2.transition().duration(2000)
		.attr("d", bLineGenerator(data))
		.style("stroke-width", "2px");
		
    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });
		
	var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScale(d.b);
        });
		
	var AreaChart1 = d3.select("#AreaChart1")
	.attr("transform", "translate(0, 200) scale(1, -1)");
	
	var Area1 = AreaChart1.select("path");
	Area1.transition().duration(2000).attr("d", aAreaGenerator(data))
		.style("stroke-width", "2px");
	

    // TODO: Select and update the 'b' area chart path (create your own generator)

	var AreaChart2 = d3.select("#AreaChart2")
		.attr("transform", "translate(0, 200) scale(1, -1)");
		
	var Area2 = AreaChart2.select("path");
	
	Area2.transition().duration(2000).attr("d", bAreaGenerator(data))
		.style("stroke-width", "2px");
		
    // TODO: Select and update the scatterplot points
	var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("visibility", "hidden")
	.style("border-style", "none")
	.style("font-size", "12px");
	
	var Scatterplot = d3.select("#Scatterplot");
	
	var circles = Scatterplot.selectAll("circle").data(data);
	
	var newCircles = circles.enter().append("circle")
		.attr("cx", function(d)
			{
				return d.a;
			})
			.attr("cy", function(d)
			{
				return d.b;
			})
			.attr("r", "0.5")
			.style("fill", "steelblue")
			.style("opacity", 0)
			.on("mouseover", function(){return tooltip.style("visibility", "visible").text("(" + d3.select(this).attr("cx") + ", " + d3.select(this).attr("cy") + ")");})
			.on("mousemove", function(){return tooltip.style("top", event.pageY+"px").style("left",event.pageX+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
	
	circles.exit()
		.style("opacity", 1)
		.transition()
		.duration(2000)
		.style("opacity", 0)
		.remove();	//Remove previous data
		
	circles = newCircles.merge(circles);
	
	circles.transition()
		.duration(2000)
		.attr("cx", function(d)
		{
			return d.a;
		})
		.attr("cy", function(d)
		{
			return d.b;
		})
		.attr("r", "0.5")
		.style("opacity", 1)
		.style("fill", "steelblue");
		
	circles.on("mouseover", function(){return tooltip.style("visibility", "visible").text("(" + d3.select(this).attr("cx") + ", " + d3.select(this).attr("cy") + ")");})
		.on("mousemove", function(){return tooltip.style("top", event.pageY+"px").style("left",event.pageX+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
	
	circles.on("click", function()
	{
		console.log("X="+d3.select(this).attr("cx")+ "," + "Y="+d3.select(this).attr("cy"));
	});
    // ****** TODO: PART IV ******

	
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}