(function() {
    // Create the connector object 
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "name",
            alias: "Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "city",
            alias: "City",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "country",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "latitude",
            alias: "Latitude",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "longitude",
            alias: "Longitude",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "value",
            alias: "Value",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "parameter",
            alias: "Parameter",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            alias: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }];

        var tableSchema = {
            id: "openaq",
            alias: "Air Quality Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("api.openaq.org/v1/measurments.json?date_from=2018-07-01&date_to=2018-10-01&parameter=pm25&coordinates=47.597,-122.3197&radius=200000", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "name": feat[i].name,
                    "city": feat[i].city,
                    "country": feat[i].country,
                    "longitude": feat[i].coordinates.longitude,
                    "latitude": feat[i].coordinates.latitude,
                    "parameter": feat[i].parameter,
                    "unit": feat[i].unit,
                    "value": feat[i].value,
                    "date": new Date(feat[i].date.local)
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Air Quality Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
