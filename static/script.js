async function loadEntityData() {
    const entityName = document.getElementById("entity-select").value;
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/data/${entityName}`); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      displayData(data, "data-display");
    } catch (error) {
      console.error("Error loading data:", error);
      // Display error message to the user (optional)
      const dataDisplay = document.getElementById("data-display");
      dataDisplay.innerHTML = `<p>Error loading data: ${error.message}</p>`; 
    }
  }
  
  async function executeCustomQuery() {
    const queryInput = document.getElementById("query-input").value;
    try {
      const query = JSON.parse(queryInput); 
      const response = await fetch("http://localhost:5001/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error("Error executing query");
      }
      const result = await response.json();
      displayData(result, "query-result");
    } catch (error) {
      console.error("Error executing query:", error);
      // Display error message to the user (optional)
      const queryResult = document.getElementById("query-result");
      queryResult.innerHTML = `<p>Error executing query: ${error.message}</p>`;
    }
  }
  
  function displayData(data, displayElementId) {
    const dataDisplay = document.getElementById(displayElementId);
    dataDisplay.innerHTML = "";
  
    if (!data || !data.length) {
      dataDisplay.innerHTML = "<p>No data available</p>";
      return;
    }
  
    const table = document.createElement("table");
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement("tr");
  
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    data.forEach((row) => {
      const rowElement = document.createElement("tr");
      headers.forEach((header) => {
        const cell = document.createElement("td");
        cell.textContent = row[header]?.$oid || row[header]; // Handle MongoDB ObjectId if necessary
        rowElement.appendChild(cell);
      });
      table.appendChild(rowElement);
    });
  
    dataDisplay.appendChild(table);
  }