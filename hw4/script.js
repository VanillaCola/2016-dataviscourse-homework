/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;

/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};

var TeamSort = false;
var GoalSort = false;
var ResultSort = false;
var WinSort = false;
var LoseSort = false;
var GameSort = false;
var header = "";

//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.


// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
d3.csv("data/fifa-matches.csv", function (error, csvData) {
teamData = d3.nest()
    .key(function (d) {
        return d.Team;
    })
    .rollup(function (leaves) {
        return {
            "Goals Made": d3.sum(leaves,function(d){return d["Goals Made"]}),
            "Goals Conceded": d3.sum(leaves,function(d){return d["Goals Conceded"]}),
            "Delta Goals": d3.sum(leaves,function(d){return d["Delta Goals"]}),
            "Wins": d3.sum(leaves,function(d){return d["Wins"]}),
            "Losses": d3.sum(leaves,function(d){return d["Losses"]}),
            "Result":  {
                "label": Object.keys(rank).find(key => rank[key] === d3.max(leaves,function(d){return rank[d["Result"]]})),
                "ranking": d3.max(leaves,function(d){return rank[d["Result"]]})
            }, 
            "TotalGames": leaves.length,
			"type": "aggregate",
            "games": 
                d3.nest()
                    .key(function (games) {
                        return games.Opponent;
                    })
                    .rollup(function(games) {
                        return {
                            "Goals Made": d3.sum(games,function(d){return d["Goals Made"]}),
                            "Goals Conceded": d3.sum(games,function(d){return d["Goals Conceded"]}),
                            "Delta Goals": [],
                            "Wins": [], 
                            "Losses": [], 
                            "Result":  {
                                "label": Object.keys(rank).find(key => rank[key] === d3.max(games,function(d){return rank[d["Result"]]})),
                                "ranking": d3.max(games,function(d){return rank[d["Result"]]})
                            }, 
                            "type": "game",
                            "Opponent": d3.max(games,function(d){return d["Team"]}),
                        }
                    })
             .entries(leaves)
        }
    })
    .entries(csvData);
	
	//console.log(teamData);
    createTable();
    updateTable();
});
// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

// ******* TODO: PART II *******
goalScale.domain([0, 18])
		.nice();
		
var GoalAxis = d3.axisTop();
        GoalAxis.scale(goalScale);
		
var svg = d3.select("#goalHeader")
			.append("svg")
			.attr("width", 140)
			.attr("height", 30);

var xAxis = d3.select("#goalHeader").select("svg").append("g")
			.attr("transform", "translate(0, 20)");

xAxis.call(GoalAxis)
		 .selectAll("text")
		 .style("font-weight", "bold");

tableElements = teamData;		 
// ******* TODO: PART V *******

d3.select("#matchTable")
	.select("thead")
	.selectAll("tr")
	.selectAll("th")
	.on("click", sort);

d3.select("#matchTable")
	.select("thead")
	.selectAll("tr")
	.selectAll("td")
	.on("click", sort);
}

function sort()
{
	collapseList();
	var text = d3.select(this).text();
	if(text == "Team")
	{
		if(TeamSort)
			tableElements.sort(function(a, b){return d3.descending(a["key"], b["key"])});
		else
			tableElements.sort(function(a, b){return d3.ascending(a["key"], b["key"])});
		TeamSort 	= !TeamSort;
		GoalSort 	= false;
		ResultSort  = false;
		WinSort 	= false;
		LoseSort 	= false;
		GameSort 	= false;
		
	}
	else if(text == "Goals")
	{
		if(GoalSort)
			tableElements.sort(function(a, b){return d3.ascending(a["value"]["Delta Goals"], b["value"]["Delta Goals"])});
		else
			tableElements.sort(function(a, b){return d3.descending(a["value"]["Delta Goals"], b["value"]["Delta Goals"])});

		TeamSort 	= false;
		GoalSort 	= !GoalSort;
		ResultSort  = false;
		WinSort 	= false;
		LoseSort 	= false;
		GameSort 	= false;
	}
	else if(text == "Round/Result" )
	{
		if(ResultSort)
			tableElements.sort(function(a, b){return d3.ascending(a["value"]["Result"]["ranking"], b["value"]["Result"]["ranking"])});
		else
			tableElements.sort(function(a, b){return d3.descending(a["value"]["Result"]["ranking"], b["value"]["Result"]["ranking"])});

		TeamSort 	= false;
		GoalSort 	= false;
		ResultSort  = !ResultSort;
		WinSort 	= false;
		LoseSort 	= false;
		GameSort 	= false;
	}
	else if(text == "Wins")
	{
		if(WinSort)
			tableElements.sort(function(a, b){return d3.ascending(a["value"]["Wins"], b["value"]["Wins"])});
		else
			tableElements.sort(function(a, b){return d3.descending(a["value"]["Wins"], b["value"]["Wins"])});

		TeamSort 	= false;
		GoalSort 	= false;
		ResultSort  = false;
		WinSort 	= !WinSort;
		LoseSort 	= false;
		GameSort 	= false;
	}
	else if(text == "Losses")
	{
		if(LoseSort)
			tableElements.sort(function(a, b){return d3.ascending(a["value"]["Losses"], b["value"]["Losses"])});
		else
			tableElements.sort(function(a, b){return d3.descending(a["value"]["Losses"], b["value"]["Losses"])});

		TeamSort 	= false;
		GoalSort 	= false;
		ResultSort  = false;
		WinSort 	= false;
		LoseSort 	= !LoseSort;
		GameSort 	= false;
	}
	else if(text == "Total Games")
	{
		if(GameSort)
			tableElements.sort(function(a, b){return d3.ascending(a["value"]["TotalGames"], b["value"]["TotalGames"])});
		else
			tableElements.sort(function(a, b){return d3.descending(a["value"]["TotalGames"], b["value"]["TotalGames"])});

		TeamSort 	= false;
		GoalSort 	= false;
		ResultSort  = false;
		WinSort 	= false;
		LoseSort 	= false;
		GameSort 	= !GameSort;
	}

	updateTable();
}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******

//console.log(tableElements);
goalScale.domain([0, 18])
		.nice();
		
gameScale.domain([0, 7])
		.nice();
		
aggregateColorScale.domain([0, 7])
		.nice();

var tbody = d3.select("#matchTable").select("tbody");

tbody.selectAll("tr").remove().exit();

var tr = tbody.selectAll("tr")
		.data(tableElements)
		.enter()
		.append("tr")
		.on("click", function(d, i)
		{
			updateList(i);
		})
		.on("mouseover", updateTree)
		.on("mouseout", clearTree);
		
var td = tr.selectAll("td")
		.data(function(d)
		{
			return [
			{"type": d["value"]["type"], "vis": "team", "value": d["key"]},
			{"type": d["value"]["type"], "vis": "goals", "value":
				{
					"Goals Made": d["value"]["Goals Made"],
					"Goals Conceded": d["value"]["Goals Conceded"],
					"Delta Goals": d["value"]["Delta Goals"]
				}
			},
			{"type": d["value"]["type"], "vis": "result", "value": d["value"]["Result"]["label"]},
			{"type": d["value"]["type"], "vis": "bar", "value": d["value"]["Wins"]},
			{"type": d["value"]["type"], "vis": "bar", "value": d["value"]["Losses"]},
			{"type": d["value"]["type"], "vis": "bar", "value": d["value"]["TotalGames"]}]
		})
		.enter()
		.append("td");
	
	td.filter(function(d)
	{
		return d["vis"] == "team";
	})
	.attr("class", function(d)
	{
		if(d["type"] == "aggregate") return "team";
		else	return "game";
	})
	.text(function(d)
	{
		if(d["type"] == "aggregate")
			return d["value"];
		return "x"+d["value"];
	});
	
	td.filter(function(d)
	{
		return d["vis"] == "result";
	})
	.text(function(d)
	{
			return d["value"];
	})
	.style("font-weight", "bold");
	
var svg = td.filter(function(d)
	{
		return d["vis"] == "bar";
	})
	.append("svg")
	.classed("bars", true)
	.attr("width", cellWidth)
	.attr("height", cellHeight)
	.html(function(d)
	{
		if(d["type"] == "aggregate")
		{
			var rect = "<rect class='bar' x='0' y ='0' height='"+barHeight+"' width='"+gameScale(d["value"])+"' fill ='"+aggregateColorScale(d["value"])+"'></rect>";
			var text = "<text class='label' x='"+(gameScale(d["value"])-9)+"' y='10' dy='.35em'>"+d["value"]+"</text>";
			return rect+text;
		}
	});
	
	td.filter(function(d)
	{
		return d["vis"] == "goals";
	})
	.append("svg")
	.classed("bars", true)
	.attr("width", cellWidth * 2)
	.attr("height", cellHeight)
	.html(function(d)
	{
		if(d["type"] == "aggregate")
		{
			var made = parseInt(d["value"]["Goals Made"]);
			var conceded = parseInt(d["value"]["Goals Conceded"]);
			var circle1 = "<circle cx='" +goalScale(made)+"' cy= '10' r ='5' fill='steelblue'></circle>";
			var circle2 = "<circle cx='" +goalScale(conceded) + "'cy= '10' r ='5' fill='red'></circle>";
					
			var bar = "";
			if(made > conceded)
			{
				bar = "<rect class='goalBar' x='" + goalScale(conceded) + "' y ='5' height='10' width='"+(goalScale(made)-goalScale(conceded))+"' fill='steelblue'></rect>";
					return bar + circle1 + circle2
			}
			else if(made < conceded)
			{
				bar = "<rect class='goalBar' x='" + goalScale(made) + "' y ='5' height='10' width='"+(goalScale(conceded)-goalScale(made))+"' fill='red'></rect>";
					return bar + circle1 + circle2;
			}
			else
				return "<circle cx='" +goalScale(made)+"' cy= '10' r ='5' fill='grey'></circle>";
		}
		else
		{
			var made = parseInt(d["value"]["Goals Made"]);
			var conceded = parseInt(d["value"]["Goals Conceded"]);
			var circle1 = "<circle class='ring' cx='" +goalScale(made)+"' cy= '10' r ='5' fill='white' stroke='steelblue' stroke-width='3'></circle>";
			var circle2 = "<circle class='ring' cx='" +goalScale(conceded) + "'cy= '10' r ='5' fill='white' stroke='red' stroke-width='3'></circle>";
			
var bar = "";
			if(made > conceded)
			{
				bar = "<rect class='goalBar' x='" + goalScale(conceded) + "' y ='7.5' height='5' width='"+(goalScale(made)-goalScale(conceded))+"' fill='steelblue'></rect>";
					return bar + circle1 + circle2
			}
			else if(made < conceded)
			{
				bar = "<rect class='goalBar' x='" + goalScale(made) + "' y ='7.5' height='5' width='"+(goalScale(conceded)-goalScale(made))+"' fill='red'></rect>";
					return bar + circle1 + circle2;
			}
			else
				return "<circle cx='" +goalScale(made)+"' cy= '10' r ='5' fill='none' stroke='grey' stroke-width='3'></circle>";
		}
	});
}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******
	var i = 0;
	while(i < tableElements.length)
	{
		if(tableElements[i]["value"]["type"] == "game") {tableElements.splice(i,1)}
		else i++;
	}

	updateTable();
}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******
	if(tableElements[i]["value"]["type"] == "aggregate")
	{
		if(i < tableElements.length -1 && tableElements[i+1]["value"]["type"] == "game")
		{		
			while(i < tableElements.length -1 && tableElements[i+1]["value"]["type"] == "game")
			{
				tableElements.splice(i+1, 1);
			}
		}
		else
		{
			for(var j = 0; j < tableElements[i]["value"]["games"].length; j++)
			{
				tableElements.splice(i+1, 0, tableElements[i]["value"]["games"][j]);
			}
		}
	}
	
	updateTable();

}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******
	
	var tree = d3.tree()
		.size([750, 300])
		
	 treeData.forEach(function(d) {
      if (d.Opponent == "") { d.Opponent = null};
    });
	
	var data = d3.stratify()
    .id(function(d) { return d.id; })
    .parentId(function(d)
	{
		if(d.ParentGame != "")
			return treeData[parseInt(d.ParentGame)].id;
		else	d.id;
	})
    (treeData);
	
	var nodes = d3.hierarchy(data, function(d)
	{
		return d.children;
	});
	
	nodes = tree(nodes);
	
	var g = d3.select("#tree")
		.attr("transform", "translate(90, 0)");
	
	var link = g.selectAll(".link")
		.data(nodes.descendants().slice(1))
		.enter()
		.append("path")
		.classed("link", true)
		.attr("d", function(d) {
			return "M" + d.y + "," + d.x
			+ "C" + (d.y + d.parent.y) / 2 + "," + d.x
			+ " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
			+ " " + d.parent.y + "," + d.parent.x;
       });
	   
	var node = g.selectAll("g")
		.data(nodes.descendants())
		.enter()
		.append("g")
		.attr("class", function(d)
		{
			if(d["data"]["data"]["Wins"] == 1) return "winner";
		})
		.classed("node", true)
		.attr("transform", function(d) { 
			return "translate(" + d.y + "," + d.x + ")"; });

	node.append("circle")
    .attr("r", 6);
	
	node.append("text")
    .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
	.attr("dy", ".3em")
    .attr("x", function(d) { return d.children ? -13 : 13; })
    .text(function(d) { return d["data"]["data"]["Team"];})
};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******
	//console.log(row);

	var team = row["key"];
	var type = row["value"]["type"];
	if(type == "game")	var opponent = row["value"]["Opponent"];
	
	d3.select("#tree").selectAll(".link")
		.filter(function(d)
		{
			if(type == "aggregate")
				return d["data"]["data"]["Team"] == team && d["data"]["data"]["Wins"] == 1;
			else
				return (d["data"]["data"]["Team"] == team && d["data"]["data"]["Opponent"] == opponent) || (d["data"]["data"]["Team"] == opponent && d["data"]["data"]["Opponent"] == team)
		})
		.classed("selected", true);	

	d3.select("#tree").selectAll("g").selectAll("text")
		.filter(function(d)
		{
			if(type == "aggregate")
				return d["data"]["data"]["Team"] == team;
			else
				return (d["data"]["data"]["Team"] == team && d["data"]["data"]["Opponent"] == opponent) || (d["data"]["data"]["Team"] == opponent && d["data"]["data"]["Opponent"] == team)	
		})
		.classed("selectedLabel", true);
}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******
    
	d3.select("#tree").selectAll(".link")
		.classed("selected", false);
		
	d3.select("#tree").selectAll("g").selectAll("text")
		.classed("selectedLabel", false);
}



