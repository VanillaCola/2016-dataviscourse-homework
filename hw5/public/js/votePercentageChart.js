/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format */
             tooltip_data = {
             "result":[
             {"nominee": electionResult[0].D_Nominee_prop,"votecount": parseInt(electionResult[0].D_Votes_Total),"percentage": parseFloat(electionResult[0].D_PopularPercentage),"party":"D"} ,
             {"nominee": electionResult[0].R_Nominee_prop,"votecount": parseInt(electionResult[0].R_Votes_Total),"percentage": parseFloat(electionResult[0].R_PopularPercentage),"party":"R"} ,
             {"nominee": electionResult[0].I_Nominee_prop,"votecount": parseInt(electionResult[0].I_Votes_Total),"percentage": parseFloat(electionResult[0].I_PopularPercentage),"party":"I"}
             ]
             }
			/*
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            return self.tooltip_render(tooltip_data);
        });


    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
	
		
	self.svg.selectAll("rect").remove();
	
	self.svg.selectAll("text").remove();
	//console.log(electionResult);


	var D_PopularPercentage = parseFloat(electionResult[0].D_PopularPercentage);
	var R_PopularPercentage = parseFloat(electionResult[0].R_PopularPercentage);
	var I_PopularPercentage = parseFloat(electionResult[0].I_PopularPercentage == "" ? "0" : electionResult[0].I_PopularPercentage);
	
	var percentageScale = d3.scaleLinear()
		.range([0, self.svgWidth])
        .domain([0, D_PopularPercentage + R_PopularPercentage + I_PopularPercentage]);
		
	var x = 0;
	self.svg.selectAll("rect")
		.data([{"party":"I", "percentage":I_PopularPercentage}, {"party":"D", "percentage":D_PopularPercentage},{"party":"R", "percentage": R_PopularPercentage}])
		.enter()
		.append("rect")
		.attr("x", function(d)
		{
			var cur_x = x;
			x += d.percentage;
			return percentageScale(cur_x);
		})
		.attr("y", 60)
		.attr("height", 25)
		.attr("width", function(d)
		{
			return percentageScale(d.percentage);
		})
		.style("fill", function(d)
		{
			if(d.party == "I")	return "#45AD6A";
			else if(d.party == "D") return "#0066CC";
			else	return "#CC0000";
		})
		.call(tip)
    	.on("mouseenter", tip.show)
		.on("mouseout", tip.hide)
		.classed("votePercentage ", true);
		
	self.svg.append('text')
        .text(electionResult[0].D_PopularPercentage)
        .attr('x', percentageScale(electionResult[0].I_PopularPercentage == "" ? 0 : parseFloat(electionResult[0].I_PopularPercentage)+10))
        .attr('y', 55)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('D'))
		.classed("votesPercentageText ", true);
		
	self.svg.append('text')
        .text(electionResult[0].R_PopularPercentage)
        .attr('x', self.svgWidth)
        .attr('y', 55)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('R'))
		.classed("votesPercentageText ", true);

    self.svg.append('text')
        .text(electionResult[0].I_PopularPercentage)
        .attr('x', 0)
        .attr('y', 55)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('I'))
		.classed("votesPercentageText ", true);
		
	self.svg.append('text')
        .text(electionResult[0].D_Nominee_prop)
        .attr('x', percentageScale(electionResult[0].I_PopularPercentage == "" ? 0 : parseFloat(electionResult[0].I_PopularPercentage)+18))
        .attr('y', 15)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('D'))
		.classed("votesPercentageText ", true);
		
	self.svg.append('text')
        .text(electionResult[0].R_Nominee_prop)
        .attr('x', self.svgWidth)
        .attr('y', 15)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('R'))
		.classed("votesPercentageText ", true);

    self.svg.append('text')
        .text(electionResult[0].I_Nominee_prop)
        .attr('x', 0)
        .attr('y', 15)
        .attr('width', 200)
        .attr('class', VotePercentageChart.prototype.chooseClass('I'))
		.classed("votesPercentageText ", true);
	
    self.svg.append('text')
        .text('Popular Vote (50%)')
        .attr('x', self.svgWidth/2)
        .attr('y', 50)
        .attr('width', 200)
        .classed("votesPercentageNote", true);

	self.svg.append('line')
        .attr("x1", self.svgWidth/2)
        .attr("y1", 54)
        .attr("x2", self.svgWidth/2)
        .attr("y2", 91)
		.style("stroke", "#000000")
		.style("stroke-width", "2px")
        .classed("middlePoint", true);	
		
};
