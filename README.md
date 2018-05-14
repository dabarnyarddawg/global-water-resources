# Global Water Resources
This is an web-based presentation on global water resources with visualizations created using d3.js (v5.1.0).

## File Structure
code: contains a Jupyter Notebook file with Python code to clean the data

data:

	AQUASTAT: contains the raw data downloaded from AQUASTAT (see below)

  clean: contains the cleaned data (output from Jupyter Notebook file) ne_110m_admin_0_countries: contains the world map shapefile and translations
  into GeoJson and TopoJson

presentation: contains the HTML, javascript and CSS code to create the presentation, along with a duplicate copy of the clean dataset. to view the presentation, host this entire folder on a web server.

  d3: contains minified versions of d3.js v5.1.0 and the d3 Legend plugin by Susie Lu (https://github.com/susielu/d3-legend).

  data: contains a duplicate copy of the clean data for hosting on the web server

  scripts: contains the javascript files for each visualization

  styles: contains the CSS file and title page image

## Sources
Total renewable water resources per capita, dependency ratio, access to improved water sources, freshwater withdrawal, dam capacity, human development index, gross domestic product per capita, population. AQUASTAT. Published by the Food and Agriculture Organization of the United Nations, 2016: http://www.fao.org/nr/water/aquastat/sets/index.stm#main
Accessed 3/24/2018.

1:100m Resolution Cultural Vectors (Admin 0 - Countries), v4.0.0 shapefile. Published by Natural Earth, October 10, 2017: http://www.naturalearthdata.com/downloads/110m-cultural-vectors/. Accessed 5/4/2018.  
