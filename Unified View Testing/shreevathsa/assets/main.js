var userID;
var userEmail;
var userPhoneNumber;
var userBrandName;
var user_premium;
var ticket_ID;
var customer_id = "";
itemsList = [];
itemsListpayments = [];
itemsListreturns = [];
itemsListrefunds = [];
var enteredUserIDOrders = userID;
var returnID = userID;
var isreturnIDClicked = false;
var tagsList = [];

function loadTabContent(
  tabName,
  userID,
  userEmail,
  userPhoneNumber,
  userBrandName,
  user_premium,
  ticket_ID,
  customer_id,
  startInd = 0,
  endInd = 5,
  loadData = {}
) {
  console.log(
    "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID startInd endInd",
    tabName,
    userID,
    userEmail,
    userPhoneNumber,
    userBrandName,
    user_premium,
    ticket_ID,
    startInd,
    endInd
  );
  var tabContent = document.getElementById("tabContent");
  tabContent.innerHTML = "";
  var allTabs = document.querySelectorAll(".tab");
  allTabs.forEach(function (tab) {
    tab.classList.remove("selected-tab");
  });

  tabContent.style.display = "block";
  var selectedTab = document.querySelector(".tab." + tabName.toLowerCase());
  selectedTab.classList.add("selected-tab");
  if (tabName === "Customers") {
    isSubmitButtonClickedOrders = false;
    isreturnIDClicked = false;
    enteredUserIDOrders = "";

    console.log(
      "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
      tabName,
      userID,
      userEmail,
      userPhoneNumber,
      userBrandName,
      user_premium,
      ticket_ID
    );

    var settings = {
      url: "https://api.nykaa.com/hcsApis/customer",
      type: "POST",
      data: '{\n"emailId": "' + userEmail + '"\n}',
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
        source: userBrandName,
        "X-API-KEY": "{{setting.apiToken}}",
      },
      secure: true,
    };
    console.log("settings--34", settings);
    console.log("");
    if (!user_premium && userEmail) {
      console.log("dataaaaaaaaaaaaaaa--35");

      client.request(settings).then(
        function (response) {
          console.log("response_--37", response);
          function maskEmail(email) {
            if (/^\S+@\S+\.\S+$/.test(email)) {
              var [localPart, domain] = email.split("@");
              var firstTwo = localPart.slice(0, 1);
              var lastTwo = localPart.slice(-2);
              var maskedLocalPart = firstTwo + "******" + lastTwo;
              return maskedLocalPart + "@" + domain;
            } else {
              return "Invalid email address";
            }
          }
          var maskedEmail = maskEmail(response.data.email);
          function maskPhoneNumber(phoneNumber) {
            console.log("maskPhoneNumber_phoneNumber", phoneNumber);
            if (/^\+\d{2,3}\d{10}$/.test(phoneNumber)) {
              var countryCode = phoneNumber.slice(0, -10);
              var maskedNumber =
                countryCode + "********" + phoneNumber.slice(-4);
              console.log("maskPhoneNumber_maskedNumberif", maskedNumber);
              return maskedNumber;
            } else if (/^\d{10}$/.test(phoneNumber)) {
              var countryCode = "+91";
              var maskedNumber = phoneNumber.slice(0, -4);
              console.log("maskPhoneNumber_maskedNumberelseif", maskedNumber);
              return countryCode + "********" + phoneNumber.slice(-4);
            } else {
              return "Phone Number Not Registered";
            }
          }
          console.log("response_69", response);
          console.log(
            "response.data.phoneNumber_70",
            response.data.phoneNumber
          );
          var maskedPhoneNumber = maskPhoneNumber(response.data.phoneNumber);
          var userData = [];
          var prive_val;
          // if (response.data.isPrive == true) {
          //   prive_val = "premium";
          // } else {
          //   prive_val = "non-premium";
          // }
          if (response.data.priveTierTag) {
            prive_val = response.data.priveTierTag;
          }
          userData.push(
            { id: 17232338148125, value: response.data.customerId },
            { id: 14408314388893, value: response.data.customerName },
            { id: 19060758931101, value: response.data.customerScore },
            { id: 14408510200349, value: maskedEmail },
            // { id: 14385575473309, value: prive_val },
            // { id: 19677363739677, value: prive_val },
            { id: 19454398862621, value: prive_val },
            { id: 14408447390237, value: maskedPhoneNumber },
            { id: 19659010510877, value: response.data.email },
            { id: 19157025776669, value: response.data.phoneNumber }
          );
          prive_val = prive_val?.replace(" ", "_");
          if (userData) {
            // response.data.customerId !=  &&  response.data.customerName
            // var userticketdata = {
            //   ticket: {
            //     custom_fields: userData,
            //     tags: [...tagsList, prive_val],
            //   },
            // };
            var userticketdata = {
              tickets: [
                {
                  id: ticket_ID,
                  custom_fields: userData,
                  tags: [...tagsList, prive_val],
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(userticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };
            client.request(updateUser_Ticketdata).then(
              function (data2) {
                console.log("data2_________115", data2);
                var contentHTML = `
                <p> Customer Email: ${response.data.email}</p>
                <p>Customer Phone: ${response.data.phoneNumber}</p>
                <p>Customer ID: ${response.data.customerId}</p>
                <p>Customer Name/Score: ${response.data.customerName}</p>
                <p>Prive Non Prive:${response.data.isPrive}</p>
                <p>Prive Tier: ${response.data.priveTierTag}</p>
            `;
                tabContent.innerHTML = contentHTML;
              },
              function (response) {
                console.log(response);
              }
            );
          } else {
            console.log("Response:", response);
            var contentHTML = `
            <p>User ID: ${response.data.customerId}</p>
            <p>Email: ${response.user.email}</p>
            <p>Phone Number: ${response.user.name}</p>
            <p>Brand Name: ${response.user.role}</p>
        `;
            tabContent.innerHTML = contentHTML;
          }
        },
        function (response) {
          console.log("error", response);
          if (response.status == 500) {
            var contentHTML = `
            <p>Customer data not available</p>`;
            tabContent.innerHTML = contentHTML;
          }
        }
      );
    } else if (!user_premium && !userEmail) {
      console.log("dataaaaaaaaaaaaaaa--129", userID);

      client.request("/api/v2/users/" + userID + ".json").then((data) => {
        var phone_Num = data.user.phone;
        console.log("phone_Num", phone_Num);
        function extractPhoneNumber(fullNumber) {
          const regex = /^\+91(\d+)$/;
          const match = fullNumber.match(regex);
          if (match) {
            const phone_Number = match[1];
            return phone_Number;
          } else {
            return null;
          }
        }
        const phone_Number = extractPhoneNumber(phone_Num);

        var settings = {
          url: "https://api.nykaa.com/hcsApis/customer",
          type: "POST",
          data: '{\n"phoneNo": "' + phone_Number + '"\n}',
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        console.log("159", settings);
        client.request(settings).then(
          function (response) {
            var userData = [];
            var prive_val;
            // if (response.data.isPrive == true) {
            //   prive_val = "premium";
            // } else {
            //   prive_val = "non-premium";
            // }
            if (response.data.priveTierTag) {
              prive_val = response.data.priveTierTag;
            }

            function maskEmail(email) {
              if (/^\S+@\S+\.\S+$/.test(email)) {
                var [localPart, domain] = email.split("@");
                var firstTwo = localPart.slice(0, 1);
                var lastTwo = localPart.slice(-2);
                var maskedLocalPart = firstTwo + "******" + lastTwo;
                return maskedLocalPart + "@" + domain;
              } else {
                return "Invalid email address";
              }
            }
            var maskedEmail = maskEmail(response.data.email);

            function maskMobileNumber(mobileNumber) {
              if (
                typeof mobileNumber !== "string" ||
                !/^\d{10}$/.test(mobileNumber)
              ) {
                console.error("Invalid mobile number format");
                return mobileNumber;
              }

              const maskedNumber =
                mobileNumber.slice(0, 1) + "********" + mobileNumber.slice(-4);

              return maskedNumber;
            }

            const maskedPhoneNumber = maskMobileNumber(
              response.data.phoneNumber
            );
            userData.push(
              { id: 17232338148125, value: response.data.customerId },
              { id: 14408314388893, value: response.data.customerName },
              { id: 19060758931101, value: response.data.customerScore },
              { id: 14408510200349, value: maskedEmail },
              // { id: 14385575473309, value: prive_val },
              // { id: 19677363739677, value: prive_val },
              { id: 19454398862621, value: prive_val },
              { id: 14408447390237, value: maskedPhoneNumber },
              { id: 19659010510877, value: response.data.email },
              { id: 19157025776669, value: response.data.phoneNumber }
            );
            prive_val = prive_val?.replace(" ", "_");
            if (userData) {
              // response.data.customerId !=  &&  response.data.customerName
              // var userticketdata = {
              //   ticket: {
              //     custom_fields: userData,
              //     tags: [...tagsList, prive_val],
              //   },
              // };
              var userticketdata = {
                tickets: [
                  {
                    id: ticket_ID,
                    custom_fields: userData,
                    tags: [...tagsList, prive_val],
                  },
                ],
              };
              var updateUser_Ticketdata = {
                url: "/api/v2/tickets/update_many.json",
                data: JSON.stringify(userticketdata),
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              };

              client.request(updateUser_Ticketdata).then(
                function (data2) {
                  // requestUserURL(ticket_ID,phone_Number,user_Brand_Name,client);
                  console.log("Response:239", data2);
                  var contentHTML = `
                <p> Customer Email: ${response.data.email}</p>
                <p>Customer Phone: ${response.data.phoneNumber}</p>
                <p>Customer ID: ${response.data.customerId}</p>
                <p>Customer Name/Score: ${response.data.customerName}</p>
                <p>Prive Non Prive:${response.data.isPrive}</p>
                <p>Prive Tier: ${response.data.priveTierTag}</p>
            `;
                  tabContent.innerHTML = contentHTML;
                },
                function (response) {
                  showError(response);
                }
              );
            } else {
              console.log("Response:", response);
              var contentHTML = `
            <p> Customer Email: ${response.data.email}</p>
            <p>Customer Phone: ${response.data.phoneNumber}</p>
            <p>Customer ID: ${response.data.customerId}</p>
            <p>Customer Name/Score: ${response.data.customerName}</p>
            <p>Prive Non Prive:${response.data.isPrive}</p>
            <p>Prive Tier: ${response.data.priveTierTag}</p>
        `;
              tabContent.innerHTML = contentHTML;
            }
          },
          function (response) {
            console.log("error", response);
            if (response.status == 500) {
              var contentHTML = `
            <p>Customer data not available</p>`;
              tabContent.innerHTML = contentHTML;
            }
          }
        );
      });
    } else {
      if (userEmail) {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/customer",
          type: "POST",
          data: '{\n"emailId": "' + userEmail + '"\n}',
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        console.log("settings--283", settings);

        client.request(settings).then(function (response) {
          console.log("response___287", response);
          var contentHTML = `
         <p> Customer Email: ${response.data.email}</p>
         <p>Customer Phone: ${response.data.phoneNumber}</p>
         <p>Customer ID: ${response.data.customerId}</p>
         <p>Customer Name/Score: ${response.data.customerName}</p>
         <p>Prive Non Prive:${response.data.isPrive}</p>
         <p>Prive Tier: ${response.data.priveTierTag}</p>
        `;
          tabContent.innerHTML = contentHTML;
        });
      } else {
        client.request("/api/v2/users/" + userID + ".json").then((data) => {
          var phone_Num = data.user.phone;
          console.log("phone_Num", phone_Num);
          function extractPhoneNumber(fullNumber) {
            const regex = /^\+91(\d+)$/;
            const match = fullNumber.match(regex);
            if (match) {
              const phone_Number = match[1];
              return phone_Number;
            } else {
              return null;
            }
          }
          const phone_Number = extractPhoneNumber(phone_Num);
          console.log("###################################", phone_Number);
          var settings = {
            url: "https://api.nykaa.com/hcsApis/customer",
            type: "POST",
            data: '{\n"phoneNo": "' + phone_Number + '"\n}',
            headers: {
              accept: "application/json",
              "Content-type": "application/json",
              source: userBrandName,
              "X-API-KEY": "{{setting.apiToken}}",
            },
            secure: true,
          };
          console.log("310", settings);
          client.request(settings).then(function (response) {
            console.log("response___313", response);
            var contentHTML = `
            <p> Customer Email: ${response.data.email}</p>
            <p>Customer Phone: ${response.data.phoneNumber}</p>
            <p>Customer ID: ${response.data.customerId}</p>
            <p>Customer Name/Score: ${response.data.customerName}</p>
            <p>Prive Non Prive:${response.data.isPrive}</p>
            <p>Prive Tier: ${response.data.priveTierTag}</p>
           
        `;
            tabContent.innerHTML = contentHTML;
          });
        });
      }
    }
  } else if (tabName === "Orders") {
    //
    isreturnIDClicked = false;
    itemsList = [];
    var inputContainer = document.createElement("div");
    console.log("customer_iddddd", customer_id);
    inputContainer.innerHTML = `
    <label for="userIdInputOrders">Enter Order ID:</label>
    <div style="display:flex;align-items:center;">
      <div style="position: relative;display: flex;align-items: center;width: 48%;">
          <input type="text" id="userIdInputOrders" placeholder="Order ID" value="${
            enteredUserIDOrders || ""
          }" style="margin-right: 8px; flex: 1;">
      </div>
      <button style="margin-bottom:10px;" onclick="searchOrdersData()">Search</button>
    </div>
  `;
    tabContent.appendChild(inputContainer);
    var clearIcon = document.getElementById("clearIcon");
    if (clearIcon) {
      clearIcon.addEventListener("click", function () {
        // Call your function to handle the clear action
        console.log("Clearing search");
        clearSearchInput();
      });
    }

    // Your function to handle clearing the input
    function clearSearchInput() {
      var userIdInputOrders = document.getElementById("userIdInputOrders");
      if (userIdInputOrders) {
        userIdInputOrders.value = "";
        enteredUserIDOrders = "";
        isSubmitButtonClickedOrders = false;
        loadTabContent(
          "Orders",
          userID,
          userEmail,
          userPhoneNumber,
          userBrandName,
          user_premium,
          ticket_ID,
          customer_id
        );
      }
    }
    console.log(
      "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
      tabName,
      userID,
      userEmail,
      userPhoneNumber,
      userBrandName,
      user_premium,
      ticket_ID
    );
    if (isSubmitButtonClickedOrders) {
      if (userEmail) {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/orders",
          type: "POST",
          timeout: 0,
          data: JSON.stringify({
            orderId: enteredUserIDOrders,
            emailId: userEmail,
          }),
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        console.log("settings", settings);
        client.request(settings).then(
          function (response) {
            var data_ = response;
            var x = response;
            var jsonData = response;

            console.log("Response_________126", response);
            for (i = 0; i < x.data.length; i++) {
              var orderNumber = x.data[i].orderNo;
              var items = x.data[i].items.length;
              for (j = 0; j < x.data[i].items.length; j++) {
                var awb_NO, courier_Name;
                if (
                  x.data[i].items[j].shipmentDetails !== null &&
                  x.data[i].items[j].shipmentDetails.length > 0
                ) {
                  awb_NO = x.data[i].items[j].shipmentDetails[0].awbNo;
                  courier_Name =
                    x.data[i].items[j].shipmentDetails[0].courierName;
                  console.log("awb_NO", awb_NO);
                  console.log("courier_Name", courier_Name);
                } else {
                  awb_NO = "NA";
                  courier_Name = "NA";
                }
                var item = {
                  ORDER_NO: x.data[i].orderNo,
                  Product_ID: x.data[i].items[j].productId,
                  sku_ID: x.data[i].items[j].skuId,
                  sku_Name: x.data[i].items[j].skuName,
                  item_Status: x.data[i].items[j].itemStatus,
                  item_Qty: x.data[i].items[j].itemQty,
                  unit_Price: x.data[i].items[j].unitPrice,
                  awb_No: awb_NO,
                  courier_Name: courier_Name,
                };
                console.log("item", item);
                itemsList.push(item);
              }
            }

            // creatingTable(itemsList,ticket_ID,client)
            createTable2(x.data[0]);

            //Shree

            function createTable2(order) {
              if (order.items.some((item) => item.shipmentDetails.length > 0)) {
                const table2 = document.createElement("table");
                table2.border = "1";

                const headers2 = [
                  "AWB No",
                  "AWB Type",
                  "Courier Name",
                  "EDD",
                  "LEDD",
                  "DD",
                  "SKU ID",
                  "Click Post Url",
                ];

                const thead2 = document.createElement("thead");
                const headerRow2 = document.createElement("tr");

                // headers2.forEach(headerText => {
                //     const th = document.createElement('th');
                //     th.textContent = headerText;
                //     headerRow2.appendChild(th);
                // });

                //start new code
                var globalCheckboxHeader = document.createElement("th");
                var globalCheckbox = document.createElement("input");
                globalCheckbox.type = "checkbox";
                globalCheckbox.addEventListener("change", function () {
                  // Call a function to handle global checkbox change
                  handleGlobalCheckboxChange(globalCheckbox.checked);
                });
                function handleGlobalCheckboxChange(checked) {
                  var tab2 = document.querySelector("#table2");
                  var checkboxes = tab2.querySelectorAll(
                    "tbody input[type='checkbox']"
                  );
                  checkboxes.forEach(function (checkbox) {
                    checkbox.checked = checked;

                    // Trigger a change event for each row checkbox
                    var changeEvent = new Event("change", { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);
                  });
                  // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                  // checkboxes.forEach(function (checkbox) {
                  //   checkbox.checked = checked
                  // });
                }
                // globalCheckbox.addEventListener("change", function () {
                //   // Toggle the selection of all checkboxes based on the global checkbox
                //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                //   checkboxes.forEach(function (checkbox) {
                //     checkbox.checked = globalCheckbox.checked;
                //   });
                // });
                globalCheckboxHeader.appendChild(globalCheckbox);
                console.log("Added new checkbox table2");
                headerRow2.appendChild(globalCheckboxHeader);

                headers2.forEach((headerText) => {
                  const th = document.createElement("th");
                  th.textContent = headerText;
                  headerRow2.appendChild(th);
                });
                thead2.appendChild(headerRow2);
                table2.appendChild(thead2);

                const tbody2 = document.createElement("tbody");

                order.items.forEach((item) => {
                  if (item.shipmentDetails.length > 0) {
                    item.shipmentDetails.forEach((shipment) => {
                      const row = document.createElement("tr");

                      const checkboxCell = document.createElement("td");
                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.addEventListener("change", () => {
                        if (checkbox.checked) {
                          // Load data for Table 3
                          createTable3(order.items);
                          // createTable3(item);
                        } else {
                          clearTable3();
                        }
                      });
                      checkboxCell.appendChild(checkbox);
                      row.appendChild(checkboxCell);

                      const awbNoCell = document.createElement("td");
                      awbNoCell.textContent = shipment.awbNo;
                      row.appendChild(awbNoCell);

                      const awbTypeCell = document.createElement("td");
                      // Fill in with your AWB Type data
                      row.appendChild(awbTypeCell);

                      const courierNameCell = document.createElement("td");
                      courierNameCell.textContent = shipment.courierName;
                      row.appendChild(courierNameCell);

                      const eddCell = document.createElement("td");
                      eddCell.textContent = shipment.estimatedDeliveryDate
                        ? formatDate(shipment.estimatedDeliveryDate)
                        : "NA";
                      row.appendChild(eddCell);

                      const leddCell = document.createElement("td");
                      leddCell.textContent =
                        shipment.latestEstimatedDeliveryDate
                          ? formatDate(shipment.latestEstimatedDeliveryDate)
                          : "NA";
                      row.appendChild(leddCell);

                      const ddCell = document.createElement("td");
                      ddCell.textContent = shipment.deliveredDate
                        ? formatDate(shipment.deliveredDate)
                        : "NA";
                      row.appendChild(ddCell);

                      const skuidCell = document.createElement("td");
                      skuidCell.textContent = item.skuId;
                      row.appendChild(skuidCell);

                      const clickPostUrlCell = document.createElement("td");
                      if (shipment.clickpostUrl) {
                        const clickPostLink = document.createElement("a");
                        clickPostLink.href = shipment.clickpostUrl;
                        clickPostLink.target = "_blank";
                        clickPostLink.textContent = "Click Post";
                        clickPostUrlCell.appendChild(clickPostLink);
                      } else {
                        clickPostUrlCell.textContent = "NA";
                      }
                      row.appendChild(clickPostUrlCell);

                      tbody2.appendChild(row);
                    });
                  }
                });

                table2.appendChild(tbody2);
                table2.id = "table2";
                tabContent.appendChild(table2);
              } else {
                createTable3(order.items);
                return;
              }

              createSubmitButton();
            }
            function formatDate(dateString) {
              const options = {
                day: "numeric",
                month: "short",
                year: "numeric",
              };
              return new Date(dateString).toLocaleDateString("en-US", options);
            }

            // // Function to create Table 3
            function createTable3(items) {
              const table3 = document.createElement("table");
              table3.setAttribute("class", "table3");
              table3.border = "1";

              const headers3 = [
                // 'CB',
                "SKU Image",
                "SKU Name",
                "SKU ID",
                "Unit Price/Item",
                "Item Qty",
                "Item Status",
                "Canceled Qty",
                "Shared / Volume",
              ];

              const thead3 = document.createElement("thead");
              const headerRow3 = document.createElement("tr");

              //start new code
              var globalCheckboxHeader = document.createElement("th");
              var globalCheckbox = document.createElement("input");
              globalCheckbox.type = "checkbox";
              globalCheckbox.addEventListener("change", function () {
                // Call a function to handle global checkbox change
                handleGlobalCheckboxChange(globalCheckbox.checked);
              });
              function handleGlobalCheckboxChange(checked) {
                var tab3 = document.querySelector("#table3");
                var checkboxes = document.querySelectorAll(
                  ".table3 tbody input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;

                  // Trigger a change event for each row checkbox
                  var changeEvent = new Event("change", { bubbles: true });
                  checkbox.dispatchEvent(changeEvent);
                });
                checkboxes = document.querySelectorAll(
                  ".table3 thead input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;
                });
                // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                // checkboxes.forEach(function (checkbox) {
                //   checkbox.checked = checked
                // });
              }
              // globalCheckbox.addEventListener("change", function () {
              //   // Toggle the selection of all checkboxes based on the global checkbox
              //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              //   checkboxes.forEach(function (checkbox) {
              //     checkbox.checked = globalCheckbox.checked;
              //   });
              // });
              globalCheckboxHeader.appendChild(globalCheckbox);
              console.log("Added new checkbox table2");
              headerRow3.appendChild(globalCheckboxHeader);
              headers3.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow3.appendChild(th);
              });

              thead3.appendChild(headerRow3);
              table3.appendChild(thead3);

              const tbody3 = document.createElement("tbody");

              items.forEach((item) => {
                const row = document.createElement("tr");

                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (!checkbox.checked) {
                    // Clear Table 3
                    clearTable3();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const skuImageCell = document.createElement("td");
                if (item.skuImage) {
                  const skuImage = document.createElement("img");
                  skuImage.src = item.skuImage;
                  skuImage.width = 50;
                  skuImageCell.appendChild(skuImage);
                }
                row.appendChild(skuImageCell);

                const skuNameCell = document.createElement("td");
                skuNameCell.textContent = item.skuName;
                skuNameCell.classList.add("SKUName");
                row.appendChild(skuNameCell);

                const skuIdCell = document.createElement("td");
                skuIdCell.textContent = item.skuId;
                row.appendChild(skuIdCell);

                const unitPriceCell = document.createElement("td");
                unitPriceCell.textContent = item.unitPrice;
                row.appendChild(unitPriceCell);

                const itemQtyCell = document.createElement("td");
                itemQtyCell.textContent = item.itemQty;
                row.appendChild(itemQtyCell);

                const itemStatusCell = document.createElement("td");
                itemStatusCell.textContent = item.itemStatus;
                row.appendChild(itemStatusCell);

                const canceledQtyCell = document.createElement("td");
                canceledQtyCell.textContent = item.cancelledQty;
                row.appendChild(canceledQtyCell);

                const sharedVolumeCell = document.createElement("td");
                sharedVolumeCell.textContent = "NF in API";
                row.appendChild(sharedVolumeCell);

                tbody3.appendChild(row);
              });

              table3.appendChild(tbody3);
              table3.id = "table3";
              tabContent.appendChild(table3);

              // Submit button after Table 3
              createSubmitButton();
            }

            function clearTables() {
              const table2 = document.querySelector("#table2");
              if (table2) {
                table2.parentNode.removeChild(table2);
              }

              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function clearTable3() {
              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function getSelectedOrderNos() {
              const selectedOrderNos = [];
              selectedOrderNos.push(enteredUserIDOrders);
              // const checkboxes = document.querySelectorAll('#table1 tbody input[type="checkbox"]');
              // checkboxes.forEach(checkbox => {
              //     if (checkbox.checked) {
              //         const orderNoCell = checkbox.closest('tr').querySelector('td:nth-child(2)');
              //         selectedOrderNos.push(orderNoCell.textContent);
              //     }
              // });
              return selectedOrderNos;
            }
            function getSelectedRewerseAwb(orders) {
              const selectedRevAwbNos = [];
              // for(let i=0;i<orders.length;i++){
              console.log(
                "isequal",
                orders.orderNo === enteredUserIDOrders,
                orders.orderNo,
                enteredUserIDOrders
              );
              if (orders.orderNo === enteredUserIDOrders) {
                const curentOrder = orders;
                console.log("current order", curentOrder);
                if (curentOrder.items) {
                  for (let j = 0; j < curentOrder.items.length; j++) {
                    const curItem = curentOrder.items[j];
                    if (curItem.returnDetails.length > 0) {
                      for (let k = 0; k < curItem.returnDetails.length; k++) {
                        if (curItem.returnDetails[k].reverseAwb) {
                          selectedRevAwbNos.push(
                            curItem.returnDetails[k].reverseAwb
                          );
                        }
                      }
                    }
                  }
                }
              }

              // }
              return selectedRevAwbNos;
            }

            function getSelectedAWBNos() {
              const selectedAWBNos = [];
              const selectedCouriers = [];
              const table2CheckboxCells = document.querySelectorAll(
                "#table2 tbody td:first-child input:checked"
              );
              console.log("awbbbbb1", table2CheckboxCells);
              table2CheckboxCells.forEach((checkboxCell) => {
                const awbNoCell = checkboxCell.parentElement.nextElementSibling;
                const courier =
                  checkboxCell.parentElement.nextElementSibling
                    .nextElementSibling.nextElementSibling;
                console.log("awbbbbb", awbNoCell, courier);
                selectedAWBNos.push(awbNoCell.textContent);
                selectedCouriers.push(courier.textContent);
              });
              return { selectedAWBNos, selectedCouriers };
            }

            function getSelectedSKUData() {
              const table3 = document.getElementById("table3");
              const selectedSKUs = [];

              if (table3) {
                const rows = table3.querySelectorAll("tbody tr");

                rows.forEach((row) => {
                  const checkbox = row.cells[0].querySelector(
                    'input[type="checkbox"]'
                  );

                  if (checkbox && checkbox.checked) {
                    const skuDataRow = row.cells;

                    selectedSKUs.push({
                      sku_Name: skuDataRow[2].textContent || "NA",
                      sku_ID: skuDataRow[3].textContent || "NA",
                      unit_Price: skuDataRow[4].textContent || "NA",
                      Item_Qty: skuDataRow[5].textContent || "NA",
                      OrderStatus: skuDataRow[6].textContent || "NA",
                      item_Status: skuDataRow[6].textContent || "NA",
                    });
                  }
                });
              }

              return selectedSKUs;
            }

            function createSubmitButton() {
              const existingSubmitButton =
                document.getElementById("submitButton");
              const existingResetButton =
                document.getElementById("resetButton");
              console.log("resettt button exist", existingResetButton);
              if (existingResetButton) {
                console.log("resettt button");
                existingResetButton.parentNode.removeChild(existingResetButton);
              }
              const resetButton = document.createElement("button");
              resetButton.textContent = "Reset";
              resetButton.id = "resetButton";
              resetButton.addEventListener("click", () => {
                clearSearchInput();
              });
              if (existingSubmitButton) {
                existingSubmitButton.parentNode.removeChild(
                  existingSubmitButton
                );
              }
              const submitButton = document.createElement("button");
              submitButton.textContent = "Submit";
              submitButton.id = "submitButton";
              submitButton.addEventListener("click", () => {
                const selectedOrderNos = getSelectedOrderNos();
                console.log("Selected Order Nos:", selectedOrderNos);
                selectedOrderNos.forEach((orderNo) => {
                  const order = jsonData.data.find(
                    (item) => item.orderNo === orderNo
                  );
                  console.log(`Order No: ${order.orderNo}`);
                  console.log("Table 1 Data:", order);
                  const { selectedAWBNos, selectedCouriers } =
                    getSelectedAWBNos();
                  if (selectedAWBNos.length > 0) {
                    console.log("Selected AWB Nos:", selectedAWBNos);
                  }

                  const selectedrevAwbs = getSelectedRewerseAwb(order);
                  console.log("selectedRevAWBs", selectedrevAwbs);
                  const selectedSKUData = getSelectedSKUData();
                  if (selectedSKUData.length > 0) {
                    console.log("Selected SKU Data:", selectedSKUData);
                  }
                  updateRequesterInfo(
                    selectedSKUData,
                    selectedOrderNos,
                    selectedAWBNos,
                    selectedrevAwbs,
                    ticket_ID,
                    selectedCouriers
                  );
                });
              });

              const table3 = document.getElementById("table3");
              if (table3) {
                tabContent.appendChild(table3);
                tabContent.appendChild(submitButton);
                tabContent.appendChild(document.createTextNode(" "));
                tabContent.appendChild(resetButton);
              } else {
                const table2 = document.getElementById("table2");
                if (table2) {
                  tabContent.appendChild(table2);
                  tabContent.appendChild(submitButton);
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                } else {
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                }
              }
            } //submit button end

            //shree
          },
          function (response) {
            console.log(response);
          }
        );
      } else if (customer_id) {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/orders",
          type: "POST",
          timeout: 0,
          data: JSON.stringify({
            orderId: enteredUserIDOrders,
            customerId: customer_id,
          }),
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        console.log("settings", settings);
        client.request(settings).then(
          function (response) {
            var data_ = response;
            var x = response;
            var jsonData = response;

            console.log("Response_________126", response);
            for (i = 0; i < x.data.length; i++) {
              var orderNumber = x.data[i].orderNo;
              var items = x.data[i].items.length;
              for (j = 0; j < x.data[i].items.length; j++) {
                var awb_NO, courier_Name;
                if (
                  x.data[i].items[j].shipmentDetails !== null &&
                  x.data[i].items[j].shipmentDetails.length > 0
                ) {
                  awb_NO = x.data[i].items[j].shipmentDetails[0].awbNo;
                  courier_Name =
                    x.data[i].items[j].shipmentDetails[0].courierName;
                  console.log("awb_NO", awb_NO);
                  console.log("courier_Name", courier_Name);
                } else {
                  awb_NO = "NA";
                  courier_Name = "NA";
                }
                var item = {
                  ORDER_NO: x.data[i].orderNo,
                  Product_ID: x.data[i].items[j].productId,
                  sku_ID: x.data[i].items[j].skuId,
                  sku_Name: x.data[i].items[j].skuName,
                  item_Status: x.data[i].items[j].itemStatus,
                  item_Qty: x.data[i].items[j].itemQty,
                  unit_Price: x.data[i].items[j].unitPrice,
                  awb_No: awb_NO,
                  courier_Name: courier_Name,
                };
                console.log("item", item);
                itemsList.push(item);
              }
            }

            // creatingTable(itemsList,ticket_ID,client)
            createTable2(x.data[0]);

            //Shree

            function createTable2(order) {
              if (order.items.some((item) => item.shipmentDetails.length > 0)) {
                const table2 = document.createElement("table");
                table2.border = "1";

                const headers2 = [
                  "AWB No",
                  "AWB Type",
                  "Courier Name",
                  "EDD",
                  "LEDD",
                  "DD",
                  "SKU ID",
                  "Click Post Url",
                ];

                const thead2 = document.createElement("thead");
                const headerRow2 = document.createElement("tr");

                // headers2.forEach(headerText => {
                //     const th = document.createElement('th');
                //     th.textContent = headerText;
                //     headerRow2.appendChild(th);
                // });

                //start new code
                var globalCheckboxHeader = document.createElement("th");
                var globalCheckbox = document.createElement("input");
                globalCheckbox.type = "checkbox";
                globalCheckbox.addEventListener("change", function () {
                  // Call a function to handle global checkbox change
                  handleGlobalCheckboxChange(globalCheckbox.checked);
                });
                function handleGlobalCheckboxChange(checked) {
                  var tab2 = document.querySelector("#table2");
                  var checkboxes = tab2.querySelectorAll(
                    "tbody input[type='checkbox']"
                  );
                  checkboxes.forEach(function (checkbox) {
                    checkbox.checked = checked;

                    // Trigger a change event for each row checkbox
                    var changeEvent = new Event("change", { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);
                  });
                  // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                  // checkboxes.forEach(function (checkbox) {
                  //   checkbox.checked = checked
                  // });
                }
                // globalCheckbox.addEventListener("change", function () {
                //   // Toggle the selection of all checkboxes based on the global checkbox
                //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                //   checkboxes.forEach(function (checkbox) {
                //     checkbox.checked = globalCheckbox.checked;
                //   });
                // });
                globalCheckboxHeader.appendChild(globalCheckbox);
                console.log("Added new checkbox table2");
                headerRow2.appendChild(globalCheckboxHeader);

                headers2.forEach((headerText) => {
                  const th = document.createElement("th");
                  th.textContent = headerText;
                  headerRow2.appendChild(th);
                });
                thead2.appendChild(headerRow2);
                table2.appendChild(thead2);

                const tbody2 = document.createElement("tbody");

                order.items.forEach((item) => {
                  if (item.shipmentDetails.length > 0) {
                    item.shipmentDetails.forEach((shipment) => {
                      const row = document.createElement("tr");

                      const checkboxCell = document.createElement("td");
                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.addEventListener("change", () => {
                        if (checkbox.checked) {
                          // Load data for Table 3
                          createTable3(order.items);
                          // createTable3(item);
                        } else {
                          clearTable3();
                        }
                      });
                      checkboxCell.appendChild(checkbox);
                      row.appendChild(checkboxCell);

                      const awbNoCell = document.createElement("td");
                      awbNoCell.textContent = shipment.awbNo;
                      row.appendChild(awbNoCell);

                      const awbTypeCell = document.createElement("td");
                      // Fill in with your AWB Type data
                      row.appendChild(awbTypeCell);

                      const courierNameCell = document.createElement("td");
                      courierNameCell.textContent = shipment.courierName;
                      row.appendChild(courierNameCell);

                      const eddCell = document.createElement("td");
                      eddCell.textContent = shipment.estimatedDeliveryDate
                        ? formatDate(shipment.estimatedDeliveryDate)
                        : "NA";
                      row.appendChild(eddCell);

                      const leddCell = document.createElement("td");
                      leddCell.textContent =
                        shipment.latestEstimatedDeliveryDate
                          ? formatDate(shipment.latestEstimatedDeliveryDate)
                          : "NA";
                      row.appendChild(leddCell);

                      const ddCell = document.createElement("td");
                      ddCell.textContent = shipment.deliveredDate
                        ? formatDate(shipment.deliveredDate)
                        : "NA";
                      row.appendChild(ddCell);

                      const skuidCell = document.createElement("td");
                      skuidCell.textContent = item.skuId;
                      row.appendChild(skuidCell);

                      const clickPostUrlCell = document.createElement("td");
                      if (shipment.clickpostUrl) {
                        const clickPostLink = document.createElement("a");
                        clickPostLink.href = shipment.clickpostUrl;
                        clickPostLink.target = "_blank";
                        clickPostLink.textContent = "Click Post";
                        clickPostUrlCell.appendChild(clickPostLink);
                      } else {
                        clickPostUrlCell.textContent = "NA";
                      }
                      row.appendChild(clickPostUrlCell);

                      tbody2.appendChild(row);
                    });
                  }
                });

                table2.appendChild(tbody2);
                table2.id = "table2";
                tabContent.appendChild(table2);
              } else {
                createTable3(order.items);
                return;
              }

              createSubmitButton();
            }
            function formatDate(dateString) {
              const options = {
                day: "numeric",
                month: "short",
                year: "numeric",
              };
              return new Date(dateString).toLocaleDateString("en-US", options);
            }

            // // Function to create Table 3
            function createTable3(items) {
              const table3 = document.createElement("table");
              table3.setAttribute("class", "table3");
              table3.border = "1";

              const headers3 = [
                // 'CB',
                "SKU Image",
                "SKU Name",
                "SKU ID",
                "Unit Price/Item",
                "Item Qty",
                "Item Status",
                "Canceled Qty",
                "Shared / Volume",
              ];

              const thead3 = document.createElement("thead");
              const headerRow3 = document.createElement("tr");

              //start new code
              var globalCheckboxHeader = document.createElement("th");
              var globalCheckbox = document.createElement("input");
              globalCheckbox.type = "checkbox";
              globalCheckbox.addEventListener("change", function () {
                // Call a function to handle global checkbox change
                handleGlobalCheckboxChange(globalCheckbox.checked);
              });
              function handleGlobalCheckboxChange(checked) {
                var tab3 = document.querySelector("#table3");
                var checkboxes = document.querySelectorAll(
                  ".table3 tbody input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;

                  // Trigger a change event for each row checkbox
                  var changeEvent = new Event("change", { bubbles: true });
                  checkbox.dispatchEvent(changeEvent);
                });
                checkboxes = document.querySelectorAll(
                  ".table3 thead input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;
                });
                // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                // checkboxes.forEach(function (checkbox) {
                //   checkbox.checked = checked
                // });
              }
              // globalCheckbox.addEventListener("change", function () {
              //   // Toggle the selection of all checkboxes based on the global checkbox
              //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              //   checkboxes.forEach(function (checkbox) {
              //     checkbox.checked = globalCheckbox.checked;
              //   });
              // });
              globalCheckboxHeader.appendChild(globalCheckbox);
              console.log("Added new checkbox table2");
              headerRow3.appendChild(globalCheckboxHeader);
              headers3.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow3.appendChild(th);
              });

              thead3.appendChild(headerRow3);
              table3.appendChild(thead3);

              const tbody3 = document.createElement("tbody");

              items.forEach((item) => {
                const row = document.createElement("tr");

                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (!checkbox.checked) {
                    // Clear Table 3
                    clearTable3();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const skuImageCell = document.createElement("td");
                if (item.skuImage) {
                  const skuImage = document.createElement("img");
                  skuImage.src = item.skuImage;
                  skuImage.width = 50;
                  skuImageCell.appendChild(skuImage);
                }
                row.appendChild(skuImageCell);

                const skuNameCell = document.createElement("td");
                skuNameCell.textContent = item.skuName;
                skuNameCell.classList.add("SKUName");
                row.appendChild(skuNameCell);

                const skuIdCell = document.createElement("td");
                skuIdCell.textContent = item.skuId;
                row.appendChild(skuIdCell);

                const unitPriceCell = document.createElement("td");
                unitPriceCell.textContent = item.unitPrice;
                row.appendChild(unitPriceCell);

                const itemQtyCell = document.createElement("td");
                itemQtyCell.textContent = item.itemQty;
                row.appendChild(itemQtyCell);

                const itemStatusCell = document.createElement("td");
                itemStatusCell.textContent = item.itemStatus;
                row.appendChild(itemStatusCell);

                const canceledQtyCell = document.createElement("td");
                canceledQtyCell.textContent = item.cancelledQty;
                row.appendChild(canceledQtyCell);

                const sharedVolumeCell = document.createElement("td");
                sharedVolumeCell.textContent = "NF in API";
                row.appendChild(sharedVolumeCell);

                tbody3.appendChild(row);
              });

              table3.appendChild(tbody3);
              table3.id = "table3";
              tabContent.appendChild(table3);

              // Submit button after Table 3
              createSubmitButton();
            }

            function clearTables() {
              const table2 = document.querySelector("#table2");
              if (table2) {
                table2.parentNode.removeChild(table2);
              }

              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function clearTable3() {
              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function getSelectedOrderNos() {
              const selectedOrderNos = [];
              selectedOrderNos.push(enteredUserIDOrders);
              // const checkboxes = document.querySelectorAll('#table1 tbody input[type="checkbox"]');
              // checkboxes.forEach(checkbox => {
              //     if (checkbox.checked) {
              //         const orderNoCell = checkbox.closest('tr').querySelector('td:nth-child(2)');
              //         selectedOrderNos.push(orderNoCell.textContent);
              //     }
              // });
              return selectedOrderNos;
            }
            function getSelectedRewerseAwb(orders) {
              const selectedRevAwbNos = [];
              // for(let i=0;i<orders.length;i++){
              console.log(
                "isequal",
                orders.orderNo === enteredUserIDOrders,
                orders.orderNo,
                enteredUserIDOrders
              );
              if (orders.orderNo === enteredUserIDOrders) {
                const curentOrder = orders;
                console.log("current order", curentOrder);
                if (curentOrder.items) {
                  for (let j = 0; j < curentOrder.items.length; j++) {
                    const curItem = curentOrder.items[j];
                    if (curItem.returnDetails.length > 0) {
                      for (let k = 0; k < curItem.returnDetails.length; k++) {
                        if (curItem.returnDetails[k].reverseAwb) {
                          selectedRevAwbNos.push(
                            curItem.returnDetails[k].reverseAwb
                          );
                        }
                      }
                    }
                  }
                }
              }

              // }
              return selectedRevAwbNos;
            }

            function getSelectedAWBNos() {
              const selectedAWBNos = [];
              const selectedCouriers = [];
              const table2CheckboxCells = document.querySelectorAll(
                "#table2 tbody td:first-child input:checked"
              );
              console.log("awbbbbb1", table2CheckboxCells);
              table2CheckboxCells.forEach((checkboxCell) => {
                const awbNoCell = checkboxCell.parentElement.nextElementSibling;
                const courier =
                  checkboxCell.parentElement.nextElementSibling
                    .nextElementSibling.nextElementSibling;
                console.log("awbbbbb", awbNoCell, courier);
                selectedAWBNos.push(awbNoCell.textContent);
                selectedCouriers.push(courier.textContent);
              });
              return { selectedAWBNos, selectedCouriers };
            }

            function getSelectedSKUData() {
              const table3 = document.getElementById("table3");
              const selectedSKUs = [];

              if (table3) {
                const rows = table3.querySelectorAll("tbody tr");

                rows.forEach((row) => {
                  const checkbox = row.cells[0].querySelector(
                    'input[type="checkbox"]'
                  );

                  if (checkbox && checkbox.checked) {
                    const skuDataRow = row.cells;

                    selectedSKUs.push({
                      sku_Name: skuDataRow[2].textContent || "NA",
                      sku_ID: skuDataRow[3].textContent || "NA",
                      unit_Price: skuDataRow[4].textContent || "NA",
                      Item_Qty: skuDataRow[5].textContent || "NA",
                      OrderStatus: skuDataRow[6].textContent || "NA",
                      item_Status: skuDataRow[6].textContent || "NA",
                    });
                  }
                });
              }

              return selectedSKUs;
            }

            function createSubmitButton() {
              const existingSubmitButton =
                document.getElementById("submitButton");
              const existingResetButton =
                document.getElementById("resetButton");
              console.log("resettt button exist", existingResetButton);
              if (existingResetButton) {
                console.log("resettt button");
                existingResetButton.parentNode.removeChild(existingResetButton);
              }
              const resetButton = document.createElement("button");
              resetButton.textContent = "Reset";
              resetButton.id = "resetButton";
              resetButton.addEventListener("click", () => {
                clearSearchInput();
              });
              if (existingSubmitButton) {
                existingSubmitButton.parentNode.removeChild(
                  existingSubmitButton
                );
              }
              const submitButton = document.createElement("button");
              submitButton.textContent = "Submit";
              submitButton.id = "submitButton";
              submitButton.addEventListener("click", () => {
                const selectedOrderNos = getSelectedOrderNos();
                console.log("Selected Order Nos:", selectedOrderNos);
                selectedOrderNos.forEach((orderNo) => {
                  const order = jsonData.data.find(
                    (item) => item.orderNo === orderNo
                  );
                  console.log(`Order No: ${order.orderNo}`);
                  console.log("Table 1 Data:", order);
                  const { selectedAWBNos, selectedCouriers } =
                    getSelectedAWBNos();
                  if (selectedAWBNos.length > 0) {
                    console.log("Selected AWB Nos:", selectedAWBNos);
                  }

                  const selectedrevAwbs = getSelectedRewerseAwb(order);
                  console.log("selectedRevAWBs", selectedrevAwbs);
                  const selectedSKUData = getSelectedSKUData();
                  if (selectedSKUData.length > 0) {
                    console.log("Selected SKU Data:", selectedSKUData);
                  }
                  updateRequesterInfo(
                    selectedSKUData,
                    selectedOrderNos,
                    selectedAWBNos,
                    selectedrevAwbs,
                    ticket_ID,
                    selectedCouriers
                  );
                });
              });

              const table3 = document.getElementById("table3");
              if (table3) {
                tabContent.appendChild(table3);
                tabContent.appendChild(submitButton);
                tabContent.appendChild(document.createTextNode(" "));
                tabContent.appendChild(resetButton);
              } else {
                const table2 = document.getElementById("table2");
                if (table2) {
                  tabContent.appendChild(table2);
                  tabContent.appendChild(submitButton);
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                } else {
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                }
              }
            } //submit button end

            //shree
          },
          function (response) {
            console.log(response);
          }
        );
      } else {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/orders",
          type: "POST",
          timeout: 0,
          data: JSON.stringify({
            orderId: enteredUserIDOrders,
            phoneNo: userPhoneNumber,
          }),
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        console.log("settings_188", settings);

        client.request(settings).then(
          function (response) {
            var data_ = response;
            var x = response;
            var jsonData = response;

            console.log("Response_________195", response);
            for (i = 0; i < x.data.length; i++) {
              var orderNumber = x.data[i].orderNo;
              var items = x.data[i].items.length;
              for (j = 0; j < x.data[i].items.length; j++) {
                var awb_NO, courier_Name;
                if (
                  x.data[i].items[j].shipmentDetails !== null &&
                  x.data[i].items[j].shipmentDetails.length > 0
                ) {
                  awb_NO = x.data[i].items[j].shipmentDetails[0].awbNo;
                  courier_Name =
                    x.data[i].items[j].shipmentDetails[0].courierName;
                } else {
                  awb_NO = "NA";
                  courier_Name = "NA";
                }
                var item = {
                  ORDER_NO: x.data[i].orderNo,
                  Product_ID: x.data[i].items[j].productId,
                  sku_ID: x.data[i].items[j].skuId,
                  sku_Name: x.data[i].items[j].skuName,
                  item_Status: x.data[i].items[j].itemStatus,
                  item_Qty: x.data[i].items[j].itemQty,
                  unit_Price: x.data[i].items[j].unitPrice,
                  awb_No: awb_NO,
                  courier_Name: courier_Name,
                };
                itemsList.push(item);
              }
            }

            // creatingTable(itemsList,ticket_ID,client)

            createTable2(x.data[0]);

            //Shree

            function createTable2(order) {
              if (order.items.some((item) => item.shipmentDetails.length > 0)) {
                const table2 = document.createElement("table");
                table2.border = "1";

                const headers2 = [
                  "AWB No",
                  "AWB Type",
                  "Courier Name",
                  "EDD",
                  "LEDD",
                  "DD",
                  "SKU ID",
                  "Click Post Url",
                ];

                const thead2 = document.createElement("thead");
                const headerRow2 = document.createElement("tr");

                // headers2.forEach(headerText => {
                //     const th = document.createElement('th');
                //     th.textContent = headerText;
                //     headerRow2.appendChild(th);
                // });

                //start new code
                var globalCheckboxHeader = document.createElement("th");
                var globalCheckbox = document.createElement("input");
                globalCheckbox.type = "checkbox";
                globalCheckbox.addEventListener("change", function () {
                  // Call a function to handle global checkbox change
                  handleGlobalCheckboxChange(globalCheckbox.checked);
                });
                function handleGlobalCheckboxChange(checked) {
                  var tab2 = document.querySelector("#table2");
                  var checkboxes = tab2.querySelectorAll(
                    "tbody input[type='checkbox']"
                  );
                  checkboxes.forEach(function (checkbox) {
                    checkbox.checked = checked;

                    // Trigger a change event for each row checkbox
                    var changeEvent = new Event("change", { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);
                  });
                  // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                  // checkboxes.forEach(function (checkbox) {
                  //   checkbox.checked = checked
                  // });
                }
                // globalCheckbox.addEventListener("change", function () {
                //   // Toggle the selection of all checkboxes based on the global checkbox
                //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                //   checkboxes.forEach(function (checkbox) {
                //     checkbox.checked = globalCheckbox.checked;
                //   });
                // });
                globalCheckboxHeader.appendChild(globalCheckbox);
                console.log("Added new checkbox table2");
                headerRow2.appendChild(globalCheckboxHeader);

                headers2.forEach((headerText) => {
                  const th = document.createElement("th");
                  th.textContent = headerText;
                  headerRow2.appendChild(th);
                });
                thead2.appendChild(headerRow2);
                table2.appendChild(thead2);

                const tbody2 = document.createElement("tbody");

                order.items.forEach((item) => {
                  if (item.shipmentDetails.length > 0) {
                    item.shipmentDetails.forEach((shipment) => {
                      const row = document.createElement("tr");

                      const checkboxCell = document.createElement("td");
                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.addEventListener("change", () => {
                        if (checkbox.checked) {
                          // Load data for Table 3
                          createTable3(order.items);
                          // createTable3(item);
                        } else {
                          clearTable3();
                        }
                      });
                      checkboxCell.appendChild(checkbox);
                      row.appendChild(checkboxCell);

                      const awbNoCell = document.createElement("td");
                      awbNoCell.textContent = shipment.awbNo;
                      row.appendChild(awbNoCell);

                      const awbTypeCell = document.createElement("td");
                      // Fill in with your AWB Type data
                      row.appendChild(awbTypeCell);

                      const courierNameCell = document.createElement("td");
                      courierNameCell.textContent = shipment.courierName;
                      row.appendChild(courierNameCell);

                      const eddCell = document.createElement("td");
                      eddCell.textContent = shipment.estimatedDeliveryDate
                        ? formatDate(shipment.estimatedDeliveryDate)
                        : "NA";
                      row.appendChild(eddCell);

                      const leddCell = document.createElement("td");
                      leddCell.textContent =
                        shipment.latestEstimatedDeliveryDate
                          ? formatDate(shipment.latestEstimatedDeliveryDate)
                          : "NA";
                      row.appendChild(leddCell);

                      const ddCell = document.createElement("td");
                      ddCell.textContent = shipment.deliveredDate
                        ? formatDate(shipment.deliveredDate)
                        : "NA";
                      row.appendChild(ddCell);

                      const skuidCell = document.createElement("td");
                      skuidCell.textContent = item.skuId;
                      row.appendChild(skuidCell);

                      const clickPostUrlCell = document.createElement("td");
                      if (shipment.clickpostUrl) {
                        const clickPostLink = document.createElement("a");
                        clickPostLink.href = shipment.clickpostUrl;
                        clickPostLink.target = "_blank";
                        clickPostLink.textContent = "Click Post";
                        clickPostUrlCell.appendChild(clickPostLink);
                      } else {
                        clickPostUrlCell.textContent = "NA";
                      }
                      row.appendChild(clickPostUrlCell);

                      tbody2.appendChild(row);
                    });
                  }
                });

                table2.appendChild(tbody2);
                table2.id = "table2";
                tabContent.appendChild(table2);
              } else {
                createTable3(order.items);
                return;
              }

              createSubmitButton();
            }
            function formatDate(dateString) {
              const options = {
                day: "numeric",
                month: "short",
                year: "numeric",
              };
              return new Date(dateString).toLocaleDateString("en-US", options);
            }

            // // Function to create Table 3
            function createTable3(items) {
              const table3 = document.createElement("table");
              table3.setAttribute("class", "table3");
              table3.border = "1";

              const headers3 = [
                // 'CB',
                "SKU Image",
                "SKU Name",
                "SKU ID",
                "Unit Price/Item",
                "Item Qty",
                "Item Status",
                "Canceled Qty",
                "Shared / Volume",
              ];

              const thead3 = document.createElement("thead");
              const headerRow3 = document.createElement("tr");

              //start new code
              var globalCheckboxHeader = document.createElement("th");
              var globalCheckbox = document.createElement("input");
              globalCheckbox.type = "checkbox";
              globalCheckbox.addEventListener("change", function () {
                // Call a function to handle global checkbox change
                handleGlobalCheckboxChange(globalCheckbox.checked);
              });
              function handleGlobalCheckboxChange(checked) {
                var tab3 = document.querySelector("#table3");
                var checkboxes = document.querySelectorAll(
                  ".table3 tbody input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;

                  // Trigger a change event for each row checkbox
                  var changeEvent = new Event("change", { bubbles: true });
                  checkbox.dispatchEvent(changeEvent);
                });
                checkboxes = document.querySelectorAll(
                  ".table3 thead input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;
                });
                // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                // checkboxes.forEach(function (checkbox) {
                //   checkbox.checked = checked
                // });
              }
              // globalCheckbox.addEventListener("change", function () {
              //   // Toggle the selection of all checkboxes based on the global checkbox
              //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              //   checkboxes.forEach(function (checkbox) {
              //     checkbox.checked = globalCheckbox.checked;
              //   });
              // });
              globalCheckboxHeader.appendChild(globalCheckbox);
              console.log("Added new checkbox table2");
              headerRow3.appendChild(globalCheckboxHeader);
              headers3.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow3.appendChild(th);
              });

              thead3.appendChild(headerRow3);
              table3.appendChild(thead3);

              const tbody3 = document.createElement("tbody");

              items.forEach((item) => {
                const row = document.createElement("tr");

                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (!checkbox.checked) {
                    // Clear Table 3
                    clearTable3();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const skuImageCell = document.createElement("td");
                if (item.skuImage) {
                  const skuImage = document.createElement("img");
                  skuImage.src = item.skuImage;
                  skuImage.width = 50;
                  skuImageCell.appendChild(skuImage);
                }
                row.appendChild(skuImageCell);

                const skuNameCell = document.createElement("td");
                skuNameCell.textContent = item.skuName;
                skuNameCell.classList.add("SKUName");
                row.appendChild(skuNameCell);

                const skuIdCell = document.createElement("td");
                skuIdCell.textContent = item.skuId;
                row.appendChild(skuIdCell);

                const unitPriceCell = document.createElement("td");
                unitPriceCell.textContent = item.unitPrice;
                row.appendChild(unitPriceCell);

                const itemQtyCell = document.createElement("td");
                itemQtyCell.textContent = item.itemQty;
                row.appendChild(itemQtyCell);

                const itemStatusCell = document.createElement("td");
                itemStatusCell.textContent = item.itemStatus;
                row.appendChild(itemStatusCell);

                const canceledQtyCell = document.createElement("td");
                canceledQtyCell.textContent = item.cancelledQty;
                row.appendChild(canceledQtyCell);

                const sharedVolumeCell = document.createElement("td");
                sharedVolumeCell.textContent = "NF in API";
                row.appendChild(sharedVolumeCell);

                tbody3.appendChild(row);
              });

              table3.appendChild(tbody3);
              table3.id = "table3";
              tabContent.appendChild(table3);

              // Submit button after Table 3
              createSubmitButton();
            }

            function clearTables() {
              const table2 = document.querySelector("#table2");
              if (table2) {
                table2.parentNode.removeChild(table2);
              }

              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function clearTable3() {
              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function getSelectedOrderNos() {
              const selectedOrderNos = [];
              selectedOrderNos.push(enteredUserIDOrders);
              // const checkboxes = document.querySelectorAll('#table1 tbody input[type="checkbox"]');
              // checkboxes.forEach(checkbox => {
              //     if (checkbox.checked) {
              //         const orderNoCell = checkbox.closest('tr').querySelector('td:nth-child(2)');
              //         selectedOrderNos.push(orderNoCell.textContent);
              //     }
              // });
              return selectedOrderNos;
            }

            function getSelectedRewerseAwb(orders) {
              const selectedRevAwbNos = [];
              // for(let i=0;i<orders.length;i++){
              console.log(
                "isequal",
                orders.orderNo === enteredUserIDOrders,
                orders.orderNo,
                enteredUserIDOrders
              );
              if (orders.orderNo === enteredUserIDOrders) {
                const curentOrder = orders;
                console.log("current order", curentOrder);
                if (curentOrder.items) {
                  for (let j = 0; j < curentOrder.items.length; j++) {
                    const curItem = curentOrder.items[j];
                    if (curItem.returnDetails.length > 0) {
                      for (let k = 0; k < curItem.returnDetails.length; k++) {
                        if (curItem.returnDetails[k].reverseAwb) {
                          selectedRevAwbNos.push(
                            curItem.returnDetails[k].reverseAwb
                          );
                        }
                      }
                    }
                  }
                }
              }

              // }
              return selectedRevAwbNos;
            }

            function getSelectedAWBNos() {
              const selectedAWBNos = [];
              const selectedCouriers = [];
              const table2CheckboxCells = document.querySelectorAll(
                "#table2 tbody td:first-child input:checked"
              );
              console.log("awbbbbb1", table2CheckboxCells);
              table2CheckboxCells.forEach((checkboxCell) => {
                const awbNoCell = checkboxCell.parentElement.nextElementSibling;
                const courier =
                  checkboxCell.parentElement.nextElementSibling
                    .nextElementSibling.nextElementSibling;
                console.log("awbbbbb", awbNoCell, courier);
                selectedAWBNos.push(awbNoCell.textContent);
                selectedCouriers.push(courier.textContent);
              });
              return { selectedAWBNos, selectedCouriers };
            }

            function getSelectedSKUData() {
              const table3 = document.getElementById("table3");
              const selectedSKUs = [];

              if (table3) {
                const rows = table3.querySelectorAll("tbody tr");

                rows.forEach((row) => {
                  const checkbox = row.cells[0].querySelector(
                    'input[type="checkbox"]'
                  );

                  if (checkbox && checkbox.checked) {
                    const skuDataRow = row.cells;

                    selectedSKUs.push({
                      sku_Name: skuDataRow[2].textContent || "NA",
                      sku_ID: skuDataRow[3].textContent || "NA",
                      unit_Price: skuDataRow[4].textContent || "NA",
                      Item_Qty: skuDataRow[5].textContent || "NA",
                      OrderStatus: skuDataRow[6].textContent || "NA",
                      item_Status: skuDataRow[6].textContent || "NA",
                    });
                  }
                });
              }

              return selectedSKUs;
            }

            function createSubmitButton() {
              const existingSubmitButton =
                document.getElementById("submitButton");
              const existingResetButton =
                document.getElementById("resetButton");
              console.log("resettt button exist", existingResetButton);
              if (existingResetButton) {
                console.log("resettt button");
                existingResetButton.parentNode.removeChild(existingResetButton);
              }
              const resetButton = document.createElement("button");
              resetButton.textContent = "Reset";
              resetButton.id = "resetButton";
              resetButton.addEventListener("click", () => {
                clearSearchInput();
              });
              if (existingSubmitButton) {
                existingSubmitButton.parentNode.removeChild(
                  existingSubmitButton
                );
              }
              const submitButton = document.createElement("button");
              submitButton.textContent = "Submit";
              submitButton.id = "submitButton";
              submitButton.addEventListener("click", () => {
                const selectedOrderNos = getSelectedOrderNos();
                console.log("Selected Order Nos:", selectedOrderNos);

                selectedOrderNos.forEach((orderNo) => {
                  const order = jsonData.data.find(
                    (item) => item.orderNo === orderNo
                  );
                  console.log(`Order No: ${order.orderNo}`);
                  console.log("Table 1 Data:", order);
                  const { selectedAWBNos, selectedCouriers } =
                    getSelectedAWBNos();
                  if (selectedAWBNos.length > 0) {
                    console.log("Selected AWB Nos:", selectedAWBNos);
                  }

                  const selectedrevAwbs = getSelectedRewerseAwb(order);
                  console.log("selectedRevAWBs", selectedrevAwbs);

                  const selectedSKUData = getSelectedSKUData();
                  if (selectedSKUData.length > 0) {
                    console.log("Selected SKU Data:", selectedSKUData);
                  }
                  updateRequesterInfo(
                    selectedSKUData,
                    selectedOrderNos,
                    selectedAWBNos,
                    selectedrevAwbs,
                    ticket_ID,
                    selectedCouriers
                  );
                });
              });

              const table3 = document.getElementById("table3");
              if (table3) {
                tabContent.appendChild(table3);
                tabContent.appendChild(submitButton);
                tabContent.appendChild(document.createTextNode(" "));
                tabContent.appendChild(resetButton);
              } else {
                const table2 = document.getElementById("table2");
                if (table2) {
                  tabContent.appendChild(table2);
                  tabContent.appendChild(submitButton);
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                } else {
                  tabContent.appendChild(document.createTextNode(" "));
                  tabContent.appendChild(resetButton);
                }
              }
            } //submit button end

            //shree
          },
          function (response) {
            console.log(response);
          }
        );
      }

      function creatingTable(userData, ticket_id, client) {
        // Create the table dynamically
        console.log("ertyuytrewq ", userData);

        var table = document.createElement("table");

        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");
        var checkboxHeader = document.createElement("th");
        headerRow.appendChild(checkboxHeader);

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
          var checkboxes = document.querySelectorAll(
            "tbody input[type='checkbox']:checked"
          );

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
      // updateRequesterInfo(selectedData, ticket_id, client);

      //commented this function by Shree
      // function updateRequesterInfo(userItemData,ticket_id,client) {
      // console.log("userItemData.length",userItemData.length,ticket_id);
      // console.log("userItemData",userItemData);
      // if(userItemData.length == 1){

      // var itemData=[];
      // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name});

      // var ticketdata={
      // "ticket":{

      //   "custom_fields":itemData
      // }
      // }
      // var updateUser_Ticketdata = {
      // 'url': '/api/v2/tickets/' + ticket_id + '.json',
      // 'data':JSON.stringify(ticketdata),
      // 'method':'PUT',
      // "headers": {
      //         "Content-Type": "application/json",
      // }

      // };

      // client.request(updateUser_Ticketdata).then(
      // function(data2) {
      //   var requester_data = {
      //     'Order_ID': userItemData.ORDER_NO,
      //     'Item_ID': userItemData.sku_ID ,
      //     'Item_Name': userItemData.sku_Name ,
      //     'Item_Quantity': userItemData.item_Qty ,
      //     'Item_Price': userItemData.unit_Price ,
      //     'Item_AWBNO': userItemData.awb_No ,
      //     'Item_CourierName': userItemData.courier_Name
      //   };
      //   var source = $("#requester-template").html();
      //   var template = Handlebars.compile(source);
      //   var html = template(requester_data);
      //   $("#content").html(html);
      // },
      // function(response) {
      // }
      // );

      // }else if(userItemData.length == 2){

      // var itemData=[];

      // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name});

      // var ticketdata={
      // "ticket":{

      //   "custom_fields":itemData
      // }
      // }
      // var updateUser_Ticketdata = {
      // 'url': '/api/v2/tickets/' + ticket_id + '.json',
      // 'data':JSON.stringify(ticketdata),
      // 'method':'PUT',
      // "headers": {
      //         "Content-Type": "application/json",
      // }

      // };

      // client.request(updateUser_Ticketdata).then(
      // function(data2) {
      //   var requester_data = {
      //     'Order_ID': userItemData.ORDER_NO,
      //     'Item_ID': userItemData.sku_ID ,
      //     'Item_Name': userItemData.sku_Name ,
      //     'Item_Quantity': userItemData.item_Qty ,
      //     'Item_Price': userItemData.unit_Price ,
      //     'Item_AWBNO': userItemData.awb_No ,
      //     'Item_CourierName': userItemData.courier_Name
      //   };
      //   var source = $("#requester-template").html();
      //   var template = Handlebars.compile(source);
      //   var html = template(requester_data);
      //   $("#content").html(html);
      // },
      // function(response) {
      // }
      // );

      // }else if(userItemData.length == 3){

      // var itemData=[];
      // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name});

      // var ticketdata={
      // "ticket":{

      //   "custom_fields":itemData
      // }
      // }
      // var updateUser_Ticketdata = {
      // 'url': '/api/v2/tickets/' + ticket_id + '.json',
      // 'data':JSON.stringify(ticketdata),
      // 'method':'PUT',
      // "headers": {
      //         "Content-Type": "application/json",
      // }

      // };

      // client.request(updateUser_Ticketdata).then(
      // function(data2) {
      //   var requester_data = {
      //     'Order_ID': userItemData.ORDER_NO,
      //     'Item_ID': userItemData.sku_ID ,
      //     'Item_Name': userItemData.sku_Name ,
      //     'Item_Quantity': userItemData.item_Qty ,
      //     'Item_Price': userItemData.unit_Price ,
      //     'Item_AWBNO': userItemData.awb_No ,
      //     'Item_CourierName': userItemData.courier_Name
      //   };
      //   var source = $("#requester-template").html();
      //   var template = Handlebars.compile(source);
      //   var html = template(requester_data);
      //   $("#content").html(html);
      // },
      // function(response) {
      // }
      // );

      // }else if(userItemData.length == 4){

      // var itemData=[];
      // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name},{"id":15969595949085,"value":userItemData[3].Product_ID},{"id":15969582488605,"value":userItemData[3].sku_ID}  ,{"id":15969587982237,"value":userItemData[3].sku_Name},{"id":15969874465565,"value":userItemData[3].item_Status},{"id":15969601460637,"value":userItemData[3].item_Qty},{"id":15969592412573,"value":userItemData[3].unit_Price},{"id":14629555101981,"value":userItemData[3].awb_No},{"id":14629524472477,"value":userItemData[3].courier_Name});

      // var ticketdata={
      // "ticket":{

      //   "custom_fields":itemData
      // }
      // }
      // var updateUser_Ticketdata = {
      // 'url': '/api/v2/tickets/' + ticket_id + '.json',
      // 'data':JSON.stringify(ticketdata),
      // 'method':'PUT',
      // "headers": {
      //         "Content-Type": "application/json",
      // }

      // };

      // client.request(updateUser_Ticketdata).then(
      // function(data2) {
      //   var requester_data = {
      //     'Order_ID': userItemData.ORDER_NO,
      //     'Item_ID': userItemData.sku_ID ,
      //     'Item_Name': userItemData.sku_Name ,
      //     'Item_Quantity': userItemData.item_Qty ,
      //     'Item_Price': userItemData.unit_Price ,
      //     'Item_AWBNO': userItemData.awb_No ,
      //     'Item_CourierName': userItemData.courier_Name
      //   };
      //   var source = $("#requester-template").html();
      //   var template = Handlebars.compile(source);
      //   var html = template(requester_data);
      //   $("#content").html(html);
      // },
      // function(response) {
      // }
      // );

      // }else if(userItemData.length == 5){

      // var itemData=[];
      // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name},{"id":15969595949085,"value":userItemData[3].Product_ID},{"id":15969582488605,"value":userItemData[3].sku_ID}  ,{"id":15969587982237,"value":userItemData[3].sku_Name},{"id":15969874465565,"value":userItemData[3].item_Status},{"id":15969601460637,"value":userItemData[3].item_Qty},{"id":15969592412573,"value":userItemData[3].unit_Price},{"id":14629555101981,"value":userItemData[3].awb_No},{"id":14629524472477,"value":userItemData[3].courier_Name},{"id":15969596015645,"value":userItemData[4].Product_ID},{"id":15969567336349,"value":userItemData[4].sku_ID}  ,{"id":15969602984477,"value":userItemData[4].sku_Name},{"id":15969858294429,"value":userItemData[4].item_Status},{"id":15969601547293,"value":userItemData[4].item_Qty},{"id":15969632814621,"value":userItemData[4].unit_Price},{"id":14629539041053,"value":userItemData[4].awb_No},{"id":14629517288477,"value":userItemData[4].courier_Name});

      // var ticketdata={
      // "ticket":{

      //   "custom_fields":itemData
      // }
      // }
      // var updateUser_Ticketdata = {
      // 'url': '/api/v2/tickets/' + ticket_id + '.json',
      // 'data':JSON.stringify(ticketdata),
      // 'method':'PUT',
      // "headers": {
      //         "Content-Type": "application/json",
      // }

      // };

      // client.request(updateUser_Ticketdata).then(
      // function(data2) {
      //   var requester_data = {
      //     'Order_ID': userItemData.ORDER_NO,
      //     'Item_ID': userItemData.sku_ID ,
      //     'Item_Name': userItemData.sku_Name ,
      //     'Item_Quantity': userItemData.item_Qty ,
      //     'Item_Price': userItemData.unit_Price ,
      //     'Item_AWBNO': userItemData.awb_No ,
      //     'Item_CourierName': userItemData.courier_Name
      //   };
      //   var source = $("#requester-template").html();
      //   var template = Handlebars.compile(source);
      //   var html = template(requester_data);
      //   $("#content").html(html);
      // },
      // function(response) {
      // }
      // );

      // }else{

      // }
      // }

      //added this function by shree
      function updateRequesterInfo(
        userItemData,
        ORDER_NO,
        awb_NO,
        selectedrevAwbs,
        ticket_id,
        couriers
      ) {
        console.log("userItemData", userItemData);
        console.log("userItemData.length", userItemData.length, ticket_id);
        console.log("userItemData", userItemData);
        console.log("UserItemRev", selectedrevAwbs);
        console.log("couriers", couriers);
        let alertContent = "Submitted Succcessfully";
        if (userItemData.length == 1) {
          //done
          var itemData = [];
          // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name});
          itemData.push(
            { id: 14408721143325, value: ORDER_NO[0] },
            { id: 19060820668445, value: userItemData[0].Product_ID },
            { id: 19059992368029, value: userItemData[0].sku_ID },
            { id: 19060895174557, value: userItemData[0].sku_Name },
            { id: 19061547394845, value: userItemData[0].item_Status },
            { id: 19061397235485, value: userItemData[0].item_Qty },
            { id: 19061758394781, value: userItemData[0].unit_Price },
            { id: 17232417457565, value: awb_NO[0] },
            { id: 17232372293661, value: couriers[0] },
            { id: 19059989229853, value: selectedrevAwbs[0] }
          );

          var ticketdata = {
            tickets: [
              {
                id: ticket_id,
                custom_fields: itemData,
              },
            ],
          };
          var updateUser_Ticketdata = {
            url: "/api/v2/tickets/update_many.json",
            data: JSON.stringify(ticketdata),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          client.request(updateUser_Ticketdata).then(
            function (data2) {},
            function (response) {}
          );
        } else if (userItemData.length == 2) {
          var itemData = [];

          // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name});
          itemData.push(
            { id: 14408721143325, value: ORDER_NO[0] },
            { id: 19060820668445, value: userItemData[0].Product_ID },
            { id: 19059992368029, value: userItemData[0].sku_ID },
            { id: 19060895174557, value: userItemData[0].sku_Name },
            { id: 19061547394845, value: userItemData[0].item_Status },
            { id: 19061397235485, value: userItemData[0].item_Qty },
            { id: 19061758394781, value: userItemData[0].unit_Price },
            { id: 17232417457565, value: awb_NO[0] },
            { id: 17232372293661, value: couriers[0] },
            { id: 19059989229853, value: selectedrevAwbs[0] },
            { id: 19060841019933, value: userItemData[1].Product_ID },
            { id: 19061007438877, value: userItemData[1].sku_ID },
            { id: 19060922613917, value: userItemData[1].sku_Name },
            { id: 19061548918813, value: userItemData[1].item_Status },
            { id: 19061412323229, value: userItemData[1].item_Qty },
            { id: 19061788703005, value: userItemData[1].unit_Price },
            { id: 19061855140509, value: awb_NO[1] },
            { id: 19061913219997, value: couriers[1] }
          );

          var ticketdata = {
            tickets: [
              {
                id: ticket_id,
                custom_fields: itemData,
              },
            ],
          };
          var updateUser_Ticketdata = {
            url: "/api/v2/tickets/update_many.json",
            data: JSON.stringify(ticketdata),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          client.request(updateUser_Ticketdata).then(
            function (data2) {},
            function (response) {}
          );
        } else if (userItemData.length == 3) {
          var itemData = [];
          // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name});
          itemData.push(
            { id: 14408721143325, value: ORDER_NO[0] },
            { id: 19060820668445, value: userItemData[0].Product_ID },
            { id: 19059992368029, value: userItemData[0].sku_ID },
            { id: 19060895174557, value: userItemData[0].sku_Name },
            { id: 19061547394845, value: userItemData[0].item_Status },
            { id: 19061397235485, value: userItemData[0].item_Qty },
            { id: 19061758394781, value: userItemData[0].unit_Price },
            { id: 17232417457565, value: awb_NO[0] },
            { id: 17232372293661, value: couriers[0] },
            { id: 19059989229853, value: selectedrevAwbs[0] },
            { id: 19060841019933, value: userItemData[1].Product_ID },
            { id: 19061007438877, value: userItemData[1].sku_ID },
            { id: 19060922613917, value: userItemData[1].sku_Name },
            { id: 19061548918813, value: userItemData[1].item_Status },
            { id: 19061412323229, value: userItemData[1].item_Qty },
            { id: 19061788703005, value: userItemData[1].unit_Price },
            { id: 19061855140509, value: awb_NO[1] },
            { id: 19061913219997, value: couriers[1] },
            { id: 19060828110365, value: userItemData[2].Product_ID },
            { id: 19061009310365, value: userItemData[2].sku_ID },
            { id: 19060957578397, value: userItemData[2].sku_Name },
            { id: 19061558049821, value: userItemData[2].item_Status },
            { id: 19061506676253, value: userItemData[2].item_Qty },
            { id: 19061790898973, value: userItemData[2].unit_Price },
            { id: 19061849327901, value: awb_NO[2] },
            { id: 19061910916637, value: couriers[2] }
          );

          var ticketdata = {
            tickets: [
              {
                id: ticket_id,
                custom_fields: itemData,
              },
            ],
          };
          var updateUser_Ticketdata = {
            url: "/api/v2/tickets/update_many.json",
            data: JSON.stringify(ticketdata),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          client.request(updateUser_Ticketdata).then(
            function (data2) {},
            function (response) {}
          );
        } else if (userItemData.length == 4) {
          var itemData = [];
          itemData.push(
            { id: 14408721143325, value: ORDER_NO[0] },
            { id: 19060820668445, value: userItemData[0].Product_ID },
            { id: 19059992368029, value: userItemData[0].sku_ID },
            { id: 19060895174557, value: userItemData[0].sku_Name },
            { id: 19061547394845, value: userItemData[0].item_Status },
            { id: 19061397235485, value: userItemData[0].item_Qty },
            { id: 19061758394781, value: userItemData[0].unit_Price },
            { id: 17232417457565, value: awb_NO[0] },
            { id: 17232372293661, value: couriers[0] },
            { id: 19059989229853, value: selectedrevAwbs[0] },
            { id: 19060841019933, value: userItemData[1].Product_ID },
            { id: 19061007438877, value: userItemData[1].sku_ID },
            { id: 19060922613917, value: userItemData[1].sku_Name },
            { id: 19061548918813, value: userItemData[1].item_Status },
            { id: 19061412323229, value: userItemData[1].item_Qty },
            { id: 19061788703005, value: userItemData[1].unit_Price },
            { id: 19061855140509, value: awb_NO[1] },
            { id: 19061913219997, value: couriers[1] },
            { id: 19060828110365, value: userItemData[2].Product_ID },
            { id: 19061009310365, value: userItemData[2].sku_ID },
            { id: 19060957578397, value: userItemData[2].sku_Name },
            { id: 19061558049821, value: userItemData[2].item_Status },
            { id: 19061506676253, value: userItemData[2].item_Qty },
            { id: 19061790898973, value: userItemData[2].unit_Price },
            { id: 19061849327901, value: awb_NO[2] },
            { id: 14629523253277, value: couriers[2] }, //TBD
            { id: 19060845889565, value: userItemData[3].Product_ID },
            { id: 19061023354909, value: userItemData[3].sku_ID },
            { id: 19060943790621, value: userItemData[3].sku_Name },
            { id: 19061738065053, value: userItemData[3].item_Status },
            { id: 19061491893661, value: userItemData[3].item_Qty },
            { id: 19061793343773, value: userItemData[3].unit_Price },
            { id: 19061863194013, value: awb_NO[3] },
            { id: 14629524472477, value: couriers[3] } //TBD
          );

          var ticketdata = {
            tickets: [
              {
                id: ticket_id,
                custom_fields: itemData,
              },
            ],
          };
          var updateUser_Ticketdata = {
            url: "/api/v2/tickets/update_many.json",
            data: JSON.stringify(ticketdata),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          client.request(updateUser_Ticketdata).then(
            function (data2) {},
            function (response) {}
          );
        } else if (userItemData.length == 5) {
          var itemData = [];
          itemData.push(
            { id: 14408721143325, value: ORDER_NO[0] },
            { id: 19060820668445, value: userItemData[0].Product_ID },
            { id: 19059992368029, value: userItemData[0].sku_ID },
            { id: 19060895174557, value: userItemData[0].sku_Name },
            { id: 19061547394845, value: userItemData[0].item_Status },
            { id: 19061397235485, value: userItemData[0].item_Qty },
            { id: 19061758394781, value: userItemData[0].unit_Price },
            { id: 17232417457565, value: awb_NO[0] },
            { id: 17232372293661, value: couriers[0] },
            { id: 19059989229853, value: selectedrevAwbs[0] },
            { id: 19060841019933, value: userItemData[1].Product_ID },
            { id: 19061007438877, value: userItemData[1].sku_ID },
            { id: 19060922613917, value: userItemData[1].sku_Name },
            { id: 19061548918813, value: userItemData[1].item_Status },
            { id: 19061412323229, value: userItemData[1].item_Qty },
            { id: 19061788703005, value: userItemData[1].unit_Price },
            { id: 19061855140509, value: awb_NO[1] },
            { id: 19061913219997, value: couriers[1] },
            { id: 19060828110365, value: userItemData[2].Product_ID },
            { id: 19061009310365, value: userItemData[2].sku_ID },
            { id: 19060957578397, value: userItemData[2].sku_Name },
            { id: 19061558049821, value: userItemData[2].item_Status },
            { id: 19061506676253, value: userItemData[2].item_Qty },
            { id: 19061790898973, value: userItemData[2].unit_Price },
            { id: 19061849327901, value: awb_NO[2] },
            { id: 19061910916637, value: couriers[2] },
            { id: 19060845889565, value: userItemData[3].Product_ID },
            { id: 19061023354909, value: userItemData[3].sku_ID },
            { id: 19060943790621, value: userItemData[3].sku_Name },
            { id: 19061738065053, value: userItemData[3].item_Status },
            { id: 19061491893661, value: userItemData[3].item_Qty },
            { id: 19061793343773, value: userItemData[3].unit_Price },
            { id: 19061863194013, value: awb_NO[3] },
            { id: 19061946734749, value: couriers[3] },
            { id: 19060906607517, value: userItemData[4].Product_ID },
            { id: 19061145634973, value: userItemData[4].sku_ID },
            { id: 19060929434397, value: userItemData[4].sku_Name },
            { id: 19061717823133, value: userItemData[4].item_Status },
            { id: 19061543756701, value: userItemData[4].item_Qty },
            { id: 19061822804125, value: userItemData[4].unit_Price },
            { id: 19061851958685, value: awb_NO[4] },
            { id: 19061955342749, value: couriers[4] }
          );

          var ticketdata = {
            tickets: [
              {
                id: ticket_id,
                custom_fields: itemData,
              },
            ],
          };
          var updateUser_Ticketdata = {
            url: "/api/v2/tickets/update_many.json",
            data: JSON.stringify(ticketdata),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          client.request(updateUser_Ticketdata).then(
            function (data2) {},
            function (response) {}
          );
        } else {
          alertContent = "Failed to Submit";
        }
        alert("submitted successfully");
        var popup = document.getElementById("popupContainer");
        var popupContent = document.querySelector(".modal-content");
        if (popup) {
          var contentHTML = `<div class="alertModal" style="padding:11%;">
      <div class="top-bar">
            <span class="close">&times;</span>
            </div>
            ${alertContent}</div>`;
          popupContent.innerHTML = contentHTML;

          popup.style.display = "block";
          popupContent.style.width = "206px";
          popupContent.style.height = "70px";
          popupContent.style.position = "absolute";
          popupContent.style.top = "35%";
          popupContent.style.left = "35%";
          popupContent.style.right = "2%";
          popupContent.style.bottom = "15%";
          popupContent.style.backgroundColor = "#fff";
          /* border: 1px solid #ccc; */
          popupContent.style.overflow = "auto";

          var closeButton = document.querySelector(".close");
          if (closeButton) {
            closeButton.addEventListener("click", closePopup);
          }
        }
        console.log("submittedddd");
      }
    } else {
      //        Normal Flow

      if (customer_id) {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/orders",
          type: "POST",
          timeout: 0,
          data: JSON.stringify({
            pageNo: startInd,
            pageSize: endInd,
            customerId: customer_id, //phoneNo
          }),
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        client.request(settings).then(function (response) {
          var jsonData =
            Object.keys(loadData).length > 0 ? { ...loadData } : response;

          createTable1();

          function createTable1() {
            const table1 = document.createElement("table");
            table1.border = "1";
            const rowsPerPage = 5;
            let currentPage = 1;
            // let startIndex = 0

            const headers1 = [
              "Checkbox",
              "Order No",
              "Order Date",
              "Order Amount",
              "Order Status",
              "Order Source",
            ];
            const thead1 = document.createElement("thead");
            const headerRow1 = document.createElement("tr");

            headers1.forEach((headerText) => {
              const th = document.createElement("th");
              th.textContent = headerText;
              headerRow1.appendChild(th);
            });

            thead1.appendChild(headerRow1);
            table1.appendChild(thead1);

            const tbody1 = document.createElement("tbody");
            function displayRows(resData, startIndex, endIndex) {
              console.log("respdataaaaa", resData, startInd, endInd);
              for (let i = 0; i < resData.data.length; i++) {
                const order = resData.data[i];
                console.log("Orderrrrr", order.orderNo);
                const row = document.createElement("tr");

                // ... (create cells for each column, similar to the existing code)
                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (checkbox.checked) {
                    createTable2(order);
                    hideOtherRows(row);
                  } else {
                    clearTables();
                    showAllRows();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const orderNoCell = document.createElement("td");
                const orderNoLink = document.createElement("a");
                orderNoLink.textContent = order.orderNo;
                orderNoLink.href = order.adminPanelLink;
                orderNoLink.target = "_blank";
                orderNoCell.appendChild(orderNoLink);
                row.appendChild(orderNoCell);

                const orderDateCell = document.createElement("td");
                orderDateCell.textContent = new Date(
                  order.orderDate
                ).toLocaleDateString();
                row.appendChild(orderDateCell);

                const orderAmountCell = document.createElement("td");
                orderAmountCell.textContent = order.orderAmount;
                row.appendChild(orderAmountCell);

                const orderStatusCell = document.createElement("td");
                orderStatusCell.textContent = order.orderStatus;
                row.appendChild(orderStatusCell);

                const orderSourceCell = document.createElement("td");
                orderSourceCell.textContent = order.source;
                row.appendChild(orderSourceCell);

                tbody1.appendChild(row);
                // Append the row to the table body
                tbody1.appendChild(row);
              }
            }

            function renderTable() {
              // Clear existing rows
              tbody1.innerHTML = "";

              // Calculate the start and end index based on the current page
              const startIndex = (currentPage - 1) * rowsPerPage;
              const endIndex = startIndex + rowsPerPage;

              // Display rows for the current page
              displayRows(jsonData, startIndex, endIndex);
            }

            function createSeeMore() {
              const seeMoreLink = document.createElement("a");
              seeMoreLink.href = "#"; // You can set the actual link destination
              seeMoreLink.textContent = "See More";
              tabContent.appendChild(seeMoreLink);
              seeMoreLink.addEventListener("click", function (event) {
                // Determine the next 5 rows to display
                event.preventDefault(); // Prevent the default link behavior

                // const curEnd = tbody1.children.length;
                const startIndex = (startInd += 1);
                const endIndex = 5;
                // currentPage++
                const currentRows = tbody1.children.length;
                const nextStartIndex = currentRows;
                const nextEndIndex = currentRows + rowsPerPage;

                var settings = {
                  url: "https://api.nykaa.com/hcsApis/orders",
                  type: "POST",
                  timeout: 0,
                  data: JSON.stringify({
                    pageNo: startIndex,
                    pageSize: endInd,
                    emailId: userEmail, //phoneNo
                  }),
                  headers: {
                    accept: "application/json",
                    "Content-type": "application/json",
                    source: userBrandName,
                    "X-API-KEY": "{{setting.apiToken}}",
                  },
                  secure: true,
                };
                client.request(settings).then(function (response) {
                  var respData = response;
                  respData.data = [...jsonData.data, ...respData.data];
                  // displayRows(respData, nextStartIndex, nextEndIndex);
                  // tabContent.appendChild(seeMoreLink);
                  loadTabContent(
                    "Orders",
                    userID,
                    userEmail,
                    userPhoneNumber,
                    userBrandName,
                    user_premium,
                    ticket_ID,
                    customer_id,
                    startIndex,
                    endIndex,
                    respData
                  );
                });
                // Append the next set of rows
                // jsonData.data.slice(startIndex, endIndex).forEach(order => {
                //   appendRowToTable(order, tbody1);
                // });
                // If there are no more rows to display, hide the "see more" button
                if (endIndex >= jsonData.data.length) {
                  seeMoreLink.style.display = "none";
                }
                // renderTable()
              });
            }

            // jsonData.data.forEach(order => {
            //     const row = document.createElement('tr');

            //     const checkboxCell = document.createElement('td');
            //     const checkbox = document.createElement('input');
            //     checkbox.type = 'checkbox';
            //     checkbox.addEventListener('change', () => {
            //         if (checkbox.checked) {
            //             createTable2(order);
            //             hideOtherRows(row);
            //         } else {
            //             clearTables();
            //             showAllRows();
            //         }
            //     });
            //     checkboxCell.appendChild(checkbox);
            //     row.appendChild(checkboxCell);

            //     const orderNoCell = document.createElement('td');
            //     const orderNoLink = document.createElement('a');
            //     orderNoLink.textContent = order.orderNo;
            //     orderNoLink.href = order.adminPanelLink;
            //     orderNoLink.target = '_blank';
            //     orderNoCell.appendChild(orderNoLink);
            //     row.appendChild(orderNoCell);

            //     const orderDateCell = document.createElement('td');
            //     orderDateCell.textContent = new Date(order.orderDate).toLocaleDateString();
            //     row.appendChild(orderDateCell);

            //     const orderAmountCell = document.createElement('td');
            //     orderAmountCell.textContent = order.orderAmount;
            //     row.appendChild(orderAmountCell);

            //     const orderStatusCell = document.createElement('td');
            //     orderStatusCell.textContent = order.orderStatus;
            //     row.appendChild(orderStatusCell);

            //     tbody1.appendChild(row);
            // });

            table1.appendChild(tbody1);
            table1.id = "table1";
            tabContent.appendChild(table1);

            // Initial render of the table
            renderTable();

            createSubmitButton();
            createSeeMore();
            // createResetButton()
            // Create a "see more" button
            // createSeeMore()
            // const seeMoreLink = document.createElement('a');
            // seeMoreLink.href = '#'; // You can set the actual link destination
            // seeMoreLink.textContent = 'See More';
            // tabContent.appendChild(seeMoreLink);
            // seeMoreLink.addEventListener('click', function (event) {
            //   // Determine the next 5 rows to display
            //   event.preventDefault(); // Prevent the default link behavior

            //   // const curEnd = tbody1.children.length;
            //   const startIndex = startInd+=1
            //   const endIndex = 5;
            //   // currentPage++
            //   const currentRows = tbody1.children.length;
            //   const nextStartIndex = currentRows;
            //   const nextEndIndex = currentRows + rowsPerPage;

            //   var settings = {
            //     "url": "https://api.nykaa.com/hcsApis/orders",
            //     "type": "POST",
            //     "timeout": 0,
            //     "data": JSON.stringify({
            //     "pageNo": startInd++,
            //     "pageSize": endInd,
            //     "emailId" : userEmail  //phoneNo
            //     }),
            //     "headers": {
            //     "accept": "application/json",
            //     "Content-type": "application/json",
            //     "source": userBrandName,
            //     "X-API-KEY": "{{setting.apiToken}}"
            //     },
            //     secure:true,

            //     };
            //     client.request(settings).then(
            //     function(response) {
            //     var respData= response;
            //     respData.data = [...jsonData.data, ...respData.data]
            //     displayRows(respData, nextStartIndex, nextEndIndex);
            //     tabContent.appendChild(seeMoreLink);
            //     })
            //   // Append the next set of rows
            //   // loadTabContent('Orders', userID ,userEmail, userPhoneNumber, userBrandName, user_premium, ticket_ID, startIndex, endIndex);
            //   // jsonData.data.slice(startIndex, endIndex).forEach(order => {
            //   //   appendRowToTable(order, tbody1);
            //   // });
            //   // If there are no more rows to display, hide the "see more" button
            //   if (endIndex >= jsonData.data.length) {
            //     seeMoreLink.style.display = 'none';
            //   }
            //   // renderTable()
            // });

            // Append the "see more" button to the document
            // tabContent.appendChild(seeMoreLink);
          }

          function hideOtherRows(selectedRow) {
            const table1 = document.getElementById("table1");
            const rows = table1.getElementsByTagName("tr");
            for (let i = 1; i < rows.length; i++) {
              if (rows[i] !== selectedRow) {
                rows[i].style.display = "none";
              }
            }
          }

          function showAllRows() {
            const table1 = document.getElementById("table1");
            const rows = table1.getElementsByTagName("tr");
            for (let i = 1; i < rows.length; i++) {
              rows[i].style.display = "";
            }
          }

          function createTable2(order) {
            if (order.items.some((item) => item.shipmentDetails.length > 0)) {
              const table2 = document.createElement("table");
              table2.border = "1";

              const headers2 = [
                "AWB No",
                "AWB Type",
                "Courier Name",
                "EDD",
                "LEDD",
                "DD",
                "SKU ID",
                "Click Post Url",
              ];

              const thead2 = document.createElement("thead");
              const headerRow2 = document.createElement("tr");

              // headers2.forEach(headerText => {
              //     const th = document.createElement('th');
              //     th.textContent = headerText;
              //     headerRow2.appendChild(th);
              // });

              //start new code
              var globalCheckboxHeader = document.createElement("th");
              var globalCheckbox = document.createElement("input");
              globalCheckbox.type = "checkbox";
              globalCheckbox.addEventListener("change", function () {
                // Call a function to handle global checkbox change
                handleGlobalCheckboxChange(globalCheckbox.checked);
              });
              function handleGlobalCheckboxChange(checked) {
                var tab2 = document.querySelector("#table2");
                var checkboxes = tab2.querySelectorAll(
                  "tbody input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;

                  // Trigger a change event for each row checkbox
                  var changeEvent = new Event("change", { bubbles: true });
                  checkbox.dispatchEvent(changeEvent);
                });
                // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                // checkboxes.forEach(function (checkbox) {
                //   checkbox.checked = checked
                // });
              }
              // globalCheckbox.addEventListener("change", function () {
              //   // Toggle the selection of all checkboxes based on the global checkbox
              //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              //   checkboxes.forEach(function (checkbox) {
              //     checkbox.checked = globalCheckbox.checked;
              //   });
              // });
              globalCheckboxHeader.appendChild(globalCheckbox);
              console.log("Added new checkbox table2");
              headerRow2.appendChild(globalCheckboxHeader);

              headers2.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow2.appendChild(th);
              });
              thead2.appendChild(headerRow2);
              table2.appendChild(thead2);

              const tbody2 = document.createElement("tbody");

              order.items.forEach((item) => {
                if (item.shipmentDetails.length > 0) {
                  item.shipmentDetails.forEach((shipment) => {
                    const row = document.createElement("tr");

                    const checkboxCell = document.createElement("td");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.addEventListener("change", () => {
                      if (checkbox.checked) {
                        // Load data for Table 3
                        createTable3(order.items);
                        // createTable3(item);
                      } else {
                        clearTable3();
                      }
                    });
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);

                    const awbNoCell = document.createElement("td");
                    awbNoCell.textContent = shipment.awbNo;
                    row.appendChild(awbNoCell);

                    const awbTypeCell = document.createElement("td");
                    // Fill in with your AWB Type data
                    row.appendChild(awbTypeCell);

                    const courierNameCell = document.createElement("td");
                    courierNameCell.textContent = shipment.courierName;
                    row.appendChild(courierNameCell);

                    const eddCell = document.createElement("td");
                    eddCell.textContent = shipment.estimatedDeliveryDate
                      ? formatDate(shipment.estimatedDeliveryDate)
                      : "NA";
                    row.appendChild(eddCell);

                    const leddCell = document.createElement("td");
                    leddCell.textContent = shipment.latestEstimatedDeliveryDate
                      ? formatDate(shipment.latestEstimatedDeliveryDate)
                      : "NA";
                    row.appendChild(leddCell);

                    const ddCell = document.createElement("td");
                    ddCell.textContent = shipment.deliveredDate
                      ? formatDate(shipment.deliveredDate)
                      : "NA";
                    row.appendChild(ddCell);

                    const skuidCell = document.createElement("td");
                    skuidCell.textContent = item.skuId;
                    row.appendChild(skuidCell);

                    const clickPostUrlCell = document.createElement("td");
                    if (shipment.clickpostUrl) {
                      const clickPostLink = document.createElement("a");
                      clickPostLink.href = shipment.clickpostUrl;
                      clickPostLink.target = "_blank";
                      clickPostLink.textContent = "Click Post";
                      clickPostUrlCell.appendChild(clickPostLink);
                    } else {
                      clickPostUrlCell.textContent = "NA";
                    }
                    row.appendChild(clickPostUrlCell);

                    tbody2.appendChild(row);
                  });
                }
              });

              table2.appendChild(tbody2);
              table2.id = "table2";
              tabContent.appendChild(table2);
            } else {
              createTable3(order.items);
              return;
            }

            createSubmitButton();
            // createResetButton();
          }
          function formatDate(dateString) {
            const options = { day: "numeric", month: "short", year: "numeric" };
            return new Date(dateString).toLocaleDateString("en-US", options);
          }

          // // Function to create Table 3
          function createTable3(items) {
            const table3 = document.createElement("table");
            table3.setAttribute("class", "table3");
            table3.border = "1";

            const headers3 = [
              // 'CB',
              "SKU Image",
              "SKU Name",
              "SKU ID",
              "Unit Price/Item",
              "Item Qty",
              "Item Status",
              "Canceled Qty",
              "Shared / Volume",
            ];

            const thead3 = document.createElement("thead");
            const headerRow3 = document.createElement("tr");

            //start new code
            var globalCheckboxHeader = document.createElement("th");
            var globalCheckbox = document.createElement("input");
            globalCheckbox.type = "checkbox";
            globalCheckbox.addEventListener("change", function () {
              // Call a function to handle global checkbox change
              handleGlobalCheckboxChange(globalCheckbox.checked);
            });
            function handleGlobalCheckboxChange(checked) {
              var tab3 = document.querySelector("#table3");
              var checkboxes = document.querySelectorAll(
                ".table3 tbody input[type='checkbox']"
              );
              checkboxes.forEach(function (checkbox) {
                checkbox.checked = checked;

                // Trigger a change event for each row checkbox
                var changeEvent = new Event("change", { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
              });
              checkboxes = document.querySelectorAll(
                ".table3 thead input[type='checkbox']"
              );
              checkboxes.forEach(function (checkbox) {
                checkbox.checked = checked;
              });
              // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              // checkboxes.forEach(function (checkbox) {
              //   checkbox.checked = checked
              // });
            }
            // globalCheckbox.addEventListener("change", function () {
            //   // Toggle the selection of all checkboxes based on the global checkbox
            //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
            //   checkboxes.forEach(function (checkbox) {
            //     checkbox.checked = globalCheckbox.checked;
            //   });
            // });
            globalCheckboxHeader.appendChild(globalCheckbox);
            console.log("Added new checkbox table2");
            headerRow3.appendChild(globalCheckboxHeader);
            headers3.forEach((headerText) => {
              const th = document.createElement("th");
              th.textContent = headerText;
              headerRow3.appendChild(th);
            });

            thead3.appendChild(headerRow3);
            table3.appendChild(thead3);

            const tbody3 = document.createElement("tbody");

            items.forEach((item) => {
              const row = document.createElement("tr");

              const checkboxCell = document.createElement("td");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.addEventListener("change", () => {
                if (!checkbox.checked) {
                  // Clear Table 3
                  clearTable3();
                }
              });
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              const skuImageCell = document.createElement("td");
              if (item.skuImage) {
                const skuImage = document.createElement("img");
                skuImage.src = item.skuImage;
                skuImage.width = 50;
                skuImageCell.appendChild(skuImage);
              }
              row.appendChild(skuImageCell);

              const skuNameCell = document.createElement("td");
              skuNameCell.textContent = item.skuName;
              skuNameCell.classList.add("SKUName");
              row.appendChild(skuNameCell);

              const skuIdCell = document.createElement("td");
              skuIdCell.textContent = item.skuId;
              row.appendChild(skuIdCell);

              const unitPriceCell = document.createElement("td");
              unitPriceCell.textContent = item.unitPrice;
              row.appendChild(unitPriceCell);

              const itemQtyCell = document.createElement("td");
              itemQtyCell.textContent = item.itemQty;
              row.appendChild(itemQtyCell);

              const itemStatusCell = document.createElement("td");
              itemStatusCell.textContent = item.itemStatus;
              row.appendChild(itemStatusCell);

              const canceledQtyCell = document.createElement("td");
              canceledQtyCell.textContent = item.cancelledQty;
              row.appendChild(canceledQtyCell);

              const sharedVolumeCell = document.createElement("td");
              sharedVolumeCell.textContent = "NF in API";
              row.appendChild(sharedVolumeCell);

              tbody3.appendChild(row);
            });

            table3.appendChild(tbody3);
            table3.id = "table3";
            tabContent.appendChild(table3);

            // Submit button after Table 3
            createSubmitButton();
            // createResetButton()
          }

          function clearTables() {
            const table2 = document.querySelector("#table2");
            if (table2) {
              table2.parentNode.removeChild(table2);
            }

            const table3 = document.querySelector("#table3");
            if (table3) {
              table3.parentNode.removeChild(table3);
            }
          }

          function clearTable3() {
            const table3 = document.querySelector("#table3");
            if (table3) {
              table3.parentNode.removeChild(table3);
            }
          }

          function getSelectedOrderNos() {
            const selectedOrderNos = [];
            const checkboxes = document.querySelectorAll(
              '#table1 tbody input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
              if (checkbox.checked) {
                const orderNoCell = checkbox
                  .closest("tr")
                  .querySelector("td:nth-child(2)");
                selectedOrderNos.push(orderNoCell.textContent);
              }
            });
            return selectedOrderNos;
          }

          function getSelectedRewerseAwb(orders) {
            const selectedRevAwbNos = [];
            // for (let i = 0; i < orders.length; i++) {
            const curentOrder = orders;
            if (curentOrder.items) {
              for (let j = 0; j < curentOrder.items.length; j++) {
                const curItem = curentOrder.items[j];
                if (curItem.returnDetails.length > 0) {
                  for (let k = 0; k < curItem.returnDetails.length; k++) {
                    if (curItem.returnDetails[k].reverseAwb) {
                      selectedRevAwbNos.push(
                        curItem.returnDetails[k].reverseAwb
                      );
                    }
                  }
                }
              }
            }
            // }
            return selectedRevAwbNos;
          }

          function getSelectedAWBNos() {
            const selectedAWBNos = [];
            const selectedCouriers = [];
            const table2CheckboxCells = document.querySelectorAll(
              "#table2 tbody td:first-child input:checked"
            );
            console.log("awbbbbb1", table2CheckboxCells);
            table2CheckboxCells.forEach((checkboxCell) => {
              const awbNoCell = checkboxCell.parentElement.nextElementSibling;
              const courier =
                checkboxCell.parentElement.nextElementSibling.nextElementSibling
                  .nextElementSibling;
              console.log("awbbbbb", awbNoCell, courier);
              selectedAWBNos.push(awbNoCell.textContent);
              selectedCouriers.push(courier.textContent);
            });
            return { selectedAWBNos, selectedCouriers };
          }

          function getSelectedSKUData() {
            const table3 = document.getElementById("table3");
            const selectedSKUs = [];

            if (table3) {
              const rows = table3.querySelectorAll("tbody tr");

              rows.forEach((row) => {
                const checkbox = row.cells[0].querySelector(
                  'input[type="checkbox"]'
                );

                if (checkbox && checkbox.checked) {
                  const skuDataRow = row.cells;

                  selectedSKUs.push({
                    sku_Name: skuDataRow[2].textContent || "NA",
                    sku_ID: skuDataRow[3].textContent || "NA",
                    unit_Price: skuDataRow[4].textContent || "NA",
                    Item_Qty: skuDataRow[5].textContent || "NA",
                    OrderStatus: skuDataRow[6].textContent || "NA",
                    item_Status: skuDataRow[6].textContent || "NA",
                  });
                }
              });
            }

            return selectedSKUs;
          }

          function createSubmitButton() {
            const existingSubmitButton =
              document.getElementById("submitButton");
            if (existingSubmitButton) {
              existingSubmitButton.parentNode.removeChild(existingSubmitButton);
            }
            const submitButton = document.createElement("button");
            submitButton.textContent = "Submit";
            submitButton.id = "submitButton";
            submitButton.addEventListener("click", () => {
              const selectedOrderNos = getSelectedOrderNos();
              console.log("Selected Order Nos:", selectedOrderNos);

              selectedOrderNos.forEach((orderNo) => {
                const order = jsonData.data.find(
                  (item) => item.orderNo === orderNo
                );
                const returnDetail = jsonData.data.returnDetails;
                // const reverseAwbs = returnDetail.length > 0? returnDetail
                console.log(`Order No: ${order.orderNo}`);
                console.log("Table 1 Data:", order);
                const { selectedAWBNos, selectedCouriers } =
                  getSelectedAWBNos();
                if (selectedAWBNos.length > 0) {
                  console.log("Selected AWB Nos:", selectedAWBNos);
                }

                const selectedrevAwbs = getSelectedRewerseAwb(order);
                console.log("selectedRevAWBs", selectedrevAwbs);

                const selectedSKUData = getSelectedSKUData();
                if (selectedSKUData.length > 0) {
                  console.log("Selected SKU Data:", selectedSKUData);
                }
                updateRequesterInfo(
                  selectedSKUData,
                  selectedOrderNos,
                  selectedAWBNos,
                  selectedrevAwbs,
                  ticket_ID,
                  selectedCouriers
                );
              });
            });

            const table3 = document.getElementById("table3");
            if (table3) {
              tabContent.appendChild(table3);
              tabContent.appendChild(submitButton);
            } else {
              const table2 = document.getElementById("table2");
              if (table2) {
                tabContent.appendChild(table2);
                tabContent.appendChild(submitButton);
              } else {
                tabContent.appendChild(submitButton);
              }
            }
          } //submit button end
        });

        function updateRequesterInfo(
          userItemData,
          ORDER_NO,
          awb_NO,
          selectedrevAwbs,
          ticket_id,
          couriers
        ) {
          console.log("userItemData", userItemData);
          console.log("userItemData.length", userItemData.length, ticket_id);
          console.log("userItemData", userItemData);
          console.log("UserItemRev", selectedrevAwbs);
          console.log("couriers", couriers);
          let alertContent = "Submited Successfully";
          if (userItemData.length == 1) {
            //done
            var itemData = [];
            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 2) {
            var itemData = [];

            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 3) {
            var itemData = [];
            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 19061910916637, value: couriers[2] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 4) {
            var itemData = [];
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 14629523253277, value: couriers[2] }, //TBD
              { id: 19060845889565, value: userItemData[3].Product_ID },
              { id: 19061023354909, value: userItemData[3].sku_ID },
              { id: 19060943790621, value: userItemData[3].sku_Name },
              { id: 19061738065053, value: userItemData[3].item_Status },
              { id: 19061491893661, value: userItemData[3].item_Qty },
              { id: 19061793343773, value: userItemData[3].unit_Price },
              { id: 19061863194013, value: awb_NO[3] },
              { id: 14629524472477, value: couriers[3] } //TBD
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 5) {
            var itemData = [];
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 19061910916637, value: couriers[2] },
              { id: 19060845889565, value: userItemData[3].Product_ID },
              { id: 19061023354909, value: userItemData[3].sku_ID },
              { id: 19060943790621, value: userItemData[3].sku_Name },
              { id: 19061738065053, value: userItemData[3].item_Status },
              { id: 19061491893661, value: userItemData[3].item_Qty },
              { id: 19061793343773, value: userItemData[3].unit_Price },
              { id: 19061863194013, value: awb_NO[3] },
              { id: 19061946734749, value: couriers[3] },
              { id: 19060906607517, value: userItemData[4].Product_ID },
              { id: 19061145634973, value: userItemData[4].sku_ID },
              { id: 19060929434397, value: userItemData[4].sku_Name },
              { id: 19061717823133, value: userItemData[4].item_Status },
              { id: 19061543756701, value: userItemData[4].item_Qty },
              { id: 19061822804125, value: userItemData[4].unit_Price },
              { id: 19061851958685, value: awb_NO[4] },
              { id: 19061955342749, value: couriers[4] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else {
            alertContent = "Failed to Submit";
          }
          alert("submitted successfully");
          var popup = document.getElementById("popupContainer");
          var popupContent = document.querySelector(".modal-content");
          if (popup) {
            var contentHTML = `<div class="alertModal" style="padding:11%;">
      <div class="top-bar">
            <span class="close">&times;</span>
            </div>${alertContent}</div>`;
            popupContent.innerHTML = contentHTML;

            popup.style.display = "block";
            popupContent.style.width = "206px";
            popupContent.style.height = "70px";
            popupContent.style.position = "absolute";
            popupContent.style.top = "35%";
            popupContent.style.left = "35%";
            popupContent.style.right = "2%";
            popupContent.style.bottom = "15%";
            popupContent.style.backgroundColor = "#fff";
            /* border: 1px solid #ccc; */
            popupContent.style.overflow = "auto";
            // popupContent.style.width= '96%';

            var closeButton = document.querySelector(".close");
            if (closeButton) {
              closeButton.addEventListener("click", closePopup);
            }
          }
          console.log("submittedddd");
        } //end of updateRequesterInfo
        //
      } else if (userEmail) {
        var settings = {
          url: "https://api.nykaa.com/hcsApis/orders",
          type: "POST",
          timeout: 0,
          data: JSON.stringify({
            pageNo: startInd,
            pageSize: endInd,
            emailId: userEmail, //phoneNo
          }),
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            source: userBrandName,
            "X-API-KEY": "{{setting.apiToken}}",
          },
          secure: true,
        };
        client.request(settings).then(function (response) {
          var jsonData =
            Object.keys(loadData).length > 0 ? { ...loadData } : response;

          createTable1();

          function createTable1() {
            const table1 = document.createElement("table");
            table1.border = "1";
            const rowsPerPage = 5;
            let currentPage = 1;
            // let startIndex = 0

            const headers1 = [
              "Checkbox",
              "Order No",
              "Order Date",
              "Order Amount",
              "Order Status",
              "Order Source",
            ];
            const thead1 = document.createElement("thead");
            const headerRow1 = document.createElement("tr");

            headers1.forEach((headerText) => {
              const th = document.createElement("th");
              th.textContent = headerText;
              headerRow1.appendChild(th);
            });

            thead1.appendChild(headerRow1);
            table1.appendChild(thead1);

            const tbody1 = document.createElement("tbody");
            function displayRows(resData, startIndex, endIndex) {
              console.log("respdataaaaa", resData, startInd, endInd);
              for (let i = 0; i < resData.data.length; i++) {
                const order = resData.data[i];
                console.log("Orderrrrr", order.orderNo);
                const row = document.createElement("tr");

                // ... (create cells for each column, similar to the existing code)
                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (checkbox.checked) {
                    createTable2(order);
                    hideOtherRows(row);
                  } else {
                    clearTables();
                    showAllRows();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const orderNoCell = document.createElement("td");
                const orderNoLink = document.createElement("a");
                orderNoLink.textContent = order.orderNo;
                orderNoLink.href = order.adminPanelLink;
                orderNoLink.target = "_blank";
                orderNoCell.appendChild(orderNoLink);
                row.appendChild(orderNoCell);

                const orderDateCell = document.createElement("td");
                orderDateCell.textContent = new Date(
                  order.orderDate
                ).toLocaleDateString();
                row.appendChild(orderDateCell);

                const orderAmountCell = document.createElement("td");
                orderAmountCell.textContent = order.orderAmount;
                row.appendChild(orderAmountCell);

                const orderStatusCell = document.createElement("td");
                orderStatusCell.textContent = order.orderStatus;
                row.appendChild(orderStatusCell);

                const orderSourceCell = document.createElement("td");
                orderSourceCell.textContent = order.source;
                row.appendChild(orderSourceCell);

                tbody1.appendChild(row);
                // Append the row to the table body
                tbody1.appendChild(row);
              }
            }

            function renderTable() {
              // Clear existing rows
              tbody1.innerHTML = "";

              // Calculate the start and end index based on the current page
              const startIndex = (currentPage - 1) * rowsPerPage;
              const endIndex = startIndex + rowsPerPage;

              // Display rows for the current page
              displayRows(jsonData, startIndex, endIndex);
            }

            function createSeeMore() {
              const seeMoreLink = document.createElement("a");
              seeMoreLink.href = "#"; // You can set the actual link destination
              seeMoreLink.textContent = "See More";
              tabContent.appendChild(seeMoreLink);
              seeMoreLink.addEventListener("click", function (event) {
                // Determine the next 5 rows to display
                event.preventDefault(); // Prevent the default link behavior

                // const curEnd = tbody1.children.length;
                const startIndex = (startInd += 1);
                const endIndex = 5;
                // currentPage++
                const currentRows = tbody1.children.length;
                const nextStartIndex = currentRows;
                const nextEndIndex = currentRows + rowsPerPage;

                var settings = {
                  url: "https://api.nykaa.com/hcsApis/orders",
                  type: "POST",
                  timeout: 0,
                  data: JSON.stringify({
                    pageNo: startIndex,
                    pageSize: endInd,
                    emailId: userEmail, //phoneNo
                  }),
                  headers: {
                    accept: "application/json",
                    "Content-type": "application/json",
                    source: userBrandName,
                    "X-API-KEY": "{{setting.apiToken}}",
                  },
                  secure: true,
                };
                client.request(settings).then(function (response) {
                  var respData = response;
                  respData.data = [...jsonData.data, ...respData.data];
                  // displayRows(respData, nextStartIndex, nextEndIndex);
                  // tabContent.appendChild(seeMoreLink);
                  loadTabContent(
                    "Orders",
                    userID,
                    userEmail,
                    userPhoneNumber,
                    userBrandName,
                    user_premium,
                    ticket_ID,
                    customer_id,
                    startIndex,
                    endIndex,
                    respData
                  );
                });
                // Append the next set of rows
                // jsonData.data.slice(startIndex, endIndex).forEach(order => {
                //   appendRowToTable(order, tbody1);
                // });
                // If there are no more rows to display, hide the "see more" button
                if (endIndex >= jsonData.data.length) {
                  seeMoreLink.style.display = "none";
                }
                // renderTable()
              });
            }

            // jsonData.data.forEach(order => {
            //     const row = document.createElement('tr');

            //     const checkboxCell = document.createElement('td');
            //     const checkbox = document.createElement('input');
            //     checkbox.type = 'checkbox';
            //     checkbox.addEventListener('change', () => {
            //         if (checkbox.checked) {
            //             createTable2(order);
            //             hideOtherRows(row);
            //         } else {
            //             clearTables();
            //             showAllRows();
            //         }
            //     });
            //     checkboxCell.appendChild(checkbox);
            //     row.appendChild(checkboxCell);

            //     const orderNoCell = document.createElement('td');
            //     const orderNoLink = document.createElement('a');
            //     orderNoLink.textContent = order.orderNo;
            //     orderNoLink.href = order.adminPanelLink;
            //     orderNoLink.target = '_blank';
            //     orderNoCell.appendChild(orderNoLink);
            //     row.appendChild(orderNoCell);

            //     const orderDateCell = document.createElement('td');
            //     orderDateCell.textContent = new Date(order.orderDate).toLocaleDateString();
            //     row.appendChild(orderDateCell);

            //     const orderAmountCell = document.createElement('td');
            //     orderAmountCell.textContent = order.orderAmount;
            //     row.appendChild(orderAmountCell);

            //     const orderStatusCell = document.createElement('td');
            //     orderStatusCell.textContent = order.orderStatus;
            //     row.appendChild(orderStatusCell);

            //     tbody1.appendChild(row);
            // });

            table1.appendChild(tbody1);
            table1.id = "table1";
            tabContent.appendChild(table1);

            // Initial render of the table
            renderTable();

            createSubmitButton();
            createSeeMore();
            // createResetButton()
            // Create a "see more" button
            // createSeeMore()
            // const seeMoreLink = document.createElement('a');
            // seeMoreLink.href = '#'; // You can set the actual link destination
            // seeMoreLink.textContent = 'See More';
            // tabContent.appendChild(seeMoreLink);
            // seeMoreLink.addEventListener('click', function (event) {
            //   // Determine the next 5 rows to display
            //   event.preventDefault(); // Prevent the default link behavior

            //   // const curEnd = tbody1.children.length;
            //   const startIndex = startInd+=1
            //   const endIndex = 5;
            //   // currentPage++
            //   const currentRows = tbody1.children.length;
            //   const nextStartIndex = currentRows;
            //   const nextEndIndex = currentRows + rowsPerPage;

            //   var settings = {
            //     "url": "https://api.nykaa.com/hcsApis/orders",
            //     "type": "POST",
            //     "timeout": 0,
            //     "data": JSON.stringify({
            //     "pageNo": startInd++,
            //     "pageSize": endInd,
            //     "emailId" : userEmail  //phoneNo
            //     }),
            //     "headers": {
            //     "accept": "application/json",
            //     "Content-type": "application/json",
            //     "source": userBrandName,
            //     "X-API-KEY": "{{setting.apiToken}}"
            //     },
            //     secure:true,

            //     };
            //     client.request(settings).then(
            //     function(response) {
            //     var respData= response;
            //     respData.data = [...jsonData.data, ...respData.data]
            //     displayRows(respData, nextStartIndex, nextEndIndex);
            //     tabContent.appendChild(seeMoreLink);
            //     })
            //   // Append the next set of rows
            //   // loadTabContent('Orders', userID ,userEmail, userPhoneNumber, userBrandName, user_premium, ticket_ID, startIndex, endIndex);
            //   // jsonData.data.slice(startIndex, endIndex).forEach(order => {
            //   //   appendRowToTable(order, tbody1);
            //   // });
            //   // If there are no more rows to display, hide the "see more" button
            //   if (endIndex >= jsonData.data.length) {
            //     seeMoreLink.style.display = 'none';
            //   }
            //   // renderTable()
            // });

            // Append the "see more" button to the document
            // tabContent.appendChild(seeMoreLink);
          }

          function hideOtherRows(selectedRow) {
            const table1 = document.getElementById("table1");
            const rows = table1.getElementsByTagName("tr");
            for (let i = 1; i < rows.length; i++) {
              if (rows[i] !== selectedRow) {
                rows[i].style.display = "none";
              }
            }
          }

          function showAllRows() {
            const table1 = document.getElementById("table1");
            const rows = table1.getElementsByTagName("tr");
            for (let i = 1; i < rows.length; i++) {
              rows[i].style.display = "";
            }
          }

          function createTable2(order) {
            if (order.items.some((item) => item.shipmentDetails.length > 0)) {
              const table2 = document.createElement("table");
              table2.border = "1";

              const headers2 = [
                "AWB No",
                "AWB Type",
                "Courier Name",
                "EDD",
                "LEDD",
                "DD",
                "SKU ID",
                "Click Post Url",
              ];

              const thead2 = document.createElement("thead");
              const headerRow2 = document.createElement("tr");

              // headers2.forEach(headerText => {
              //     const th = document.createElement('th');
              //     th.textContent = headerText;
              //     headerRow2.appendChild(th);
              // });

              //start new code
              var globalCheckboxHeader = document.createElement("th");
              var globalCheckbox = document.createElement("input");
              globalCheckbox.type = "checkbox";
              globalCheckbox.addEventListener("change", function () {
                // Call a function to handle global checkbox change
                handleGlobalCheckboxChange(globalCheckbox.checked);
              });
              function handleGlobalCheckboxChange(checked) {
                var tab2 = document.querySelector("#table2");
                var checkboxes = tab2.querySelectorAll(
                  "tbody input[type='checkbox']"
                );
                checkboxes.forEach(function (checkbox) {
                  checkbox.checked = checked;

                  // Trigger a change event for each row checkbox
                  var changeEvent = new Event("change", { bubbles: true });
                  checkbox.dispatchEvent(changeEvent);
                });
                // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
                // checkboxes.forEach(function (checkbox) {
                //   checkbox.checked = checked
                // });
              }
              // globalCheckbox.addEventListener("change", function () {
              //   // Toggle the selection of all checkboxes based on the global checkbox
              //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              //   checkboxes.forEach(function (checkbox) {
              //     checkbox.checked = globalCheckbox.checked;
              //   });
              // });
              globalCheckboxHeader.appendChild(globalCheckbox);
              console.log("Added new checkbox table2");
              headerRow2.appendChild(globalCheckboxHeader);

              headers2.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow2.appendChild(th);
              });
              thead2.appendChild(headerRow2);
              table2.appendChild(thead2);

              const tbody2 = document.createElement("tbody");

              order.items.forEach((item) => {
                if (item.shipmentDetails.length > 0) {
                  item.shipmentDetails.forEach((shipment) => {
                    const row = document.createElement("tr");

                    const checkboxCell = document.createElement("td");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.addEventListener("change", () => {
                      if (checkbox.checked) {
                        // Load data for Table 3
                        createTable3(order.items);
                        // createTable3(item);
                      } else {
                        clearTable3();
                      }
                    });
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);

                    const awbNoCell = document.createElement("td");
                    awbNoCell.textContent = shipment.awbNo;
                    row.appendChild(awbNoCell);

                    const awbTypeCell = document.createElement("td");
                    // Fill in with your AWB Type data
                    row.appendChild(awbTypeCell);

                    const courierNameCell = document.createElement("td");
                    courierNameCell.textContent = shipment.courierName;
                    row.appendChild(courierNameCell);

                    const eddCell = document.createElement("td");
                    eddCell.textContent = shipment.estimatedDeliveryDate
                      ? formatDate(shipment.estimatedDeliveryDate)
                      : "NA";
                    row.appendChild(eddCell);

                    const leddCell = document.createElement("td");
                    leddCell.textContent = shipment.latestEstimatedDeliveryDate
                      ? formatDate(shipment.latestEstimatedDeliveryDate)
                      : "NA";
                    row.appendChild(leddCell);

                    const ddCell = document.createElement("td");
                    ddCell.textContent = shipment.deliveredDate
                      ? formatDate(shipment.deliveredDate)
                      : "NA";
                    row.appendChild(ddCell);

                    const skuidCell = document.createElement("td");
                    skuidCell.textContent = item.skuId;
                    row.appendChild(skuidCell);

                    const clickPostUrlCell = document.createElement("td");
                    if (shipment.clickpostUrl) {
                      const clickPostLink = document.createElement("a");
                      clickPostLink.href = shipment.clickpostUrl;
                      clickPostLink.target = "_blank";
                      clickPostLink.textContent = "Click Post";
                      clickPostUrlCell.appendChild(clickPostLink);
                    } else {
                      clickPostUrlCell.textContent = "NA";
                    }
                    row.appendChild(clickPostUrlCell);

                    tbody2.appendChild(row);
                  });
                }
              });

              table2.appendChild(tbody2);
              table2.id = "table2";
              tabContent.appendChild(table2);
            } else {
              createTable3(order.items);
              return;
            }

            createSubmitButton();
            // createResetButton();
          }
          function formatDate(dateString) {
            const options = { day: "numeric", month: "short", year: "numeric" };
            return new Date(dateString).toLocaleDateString("en-US", options);
          }

          // // Function to create Table 3
          function createTable3(items) {
            const table3 = document.createElement("table");
            table3.setAttribute("class", "table3");
            table3.border = "1";

            const headers3 = [
              // 'CB',
              "SKU Image",
              "SKU Name",
              "SKU ID",
              "Unit Price/Item",
              "Item Qty",
              "Item Status",
              "Canceled Qty",
              "Shared / Volume",
            ];

            const thead3 = document.createElement("thead");
            const headerRow3 = document.createElement("tr");

            //start new code
            var globalCheckboxHeader = document.createElement("th");
            var globalCheckbox = document.createElement("input");
            globalCheckbox.type = "checkbox";
            globalCheckbox.addEventListener("change", function () {
              // Call a function to handle global checkbox change
              handleGlobalCheckboxChange(globalCheckbox.checked);
            });
            function handleGlobalCheckboxChange(checked) {
              var tab3 = document.querySelector("#table3");
              var checkboxes = document.querySelectorAll(
                ".table3 tbody input[type='checkbox']"
              );
              checkboxes.forEach(function (checkbox) {
                checkbox.checked = checked;

                // Trigger a change event for each row checkbox
                var changeEvent = new Event("change", { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
              });
              checkboxes = document.querySelectorAll(
                ".table3 thead input[type='checkbox']"
              );
              checkboxes.forEach(function (checkbox) {
                checkbox.checked = checked;
              });
              // checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
              // checkboxes.forEach(function (checkbox) {
              //   checkbox.checked = checked
              // });
            }
            // globalCheckbox.addEventListener("change", function () {
            //   // Toggle the selection of all checkboxes based on the global checkbox
            //   var checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
            //   checkboxes.forEach(function (checkbox) {
            //     checkbox.checked = globalCheckbox.checked;
            //   });
            // });
            globalCheckboxHeader.appendChild(globalCheckbox);
            console.log("Added new checkbox table2");
            headerRow3.appendChild(globalCheckboxHeader);
            headers3.forEach((headerText) => {
              const th = document.createElement("th");
              th.textContent = headerText;
              headerRow3.appendChild(th);
            });

            thead3.appendChild(headerRow3);
            table3.appendChild(thead3);

            const tbody3 = document.createElement("tbody");

            items.forEach((item) => {
              const row = document.createElement("tr");

              const checkboxCell = document.createElement("td");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.addEventListener("change", () => {
                if (!checkbox.checked) {
                  // Clear Table 3
                  clearTable3();
                }
              });
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              const skuImageCell = document.createElement("td");
              if (item.skuImage) {
                const skuImage = document.createElement("img");
                skuImage.src = item.skuImage;
                skuImage.width = 50;
                skuImageCell.appendChild(skuImage);
              }
              row.appendChild(skuImageCell);

              const skuNameCell = document.createElement("td");
              skuNameCell.textContent = item.skuName;
              skuNameCell.classList.add("SKUName");
              row.appendChild(skuNameCell);

              const skuIdCell = document.createElement("td");
              skuIdCell.textContent = item.skuId;
              row.appendChild(skuIdCell);

              const unitPriceCell = document.createElement("td");
              unitPriceCell.textContent = item.unitPrice;
              row.appendChild(unitPriceCell);

              const itemQtyCell = document.createElement("td");
              itemQtyCell.textContent = item.itemQty;
              row.appendChild(itemQtyCell);

              const itemStatusCell = document.createElement("td");
              itemStatusCell.textContent = item.itemStatus;
              row.appendChild(itemStatusCell);

              const canceledQtyCell = document.createElement("td");
              canceledQtyCell.textContent = item.cancelledQty;
              row.appendChild(canceledQtyCell);

              const sharedVolumeCell = document.createElement("td");
              sharedVolumeCell.textContent = "NF in API";
              row.appendChild(sharedVolumeCell);

              tbody3.appendChild(row);
            });

            table3.appendChild(tbody3);
            table3.id = "table3";
            tabContent.appendChild(table3);

            // Submit button after Table 3
            createSubmitButton();
            // createResetButton()
          }

          function clearTables() {
            const table2 = document.querySelector("#table2");
            if (table2) {
              table2.parentNode.removeChild(table2);
            }

            const table3 = document.querySelector("#table3");
            if (table3) {
              table3.parentNode.removeChild(table3);
            }
          }

          function clearTable3() {
            const table3 = document.querySelector("#table3");
            if (table3) {
              table3.parentNode.removeChild(table3);
            }
          }

          function getSelectedOrderNos() {
            const selectedOrderNos = [];
            const checkboxes = document.querySelectorAll(
              '#table1 tbody input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
              if (checkbox.checked) {
                const orderNoCell = checkbox
                  .closest("tr")
                  .querySelector("td:nth-child(2)");
                selectedOrderNos.push(orderNoCell.textContent);
              }
            });
            return selectedOrderNos;
          }

          function getSelectedRewerseAwb(orders) {
            const selectedRevAwbNos = [];
            // for (let i = 0; i < orders.length; i++) {
            const curentOrder = orders;
            if (curentOrder.items) {
              for (let j = 0; j < curentOrder.items.length; j++) {
                const curItem = curentOrder.items[j];
                if (curItem.returnDetails.length > 0) {
                  for (let k = 0; k < curItem.returnDetails.length; k++) {
                    if (curItem.returnDetails[k].reverseAwb) {
                      selectedRevAwbNos.push(
                        curItem.returnDetails[k].reverseAwb
                      );
                    }
                  }
                }
              }
            }
            // }
            return selectedRevAwbNos;
          }

          function getSelectedAWBNos() {
            const selectedAWBNos = [];
            const selectedCouriers = [];
            const table2CheckboxCells = document.querySelectorAll(
              "#table2 tbody td:first-child input:checked"
            );
            console.log("awbbbbb1", table2CheckboxCells);
            table2CheckboxCells.forEach((checkboxCell) => {
              const awbNoCell = checkboxCell.parentElement.nextElementSibling;
              const courier =
                checkboxCell.parentElement.nextElementSibling.nextElementSibling
                  .nextElementSibling;
              console.log("awbbbbb", awbNoCell, courier);
              selectedAWBNos.push(awbNoCell.textContent);
              selectedCouriers.push(courier.textContent);
            });
            return { selectedAWBNos, selectedCouriers };
          }

          function getSelectedSKUData() {
            const table3 = document.getElementById("table3");
            const selectedSKUs = [];

            if (table3) {
              const rows = table3.querySelectorAll("tbody tr");

              rows.forEach((row) => {
                const checkbox = row.cells[0].querySelector(
                  'input[type="checkbox"]'
                );

                if (checkbox && checkbox.checked) {
                  const skuDataRow = row.cells;

                  selectedSKUs.push({
                    sku_Name: skuDataRow[2].textContent || "NA",
                    sku_ID: skuDataRow[3].textContent || "NA",
                    unit_Price: skuDataRow[4].textContent || "NA",
                    Item_Qty: skuDataRow[5].textContent || "NA",
                    OrderStatus: skuDataRow[6].textContent || "NA",
                    item_Status: skuDataRow[6].textContent || "NA",
                  });
                }
              });
            }

            return selectedSKUs;
          }

          function createSubmitButton() {
            const existingSubmitButton =
              document.getElementById("submitButton");
            if (existingSubmitButton) {
              existingSubmitButton.parentNode.removeChild(existingSubmitButton);
            }
            const submitButton = document.createElement("button");
            submitButton.textContent = "Submit";
            submitButton.id = "submitButton";
            submitButton.addEventListener("click", () => {
              const selectedOrderNos = getSelectedOrderNos();
              console.log("Selected Order Nos:", selectedOrderNos);

              selectedOrderNos.forEach((orderNo) => {
                const order = jsonData.data.find(
                  (item) => item.orderNo === orderNo
                );
                const returnDetail = jsonData.data.returnDetails;
                // const reverseAwbs = returnDetail.length > 0? returnDetail
                console.log(`Order No: ${order.orderNo}`);
                console.log("Table 1 Data:", order);
                const { selectedAWBNos, selectedCouriers } =
                  getSelectedAWBNos();
                if (selectedAWBNos.length > 0) {
                  console.log("Selected AWB Nos:", selectedAWBNos);
                }

                const selectedrevAwbs = getSelectedRewerseAwb(order);
                console.log("selectedRevAWBs", selectedrevAwbs);

                const selectedSKUData = getSelectedSKUData();
                if (selectedSKUData.length > 0) {
                  console.log("Selected SKU Data:", selectedSKUData);
                }
                updateRequesterInfo(
                  selectedSKUData,
                  selectedOrderNos,
                  selectedAWBNos,
                  selectedrevAwbs,
                  ticket_ID,
                  selectedCouriers
                );
              });
            });

            const table3 = document.getElementById("table3");
            if (table3) {
              tabContent.appendChild(table3);
              tabContent.appendChild(submitButton);
            } else {
              const table2 = document.getElementById("table2");
              if (table2) {
                tabContent.appendChild(table2);
                tabContent.appendChild(submitButton);
              } else {
                tabContent.appendChild(submitButton);
              }
            }
          } //submit button end
        });

        function updateRequesterInfo(
          userItemData,
          ORDER_NO,
          awb_NO,
          selectedrevAwbs,
          ticket_id,
          couriers
        ) {
          console.log("userItemData", userItemData);
          console.log("userItemData.length", userItemData.length, ticket_id);
          console.log("userItemData", userItemData);
          console.log("UserItemRev", selectedrevAwbs);
          console.log("couriers", couriers);
          let alertContent = "Submitted Successfully";
          if (userItemData.length == 1) {
            //done
            var itemData = [];
            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 2) {
            var itemData = [];

            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 3) {
            var itemData = [];
            // itemData.push({"id":14124127851293,"value":userItemData[0].ORDER_NO},{"id":14727705641117,"value":userItemData[0].Product_ID},{"id":14628803444893,"value":userItemData[0].sku_ID}  ,{"id":14628597471645,"value":userItemData[0].sku_Name},{"id":14727688765469,"value":userItemData[0].item_Status},{"id":14727642219677,"value":userItemData[0].item_Qty},{"id":14727678679837,"value":userItemData[0].unit_Price},{"id":14629534496669,"value":userItemData[0].awb_No},{"id":14629482724509,"value":userItemData[0].courier_Name},{"id":15969595721245,"value":userItemData[1].Product_ID},{"id":15969557510941,"value":userItemData[1].sku_ID}  ,{"id":15969559506845,"value":userItemData[1].sku_Name},{"id":15969857457053,"value":userItemData[1].item_Status},{"id":15969585889309,"value":userItemData[1].item_Qty},{"id":15969615488925,"value":userItemData[1].unit_Price},{"id":14629536371101,"value":userItemData[1].awb_No},{"id":14629497695517,"value":userItemData[1].courier_Name},{"id":15969579886877,"value":userItemData[2].Product_ID},{"id":15969566937117,"value":userItemData[2].sku_ID}  ,{"id":15969599750941,"value":userItemData[2].sku_Name},{"id":15969857813277,"value":userItemData[2].item_Status},{"id":15969627935517,"value":userItemData[2].item_Qty},{"id":15969608339613,"value":userItemData[2].unit_Price},{"id":14629561115037,"value":userItemData[2].awb_No},{"id":14629523253277,"value":userItemData[2].courier_Name});
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 19061910916637, value: couriers[2] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 4) {
            var itemData = [];
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 14629523253277, value: couriers[2] }, //TBD
              { id: 19060845889565, value: userItemData[3].Product_ID },
              { id: 19061023354909, value: userItemData[3].sku_ID },
              { id: 19060943790621, value: userItemData[3].sku_Name },
              { id: 19061738065053, value: userItemData[3].item_Status },
              { id: 19061491893661, value: userItemData[3].item_Qty },
              { id: 19061793343773, value: userItemData[3].unit_Price },
              { id: 19061863194013, value: awb_NO[3] },
              { id: 14629524472477, value: couriers[3] } //TBD
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else if (userItemData.length == 5) {
            var itemData = [];
            itemData.push(
              { id: 14408721143325, value: ORDER_NO[0] },
              { id: 19060820668445, value: userItemData[0].Product_ID },
              { id: 19059992368029, value: userItemData[0].sku_ID },
              { id: 19060895174557, value: userItemData[0].sku_Name },
              { id: 19061547394845, value: userItemData[0].item_Status },
              { id: 19061397235485, value: userItemData[0].item_Qty },
              { id: 19061758394781, value: userItemData[0].unit_Price },
              { id: 17232417457565, value: awb_NO[0] },
              { id: 17232372293661, value: couriers[0] },
              { id: 19059989229853, value: selectedrevAwbs[0] },
              { id: 19060841019933, value: userItemData[1].Product_ID },
              { id: 19061007438877, value: userItemData[1].sku_ID },
              { id: 19060922613917, value: userItemData[1].sku_Name },
              { id: 19061548918813, value: userItemData[1].item_Status },
              { id: 19061412323229, value: userItemData[1].item_Qty },
              { id: 19061788703005, value: userItemData[1].unit_Price },
              { id: 19061855140509, value: awb_NO[1] },
              { id: 19061913219997, value: couriers[1] },
              { id: 19060828110365, value: userItemData[2].Product_ID },
              { id: 19061009310365, value: userItemData[2].sku_ID },
              { id: 19060957578397, value: userItemData[2].sku_Name },
              { id: 19061558049821, value: userItemData[2].item_Status },
              { id: 19061506676253, value: userItemData[2].item_Qty },
              { id: 19061790898973, value: userItemData[2].unit_Price },
              { id: 19061849327901, value: awb_NO[2] },
              { id: 19061910916637, value: couriers[2] },
              { id: 19060845889565, value: userItemData[3].Product_ID },
              { id: 19061023354909, value: userItemData[3].sku_ID },
              { id: 19060943790621, value: userItemData[3].sku_Name },
              { id: 19061738065053, value: userItemData[3].item_Status },
              { id: 19061491893661, value: userItemData[3].item_Qty },
              { id: 19061793343773, value: userItemData[3].unit_Price },
              { id: 19061863194013, value: awb_NO[3] },
              { id: 19061946734749, value: couriers[3] },
              { id: 19060906607517, value: userItemData[4].Product_ID },
              { id: 19061145634973, value: userItemData[4].sku_ID },
              { id: 19060929434397, value: userItemData[4].sku_Name },
              { id: 19061717823133, value: userItemData[4].item_Status },
              { id: 19061543756701, value: userItemData[4].item_Qty },
              { id: 19061822804125, value: userItemData[4].unit_Price },
              { id: 19061851958685, value: awb_NO[4] },
              { id: 19061955342749, value: couriers[4] }
            );

            var ticketdata = {
              tickets: [
                {
                  id: ticket_id,
                  custom_fields: itemData,
                },
              ],
            };
            var updateUser_Ticketdata = {
              url: "/api/v2/tickets/update_many.json",
              data: JSON.stringify(ticketdata),
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            };

            client.request(updateUser_Ticketdata).then(
              function (data2) {},
              function (response) {}
            );
          } else {
            alertContent = "Failed to Submit";
          }
          alert("submitted successfully");
          var popup = document.getElementById("popupContainer");
          var popupContent = document.querySelector(".modal-content");
          if (popup) {
            var contentHTML = `<div class="alertModal" style="padding:11%;">
      <div class="top-bar">
            <span class="close">&times;</span>
            </div>${alertContent}</div>`;
            popupContent.innerHTML = contentHTML;

            popup.style.display = "block";
            popupContent.style.width = "206px";
            popupContent.style.height = "70px";
            popupContent.style.position = "absolute";
            popupContent.style.top = "35%";
            popupContent.style.left = "35%";
            popupContent.style.right = "2%";
            popupContent.style.bottom = "15%";
            popupContent.style.backgroundColor = "#fff";
            /* border: 1px solid #ccc; */
            popupContent.style.overflow = "auto";
            // popupContent.style.width= '96%';

            var closeButton = document.querySelector(".close");
            if (closeButton) {
              closeButton.addEventListener("click", closePopup);
            }
          }
          console.log("submittedddd");
        }
      } else {
        client.request("/api/v2/users/" + userID + ".json").then((data) => {
          var phone_Num = data.user.phone;
          console.log("phone_Num", phone_Num);
          function extractPhoneNumber(fullNumber) {
            const regex = /^\+91(\d+)$/;
            const match = fullNumber.match(regex);
            if (match) {
              const phone_Number = match[1];
              return phone_Number;
            } else {
              return null;
            }
          }
          const phone_Number = extractPhoneNumber(phone_Num);
          var settings = {
            url: "https://api.nykaa.com/hcsApis/orders",
            type: "POST",
            timeout: 0,
            data: JSON.stringify({
              pageNo: 0,
              pageSize: 5,
              phoneNo: phone_Number,
            }),
            headers: {
              accept: "application/json",
              "Content-type": "application/json",
              source: userBrandName,
              "X-API-KEY": "{{setting.apiToken}}",
            },
            secure: true,
          };
          client.request(settings).then(function (response) {
            var jsonData = response;
            createTable1();

            function createTable1() {
              const table1 = document.createElement("table");
              table1.border = "1";

              const headers1 = [
                "Checkbox",
                "Order No",
                "Order Date",
                "Order Amount",
                "Order Status",
                "Order Source",
              ];
              const thead1 = document.createElement("thead");
              const headerRow1 = document.createElement("tr");

              headers1.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow1.appendChild(th);
              });

              thead1.appendChild(headerRow1);
              table1.appendChild(thead1);

              const tbody1 = document.createElement("tbody");

              jsonData.data.forEach((order) => {
                const row = document.createElement("tr");

                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", () => {
                  if (checkbox.checked) {
                    createTable2(order);
                    hideOtherRows(row);
                  } else {
                    clearTables();
                    showAllRows();
                  }
                });
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const orderNoCell = document.createElement("td");
                orderNoCell.textContent = order.orderNo;
                row.appendChild(orderNoCell);

                const orderDateCell = document.createElement("td");
                orderDateCell.textContent = new Date(
                  order.orderDate
                ).toLocaleDateString();
                row.appendChild(orderDateCell);

                const orderAmountCell = document.createElement("td");
                orderAmountCell.textContent = order.orderAmount;
                row.appendChild(orderAmountCell);

                const orderStatusCell = document.createElement("td");
                orderStatusCell.textContent = order.orderStatus;
                row.appendChild(orderStatusCell);

                const orderSourceCell = document.createElement("td");
                orderSourceCell.textContent = order.source;
                row.appendChild(orderSourceCell);

                tbody1.appendChild(row);
              });

              table1.appendChild(tbody1);
              table1.id = "table1";
              tabContent.appendChild(table1);

              createSubmitButton();
            }

            function hideOtherRows(selectedRow) {
              const table1 = document.getElementById("table1");
              const rows = table1.getElementsByTagName("tr");
              for (let i = 1; i < rows.length; i++) {
                if (rows[i] !== selectedRow) {
                  rows[i].style.display = "none";
                }
              }
            }

            function showAllRows() {
              const table1 = document.getElementById("table1");
              const rows = table1.getElementsByTagName("tr");
              for (let i = 1; i < rows.length; i++) {
                rows[i].style.display = "";
              }
            }

            function createTable2(order) {
              if (order.items.some((item) => item.shipmentDetails.length > 0)) {
                const table2 = document.createElement("table");
                table2.border = "1";

                const headers2 = [
                  "Checkbox",
                  "AWB No",
                  "AWB Type",
                  "Courier Name",
                  "EDD",
                  "LEDD",
                  "DD",
                  "SKU ID",
                  "Click Post Url",
                ];

                const thead2 = document.createElement("thead");
                const headerRow2 = document.createElement("tr");

                headers2.forEach((headerText) => {
                  const th = document.createElement("th");
                  th.textContent = headerText;
                  headerRow2.appendChild(th);
                });

                thead2.appendChild(headerRow2);
                table2.appendChild(thead2);

                const tbody2 = document.createElement("tbody");

                order.items.forEach((item) => {
                  if (item.shipmentDetails.length > 0) {
                    item.shipmentDetails.forEach((shipment) => {
                      const row = document.createElement("tr");

                      const checkboxCell = document.createElement("td");
                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.addEventListener("change", () => {
                        if (checkbox.checked) {
                          //createTable3(order.items);
                          createTable3(item);
                        } else {
                          clearTable3();
                        }
                      });
                      checkboxCell.appendChild(checkbox);
                      row.appendChild(checkboxCell);

                      const awbNoCell = document.createElement("td");
                      awbNoCell.textContent = shipment.awbNo;
                      row.appendChild(awbNoCell);

                      const awbTypeCell = document.createElement("td");
                      row.appendChild(awbTypeCell);

                      const courierNameCell = document.createElement("td");
                      courierNameCell.textContent = shipment.courierName;
                      row.appendChild(courierNameCell);

                      const eddCell = document.createElement("td");
                      eddCell.textContent = shipment.estimatedDeliveryDate
                        ? formatDate(shipment.estimatedDeliveryDate)
                        : "NA";
                      row.appendChild(eddCell);

                      const leddCell = document.createElement("td");
                      leddCell.textContent =
                        shipment.latestEstimatedDeliveryDate
                          ? formatDate(shipment.latestEstimatedDeliveryDate)
                          : "NA";
                      row.appendChild(leddCell);

                      const ddCell = document.createElement("td");
                      ddCell.textContent = shipment.deliveredDate
                        ? formatDate(shipment.deliveredDate)
                        : "NA";
                      row.appendChild(ddCell);

                      const skuidCell = document.createElement("td");
                      skuidCell.textContent = item.skuId;
                      row.appendChild(skuidCell);

                      const clickPostUrlCell = document.createElement("td");
                      if (shipment.clickpostUrl) {
                        const clickPostLink = document.createElement("a");
                        clickPostLink.href = shipment.clickpostUrl;
                        clickPostLink.target = "_blank";
                        clickPostLink.textContent = "Click Post";
                        clickPostUrlCell.appendChild(clickPostLink);
                      } else {
                        clickPostUrlCell.textContent = "NA";
                      }
                      row.appendChild(clickPostUrlCell);

                      tbody2.appendChild(row);
                    });
                  }
                });

                table2.appendChild(tbody2);
                table2.id = "table2";
                tabContent.appendChild(table2);
              }

              createSubmitButton();
            }
            function formatDate(dateString) {
              const options = {
                day: "numeric",
                month: "short",
                year: "numeric",
              };
              return new Date(dateString).toLocaleDateString("en-US", options);
            }

            function createTable3(selectedItem) {
              console.log("selectedItem______", selectedItem);
              const table3 = document.createElement("table");
              table3.border = "1";

              const headers3 = [
                "CB",
                "SKU Image",
                "SKU Name",
                "SKU ID",
                "Unit Price/Item",
                "Item Qty",
                "Item Status",
                "Canceled Qty",
                "Shared / Volume",
              ];
              const thead3 = document.createElement("thead");
              const headerRow3 = document.createElement("tr");

              headers3.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow3.appendChild(th);
              });

              thead3.appendChild(headerRow3);
              table3.appendChild(thead3);

              const tbody3 = document.createElement("tbody");

              const row = document.createElement("tr");

              const checkboxCell = document.createElement("td");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = true; // Assuming it's checked by default
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              const skuImageCell = document.createElement("td");
              if (selectedItem.skuImage) {
                const skuImage = document.createElement("img");
                skuImage.src = selectedItem.skuImage;
                skuImage.width = 50;
                skuImageCell.appendChild(skuImage);
              }
              row.appendChild(skuImageCell);

              const skuNameCell = document.createElement("td");
              skuNameCell.textContent = selectedItem.skuName;
              skuNameCell.classList.add("SKUName");
              row.appendChild(skuNameCell);

              const skuIdCell = document.createElement("td");
              skuIdCell.textContent = selectedItem.skuId;
              row.appendChild(skuIdCell);

              const unitPriceCell = document.createElement("td");
              unitPriceCell.textContent = selectedItem.unitPrice;
              row.appendChild(unitPriceCell);

              const itemQtyCell = document.createElement("td");
              itemQtyCell.textContent = selectedItem.itemQty;
              row.appendChild(itemQtyCell);

              const itemStatusCell = document.createElement("td");
              itemStatusCell.textContent = selectedItem.itemStatus;
              row.appendChild(itemStatusCell);

              const canceledQtyCell = document.createElement("td");
              canceledQtyCell.textContent = selectedItem.cancelledQty;
              row.appendChild(canceledQtyCell);

              const sharedVolumeCell = document.createElement("td");
              sharedVolumeCell.textContent = "NF in API";
              row.appendChild(sharedVolumeCell);

              tbody3.appendChild(row);

              table3.appendChild(tbody3);
              table3.id = "table3";
              tabContent.appendChild(table3);

              createSubmitButton();
            }

            function clearTables() {
              const table2 = document.querySelector("#table2");
              if (table2) {
                table2.parentNode.removeChild(table2);
              }

              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function clearTable3() {
              const table3 = document.querySelector("#table3");
              if (table3) {
                table3.parentNode.removeChild(table3);
              }
            }

            function getSelectedOrderNos() {
              const selectedOrderNos = [];
              const checkboxes = document.querySelectorAll(
                '#table1 tbody input[type="checkbox"]'
              );
              checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                  const orderNoCell = checkbox
                    .closest("tr")
                    .querySelector("td:nth-child(2)");
                  selectedOrderNos.push(orderNoCell.textContent);
                }
              });
              return selectedOrderNos;
            }

            function getSelectedRewerseAwb(orders) {
              const selectedRevAwbNos = [];
              // for (let i = 0; i < orders.length; i++) {
              const curentOrder = orders;
              if (curentOrder.items) {
                for (let j = 0; j < curentOrder.items.length; j++) {
                  const curItem = curentOrder.items[j];
                  if (curItem.returnDetails.length > 0) {
                    for (let k = 0; k < curItem.returnDetails.length; k++) {
                      if (curItem.returnDetails[k].reverseAwb) {
                        selectedRevAwbNos.push(
                          curItem.returnDetails[k].reverseAwb
                        );
                      }
                    }
                  }
                }
              }
              // }
              return selectedRevAwbNos;
            }

            function getSelectedAWBNos() {
              const selectedAWBNos = [];
              const table2CheckboxCells = document.querySelectorAll(
                "#table2 tbody td:first-child input:checked"
              );
              table2CheckboxCells.forEach((checkboxCell) => {
                const awbNoCell = checkboxCell.parentElement.nextElementSibling;
                selectedAWBNos.push(awbNoCell.textContent);
              });
              return selectedAWBNos;
            }

            function getSelectedRevAWBNos() {
              const selectedAWBNos = [];
              const table2CheckboxCells = document.querySelectorAll(
                "#table2 tbody td:first-child input:checked"
              );
              console.log("awbbbbb1", table2CheckboxCells);
              table2CheckboxCells.forEach((checkboxCell) => {
                const awbNoCell = checkboxCell.parentElement.nextElementSibling;
                const courier =
                  checkboxCell.parentElement.nextElementSibling
                    .nextElementSibling.nextElementSibling.textContent;
                console.log("awbbbbb", awbNoCell, courier);
                selectedAWBNos.push(awbNoCell.textContent);
              });
              return selectedAWBNos;
            }

            function getSelectedSKUData() {
              const table3 = document.getElementById("table3");
              const selectedSKUs = [];

              if (table3) {
                const rows = table3.querySelectorAll("tbody tr");

                rows.forEach((row) => {
                  const checkbox = row.cells[0].querySelector(
                    'input[type="checkbox"]'
                  );

                  if (checkbox && checkbox.checked) {
                    const skuDataRow = row.cells;

                    selectedSKUs.push({
                      SKUImage: skuDataRow[1].querySelector("img")?.src || "NA",
                      SKUDetails: {
                        SKUName: skuDataRow[2].textContent || "NA",
                        SKUId: skuDataRow[3].textContent || "NA",
                      },
                      OrderStatus: skuDataRow[6].textContent || "NA",
                    });
                  }
                });
              }

              return selectedSKUs;
            }

            function createSubmitButton() {
              const existingSubmitButton =
                document.getElementById("submitButton");
              if (existingSubmitButton) {
                existingSubmitButton.parentNode.removeChild(
                  existingSubmitButton
                );
              }

              const submitButton = document.createElement("button");
              submitButton.textContent = "Submit";
              submitButton.id = "submitButton";
              submitButton.addEventListener("click", () => {
                const selectedOrderNos = getSelectedOrderNos();
                console.log("Selected Order Nos:", selectedOrderNos);

                selectedOrderNos.forEach((orderNo) => {
                  const order = jsonData.data.find(
                    (item) => item.orderNo === orderNo
                  );
                  console.log(`Order No: ${order.orderNo}`);
                  console.log("Table 1 Data:", order); // Log Table 1 data
                  const { selectedAWBNos, selectedCouriers } =
                    getSelectedAWBNos();
                  if (selectedAWBNos.length > 0) {
                    console.log("Selected AWB Nos:", selectedAWBNos);
                  }

                  const selectedrevAwbs = getSelectedRewerseAwb(order);
                  console.log("selectedRevAWBs", selectedrevAwbs);

                  const selectedSKUData = getSelectedSKUData();
                  if (selectedSKUData.length > 0) {
                    console.log("Selected SKU Data:", selectedSKUData);
                  }
                });
              });

              const table3 = document.getElementById("table3");
              if (table3) {
                tabContent.appendChild(table3);
                tabContent.appendChild(submitButton);
              } else {
                const table2 = document.getElementById("table2");
                if (table2) {
                  tabContent.appendChild(table2);
                  tabContent.appendChild(submitButton);
                } else {
                  tabContent.appendChild(submitButton);
                }
              }
            }
          });
        });
      }
    } //else block for onsubmit button
  } else if (tabName === "Payments") {
    // isSubmitButtonClickedOrders = false;
    isreturnIDClicked = false;
    var inputContainer = document.createElement("div");
    // inputContainer.innerHTML = `
    //   <label for="userIdInputOrders">Enter Order ID:</label>
    //   <input type="text" id="userIdInputOrders" placeholder="Order ID" value="${enteredUserIDOrders || ''}">
    //   <button onclick="searchPaymentsData()">Submit</button>
    // `;
    // tabContent.appendChild(inputContainer);

    itemsListpayments = [];
    console.log("UserID paymentsss", enteredUserIDOrders);
    console.log(
      "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
      tabName,
      userID,
      userEmail,
      userPhoneNumber,
      userBrandName,
      user_premium,
      ticket_ID
    );

    if (userEmail) {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        emailId: userEmail,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          console.log("Response_________288", response);
          for (i = 0; i < x.data.length; i++) {
            var orderNumber = x.data[i].orderNo;
            var items = x.data[i].items.length;
            for (j = 0; j < x.data[i].items.length; j++) {
              var item = {
                "Discount/Unit orderNo": x.data[i].orderNo,
                "SKU Image": x.data[i].items[j].skuImage,
                Sku_Name: x.data[i].items[j].skuName,
                totalRefundAmount: x.data[i].totalRefundAmount,
                Source: x.data[i].source,
                WalletAmount: x.data[i].walletAmount,
                GiftCardAmount: x.data[i].giftCardAmount,
                PaymentStatus: x.data[i].paymentStatus,
                orderAmount: x.data[i].orderAmount,
                ItemStatus: x.data[i].items[j].itemStatus,
              };
              console.log("item", item);
              itemsListpayments.push(item);
            }
          }

          creatingTable(itemsListpayments, ticket_ID, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } else {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        phoneNo: userPhoneNumber,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          for (i = 0; i < x.data.length; i++) {
            var orderNumber = x.data[i].orderNo;
            var items = x.data[i].items.length;
            for (j = 0; j < x.data[i].items.length; j++) {
              var item = {
                "Discount/Unit  : orderNo": x.data[i].orderNo,
                "SKU Image": x.data[i].items[j].skuImage,
                Sku_Name: x.data[i].items[j].skuName,
                totalRefundAmount: x.data[i].totalRefundAmount,
                Source: x.data[i].source,
                WalletAmount: x.data[i].walletAmount,
                GiftCardAmount: x.data[i].giftCardAmount,
                PaymentStatus: x.data[i].paymentStatus,
                orderAmount: x.data[i].orderAmount,
                ItemStatus: x.data[i].items[j].itemStatus,
              };
              itemsListpayments.push(item);
            }
          }

          creatingTable(itemsListpayments, ticket_ID_, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } // end of

    function creatingTable(itemsToTable, ticket_id, client) {
      var itemsSorting = itemsToTable.sort(
        (a, b) => Number(a.ID) - Number(b.ID)
      );
      var col = [];
      if (itemsSorting.length === 0) {
        var container = document.querySelector("#tabContent");
        container.insertAdjacentHTML("beforeend", "No data avaliable");
      } else {
        for (var i = 0; i < itemsSorting.length; i++) {
          for (var key in itemsSorting[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }
      }

      var table = document.createElement("table");
      table.classList.add("table");

      var tr = table.insertRow(-1);

      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
      }

      for (var i = 0; i < itemsSorting.length; i++) {
        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          if (col[j] === "SKU Image") {
            var img = document.createElement("img");
            img.src = itemsSorting[i][col[j]];
            img.style.maxWidth = "50px";
            tabCell.appendChild(img);
          } else if (col[j] === "Sku_Name") {
            tabCell.innerHTML = itemsSorting[i][col[j]];
            tabCell.classList.add("SKUName");
          } else {
            tabCell.innerHTML = itemsSorting[i][col[j]];
          }
        }
      }

      tabContent.appendChild(table);

      const getCellValue = (tr, idx) =>
        tr.children[idx].innerText || tr.children[idx].textContent;

      const comparer = (idx, asc) => (a, b) =>
        ((v1, v2) =>
          v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
            ? v1 - v2
            : v1.toString().localeCompare(v2))(
          getCellValue(asc ? a : b, idx),
          getCellValue(asc ? b : a, idx)
        );

      document.querySelectorAll("th").forEach((th) =>
        th.addEventListener("click", () => {
          const table = th.closest("table");
          Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
            .sort(
              comparer(
                Array.from(th.parentNode.children).indexOf(th),
                (this.asc = !this.asc)
              )
            )
            .forEach((tr) => table.appendChild(tr));
        })
      );
    }
  } else if (tabName === "Returns") {
    // isSubmitButtonClickedOrders = false;
    itemsListreturns = [];

    console.log(
      "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
      tabName,
      userID,
      userEmail,
      userPhoneNumber,
      userBrandName,
      user_premium,
      ticket_ID
    );

    if (userEmail) {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        emailId: userEmail,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          console.log("resturs response", x);
          console.log("Response_________288", response);
          for (i = 0; i < x.data.length; i++) {
            var orderNumber = x.data[i].orderNo;
            var items = x.data[i].items.length;
            for (j = 0; j < x.data[i].items.length; j++) {
              if (
                x.data[i].items[j].returnDetails &&
                x.data[i].items[j].returnDetails.length > 0
              ) {
                for (k = 0; k < x.data[i].items[j].returnDetails.length; k++) {
                  var item = {
                    "Return id": x.data[i].items[j].returnDetails[k].returnId,
                    "Return created date & time":
                      x.data[i].items[j].returnDetails[k].returnCreateTimestamp,
                    "order id": x.data[i].orderNo,
                    "Return Status":
                      x.data[i].items[j].returnDetails[k].returnStatus,
                    "Total refund amount": x.data[i].items[j].totalRefundAmount,
                  };
                  itemsListreturns.push(item);
                }
              }
            }
          }
          console.log("Return itemss", itemsListreturns);
          creatingTable(itemsListreturns, ticket_ID, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } else {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        phoneNo: userPhoneNumber,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          console.log("resturs response1", x);
          for (i = 0; i < x.data.length; i++) {
            var orderNumber = x.data[i].orderNo;
            var items = x.data[i].items.length;
            for (j = 0; j < x.data[i].items.length; j++) {
              if (
                x.data[i].items[j].returnDetails &&
                x.data[i].items[j].returnDetails.length > 0
              ) {
                for (k = 0; k < x.data[i].items[j].returnDetails.length; k++) {
                  var item = {
                    "Return id": x.data[i].items[j].returnDetails[k].returnId,
                    "Return created date & time":
                      x.data[i].items[j].returnDetails[k].returnCreateTimestamp,
                    "order id": x.data[i].orderNo,
                    "Return Status":
                      x.data[i].items[j].returnDetails[k].returnStatus,
                    "Total refund amount": x.data[i].items[j].totalRefundAmount,
                  };
                  itemsListreturns.push(item);
                }
              }
            }
          }
          console.log("Return itemss1", itemsListreturns);
          creatingTable(itemsListreturns, ticket_ID_, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } // end of

    function creatingTable(itemsToTable, ticket_id, client) {
      var itemsSorting = itemsToTable.sort(
        (a, b) => Number(a.ID) - Number(b.ID)
      );
      var col = [];
      if (itemsSorting.length === 0) {
        var container = document.querySelector("#tabContent");
        container.insertAdjacentHTML("beforeend", "No data avaliable");
      } else {
        for (var i = 0; i < itemsSorting.length; i++) {
          for (var key in itemsSorting[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }
      }

      var table = document.createElement("table");
      table.classList.add("table");

      var tr = table.insertRow(-1);

      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
      }

      for (var i = 0; i < itemsSorting.length; i++) {
        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          // tabCell.innerHTML = itemsSorting[i][col[j]];

          console.log("itemsSorting[i][col[j]]", itemsSorting[i][col[j]]);
          if (col[j] === "Return id") {
            console.log(
              "itemsSorting[i][col[j]]________________ertyu",
              itemsSorting[i][col[j]]
            );
            var x = itemsSorting[i][col[j]];
            console.log("hhhhhh", itemsSorting[i]["order id"]);
            var curOrderId = itemsSorting[i]["order id"];
            var link = document.createElement("a");
            link.href = x;
            link.textContent = x;
            link.target = "_blank";
            link.addEventListener("click", function (event) {
              event.preventDefault();
              console.log("orderrrrrr---", curOrderId);
              gettingReturnIDCompleteInfo(x, curOrderId);
            });
            tabCell.appendChild(link);
          } else {
            tabCell.innerHTML = itemsSorting[i][col[j]];
          }
        }
      }

      tabContent.appendChild(table);

      const getCellValue = (tr, idx) =>
        tr.children[idx].innerText || tr.children[idx].textContent;

      const comparer = (idx, asc) => (a, b) =>
        ((v1, v2) =>
          v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
            ? v1 - v2
            : v1.toString().localeCompare(v2))(
          getCellValue(asc ? a : b, idx),
          getCellValue(asc ? b : a, idx)
        );

      document.querySelectorAll("th").forEach((th) =>
        th.addEventListener("click", () => {
          const table = th.closest("table");
          Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
            .sort(
              comparer(
                Array.from(th.parentNode.children).indexOf(th),
                (this.asc = !this.asc)
              )
            )
            .forEach((tr) => table.appendChild(tr));
        })
      );
    }
    //}
  } else if (tabName === "Refund") {
    // isSubmitButtonClickedOrders = false;
    isreturnIDClicked = false;

    itemsListrefunds = [];

    console.log(
      "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
      tabName,
      userID,
      userEmail,
      userPhoneNumber,
      userBrandName,
      user_premium,
      ticket_ID
    );
    if (userEmail) {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        emailId: userEmail,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          console.log("Response_________288", response);
          for (i = 0; i < x.data.length; i++) {
            // var orderNumber = x.data[i].orderNo;
            // var items = x.data[i].items.length;
            // for (j = 0; j < x.data[i].items.length; j++) {
            // var skuImageUrl = x.data[i].items[j].skuImage;
            let refundsList = x.data[i].refunds;
            for (let k = 0; k < refundsList.length; k++) {
              if (refundsList[k].refundId) {
                var item = {
                  "Refund id": refundsList[k].refundId,
                  "Refund amount": refundsList[k].refundAmount,
                  "Refund initiated at": refundsList[k].refundInitiatedAt,
                  "Refund initiated to (cc / Wallet)":
                    refundsList[k].refundInitiatedTo,
                  "Refund status": refundsList[k].refundStatus,
                };
                console.log("item", item);
                itemsListrefunds.push(item);
              }
            }
            // }
          }

          creatingTable(itemsListrefunds, ticket_ID, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } else {
      var reqData = {
        pageNo: 0,
        pageSize: 5,
        phoneNo: userPhoneNumber,
      };
      if (isSubmitButtonClickedOrders) {
        reqData["orderId"] = enteredUserIDOrders;
      }
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify(reqData),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      client.request(settings).then(
        function (response) {
          var data_ = response;
          var x = response;
          for (i = 0; i < x.data.length; i++) {
            var orderNumber = x.data[i].orderNo;
            var items = x.data[i].items.length;
            for (j = 0; j < x.data[i].items.length; j++) {
              if (x.data[i].refunds.refundId) {
                var item = {
                  "Refund id": x.data[i].refunds.refundId,
                  "Refund amount": x.data[i].refunds.refundAmount,
                  "Refund initiated at": refundsList[k].refundInitiatedAt,
                  "Refund initiated to (cc / Wallet)":
                    x.data[i].refunds.refundInitiatedTo,
                  "Refund status": x.data[i].refunds.refundStatus,
                };
                itemsListrefunds.push(item);
              }
            }
          }

          creatingTable(itemsListrefunds, ticket_ID_, client);
        },
        function (response) {
          console.log(response);
        }
      );
    } // end of

    function creatingTable(itemsToTable, ticket_id, client) {
      var itemsSorting = itemsToTable.sort(
        (a, b) => Number(a.ID) - Number(b.ID)
      );
      var col = [];
      if (itemsSorting.length === 0) {
        var container = document.querySelector("#tabContent");
        container.insertAdjacentHTML("beforeend", "No data avaliable");
      } else {
        for (var i = 0; i < itemsSorting.length; i++) {
          for (var key in itemsSorting[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }
      }

      var table = document.createElement("table");
      table.classList.add("table");

      var tr = table.insertRow(-1);

      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
      }

      for (var i = 0; i < itemsSorting.length; i++) {
        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = itemsSorting[i][col[j]];
        }
      }

      tabContent.appendChild(table);

      const getCellValue = (tr, idx) =>
        tr.children[idx].innerText || tr.children[idx].textContent;

      const comparer = (idx, asc) => (a, b) =>
        ((v1, v2) =>
          v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
            ? v1 - v2
            : v1.toString().localeCompare(v2))(
          getCellValue(asc ? a : b, idx),
          getCellValue(asc ? b : a, idx)
        );

      document.querySelectorAll("th").forEach((th) =>
        th.addEventListener("click", () => {
          const table = th.closest("table");
          Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
            .sort(
              comparer(
                Array.from(th.parentNode.children).indexOf(th),
                (this.asc = !this.asc)
              )
            )
            .forEach((tr) => table.appendChild(tr));
        })
      );
    }
  } else if (tabName === "AdminPanel") {
    if (tabName === "NykaaAdminPanel") {
      isreturnIDClicked = false;

      var settings = {
        url: "/api/v2/users/" + userID + ".json",
        method: "GET",
      };

      client.request(settings).then(
        function (response) {
          // Append the response to the tab content
          tabContent.innerHTML = JSON.stringify(response);
          console.log("Response:", response);
          var contentHTML = `
              <p>User ID: ${response.user.id}</p>
              <p>Email: ${response.user.email}</p>
              <p>Phone Number: ${response.user.name}</p>
              <p>Brand Name: ${response.user.role}</p>
          `;
          tabContent.innerHTML = contentHTML;
        },
        function (response) {
          console.log("Error:", response);
        }
      );
    }
  }
}
function searchOrdersData(e) {
  var userIdInputOrders = document.getElementById("userIdInputOrders");
  enteredUserIDOrders = userIdInputOrders.value;
  isSubmitButtonClickedOrders = true;
  loadTabContent(
    "Orders",
    enteredUserIDOrders,
    userEmail,
    userPhoneNumber,
    userBrandName,
    user_premium,
    ticket_ID
  );
}
function searchPaymentsData() {
  var userIdInputOrders = document.getElementById("userIdInputOrders");
  enteredUserIDOrders = userIdInputOrders.value;
  isSubmitButtonClickedOrders = true;
  loadTabContent(
    "Payments",
    enteredUserIDOrders,
    userEmail,
    userPhoneNumber,
    userBrandName,
    user_premium,
    ticket_ID
  );
}
function gettingReturnIDCompleteInfo(returnId, orderId) {
  console.log("Clicked with value:2777", returnId);
  returnID = returnId;
  isreturnIDClicked = true;
  // loadTabContent('Returns', returnID,userEmail, userPhoneNumber, userBrandName, user_premium, ticket_ID);
  if (isreturnIDClicked) {
    console.log(
      "returnID,userEmail,userBrandName,userPhoneNumber__________2276",
      returnID,
      userEmail,
      userBrandName,
      userPhoneNumber,
      orderId
    );
    if (userEmail) {
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify({
          emailId: userEmail,
          // returnId: returnID,
          orderId: orderId,
        }),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      console.log("settings", settings);
      client.request(settings).then(function (response) {
        console.log("response", response);

        if (response.data && Array.isArray(response.data)) {
          for (let i = 0; i < response.data.length; i++) {
            const order = response.data[i];
            if (order.items && Array.isArray(order.items)) {
              for (let j = 0; j < order.items.length; j++) {
                const item = order.items[j];
                for (let k = 0; k < item.returnDetails.length; k++) {
                  if (
                    item &&
                    item.returnDetails.length > 0 &&
                    item.returnDetails[k].returnId == returnID
                  ) {
                    var popup = document.getElementById("popupContainer");
                    var popupContent = document.querySelector(".modal-content");
                    if (popup) {
                      console.log(
                        `Return ID for order ${order.orderNo}: ${item.returnId}`,
                        item
                      );
                      // <div class="top-bar">
                      // <span class="close">&times;</span>
                      // </div>
                      var contentHTML = `<div class="returnsTabDiv">
            <div class="top-bar">
            <span class="close">&times;</span>
            </div>
            <div class="flex-container">
              <div class="flex-box customer-info block1">
                <div class="info-item"><span class="label"> Return id:</span> <span class="value"> ${returnID}</span> </div>  
                <div class="info-item"><span class="label"> Order id:</span> <span class="value"> ${order.orderNo}</span> </div>  
              </div>
              <div class="flex-box customer-info block2">
                <div class="info-item"><span class="label"> Return Created date & Time:</span> <span class="value"> ${item.returnDetails[k].returnCreateTimestamp}</span> </div>  
                <div class="info-item"><span class="label"> Order date:</span> <span class="value"> ${order.orderDate}</span> </div>  
                <div class="info-item"><span class="label"> Retained Amount(% on all orders and is at user level):</span> <span class="value">NF in API</span> </div>  
                <div class="info-item"><span class="label"> </span> <span class="value" style="float: right;"><a href="${order.adminPanelLink}" target="_blank" style="color: #bb0000; font-weight: bold;">View on Nykaa Admin Panel</a></span> </div>
              </div>
            </div>
            
            <div class="spaceBwFlexboxs"></div>
            
              <div class="flex-container">
                <div class="imageFlexBox">
                    <img src="${item.skuImage}"/>
                </div>
                <div class="flex-box customer-info block3">
                  <p>${item.skuName}</p>
                  <div class="info-item"><span class="label"> SKU Number:</span> <span class="value"> ${item.skuId}</span> </div>
                  <div class="info-item"><span class="label"> Customer Return Reason:</span> <span class="value"> ${item.returnDetails[k].returnReason}</span> </div>
                  <div class="info-item"><span class="label"> Return Created from:</span> <span class="value"> ${item.returnDetails[k].returnCreatedBy}</span> </div>
                  <div class="info-item"><span class="label"> Approved/Rejected by:</span> <span class="value"> "Not Found value in API"</span> </div>
                  <div class="info-item"><span class="label"> Approval/Rejection date:</span> <span class="value"> ${item.returnDetails[k].rejectedOn}</span> </div>
                </div>
                <div class="flex-box customer-info block4">
                  <div class="info-item"><span class="label"> Return Status:</span> <span class="value"> ${item.returnDetails[k].returnStatus}</span> </div>
                  <div class="info-item"><span class="label"> Refund Type:</span> <span class="value"> ${item.returnDetails[k].refundType}</span> </div>
                  <div class="info-item"><span class="label"> Refund Amount:</span> <span class="value"> ${item.refundAmount}</span> </div>
                  <div class="info-item"><span class="label"> Reverse AWB:</span> <span class="value"> ${item.shipmentDetails[0].awbNo}</span> </div>
                  <button><a href="${item.shipmentDetails[0].clickpostUrl}" target="_blank"> View Tracking on Clickpost</button>
                </div>
              </div>
            </div>
            `;
                      // tabContent.innerHTML = contentHTML;
                      popupContent.innerHTML = contentHTML;

                      popup.style.display = "block";

                      var closeButton = document.querySelector(".close");
                      if (closeButton) {
                        closeButton.addEventListener("click", closePopup);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
    //}
    else {
      var settings = {
        url: "https://api.nykaa.com/hcsApis/orders",
        type: "POST",
        timeout: 0,
        data: JSON.stringify({
          // "emailId" : userEmail,
          phoneNo: userPhoneNumber,
          returnId: returnID,
        }),
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          source: userBrandName,
          "X-API-KEY": "{{setting.apiToken}}",
        },
        secure: true,
      };
      console.log("settings", settings);
      client.request(settings).then(function (response) {
        console.log("response", response);
      });
    }
  }
}
function closePopup() {
  var popup = document.getElementById("popupContainer");
  if (popup) {
    popup.style.display = "none";
  }
}
var client = ZAFClient.init();

$(document).ready(function () {
  client.invoke("resize", { width: "100%", height: "500px" });

  client
    .get([
      "ticket.id",
      "ticket.requester.email",
      "ticket.requester.id",
      "ticket.customField:custom_field_14629534496669",
      "ticket.customField:custom_field_14629482724509",
      "ticket.customField:custom_field_14628803444893",
      "ticket.customField:custom_field_14727678679837",
      "ticket.customField:custom_field_14628597471645",
      "ticket.customField:custom_field_14727642219677",
      "ticket.customField:custom_field_14385575473309",
      "ticket.customField:custom_field_14124127851293",
      "ticket.customField:custom_field_15062698212765",
      "ticket.customField:custom_field_14727867285789",
      "ticket.customField:custom_field_15062730032541",
      "ticket.customField:custom_field_14124069685917",
      "ticket.customField:custom_field_17232338148125",
      "ticket.customField:custom_field_14408510200349",
      "ticket.customField:custom_field_14408447390237",
      "ticket.customField:custom_field_19454398862621",
      "ticket.customField:custom_field_19677363739677",
      "ticket.customField:custom_field_19454398862621",
      "ticket.customField:custom_field_19659010510877",
      "ticket",
    ])
    .then(
      function (data) {
        console.log("Datttttaaaa", data);
        ticket_ID = data["ticket.id"];
        // const mail = data["ticket.customField:custom_field_14124069685917"];
        // const mail = data["ticket.customField:custom_field_14408510200349"];
        const mail = data["ticket.customField:custom_field_19659010510877"];
        console.log("maiilllll", mail);
        if (mail) {
          userEmail = mail;
        } else {
          userEmail = data["ticket.requester.email"];
        }
        const ph = data["ticket.requester.phone"];
        if (ph) {
          userPhoneNumber = ph;
        } else {
          userPhoneNumber =
            data["ticket.customField:custom_field_14408447390237"];
        }
        console.log("phone number--", userPhoneNumber);
        userID = data["ticket.requester.id"];
        // user_premium = data["ticket.customField:custom_field_14385575473309"];19454398862621
        // user_premium = data["ticket.customField:custom_field_19677363739677"];
        user_premium = data["ticket.customField:custom_field_19454398862621"];
        var user_premium1 =
          // data["ticket.customField:custom_field_14385575473309"];
          // data["ticket.customField:custom_field_19677363739677"];
          data["ticket.customField:custom_field_19454398862621"];
        var user_Item_OrderID =
          data["ticket.customField:custom_field_14124127851293"];
        var user_Item_ID =
          data["ticket.customField:custom_field_14628803444893"];
        var user_Item_Name =
          data["ticket.customField:custom_field_14628597471645"];
        var user_Item_Quantity =
          data["ticket.customField:custom_field_14727642219677"];
        var user_Item_Price =
          data["ticket.customField:custom_field_14727678679837"];
        var user_Item_AWBNO =
          data["ticket.customField:custom_field_14629534496669"];
        var user_Item_courierName =
          data["ticket.customField:custom_field_14629482724509"];
        // var customerId = data["ticket.customField:custom_field_14727867285789"];
        var customerId = data["ticket.customField:custom_field_17232338148125"];
        console.log("customerrrr_iddd", customerId);
        customer_id = customerId;
        var user_Data = data["ticket"];
        console.log("user_Data_1735", user_Data);
        userBrandName = user_Data.brand.name;
        console.log("403", userID);
        console.log("403_user_premium1", user_premium1);
        console.log("403_user_premium", user_premium);
        tagsList = data.ticket.tags;
        var settings = {
          url: "/api/v2/users/" + userID + ".json",
          method: "GET",
        };
        client.request(settings).then(function (data) {
          var phone_Number = data.user.phone;
          if (!phone_Number && userEmail) {
            var settings = {
              url: "https://api.nykaa.com/hcsApis/customer",
              type: "POST",
              data: '{\n"emailId": "' + userEmail + '"\n}',
              headers: {
                accept: "application/json",
                "Content-type": "application/json",
                source: userBrandName,
                "X-API-KEY": "{{setting.apiToken}}",
              },
              secure: true,
            };

            client.request(settings).then(function (data1) {
              console.log(
                "response.data.phoneNumber_70",
                data1.data.phoneNumber
              );
              if (data1.data.phoneNumber) {
                console.log("data1.data.phoneNumber", data1.data.phoneNumber);
                var userdata = {
                  user: {
                    phone: data1.data.phoneNumber,
                  },
                };
                var updateUser_PhoneNO = {
                  url: "/api/v2/users/" + userID + ".json",
                  data: JSON.stringify(userdata),
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                };

                console.log("updateUser_PhoneNO_1781", updateUser_PhoneNO);
                client.request(updateUser_PhoneNO).then(function (data2) {
                  console.log("12345678Test", data2);
                });
              }
            });
          }
        });
        console.log(
          "tabName    userID   userEmail  userPhoneNumber userBrandName  user_premium  ticket_ID,ticket_ID",
          userID,
          userEmail,
          userPhoneNumber,
          userBrandName,
          user_premium,
          ticket_ID,
          customerId
        );

        loadTabContent(
          "Customers",
          userID,
          userEmail,
          userPhoneNumber,
          userBrandName,
          user_premium,
          ticket_ID,
          customerId
        );
        // loadTabContent('Orders', userID, userEmail, userPhoneNumber, userBrandName,user_premium,ticket_ID);
        // loadTabContent('Payments', userID, userEmail, userPhoneNumber, userBrandName,user_premium,ticket_ID);
        // loadTabContent('Returns', userID, userEmail, userPhoneNumber, userBrandName,user_premium,ticket_ID);
        // loadTabContent('Refund', userID, userEmail, userPhoneNumber, userBrandName,user_premium,ticket_ID);
        // loadTabContent('AdminPanel', userID, userEmail, userPhoneNumber, userBrandName,user_premium,ticket_ID);
      },
      function (response) {
        console.log("Error:", response);
      }
    );
});
