function buildPlots(name){
	// Step 1: Plotly
	// Use the D3 library to read in samples.json.
	d3.json("../data/samples.json").then(function(data){
		
		// Check for specified person in samples
		data.samples.forEach(sample => {

			if (parseInt(sample.id) === parseInt(name)) {
				
				// 2) Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

				var topOtuIds = sample.otu_ids.slice(0,10);
				var idsStr = topOtuIds.map(id => `OTU ${id}`);
				var topSampleValues = sample.sample_values.slice(0,10);
				var topOtuLabels = sample.otu_labels.slice(0,10);


				var trace1 = [{
					y: idsStr,
					x: topSampleValues,
					text: topOtuLabels,
					type: "bar", 
					orientation: "h",
					transforms: [{
						type: 'sort',
						target: 'y',
						order: 'descending'
					}]
				}];

				var layout1 = {
					height: 450,
					margin: { t: 20, b: 20 }
				}

				Plotly.newPlot("bar", trace1, layout1);    

				// 3) Create a bubble chart that displays each sample.
				var otuIds = sample.otu_ids;
				var sampleValues = sample.sample_values;
				var otuLabels = sample.otu_labels;

				var trace2 = [{
					x: otuIds,
					y: sampleValues,
					text: otuLabels, 
					mode: "markers",
					marker: {
						color: otuIds,
						size: sampleValues,
						colorscale: "Earth"
					}
				}];

				var layout2 = {
					hovermode: "closest", 
					xaxis: {title: "OTU ID"},
					height:	600
				};

				Plotly.newPlot("bubble", trace2, layout2);                
			};   
		});
	});
	};	  
// 4) Display the sample metadata, i.e., an individual's demographic information.(below)
// 5) Display each key-value pair from the metadata JSON object somewhere on the page.(below)
	
function buildMetadata(sample) {
	// console.log(sample)
	d3.json("../../data/samples.json").then(function(data){
		// console.log(data)
		
        // select metadata table
        var demographics = d3.select("#sample-metadata");

        // clear previous output
		demographics.html("");
		
		data.metadata.forEach(subject => {
            if (parseInt(subject.id) === parseInt(sample)) {
                demographics.append("tr").html(`
                    ID: ${subject.id}<br>
                    Age: ${subject.age}<br>
                    Gender: ${subject.gender}<br>
                    Ethnicity: ${subject.ethnicity}<br>
                    Location: ${subject.location}<br>
                    bbtype: ${subject.bbtype}<br>
                    wfreq: ${subject.wfreq}<br>
                `);
            };
        });
	});
};



// 6) Update all of the plots any time that a new sample is selected.
function init() {
	var selector = d3.select("#selDataset");
	d3.json("../../data/samples.json").then(function(data){
		// console.log(data)
		var names = data.names
		// console.log(names)
		names.forEach((sample) => {
		selector
			.append("option")
			.text(sample)
			.property("value", sample);
		});
		// populate the page with a sample (first) when the page loads
		var starterSample = names[0];
		buildPlots(starterSample);
		buildMetadata(starterSample);
	});
	}
function optionChanged(newSample) {
	// get new data each time a new sample is selected
	buildPlots(newSample);
	buildMetadata(newSample);
	}
init();


