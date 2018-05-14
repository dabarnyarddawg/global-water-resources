//TOP COUNTRIES CHART
function topCountries() {
    //chart parameters
    var svg = d3.select('#trwrpctop')
        .attr('width', 450)
        .attr('height', 600);

    //axis values
    var x = d => d.country
        y = d => d.renew_pc,
        z = d => d.dependency;

    //define margins and chart extent
    var margin = {top: 20, right: 50, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleLinear().range([d3.interpolatePlasma(0), d3.interpolatePlasma(0.5)]);

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //create y gridlines
    function draw_y_gridlines() {
        return d3.axisLeft(yScale).ticks(5);
    };

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);

    //define chart
    function draw(data) {
        //init scales
        xScale.domain(data.map(d => x(d)));
        yScale.domain([0, d3.max(data, d => y(d) + 10000)]);
        colorScale.domain([0, 1]);

        //append x axis group
        canvas.append('g')
            .attr('class', 'axis axis-x text45')
            .attr('transform', 'translate(0,' + height +  ')')
            .call(d3.axisBottom(xScale));

        //y axis label
        canvas.append('text')
            .attr('class', 'axis-label ylabel')
            .attr('transform', 'rotate(-90) translate('+-height/2+','+-margin.left/2+')')
            .html('m<tspan class=sup>3</tspan> H<tspan class=sub>2</tspan>0 Per Capita');

        //append y axis group
        canvas.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(yScale).ticks(10, 's'));

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(draw_y_gridlines()
                .tickSize(-width)
                .tickFormat(''));

        //append data bars group
        var bar = canvas.selectAll('bar').data(data)
            .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(x(d)))
                .attr('y', height)
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .style('fill', d => colorScale(z(d)))
        //bar load animation
            bar.transition()
                .attr('height', d => height - yScale(y(d)))
                .attr('y', d => yScale(y(d)))
                .delay(500)
                .duration(800)
                .ease(d3.easeCircleOut);

            //create legend
            canvas.append('g')
              .attr('class', 'legendPane')
              .attr('transform', 'translate('+(width-10)+','+(105)+')');

            var legend = d3.legendColor()
              .title('Dependency Ratio')
              .titleWidth(50)
              .labelFormat(d3.format('.0%'))
              .labelOffset(5)
              .orient('vertical')
              .labelAlign('start')
              .shape('rect')
              .shapeWidth(20)
              .scale(colorScale);

            //append legend
            canvas.select('.legendPane')
              .call(legend);

            //tooltip
            bar.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + x(d) + '</strong>' + '</br>'
                        + '<strong>TRWR:</strong> ' + d3.format(',.0f')(y(d)) + ' m<sup>3</sup>/pp</br>'
                        + '<strong>Dependency Ratio:</strong> ' + d3.format('.1%')(z(d)))
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
            dependency: +d.dependency,
            tot_renew: +d.tot_renew,
            renew_pc: +d.renew_pc
        };
    };

    //load data and draw chart
    d3.csv('data/renew_pc_top15.csv', parse).then(draw);
};


//BOTTOM COUNTRIES CHART
function bottomCountries() {
    //chart parameters
    var svg = d3.select('#trwrpcbot')
        .attr('width', 450)
        .attr('height', 600);

    //axis values
    var x = d => d.country,
        y = d => d.renew_pc,
        z = d => d.dependency;

    //define margins and chart extent
    var margin = {top: 20, right: 50, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleLinear().range([d3.interpolatePlasma(0), d3.interpolatePlasma(0.5)]);

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //create y gridlines
    function draw_y_gridlines() {
        return d3.axisLeft(yScale).ticks(5);
    };

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);

    //define chart
    function draw(data) {
        //init scales
        xScale.domain(data.map(d => x(d)));
        yScale.domain([0, d3.max(data, d => y(d) + 10)]);
        colorScale.domain([0, 1]);

        //append x axis group
        canvas.append('g')
            .attr('class', 'axis axis-x text45')
            .attr('transform', 'translate(0,' + height +  ')')
            .call(d3.axisBottom(xScale));

        //y axis label
        canvas.append('text')
            .attr('class', 'axis-label ylabel')
            .attr('transform', 'rotate(-90) translate('+-height/2+','+-margin.left/2+')')
            .html('m<tspan class=sup>3</tspan> H<tspan class=sub>2</tspan>0 Per Capita');

        //append y axis group
        canvas.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(yScale).ticks(10));

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(draw_y_gridlines()
                .tickSize(-width)
                .tickFormat(''));

        //append data bars group
        var bar = canvas.selectAll('bar').data(data)
            .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(x(d)))
                .attr('y', height)
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .style('fill', d => colorScale(z(d)))
        //bar loading animation
            bar.transition()
                .attr('height', d => height - yScale(y(d)))
                .attr('y', d => yScale(y(d)))
                .delay(700)
                .duration(1000)
                .ease(d3.easeCircleOut);

            //tooltip
            bar.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + x(d) + '</strong>' + '</br>'
                        + '<strong>TRWR:</strong> ' + d3.format('.2f')(y(d)) + ' m<sup>3</sup>/pp</br>'
                        + '<strong>Dependency Ratio:</strong> ' + d3.format('.1%')(z(d)))
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
            dependency: +d.dependency,
            tot_renew: +d.tot_renew,
            renew_pc: +d.renew_pc
        };
    };

    //load data and draw chart
    d3.csv('data/renew_pc_bot15.csv', parse).then(draw);
};

//load charts
topCountries();
bottomCountries();
