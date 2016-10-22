
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(shiftChart){

    var self = this;
	self.shiftChart = shiftChart;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
	
	electionResult = electionResult.sort(function (a,b)
	{
		//return d3.ascending(a.State_Winner, b.State_Winner) || d3.ascending(a.RD_difference, b.RD_difference);
		if(a.State_Winner == "I") return -1;
		else if(b.State_Winner == "I") return 1;
		
		return parseFloat(a.RD_Difference) - parseFloat(b.RD_Difference);
	});
	
	self.svg.selectAll("rect").remove();
	
	self.svg.selectAll("text").remove();
	
	var electoralScale = d3.scaleLinear()
		.range([0, self.svgWidth])
        .domain([0, d3.sum(electionResult, function (d) {return d.Total_EV})]);
	
	var rectangles = [];
	
	self.svg.selectAll("rect")
		.data(electionResult)
		.enter()
		.append("rect")
		.attr("x", function(d, i)
		{
			var x = electoralScale(d3.sum(electionResult.slice(0,i), function (d) {return d.Total_EV}));
			rectangles[i] = {"left": x, "right": x + electoralScale(d.Total_EV)}; 
			return x;
		})
		.attr("y", 30)
		.attr("height", 25)
		.attr("width", function(d, i)
		{
			return electoralScale(d.Total_EV);
		})
		.style("fill", function(d)
		{
			if(d.State_Winner == "I")	return "#45AD6A";
			return colorScale(d.RD_Difference);
		})
		.classed("electoralVotes", true);
		
	self.svg.append('text')
        .text(d3.max(electionResult, function (d) {return d.D_EV_Total}))
        .attr('x', electoralScale(d3.max(electionResult, function (d) {
            if (d.I_EV_Total == "") {return 0}
            else {return d.I_EV_Total}
        })))
        .attr('y', 25)
        .attr('width', 200)
        .attr('class', ElectoralVoteChart.prototype.chooseClass('D'))
		.classed("electoralVoteText", true);
	
	self.svg.append('text')
        .text(d3.max(electionResult, function (d) {return d.R_EV_Total}))
        .attr('x', self.svgWidth)
        .attr('y', 25)
        .attr('width', 200)
        .attr('class', ElectoralVoteChart.prototype.chooseClass('R'))
		.classed("electoralVoteText", true);

    self.svg.append('text')
        .text(d3.max(electionResult, function (d) {return d.I_EV_Total}))
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 200)
        .attr('class', ElectoralVoteChart.prototype.chooseClass('I'))
		.classed("electoralVoteText", true);
		
    self.svg.append('text')
        .text('Electoral Vote (270 needed to win)')
        .attr('x', self.svgWidth/2)
        .attr('y', 20)
        .attr('width', 200)
        .classed("electoralVotesNote", true);
		
    self.svg.append('line')
        .attr("x1", self.svgWidth/2)
        .attr("y1", 24)
        .attr("x2", self.svgWidth/2)
        .attr("y2", 61)
		.style("stroke", "#000000")
		.style("stroke-width", "2px")
        .classed("middlePoint", true);
	
    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
	
	var brush = d3.brushX().extent([[0, self.svgHeight*0.1], [self.svgWidth, self.svgHeight*0.45]]).on("end", brushed);
	
	self.svg.append("g").attr("class", "brush").call(brush);
	
	function brushed() {
        var brushedStates = [];
        var selection = d3.event.selection;
        for (var i = 0; i < rectangles.length; i++) {
            if (selection[0] < rectangles[i]["left"] && selection[1] > rectangles[i]["right"]) {
                brushedStates.push(electionResult[i].State);
            }
        }
		console.log(self);
        self.shiftChart.update(brushedStates);
    }

};
