//SCATTER PLOT OF IMRPOVED WATER ACCESS AND DAM CAPACITY

function damAccess() {
    //chart parameters
    var svg = d3.select('#damaccess')
        .attr('width', 900)
        .attr('height', 650);

    //axis values
    var x = d => d.water_access,
        y = d => d.dam_capacity
        z = d => d.gdp_pc;

    //define margins and chart extent
    var margin = {top: 20, right: 75, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleLinear().rangeRound([0, width]),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleSqrt().range([d3.interpolateCool(0.3), d3.interpolateBlues(1)]);

    //define size scale
    var rScale = d3.scaleSqrt().range([5, 12]);

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //create x gridlines
    function draw_x_gridlines() {
        return d3.axisBottom(xScale).ticks(5);
    };

    //create y gridlines
    function draw_y_gridlines() {
        return d3.axisLeft(yScale).ticks(6);
    };

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);

    //define chart
    function draw(data) {

        //init scales
        xScale.domain([0.4, 1]);
        yScale.domain([0, 180]);
        colorScale.domain(d3.extent(data, d => z(d)));
        rScale.domain(d3.extent(data, d => z(d)));

        //x axis label
        canvas.append('text')
            .attr('class', 'axis-label xlabel')
            .attr('transform', 'translate('+width/2+','+(height + margin.bottom/2)+')')
            .html('Population Using Improved Water Sources');

        //append x axis group
        canvas.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', 'translate(0,' + height +  ')')
            .call(d3.axisBottom(xScale)
                .ticks(5, ','));

        //append x gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(draw_x_gridlines()
                .tickSize(height)
                .tickFormat(''));

        //y axis label
        canvas.append('text')
            .attr('class', 'axis-label ylabel')
            .attr('transform', 'rotate(-90) translate('+-height/2+','+-margin.left/2+')')
            .html('Dam Capacity (km<tspan class=sup>3</tspan>)');

        //append y axis group
        canvas.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(yScale));

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(draw_y_gridlines()
                .tickSize(-width)
                .tickFormat(''));

        //draw circles
        var circle = canvas.selectAll('circle').data(data)
            .enter().append('circle')
                .attr('class', 'circle')
                .attr('cx', d => xScale(x(d)))
                .attr('cy', - 50)
                .attr('r', d => rScale(z(d)))
                .style('fill', 'white')

            circle.transition()
                .attr('cx', d => xScale(x(d)))
                .attr('cy', d => yScale(y(d)))
                .style('fill', d => colorScale(z(d)))
                .delay((d,i) => i*15)
                .duration(1000)
                .ease(d3.easeCircleOut)

            //create legend
            canvas.append('g')
                .attr('class', 'legendPane')
                .attr('transform', 'translate('+(25)+','+(10)+')');

            var legend = d3.legendColor()
                .title('GDP Per Capita')
                .shape('circle')
                .shapePadding(5)
                .titleWidth(100)
                .labelFormat(d3.format('$,.1r'))
                .scale(colorScale);

            //append legend
            canvas.select('.legendPane')
                .call(legend);

            //scale legend circles to match chart
            d3.selectAll('.swatch')
                .attr('r', d => rScale(d));

            //tooltip
            circle.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + d.country + '</strong>' + '</br>'
                        + '<strong>Dam Capacity:</strong> ' + d3.format('.0f')(y(d)) + ' km<sup>3</sup></br>'
                        + '<strong>Using Improved H<sub>2</sub>0:</strong> ' + d3.format('.1%')(x(d)) + '</br>'
                        + '<strong>GDP Per Capita:</strong> ' + d3.format('$,.0f')(d.gdp_pc) + '</br>'
                        + '<strong>Population:</strong> ' + d3.format(',')(d.population) + ' k')
                    .style('top', d3.event.pageY + 10 + 'px')
                    .style('left', d3.event.pageX + 10 + 'px')
                })
                .on('mouseout', d => {
                    tooltip.transition()
                        .style('opacity', 0)
                        .style('top', 0)
                        .style('left', 0)
                });
    };

    //data parser
    function parse(d) {
        return {
            country: d.country,
            dam_capacity: +d.dam_capacity,
            water_access: +d.water_access,
            gdp_pc: +d.gdp_pc,
            hdi: +d.hdi,
            population: +d.population
        };
    };

    //load data and draw chart
    d3.csv('data/dam_capacity_drinking_access.csv', parse).then(draw);
};

// load charts
damAccess();
