//SCATTER PLOT OF WATER RESOURCE STRESS AND HDI

function stressHdi() {
    //chart parameters
    var svg = d3.select('#stresshdi')
        .attr('width', 900)
        .attr('height', 650);

    //axis values
    var x = d => d.tfwtrwr,
        y = d => d.hdi,
        z = d => d.gdp_pc;

    //define margins and chart extent
    var margin = {top: 20, right: 75, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleLog().rangeRound([0, width]),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleSqrt().range([d3.interpolateCool(0.2), d3.interpolateCool(0.6)]);

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
        xScale.domain([0.001, 10000]);
        yScale.domain([0.3, 1]);
        colorScale.domain(d3.extent(data, d => z(d)));
        rScale.domain(d3.extent(data, d => z(d)));

        //x axis label
        canvas.append('text')
            .attr('class', 'axis-label xlabel')
            .attr('transform', 'translate('+width/2+','+(height + margin.bottom/2)+')')
            .html('Freshwater Withdrawal Ratio (Log Scale)');

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
            .html('Human Development Index (HDI)');

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

        //create legend
        canvas.append('g')
            .attr('class', 'legendPane')
            .attr('transform', 'translate('+(width - 80)+','+(height - 130)+')');

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
        d3.selectAll('#stresshdi .swatch')
            .attr('r', d => rScale(d));

        //draw circles
        var circle = canvas.selectAll('circle').data(data)
            .enter().append('circle')
                .attr('class', 'circle')
                .attr('cx', -115)
                .attr('cy', (height + 20))
                .attr('r', 0)
                .style('fill', d => colorScale(z(d)))

        //circle opening animation
            circle.transition()
                .attr('cx', d => xScale(x(d)))
                .attr('cy', d => yScale(y(d)))
                .attr('r', d => rScale(z(d)))
                .delay(700)
                .delay((d,i) => i*10)
                .duration(800)
                .ease(d3.easeCircleOut)

            //tooltip
            circle.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + d.country + '</strong>' + '</br>'
                        + '<strong>HDI:</strong> ' + d3.format('.2f')(y(d)) + '</br>'
                        + '<strong>Freshwater W/d:</strong> ' + d3.format(',.2f')(x(d)) + '</br>'
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
            gdp_pc: +d.gdp_pc,
            hdi: +d.hdi,
            population: +d.population,
            tfwtrwr: +d.tfwtrwr

        };
    };

    //load data and draw chart
    d3.csv('data/water_econ_corr.csv', parse).then(draw);
};


//SCATTER PLOT OF IMPROVED WATER ACCESS AND HDI

function accessHdi() {
    //chart parameters
    var svg = d3.select('#accesshdi')
        .attr('width', 900)
        .attr('height', 650)
        .style('opacity', 0);

    //axis values
    var x = d => d.water_access,
        y = d => d.hdi,
        z = d => d.population;

    //define margins and chart extent
    var margin = {top: 20, right: 75, bottom: 130, left: 75},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    //define scales
    var xScale = d3.scaleLinear().rangeRound([0, width]),
        yScale = d3.scaleLinear().rangeRound([height, 0]);

    //define color scale
    var colorScale = d3.scaleSqrt().range([d3.interpolatePlasma(0.1), d3.interpolatePlasma(0.6)]);

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
        xScale.domain([0.35, 1]);
        yScale.domain([0.3, 1]);
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
                .ticks(5, '.0%'));

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
            .html('Human Development Index (HDI)');

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

        //append y gridlines
        canvas.append('g')
            .attr('class', 'grid')
            .call(draw_y_gridlines()
                .tickSize(-width)
                .tickFormat(''));

        //create legend
        canvas.append('g')
            .attr('class', 'legendPane')
            .attr('transform', 'translate('+70+','+15+')');

        var legend = d3.legendColor()
            .title('Population')
            .titleWidth(100)
            .shape('circle')
            .shapePadding(5)
            .labels(({i,generatedLabels}) => d3.format(',.2r')(generatedLabels[i] * 1000))
            .scale(colorScale);

        //append legend
        canvas.select('.legendPane')
            .call(legend);

        //scale legend circles to match chart
        d3.selectAll('#accesshdi .swatch')
            .attr('r', d => rScale(d));

        //draw circles
        var circle = canvas.selectAll('circle').data(data)
            .enter().append('circle')
                .attr('class', 'circle')
                .attr('cx', d => xScale(x(d)))
                .attr('cy', d => yScale(y(d)))
                .style('fill', d => colorScale(z(d)))
                .attr('r', d => rScale(z(d)));

            //chart fade in
            svg.transition()
                .style('opacity', 1)
                .delay(1500)
                .duration(800);

            //tooltip
            circle.on('mouseover', d => {
                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html('<strong>' + d.country + '</strong>' + '</br>'
                        + '<strong>HDI:</strong> ' + d3.format('.2f')(y(d)) + '</br>'
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
            water_access: +d.water_access,
            gdp_pc: +d.gdp_pc,
            hdi: +d.hdi,
            population: +d.population
        };
    };

    //load data and draw chart
    d3.csv('data/drinking_access_econ.csv', parse).then(draw);
};

// load charts
stressHdi();
accessHdi();
