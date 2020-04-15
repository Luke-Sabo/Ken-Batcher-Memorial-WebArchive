////////////////////////////////////////////////////////////////////////////////
//
// GLOBAL VARIABLES
////////////////////////////////////////
var currentArchiveAddress = 'https://oaks.kent.edu/api/v1/collections/53';

// [archiveID, header]
var staranTab = [53, 'STARAN'];
var bitonicTab = [4, 'ASPRO'];
var mppTab = [47, 'MPP'];

////////////////////////////////////////////////////////////////////////////////
//
// FUNCTIONS
////////////////////////////////////////
// function to create table from parsed json
createTable = function(tableID, data)
{
    // grab table id
    var myTableDiv = document.getElementById(tableID);
            
    var table = document.createElement('TABLE');
    table.border = '1';
    
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    
    // column titles
    var columns = ['#', 'Title', 'Authors', 'Date', 'Link'];

    // corresponding attributes to pull
    var attributes = ['title', 'author', 'date', 'public_url']

    // create columns titles
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < columns.length; ++j)
    {
        var td = document.createElement('TD');
        td.width = '50';
        td.appendChild(document.createTextNode(columns[j]));
        tr.appendChild(td);
    }

    // insert data from json to table
    for (var i = 0; i < data.rows.length; ++i)
    {
        // create row object
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var row = data.rows[i];

        // insert row num
        var td = document.createElement('TD');
        td.width='75';
        td.appendChild(document.createTextNode(i));
        tr.appendChild(td);

        // insert attributes from object
        for (elem in row) if (attributes.includes(elem))
        {
            // create cell
            td = document.createElement('TD');
            td.width = '200';

            // create contents
            var contents = document.createTextNode(row[elem]);
            
            // create link object and append
            if (elem == 'public_url')
            {
                var link = document.createElement('a');
                link.href = row[elem];
                contents.textContent = 'URL';

                // append children
                link.appendChild(contents);
                td.appendChild(link);
            }
            // if not a url just append contents
            else 
                td.appendChild(contents);

            // append to row
            tr.appendChild(td);    
        }
    }

    // add created table
    myTableDiv.appendChild(table);      
}

////////////////////////////////////////
// create search function
function search()
{
    // get input value
    var val = document.getElementById('searchTextBox').value;
    if (val == '') return;

    // create GET request
    var searchReq = new XMLHttpRequest();
    searchReq.open('GET', currentArchiveAddress + '/' + val, false);
    searchReq.send();

    // convert json string to object
    var data = JSON.parse(searchReq.responseText);

    // check data has been recieved
    if (searchReq.status >= 200 && searchReq.status < 400) 
    {
        document.getElementById('searchResults').innerHTML = '<h2>Results</h2>';
        createTable('searchResults', data);
    }
    else 
    {
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = 'Error';
    }
}

////////////////////////////////////////
// switch archive being searched, or change tab
function tab(archiveID, header)
{
    // check params have value
    if (archiveID == null || header == null)
    {
        archiveID = staranTab[0];
        header = staranTab[1];
    }

    // create GET request
    var searchReq = new XMLHttpRequest();

    // update current archive address
    currentArchiveAddress = currentArchiveAddress.slice(0, 41) + archiveID;
    searchReq.open('GET', currentArchiveAddress, false);
    searchReq.send();

    // convert json string to object
    var data = JSON.parse(searchReq.responseText);

    // check data has been recieved
    if (searchReq.status >= 200 && searchReq.status < 400) 
    {
        // change header for new archive
        document.getElementById('header').textContent = header;

        // clear any search results
        document.getElementById('searchResults').innerHTML = '';

        // clear old table data
        document.getElementById('myTableData').innerHTML = '';

        // make new table from current archive
        createTable('myTableData', data);
    }
    else 
    {
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = 'Error';
    }
}