// Global var for FIFA world cup data
var allWorldCupData;

var cur_rect = null;
var rect_color = null;
var cur_color = null;

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {
    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;
	

    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes
	var X_MIN = d3.min(allWorldCupData, function (d) {
            return d.year;
        });
	
	var X_MAX = d3.max(allWorldCupData, function (d) {
            return d.year;
        });
	
	allWorldCupData = allWorldCupData.sort(function(a, b) {return a.year - b.year});
    var xScale = d3.scaleBand()
		.domain(allWorldCupData.map(function (d)
		{
			return d.year;
		}))
        .range([70, 500]).padding(0.1);
		
	var Y_MAX;
	var Y_MIN;
	
	if(selectedDimension == "attendance")
	{
		Y_MIN = d3.min(allWorldCupData, function (d) {
            return d.attendance;
        });
		Y_MAX = d3.max(allWorldCupData, function (d) {
            return d.attendance;
        });
	}
	else if(selectedDimension == "goals")
	{
		Y_MIN = d3.min(allWorldCupData, function (d) {
            return d.goals;
        });
		Y_MAX = d3.max(allWorldCupData, function (d) {
            return d.goals;
        });
	}
	else if(selectedDimension == "teams")
	{
		Y_MIN = d3.min(allWorldCupData, function (d) {
            return d.teams;
        });
		Y_MAX = d3.max(allWorldCupData, function (d) {
            return d.teams;
        });
	}
	else if(selectedDimension == "matches")
	{
		Y_MIN = d3.min(allWorldCupData, function (d) {
            return d.matches;
        });
		Y_MAX = d3.max(allWorldCupData, function (d) {
            return d.matches;
        });
	}
		
    var yScale = d3.scaleLinear()
        .domain([Y_MAX, 0])
        .range([70, 400])
		.nice();
		
	var iScale = d3.scaleLinear()
        .domain([0, allWorldCupData.length])
        .range([70, 500])
		.nice();
		
		
    // Create colorScale
	var colorScale = d3.scaleLinear()
                // notice the three interpolation points
                .domain([Y_MIN, Y_MAX])
                // each color matches to an interpolation point
                .range(["steelblue", "#24425C"]);

    // Create the axes (hint: use #xAxis and #yAxis)
	var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
	
	d3.select("#xAxis")
		.transition()
		.duration(1000)
		.attr("transform", "translate(0, 350)")
         .call(xAxis)
		 .selectAll("text")
		 .style("text-anchor", "end")
		 .style("font-weight", "bold")
		 .attr("dx", "-.5em")
		 .attr("dy", "-.2em")
		 .attr("transform", "rotate(-90)"); 
		
	var yAxis = d3.axisLeft();
        yAxis.scale(yScale);
		
	d3.select("#yAxis")
			.transition()
		.duration(1000)
		.attr("transform", "translate(70, -50)")
         .call(yAxis)
		 .selectAll("text")
		 .style("text-anchor", "end")
		 .style("font-weight", "bold")
		 .style("font-size", "14px");
		 
    // Create the bars (hint: use #bars)
	
	var Scale = d3.scaleLinear()
        .domain([0, Y_MAX])
        .range([0, 330])
		.nice();
	
	var bars = d3.select("#bars");
	bars.attr("transform", "translate(0, 350) scale(1, -1)");
	
	if(bars.selectAll("rect").size() == 0)
		var data = bars.selectAll("rect").data(allWorldCupData).enter().append("rect");
	else
		var data = bars.selectAll("rect").data(allWorldCupData);
	
	data.attr("x", function(d, i){
				return iScale(i);
			})
			.attr("y",0)
			.attr("width", 21)
			.style("stroke", "white")
			.style("stroke-width", "0.5px")
			.on("click", function(d)
			{
				if(cur_rect != null)
				{
					d3.select(cur_rect).style("fill", rect_color);
				}
				cur_rect = this;
				rect_color = this.style.fill;
				
				d3.select(this).style("fill", "red");
				updateInfo(d);
				updateMap(d);
			})			
			.transition()
			.duration(1000)
			.attr("height", function(d)
			{
				if(selectedDimension == "attendance")
				{
						return Scale(d.attendance);
				}
				else if(selectedDimension == "goals")
				{
						return Scale(d.goals);
				}
				else if(selectedDimension == "teams")
				{
						return Scale(d.teams);
				}
				else if(selectedDimension == "matches")
				{
						return Scale(d.matches);
				}
			})
			.style("fill", function(d)
			{
				if(this == cur_rect)
				{
					if(selectedDimension == "attendance")
					{
							rect_color = colorScale(d.attendance);
					}
					else if(selectedDimension == "goals")
					{
							rect_color = colorScale(d.goals);
					}
					else if(selectedDimension == "teams")
					{
							rect_color = colorScale(d.teams);
					}
					else if(selectedDimension == "matches")
					{
							rect_color =  colorScale(d.matches);
					}
					return "red";
				}
				else
				{
					if(selectedDimension == "attendance")
					{
							return colorScale(d.attendance);
					}
					else if(selectedDimension == "goals")
					{
							return colorScale(d.goals);
					}
					else if(selectedDimension == "teams")
					{
							return colorScale(d.teams);
					}
					else if(selectedDimension == "matches")
					{
							return colorScale(d.matches);
					}
				}
			});
    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.


}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
	//Done!
    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.
	var dataset = document.getElementById("dataset");
	updateBarChart(dataset.value);
}


/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.
	console.log(oneWorldCup);
	
	var Title = oneWorldCup.EDITION;
	
	var Host = oneWorldCup.host;
	var Winner = oneWorldCup.winner;
	var Silver = oneWorldCup.runner_up;
	
	d3.select("#edition").text(Title);
	d3.select("#host").text(Host);
	d3.select("#winner").text(Winner);
	d3.select("#silver").text(Silver);
	
	var teams = "";
	for(var i = 0; i < oneWorldCup.teams; ++i)
	{
		teams += "<li>" + oneWorldCup.teams_names[i]+"</li>";
	}

	d3.select("#teams").html(teams);
}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

	var map = d3.select("#map");
		
	var path = d3.geoPath().projection(projection);
	
	var countries = topojson.feature(world, world.objects.countries).features;

	var graticule = d3.geoGraticule();
	
	map.selectAll(".countries")
		.data(countries)
		.enter()
		.append("path")
		.classed("countries", true)
		.attr("d", path)
		.attr("id", function(d)
		{
			return d.id;
		})
		.on("click", function()
		{
			displayRecords(this.id);
		});
		
	map.append("path")
		.datum(graticule)
		.classed("grat", true)
		.attr("d", path);

	
    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)


}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART V*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

	var map = d3.select("#map");
	var points = d3.select("#points");
	map.selectAll("path")
		.classed("host", false)
		.classed("team", false)
		.classed("countries", true);

	points.selectAll("circle")
		.remove();
}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.
	
	var Host = worldcupData.host_country_code;
	
	var Winner = worldcupData.winner;
	var win_pos = projection(worldcupData.win_pos);
	
	var Silver = worldcupData.runner_up;
	var ru_pos = projection(worldcupData.ru_pos);
	
	var ISO = worldcupData.teams_iso;
	
	for(var i = 0; i < worldcupData.teams; i++)
	{
		if(worldcupData.teams_names[i] == Winner)
		{
			Winner = ISO[i];
		}
		else if(worldcupData.teams_names[i] == Silver)
		{
			Silver = ISO[i];
		}
	}
	
	var map = d3.select("#map");
	map.select("#"+Host).classed("host", true);		//Japan and Korean
	
	for(var i = 0; i < worldcupData.teams; i++)
	{
		map.select("#"+ISO[i]).classed("team", true);
	}
	
	var points = d3.select("#points");
	points.append("circle")
            .attr("cx", win_pos[0])
            .attr("cy", win_pos[1])
			.attr("r", 8)
            .classed("gold", true);
			
	points.append("circle")
            .attr("cx", ru_pos[0])
            .attr("cy",	ru_pos[1])
			.attr("r", 8)
			.classed("silver", true);
}

function displayRecords(id)
{
	var records   = d3.select("#records");
	var cups 	  = records.select("#cups");
	var winner 	  = records.select("#winners");
	var runner_up = records.select("#runner-ups");
	
	records.select("#titles").text(id + " at World Cups");
	
	var editions = "";
	var wins = "";
	var runners = "";
	for(var i =0; i < allWorldCupData.length; i++)
	{
		if(allWorldCupData[i].win_iso == id)
		{
			wins += "<li>" + allWorldCupData[i].EDITION +"</li>";
		}
		
		if(allWorldCupData[i].ru_iso == id)
		{
			runners += "<li>" + allWorldCupData[i].EDITION +"</li>"
		}
		
		var iso = allWorldCupData[i].teams_iso;
		for(var j = 0; j < iso.length; j++)
		{
			if(iso[j] == id)
			{
				editions += "<li>" + allWorldCupData[i].EDITION +"</li>";
			}
		}
	}
	
	cups.html(editions);
	winner.html(wins);
	runner_up.html(runners);
}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

		//Revised data
		d.win_iso = d.winnerID;
		d.ru_iso = d.runnerupID;
    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});
