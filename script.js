const API_KEY = 'AIzaSyDtVQ6fgbzJNEJW9IVYRkaoB-0-NhD7hHQ'; // Your API Key
const SHEET_ID = '1Bwqc7eRuMi6N29HkxjzLNzAt3SlMShP_Y7AdLkB49xM'; // Your Google Sheet ID
const RANGE = 'Sheet1!A1:H1000'; // Adjust the range according to your sheet

async function fetchData() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // Show loading image
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        loadingElement.style.display = 'none'; // Hide loading image
        return data.values;
    } catch (error) {
        loadingElement.style.display = 'none'; // Hide loading image in case of error
        console.error('Error fetching data:', error);
        throw error;
    }
}

function renderTable(data) {
    const tableHead = document.querySelector("#data-table thead tr");
    const tableBody = document.querySelector("#data-table tbody");

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        console.error('No data found.');
        document.body.innerHTML = `<div class="alert alert-warning" role="alert">No data found in the specified range.</div>`;
        return;
    }

    // Render table headers
    const headers = data[0];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Render table rows
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    }
}

fetchData()
    .then(data => renderTable(data))
    .catch(error => {
        document.body.innerHTML = `<div class="alert alert-danger" role="alert">Error fetching data: ${error.message}</div>`;
    });

function downloadCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(row => {
        let rowContent = row.join(",");
        csvContent += rowContent + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "google_sheets_data.csv");
    document.body.appendChild(link); // Required for Firefox

    link.click();
    document.body.removeChild(link); // Clean up
}
