//MAP OF TOTAL RENEWABLE WATER RESOURCES PER CAPITA
function trwrMap() {
    //chart parameters
    var svg = d3.select('#trwrpcmap')
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
        .attr('fill', '#FFF') // missing values color
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //map base
    var map = d3.map();
    var projection = d3.geoEquirectangular();
    var path = d3.geoPath()
        .projection(projection);

    //define color scale: map values to discrete colors
    var colorScale = d3.scaleQuantile().range(d3.schemeYlGnBu[9]);

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);

    //define rounding function
    function precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
}


    //draw map
    function draw(data) {

        //list to hold rounded data values
        roundDomain = [];
        //round data points for better visualization coloring
        map.values().forEach(d => roundDomain.push(precisionRound(d, -2)))
        colorScale.domain(roundDomain);

        //geo information
        var world = data[0];

        //projection parameters
        projection
            .fitWidth(width, world)
            .scale(185)
            .translate([405, 250]);

        //draw countries
        var country = canvas.append('g')
            .attr('class', 'countries')
            .selectAll('path').data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                    .attr('class', d => ('country ' + d.id))
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr('stroke', 'none')
                    .attr('stroke-width', 0.25)
                    .attr('d', path);

        //fade-in animation
        country.transition()
            .attr('fill', d => colorScale(d.renew_pc = map.get(d.id)))
            .attr('stroke', '#AAA')
            .delay((d,i) => i*3)
            .duration(700);

        //draw country ountline meshes
        canvas.append('path')
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr('class', 'countries-mesh')
          .attr('fill', 'none')
          .attr('d', path);

        //create legend
        canvas.append('g')
          .attr('class', 'legendPane horizontal')
          .attr('transform', 'translate('+(width - 350)+','+(height - 70)+')');

        var legend = d3.legendColor()
          .title('Total Renewable Water Resources Per Capita (cubic meters/pp)')
          .titleWidth(200)
          .labelFormat(d3.format(',.2s'))
          .orient('horizontal')
          .labelAlign('end')
          .shape('rect')
          .shapeWidth(25)
          .shapeHeight(10)
          .shapePadding(4)
          .scale(colorScale);

        //append legend
        canvas.select('.legendPane')
              .call(legend);

        //append tooltip
        country.on('mouseover', d => {
          tooltip.transition()
              .style('opacity', 0.9)
          tooltip.html('<strong>' + d.id + '</strong></br>'
                        + '<strong>TRWR:</strong> ' + d3.format(',.0f')(d.renew_pc) + ' m<sup>3</sup>/pp</br>')
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
    var fetchcsv = Promise.resolve(d3.csv('data/renew_all.csv', d => map.set(
        d.country, +d.renew_pc)));

    Promise.all([fetchjson, fetchcsv]).then(draw);
};

//draw maps
trwrMap();
