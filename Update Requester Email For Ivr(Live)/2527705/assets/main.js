(function () {
  var client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "120px" });

  client
    .get([
      "ticket.id",
      "ticket.requester.email",
      "ticket.requester.phone",
      "ticket.requester.id",
      "ticket",
    ])
    .then(function (data) {
      var ticket_ID = data["ticket.id"];
      var user_Email = data["ticket.requester.email"];
      var user_ID = data["ticket.requester.id"];
      var user_Data = data["ticket"];
      var user_Brand_Name = user_Data.brand.name;
      console.log("user_Data", user_Data);
      console.log(
        "ticket_ID, user_Email, user_Brand_Name",
        ticket_ID,
        user_Email,
        user_ID,
        user_Brand_Name
      );

      // if (!user_Email) {
      var settings = {
        url: "/api/v2/users/" + user_ID + ".json",
        type: "GET",
        dataType: "json",
      };

      client.request(settings).then(
        function (data) {
          console.log("User_data", data);
          console.log("User_data phone", data.user.phone);
          if (data.user.phone) {
            getRequesterEmail(
              client,
              user_ID,
              data.user.phone,
              user_Brand_Name
            );
          } else {
            showError(data);
          }
        },
        function (response) {
          showError(response);
        }
      );
      // }
    });
})();

function getRequesterEmail(client, user_ID, phonenumber, user_Brand_Name) {
  function extractPhoneNumber(fullNumber) {
    const regex = /^\+91(\d+)$/;
    const match = fullNumber.match(regex);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  var phone_Number;
  if (phonenumber.length === 10) {
    phone_Number = phonenumber;
  } else {
    phone_Number = extractPhoneNumber(phonenumber);
  }
  console.log("Processed phone number", phone_Number);

  var settings = {
    url: "https://api.nykaa.com/hcsApis/customer",
    type: "POST",
    data: JSON.stringify({ phoneNo: phone_Number }), // Ensuring correct data format
    headers: {
      accept: "application/json",
      "Content-type": "application/json",
      source: user_Brand_Name,
      "X-API-KEY": "{{setting.apiToken}}",
    },
    secure: true,
  };

  client.request(settings).then(
    function (response) {
      console.log("Nykaa API Response", response);
      if (response.data && response.data.email) {
        updateRequesterEmail(client, user_ID, response.data.email);
      } else {
        showError(response);
      }
    },
    function (response) {
      showError(response);
    }
  );
}

function updateRequesterEmail(client, user_ID, email) {
  var updateRequester_Emaildata = {
    url: "/api/v2/users/" + user_ID + ".json",
    type: "PUT",
    data: JSON.stringify({
      user: {
        email: email,
        name: email,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  client.request(updateRequester_Emaildata).then(
    function (data1) {
      console.log("Updated user email", data1);
    },
    function (response) {
      showError(response);
    }
  );
}

function showError(response) {
  var error_data = {
    status: response.status,
    statusText: response.statusText,
  };

  var source = document.getElementById("error-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(error_data);
  document.getElementById("content").innerHTML = html;
}
