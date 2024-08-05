
var userData = [
    { id: 1, name: "John Doe", age: 25, email: "john@example.com" },
    { id: 2, name: "Jane Smith", age: 30, email: "jane@example.com" },
    { id: 3, name: "Alice Johnson", age: 28, email: "alice@example.com" },
    // Add more objects as needed
  ];
var tabContent = document.getElementById("tabContent")
function creatingTable(userData, ticket_id, client) {
    // Create the table dynamically
    console.log("ertyuytrewq ", userData);
  
    var table = document.createElement("table");
  
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var checkboxHeader = document.createElement("th");
    headerRow.appendChild(checkboxHeader);
  
    //new code
    var globalCheckboxHeader = document.createElement("th");
    var globalCheckbox = document.createElement("input");
    globalCheckbox.type = "checkbox";
    globalCheckbox.addEventListener("change", function () {
      // Toggle the selection of all checkboxes based on the global checkbox
      var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = globalCheckbox.checked;
      });
    });
    globalCheckboxHeader.appendChild(globalCheckbox);
    headerRow.appendChild(globalCheckboxHeader);
    //end new code
  
    for (var key in userData[0]) {
    var th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
    }
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
  
    userData.forEach(function (data) {
    var row = document.createElement("tr");
    var checkboxCell = document.createElement("td");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);
  
    for (var key in data) {
        var cell = document.createElement("td");
        cell.textContent = data[key];
        row.appendChild(cell);
    }
  
    tbody.appendChild(row);
    });
  
    tabContent.appendChild(table);
  
    var submitButton = document.createElement("input");
    submitButton.type = "button"; 
    submitButton.value = "Submit";
    tabContent.appendChild(submitButton);
  
    submitButton.addEventListener("click", function () {
    var selectedData = getSelectedData();
    console.log("selectedData_________CB", selectedData);
    updateRequesterInfo(selectedData, ticket_id, client);
    });
  
    function getSelectedData() {
    var selectedData = [];
    var checkboxes = document.querySelectorAll("tbody input[type='checkbox']:checked");
  
    checkboxes.forEach(function (checkbox) {
        var rowData = {};
        var row = checkbox.closest("tr");
        var cells = row.querySelectorAll("td:not(:first-child)"); 
        cells.forEach(function (cell, index) {
            var key = Object.keys(userData[0])[index];
            rowData[key] = cell.textContent;
        });
  
        selectedData.push(rowData);
    });
  
    return selectedData;
    }
    }

creatingTable(userData,"sample_ticket_id", { clientName: "Sample Client" })