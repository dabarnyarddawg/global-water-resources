//MAP OF ACCESS TO IMPROVED WATER RESOURCES
function accessMap() {
    //chart parameters
    var svg = d3.select('#accessmap')
        .attr('width', 900)
        .style('background-color', 'rgb(222,235,247)') //'ocean' color
        .attr('height', 500);

    //define margins and chart extent
    var margin = {top: 20, right: 0, bottom: 20, left: 0},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('fill', '#CCC') // missing values color
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //map base
    var map = d3.map();
    var projection = d3.geoEquirectangular();
    var path = d3.geoPath()
        .projection(projection);

    //color scale with discrete values
    var colorScale = d3.scaleThreshold().range([d3.interpolateRdYlBu(0),
                                        d3.interpolateRdYlBu(.08),
                                        d3.interpolateRdYlBu(.16),
                                        d3.interpolateRdYlBu(.24),
                                        d3.interpolateRdYlBu(.32),
                                        d3.interpolateRdYlBu(.4),
                                        d3.interpolateRdYlBu(.9),
                                        d3.interpolateRdYlBu(.94),
                                        d3.interpolateRdYlBu(.99),
                                        d3.interpolateRdYlBu(1)]);

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);


    //draw map
    function draw(data) {

        //set data threshold values for colors
        colorScale.domain([.5,.55,.60,.70,.80,.90,.94,.97,.99]);

        //map geo information
        var world = data[0];

        //projection parameters
        projection
            .fitWidth(width, world)
            .scale(185)
            .translate([405, 250]);

        //draw country paths
        var country = canvas.append('g')
            .attr('class', 'countries')
            .selectAll('path').data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                    .attr('class', d => ('country ' + d.id))
                    .attr('fill', 'white')
                    .attr('stroke', 'none')
                    .attr('stroke-width', 0.25)
                    .attr('d', path);

        //fade-in animation
        country.transition()
            .attr('fill', d => colorScale(d.drinking_access = map.get(d.id)))
            .attr('stroke', '#AAA')
            .duration(1000);

        //draw country outline meshes
        canvas.append('path')
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr('class', 'countries-mesh')
          .attr('fill', 'none')
          .attr('d', path);

        //create legend
        canvas.append('g')
            .attr('class', 'legendPane horizontal')
            .attr('transform', 'translate('+(width - 350)+','+(height - 60)+')');

        var legend = d3.legendColor()
            .title('Using Improved Water Sources')
            .titleWidth(200)
            .labelFormat(d3.format('.0%'))
            .orient('horizontal')
            .labelAlign('end')
            .shape('rect')
            .shapeWidth(25)
            .shapeHeight(10)
            .shapePadding(4)
            .labels(d3.legendHelpers.thresholdLabels)
            .scale(colorScale);

        //append legend
        canvas.select('.legendPane')
              .call(legend);

        //append tooltip
        country.on('mouseover', d => {
          tooltip.transition()
              .style('opacity', 0.9)
          tooltip.html('<strong>' + d.id + '</strong></br>'
                        + '<strong>Using Improved H<sub>2</sub>0:</strong> ' + d3.format('.1%')(d.drinking_access) + '</br>')
              .style('top', d3.event.pageY + 10 + 'px')
              .style('left', d3.event.pageX + 10 + 'px')
          })
          .on('mouseout', d => {
              tooltip.transition()
                  .style('opacity', 0)
                  .style('top', 0)
                  .style('left', 0)
          });


    }

    //load data
    var fetchjson = Promise.resolve(d3.json('data/world.json'));
    var fetchcsv = Promise.resolve(d3.csv('data/drinking_access_all.csv', d => map.set(
        d.country, +d.drinking_access)));

    Promise.all([fetchjson, fetchcsv]).then(draw);
};

//draw maps
accessMap();
