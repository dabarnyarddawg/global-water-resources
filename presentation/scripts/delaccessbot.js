//BOX PLOT

//chart parameters
function boxPlot() {
    var svg = d3.select('#delaccess')
        .attr('width', 900)
        .attr('height', 650)

    //axis values
    var x = d => d.country,
        yStart = d => d.first,
        yEnd = d => d.last,
        z = d => d.change;

    //define margins and chart extent
    var margin = {top: 20, right: 75, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleBand().rangeRound([0, width]),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleLog().range([d3.interpolateInferno(.6), d3.interpolateInferno(.3)]);

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //create x gridlines
    function draw_x_gridlines() {
        return d3.axisBottom(xScale).ticks();
    };

    //create y gridlines
    function draw_y_gridlines() {
        return d3.axisLeft(yScale).ticks();
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
        yScale.domain([.55, 1]);
        colorScale.domain([d3.min(data, d => z(d)), d3.max(data, d => z(d))]);

        //append x axis group
        canvas.append('g')
            .attr('class', 'axis axis-x text45')
            .attr('transform', 'translate(0,' + height +  ')')
            .call(d3.axisBottom(xScale));

        //append y axis group
        canvas.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(yScale).ticks(10, 'p'));

        //append x gridlines
        canvas.append('g')
            .attr('class', 'grid-x')
            .call(draw_x_gridlines()
                .tickSize(height)
                .tickFormat(''));

        //y axis label
        canvas.append('text')
            .attr('class', 'axis-label xlabel')
            .attr('transform', 'rotate(-90) translate('+-height/2+','+(-margin.left/2)+')')
            .html('Population Using Improved Water Sources');

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid grid-y')
            .call(draw_y_gridlines()
                .tickSize(-width)
                .tickFormat(''));

        //create legend
        canvas.append('g')
            .attr('class', 'legendPane')
            .attr('transform', 'translate('+(width - 99)+','+(height - 115)+')');

        var legend = d3.legendColor()
            .title('Percentage Point Change')
            .titleWidth(100)
            .labels(({i,generatedLabels}) => d3.format('.2r')(generatedLabels[i] * 100))
            //.labelFormat(d3.format('.1%'))
            .scale(colorScale);

        //append legend
        canvas.select('.legendPane')
            .call(legend);

        //append data box plot group
        var box = canvas.selectAll('box').data(data)
            .enter().append('rect')
                .attr('class', 'box')
                .attr('x', d => xScale(x(d)) + xScale.bandwidth()/(8/3))
                .attr('y', d => (yScale(yStart(d)) + yScale(yEnd(d)))/2)
                .attr('width', d => (xScale.bandwidth()/4))
                .attr('height', 0)
                .style('fill', '#FFF');

        //append endpoint "whiskers"
        var whiskerTop = canvas.selectAll('whisker').data(data)
            .enter().append('line')
                .attr('class', 'whisker top')
                .attr('x1', d => xScale(x(d)) + xScale.bandwidth()/4)
                .attr('y1', d => yScale(yStart(d)))
                .attr('x2', d => xScale(x(d)) + xScale.bandwidth()/(4/3))
                .attr('y2', d => yScale(yStart(d)))
                .style('opacity', 0)
                .style('stroke', d => colorScale(z(d)));

        //append endpoint "whiskers"
        var whiskerBot = canvas.selectAll('whisker').data(data)
            .enter().append('line')
                .attr('class', 'whisker bottom')
                .attr('x1', d => xScale(x(d)) + xScale.bandwidth()/4)
                .attr('y1', d => yScale(yEnd(d)))
                .attr('x2', d => xScale(x(d)) + xScale.bandwidth()/(4/3))
                .attr('y2', d => yScale(yEnd(d)))
                .style('opacity', 0)
                .style('stroke', d => colorScale(z(d)));

            //box scroll-in animation
            box.transition()
                .attr('y', d => yScale(yStart(d)))
                .attr('height', d => (yScale(yEnd(d)) - yScale(yStart(d))))
                .style('fill', d => colorScale(z(d)))
                .delay(700)
                .duration(1000)
                .ease(d3.easeCubicOut);

            //whisker fade-in
            whiskerTop.transition()
                .style('opacity', 1)
                .delay(700)
                .duration(800)
                .ease(d3.easeCubicOut);

            whiskerBot.transition()
                .style('opacity', 1)
                .delay(700)
                .duration(800)
                .ease(d3.easeCubicOut);


            //add text annotation to Algeria bar
            canvas.append('text')
                .attr('class', 'annotation')
                .attr('transform', 'translate(150,90)')
                .style('text-anchor', 'end')
                .style('opacity', 0)
                .text('1992')
                .style('font-size', '0.7em')
                .style('fill', '#4679A3')
                .transition()
                    .style('opacity', 1)
                    .delay(900)
                    .duration(800)
                    .ease(d3.easeCubicOut);

            canvas.append('text')
                .attr('class', 'annotation')
                .attr('transform', 'translate(150,195)')
                .style('text-anchor', 'end')
                .style('opacity', 0)
                .text('2015')
                .style('font-size', '0.7em')
                .style('fill', '#4679A3')
                .transition()
                    .style('opacity', 1)
                    .delay(900)
                    .duration(800)
                    .ease(d3.easeCubicOut);

            //tooltip
            box.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + x(d) + '</strong>' + '</br>'
                        + '<strong>1992:</strong> ' + d3.format('.1%')(yStart(d)) + '</br>'
                        + '<strong>2015:</strong> ' + d3.format('.1%')(yEnd(d)) + '</br>'
                        + '<strong>Change:</strong> ' + d3.format('.1f')(z(d)*100))
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
            first: +d.first,
            last: +d.last,
            change: +d.change
        };
    };

    //load data and draw chart
    d3.csv('data/access_del_bot10.csv', parse).then(draw);
};

//LINE CHART

function lineChart() {
    //chart parameters
    var svg = d3.select('#delaccessts')
        .attr('width', 900)
        .attr('height', 650)
        .style('opacity', 0);

    //define margins and chart extent
    var margin = {top: 20, right: 75, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleTime().range([0, width])
        yScale = d3.scaleLinear().range([height, 0])
        colorScale = d3.scaleOrdinal(['#101D72', '#CB3E11', '#7D1E00', '#0F657E', '#135083']);

    //create chart group
    var canvas = svg.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //create line
    var line = d3.line()
       .x(d => xScale(d.year))
       .y(d => yScale(d.percent));

    //create tooltip
    var tooltip = d3.select('.content').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('opacity', 0);

    //define chart
    function draw(data) {

        //map countries to array with values inside inner arrays
        var countries = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {year: d.year, percent: d[id]};
                    })
                };
            });

        //init scales
        xScale.domain(d3.extent(data, d => d.year));
        yScale.domain([.55, 1]);
        colorScale.domain(countries.map(c => c.id));

        //append x axis group
        canvas.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', 'translate(0,' + height +  ')')
            .call(d3.axisBottom(xScale).ticks());

        //append x gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(d3.axisBottom(xScale)
                .tickSize(height)
                .tickFormat('')
                .ticks());

        //y axis label
        canvas.append('text')
            .attr('class', 'axis-label ylabel')
            .attr('transform', 'rotate(-90) translate('+-height/2+','+-margin.left/2+')')
            .html('Population Using Improved Water Sources');

        //append y axis group
        canvas.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(yScale).ticks(5, 'p'));

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
                .ticks(5));

        //fade in chart
        svg.transition()
            .style('opacity', 1)
            .delay(1500)
            .duration(800);

        //draw lines
        var country = canvas.selectAll('.country').data(countries)
            .enter().append('g')
                .attr('class', 'country');

        country.append('path')
            .attr('class', 'line')
            .attr('d', d => line(d.values))
            .style('fill', 'none')
            .style('stroke-width', 3)
            .style('opacity', 0.9)
            .style('stroke', d => colorScale(d.id));

        // add country labels
        country.append('text')
            .datum(function(d) { return {id: d.id, value: d.values[1]}; })
            .attr('class', 'line-label')
            .attr('transform', d => 'translate(' + xScale(d.value.year) + ',' + yScale(d.value.percent) + ')')
            .attr('x', 3)
            .attr('y', -6)
            .text(d => d.id)
            .style('fill', d => colorScale(d.id));

        //add circle marks and tooltips (requires loop through each country for svg primative)
        countries.forEach(
            function(c) {
                country.append('g')
                    .selectAll('circle').data(c.values).enter()
                        .append('circle')
                            .attr('class', 'marker circle')
                            .attr('r', 5)
                            .attr('cx', d => xScale(d.year))
                            .attr('cy', d => yScale(d.percent))
                            .attr('stroke', colorScale(c.id))
                            .attr('fill', 'white')
                            .style('opacity', 1)

                            .on('mouseover', d => {
                                tooltip.transition()
                                    .style('opacity', 0.9)
                                tooltip.html('<strong>' + c.id + '</strong> </br>'
                                        + '<strong>Year:</strong> ' + d3.timeFormat('%Y')(d.year) + '</br>'
                                        + '<strong>Percent:</strong> ' + d3.format('.1%')(d.percent))
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
        );
    };

    function parse(d, _, columns) {
      d.year = d3.timeParse('%Y')(d.year);
      for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
      return d;
    };

    //load data and draw chart
    d3.csv('data/access_yrly_bot5.csv', parse).then(draw);
};

//load charts
boxPlot();
lineChart();
