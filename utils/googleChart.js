google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart)
function drawChart(addRows, options, element) {
    console.log(addRows)

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows(
        addRows
        // [
        //     ['Mushrooms', 3],
        //     ['Onions', 1],
        //     ['Olives', 1],
        //     ['Zucchini', 1],
        //     ['Pepperoni', 2]
        // ]
    );

    // Set chart options
    // var options = {
    //     'title': 'Tenaga Perpustakaan Berdasarkan Jabatan',
    //     'width': 500,
    //     'height': 500
    // };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(element)
    chart.draw(data, options);
}