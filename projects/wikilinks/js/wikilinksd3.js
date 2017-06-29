var svg = d3.select("#d3-display");
var width = +svg.attr("width");
var height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

svg.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "none")
	.style("pointer-events", "all")
	.call(d3.zoom()
		.scaleExtent([1 / 4, 4])
		.on("zoom", zoomed));

var g = svg.append("g");

function zoomed() {
	g.attr("transform", d3.event.transform);
}

var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function (d) {
		return d.id;
	}))
	.force("charge", d3.forceManyBody().strength(-30))
	.force("center", d3.forceCenter(width / 2, height / 2));

d3.json("./js/graph_data.json", function (error, graph) {
	if (error) throw error;

	var link = g.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
		.attr("stroke-width", function (d) { return 1; });

	var node = g.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		.attr("r", 5)
		.attr("fill", function (d) { return "#c65753"; })
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	node.append("title")
		.text(function (d) { return d.id; });

	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(graph.links);

	// simulation.on("tick", function () {
	// 	nodes.attr("transform", function (d) {
	// 		return "translate(" + Math.min(0, 5) + "," + Math.min(0, 5) + ")";
	// 	});
	// });

	function ticked() {
		link
			.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });

		node
			.attr("cx", function (d) { return d.x; })
			.attr("cy", function (d) { return d.y; });
	}
});

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}
