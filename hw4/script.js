/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;
var games = {};

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

var rank_ = {
    7: "Winner",
    6: "Runner-Up",
    5: 'Third Place',
    4: 'Fourth Place',
    3: 'Semi Finals',
    2: 'Quarter Finals',
    1: 'Round of Sixteen',
    0: 'Group'
};

//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

/**
d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
})
**/


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
                "label": rank_[d3.max(leaves,function(d){return rank[d["Result"]]})],
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
                                "label": rank_[d3.max(games,function(d){return rank[d["Result"]]})],
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
	console.log(teamData);
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

// ******* TODO: PART V *******
tableElements = [];
teamData.forEach(function(d, i)
{
	var Goals = {made: d["value"]["Goals Made"], conceded: d["value"]["Goals Conceded"]};

	tableElements[i] = {};
	tableElements[d["key"]] = []; 
	tableElements[d["key"]].push({"vis": "team", "value": d["key"]});
	tableElements[d["key"]].push({"vis": "goals", "value": Goals});
	tableElements[d["key"]].push({"vis": "result", "value": d["value"]["Result"]["label"]});
	tableElements[d["key"]].push({"vis": "bar", "value": d["value"]["Wins"]});
	tableElements[d["key"]].push({"vis": "bar", "value": d["value"]["Losses"]});
	tableElements[d["key"]].push({"vis": "bar", "value": d["value"]["TotalGames"]});
	
	var games = d["value"]["games"];
	
});

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******
goalScale.domain([0, 18])
		.nice();
		
gameScale.domain([0, 7])
		.nice();
		
aggregateColorScale.domain([0, 7])
		.nice();

var tbody = d3.select("#matchTable").select("tbody");

var tr = tbody.selectAll("tr")
		.data(Object.keys(tableElements))
		.enter()
		.append("tr")
		.attr("id", function(d)
		{
			return d;
		});
		
var td = tr.selectAll("td")
		.data(function(d)
		{
			return tableElements[d];
		})
		.enter()
		.append("td");
	
	td.filter(function(d)
	{
		return d["vis"] == "team";
	})
	.classed("team", true)
	.text(function(d)
	{
		return d["value"];
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
	.attr("height", cellHeight);
	
	svg.append("rect")
	.classed("bar", true)
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", barHeight)
	.attr("width", function(d)
	{
		return gameScale(d["value"]);
	})
	.attr("fill", function(d)
	{
		return aggregateColorScale(d["value"]);
	});
	
	svg.append("text")
	.classed("label", true)
	.attr("x", function(d)
	{
		return gameScale(d["value"])-9;
	})
	.attr("y", 10)
	.attr("dy", ".35em")
	.text(function(d)
	{
		return d["value"];
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
		var made = parseInt(d["value"]["made"]);
		var conceded = parseInt(d["value"]["conceded"]);
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
			return "<circle cx='" +goalScale(made)+"' cy= '15' r ='5' fill='grey'></circle>";

	});
}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******
	
	var tree = d3.tree()
		.size([750, 330])
		
	 treeData.forEach(function(d) {
      if (d.Opponent == "") { d.Opponent = null};
    });
	
	//console.log(treeData);
	
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
		.attr("transform", "translate(70, 0)");
	
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
	   
	var node = g.selectAll(".node")
		.data(nodes.descendants())
		.enter().append("g")
		.attr("class", function(d) { 
			return "node" + 
			(d.children ? " node--internal" : " node--leaf"); })
		.attr("transform", function(d) { 
			return "translate(" + d.y + "," + d.x + ")"; });

	g.selectAll(".node")
	.append("circle")
    .attr("r", 6);
	
	node.append("text")
    .attr("dy", ".35em")
    .attr("x", function(d) { return d.children ? -13 : 13; })
    .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
    .text(function(d) { return d.data.data.Team;});
};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******
    

}



