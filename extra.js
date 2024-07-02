const contentIdLoggedInArray = ["topNavHeader", "sideNav", "topNavMobile", "mainContent", "footer"];

const contentIdLoggedOutArray = ["topNavHeader", "beforeLogIn", "footer"];

let isLoggedIn = false;
let cardNo = {};

//when createQuote button is clicked
function createQuote() {
  $("#showQuotes").addClass("d-none");
  $("#createQuote").removeClass("d-none");
  $("#afterLogIn").css("height","107vh");
}

//when showQuote button is clicked
function showQuotesOnClick() {
  $("#showQuotes").removeClass("d-none");
  $("#createQuote").addClass("d-none");
  location.reload();
}

$(document).ready(function () {
  //loading all the years inside the dropdown
  $.ajax({
    type: "GET",
    url: "https://iic-insurance-project-backend.vercel.app/api/getYears",
    success: function (data) {
      var s = '<option value="-1">Select Model Year</option>';
      for (var i = 0; i < data.data.length; i++) {
        s += '<option value="' + data.data[i] + '">' + data.data[i] + "</option>";
      }
      $("#modelYear").html(s);
    },
  });

  //it is used to store the manufacturer api data
  let storeManufacturerApi = {};
  
  // this is not working, why?
  // $("#modelYear").on("change", function () {

  // loading the manufacturer data based on selected year
  $(document).on("change", "#modelYear", function () {
    var selectedYear = $(this).val();
    // console.log(selectedYear);
    $.ajax({
      type: "GET",
      url: "https://iic-insurance-project-backend.vercel.app/api/getManufactures/" + selectedYear,
      success: function (data) {
        storeManufacturerApi = { ...data.data };
        var s = '<option value="-1">Select Manufacturer</option>';
        for (var i = 0; i < data.data.length; i++) {
          s += '<option value="' + data.data[i].value + '">' + data.data[i].name + "</option>";
        }
        $("#manufacturer").html(s);
      },
    });
  });

  //it is giving the name of the manufacturer corresponding to manufacturer value
  function getFullName(val, storeManufacturerApi) {
    for (var i = 0; i < Object.keys(storeManufacturerApi).length; i++) {
      if (storeManufacturerApi[i].value == val) {
        return storeManufacturerApi[i].name;
      }
    }
  }

  // it loads the model in dropdown based on the manufacturer
  $(document).on("change", "#manufacturer", async function () {
    var selectedManufacturer = $(this).val();
    fullName = await getFullName(selectedManufacturer, storeManufacturerApi);

    $.ajax({
      type: "GET",
      url: "https://iic-insurance-project-backend.vercel.app/api/getModels/" + fullName,
      success: function (data) {
        // console.log(data)
        var s = '<option value="-1">Select Model</option>';
        for (var i = 0; i < data.data.length; i++) {
          s += '<option value="' + data.data[i].value + '">' + data.data[i].name + "</option>";
        }
        $("#model").html(s);
      },
    });
  });

  //it is used to load the engine type data in dropdown
  $(document).on("change", "#model", function () {
    $.ajax({
      type: "GET",
      url: "https://iic-insurance-project-backend.vercel.app/api/getExtraCharacteristics",
      success: function (data) {
        var s = '<option value="-1">Select Engine</option>';
        for (var i = 0; i < data.data.engine.length; i++) {
          s += '<option value="' + data.data.engine[i].value + '">' + data.data.engine[i].name + "</option>";
        }
        $("#engine").html(s);
      },
    });
  });

  //when addviolation button is clicked ,all violations are loaded in dropdown with adding and removing separate rows functionality
  $(document).on("click", "#violationBtn", function () {
    var violationDropdown = $('<select class="form-control"></select>');
    $.ajax({
      url: "https://iic-insurance-project-backend.vercel.app/api/getViolations",
      type: "GET",
      success: function (response) {
        // console.log(response);
        violationDropdown.append("<option>Select Violation</option>");

        if (response.status === true && response.data && Array.isArray(response.data)) {
          response.data.forEach(function (violation) {
            violationDropdown.append('<option value="' + violation.code + '">' + violation.name + "</option>");
          });
        } else {
          console.error("Invalid response data for violations:", response);
        }

        var row = $('<div class="form-row"></div>');
        var col = $('<div class="form-group mt-2 col-md-4"></div>').append(violationDropdown);
        var deleteButton = $('<button type="button" class="btn btn-lg mb-2"><i class="fas fa-times"></i></button>');

        deleteButton.click(function () {
          row.remove();
        });

        row.append(col).append(deleteButton);
        $("#flush-collapseTwo .accordion-body").append(row);
      },
    });
  });

  //this function is getting all violations value(that we select and that are loading from edit quote)
  function getAllViolations() {
    var violations = [];
    $("#flush-collapseTwo .form-row").each(function () {
      var selectedValue = $(this).find("select").val();
      if (selectedValue !== "Select Violation") {
        violations.push(selectedValue);
      }
    });

    $(".col-5").each(function () {
      var loadViolations = $(this).text();
      violations.push(loadViolations);
    });

    return violations;
  }

  //this is storing the quote information(id,date,amount) for passing in the payload
  var storeInfoOfQuote = {};

  //when save quote button is clicked, data is passed to api
  $(document).on("click", "#saveQuoteBtn", async function () {
    //getting all the violation values and passing it to payload under "trafficViolations" key
    var violationArray = await getAllViolations();
    // console.log(violationArray);

    //getting all data from the form
    const allData = $("#addQuoteForm").serializeArray();
    // console.log(allData);

    //storing all the input field data inside arrObj object
    const arrObj = {};
    for (const inputs of allData) {
      arrObj[inputs["name"]] = inputs["value"];
    }
    // console.log(arrObj);

    //using arrObj , storeInfoOfQuote and violationArray to send data to api
    const data = {
      id: storeInfoOfQuote.id ? storeInfoOfQuote.id : "",
      createdDate: storeInfoOfQuote.date ? storeInfoOfQuote.date : "",
      quoteAmount: storeInfoOfQuote.amount ? storeInfoOfQuote.amount : "",
      driverDetails: {
        name: arrObj.name,
        age: arrObj.age,
        gender: arrObj.gender,
        address: {
          addressLine1: arrObj.address1,
          addressLine2: arrObj.address2,
          city: arrObj.city,
          state: arrObj.state,
          pinCode: arrObj.pincode,
        },
        email: arrObj.email,
      },
      vehicleDetails: {
        chassisNumber: arrObj.ChasisNumber,
        color: arrObj.color,
        regNumber: arrObj.regNumber,
        modelYear: arrObj.modelYear,
        manufacturer: arrObj.manufacturer,
        model: arrObj.model,
        engine: arrObj.engine,
        suspension: arrObj.suspension,
        sunroofAvailability: arrObj.sunroof,
      },
      trafficViolations: violationArray,
    };
    // console.log(data);

    $.ajax({
      url: "https://iic-insurance-project-backend.vercel.app/api/saveUpdateQuote",
      type: "POST",
      data: data,
      success: function (response) {
        console.log(response);
      },
    });
  });

  //while loading the data inside the input fields under edit quote, we are recieveing shortforms of manufacturer,model and engine. so we have to get the corresponsing names in oder to display them in fields
  async function valueToName(url, compareVaule, appendURL) {
    let vari;
      await $.ajax({
        type: "GET",
        url: url + appendURL,
        success: function (data) {
          if (appendURL == "") {
            for (var i = 0; i < data.data.engine.length; i++) {
              if (data.data.engine[i].value === compareVaule) {
              vari =  data.data.engine[i].name;
              break;
              }
            }
          } else {
            for (var i = 0; i < data.data.length; i++) {
              if (data.data[i].value === compareVaule) {
                vari =  data.data[i].name;
                break;
              }
            }
          }
        },
        error: function (error) {
          // reject(error);
        },
      });
      return vari;
  }

  //this is loading all the data inside the fields of the form that we are getting from the backend
  async function loadFormData(data) {
    $("#regNo").val(data.vehicleDetails.regNumber);
    $("#chasisNo").val(data.vehicleDetails.chassisNumber);
    $("#color").val(data.vehicleDetails.color);
    $("#modelYear").val(data.vehicleDetails.year);
    var manuName = await valueToName(
      "https://iic-insurance-project-backend.vercel.app/api/getManufactures/",
      data.vehicleDetails.manufacturer,
      data.vehicleDetails.year
    );
    // console.log(manuName);
    $("#manufacturer").html("<option>" + manuName + "</option>");
    var modelName = await valueToName(
      "https://iic-insurance-project-backend.vercel.app/api/getModels/",
      data.vehicleDetails.model,
      manuName
    );
    $("#model").html("<option>" + modelName + "</option>");
    var engineType = await valueToName(
      "https://iic-insurance-project-backend.vercel.app/api/getExtraCharacteristics",
      data.vehicleDetails.engine,
      ""
    );
    $("#engine").html("<option>" + engineType + "</option>");
    // Set radio button values based on data
    $("input[name='sunroof'][value='" + data.vehicleDetails.sunRoof.toLowerCase() + "']").prop("checked", true);
    $("input[name='suspension'][value='" + data.vehicleDetails.suspension.toLowerCase() + "']").prop("checked", true);
    // Driver Details
    $("#driverName").val(data.driverDetails.name);
    $("#driverAge").val(data.driverDetails.age);
    $("#driverEmail").val(data.driverDetails.email);
    // Set radio button value based on data
    $("input[name='gender'][value='" + data.driverDetails.gender.toLowerCase() + "']").prop("checked", true);
    // Driver Address
    $("#addressLine1").val(data.driverDetails.address.addressLine1);
    $("#addressLine2").val(data.driverDetails.address.addressLine2);
    $("#city").val(data.driverDetails.address.city);
    $("#state").val(data.driverDetails.address.state);
    $("#pincode").val(data.driverDetails.address.pincode);
  }

  //object that will contain all the violation name and value
  var allViolations = {};

  //it is calling the violation api and storing the data inside the allViolations object
  function callViolationsAPI(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
          allViolations = { ...response.data };
          resolve();
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  //it is returning the violation name corresponding to violation value
  function getViolationName(value) {
    for (var i = 0; i < Object.keys(allViolations).length; i++) {
      if (allViolations[i].code == value) {
        return allViolations[i].name;
      }
    }
  }

  //it is loading the violation related information
  async function addViolationsCSS(data) {
    //when there is no violation is present, do this
    if (data.length == 0) {
      var rowelem = `<div class="row">
    <div class="col-6 mb-2">
      <strong>No Violations</strong>
    </div>
    </div>`;
      $("#violationBtn").before(rowelem);
    }
    //otherwise this
    else {
      var roeelem = `<div class="row">
                    <div class="col-6">
                      <strong>Violation Description</strong>
                    </div>
                    <div class="col-6">
                      <strong>Violation Code</strong>
                    </div>
                  </div>
                  <hr>
                  <div id="accidentList"></div>`;
      $("#violationBtn").before(roeelem);
      await callViolationsAPI("https://iic-insurance-project-backend.vercel.app/api/getViolations");
      data.forEach((item) => {
        var violationFullName = getViolationName(item);
        var eachViolations = `
      <div class="row my-2">
        <div class="col-6">${violationFullName}</div>
        <div class="col-5">${item}</div>
        <div class="col-1"><button type="button" class="btn btn-delete" "><i class="fas fa-times"></i></button></div>
      </div>`;
        $("#accidentList").append(eachViolations);
      });

      $(document).on("click", ".btn-delete", function () {
        $(this).closest(".row").remove();
      });
    }
  }

  //it is displaying the quote related info below "edit quote" heading
  function addExtraCSS(quoteid, date, amt) {
    var storeInfoOfQuotes = {
      id: quoteid,
      date: date,
      amount: amt,
    };
    storeInfoOfQuote = { ...storeInfoOfQuotes };

    var quotesRelatedInfo = `
        <div class="d-flex justify-content-evenly mt-4 ">
            <p><strong>Quote No:</strong> ${quoteid}</p>
            <p><strong>Created Date:</strong> ${date}</p>
            <p><strong>Quote Amount:</strong> ${amt}</p>
        </div>
    `;
    $(".heading.container").after(quotesRelatedInfo);
  }

  //it changes the heading from "create quote" to "edit quote" when edit button is clicked
  function chnageHeading() {
    $("#createQuoteHeading").text("Edit Quote");
  }

  //when edit button is clicked
  $(document).on("click", ".cardHeadBtn", function () {
    var quoteId = $(this).data("quote-id"); // Retrieve quote ID from data attribute
    // console.log("Clicked on edit button for quote ID:", quoteId);

    $("#afterLogIn").css("height","117vh");
    $("#createQuoteBtn").addClass("nav-link active");
    $("#showQuoteBtn").removeClass("active");
    $("#showQuotes").addClass("d-none");
    $("#createQuote").removeClass("d-none");
    chnageHeading();
    $.ajax({
      url: "https://iic-insurance-project-backend.vercel.app/api/getQuoteById/" + quoteId,
      type: "GET",
      success: async function (response) {
        // console.log(response);
        await addExtraCSS(quoteId, response.data.createdDate, response.data.quoteAmount);
        await addViolationsCSS(response.data.trafficViolations);
        await loadFormData(response.data);
      },
    });
  });
});

function removeLoggOutPages() {
  $("#beforeLogIn").remove();
}

// it is fetching the all pages to display on html
function createPromiseForPageLoad(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
    })
      .done((response) => {
        resolve(response);
      })
      .fail((error) => {
        reject(console.log(error));
      });
  });
}

// it is displaying all the log in pages
function loadAllPagesLoggedIn() {
  removeLoggOutPages();
  const headerPromise = createPromiseForPageLoad("./pages/header.html");
  const sideNavPromise = createPromiseForPageLoad("./pages/sideNav.html");
  const topNavMobilePromise = createPromiseForPageLoad("./pages/topNav.html");
  const mainContentPromise = createPromiseForPageLoad("./pages/mainContent.html");
  const footerPromise = createPromiseForPageLoad("./pages/footer.html");
  return Promise.all([headerPromise, sideNavPromise, topNavMobilePromise, mainContentPromise, footerPromise]).then((values) => {
    for (let i = 0; i < values.length; i++) {
      $(`#${contentIdLoggedInArray[i]}`).html(values[i]);
    }
  });
}

// it is displaying the all the log out pages
function loadAllPagesLoggedOut() {
  const headerPromise = createPromiseForPageLoad("./pages/header.html");
  const loginPromise = createPromiseForPageLoad("./pages/login.html");
  const footerPromise = createPromiseForPageLoad("./pages/footer.html");
  return Promise.all([headerPromise, loginPromise, footerPromise]).then((values) => {
    for (let i = 0; i < values.length; i++) {
      $(`#${contentIdLoggedOutArray[i]}`).html(values[i]);
    }
  });
}

// it is taking the card data from api
// function requestData() {
//   return $.ajax({
//     url: "https://iic-insurance-project-backend.vercel.app/api/getQuotes",
//     success: async function (response) {
//       if (response.status) {
//         // console.log(response);
//         await loadData(response);
//       }
//     },
//     error: function (error) {
//       console.log(error);
//     },
//   });
// }

const mypromise = requestData();
mypromise.then((response)=>{
  loadData(response);
})

function requestData(){
  const pro = new Promise(function(resolve,reject){
    $.ajax({
      url: "https://iic-insurance-project-backend.vercel.app/api/getQuotes",
      typr:"GET"
    })
    .done((response)=>{
      resolve(response);
    })
    .fail((error)=>{
      reject("error");
    });
  });
  return pro;
}

// it is making the card and loading all the data coming from the api
function loadData(response) {
  var itemcontainer = $("#itemCardContainer");
  response.data.forEach((item) => {
    var cardHead = document.createElement("div");
    cardHead.setAttribute("class", "cardHead d-flex justify-content-between");

    var quoteNo = document.createElement("p");
    quoteNo.innerHTML = `Quote No : ${item.id}`;

    var cardHeadBtn = document.createElement("button");
    cardHeadBtn.setAttribute("class", "cardHeadBtn btn-primary");
    cardHeadBtn.setAttribute("data-quote-id", item.id);
    cardHeadBtn.innerText = "Edit";

    var itemcard = document.createElement("div");
    itemcard.setAttribute("class", "eachCard col-4");

    var img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("height", "240px");
    img.src = "/images/logo.svg";

    var cardDetails = document.createElement("div");
    cardDetails.setAttribute("class", "cardDetails");

    var quoteAmt = document.createElement("p");
    quoteAmt.innerHTML = `<strong>Quote Amount : </strong>${item.quoteAmount}`;
    var createdDate = document.createElement("p");
    createdDate.innerHTML = `<strong>Created Date : </strong>${item.createdDate}`;
    var regNo = document.createElement("p");
    regNo.innerHTML = `<strong>Reg. Number : </strong>${item.vehicleDetails.regNumber}`;

    cardHead.appendChild(quoteNo);
    cardHead.appendChild(cardHeadBtn);
    itemcard.appendChild(cardHead);
    itemcard.appendChild(img);
    cardDetails.appendChild(quoteAmt);
    cardDetails.appendChild(createdDate);
    cardDetails.appendChild(regNo);
    itemcard.appendChild(cardDetails);
    itemcontainer.append(itemcard);
  });
}

// function showSpinner() {
//   return new Promise((resolve, reject) => {
//     $("#spinner-container").css("display", "flex");
//     setTimeout(() => {
//       $("#spinner-container").css("display", "none");
//       resolve(); // Resolve the promise after hiding the spinner
//     }, 1000);
//   });
// }

// async function spinnerLogic() {
//   try {
//     await showSpinner(); // Show spinner and wait until it's hidden
//   } catch (error) {
//     console.error(error);
//   }
// }

$(async function () {
    if (localStorage.getItem("isLoggedIn")) {
      isLoggedIn = true;
  }

  if (isLoggedIn) {
    await loadAllPagesLoggedIn();
    $("#logOutBtn").removeClass("d-none");
    $("#createQuote").addClass("d-none");
    requestData();

    $("#logOutBtn").on("click", () => {
      console.log("logout");
      localStorage.removeItem("isLoggedIn");
      location.reload();
    });
  } else {
    await loadAllPagesLoggedOut();

    $("#logOutBtn").addClass("d-none");

    //check the local storage for emailID and the checkbox value and update it on the screen if present
    const fetchedEmail = localStorage.getItem("typedEmail");
    if (fetchedEmail) {
      $("#email").val(fetchedEmail);
      $("#check").prop("checked", true);
    }

    //making logIn button enable and disable
    $(".emailPassField input").on("keyup", function () {
      let empty = false;

      $(".emailPassField input").each(function () {
        empty = $(this).val().length == 0;
      });

      if (empty) $(".logInActions").attr("disabled", "disabled");
      else $(".logInActions").attr("disabled", false);
    });

    //on click of the login button
    $("#loginButton").on("click", function (e) {
      //saving the email and checkbox status in local storage if checkbox is clicked
      if ($("#check").prop("checked")) {
        localStorage.setItem("typedEmail", $("#email").val());
        localStorage.setItem("checkStatus", $("#check").prop("checked"));
      } else {
        localStorage.removeItem("typedEmail");
      }

      //making ajax request for the logIn
      const myData = {
        userEmail: $("#email").val(), //"shivang@insureinfinite.com",
        password: $("#pwd").val(), //"U0IG6YASltLaLWPQ",
      };

      $("#spinner-container").css("display", "flex");
      $.ajax({
        url: "http://iic-insurance-project-backend.vercel.app/api/doLogin",
        type: "POST",
        data: myData,
        success: async function (response) {
          if (!response.status) {
            $("#spinner-container").css("display", "none");
            $(".invalid").removeClass("d-none");
            $(".valid").addClass("d-none");
          } else {
            $("#spinner-container").css("display", "none");
            $(".invalid").addClass("d-none");
            $(".valid").removeClass("d-none");
            localStorage.setItem("isLoggedIn", true);
            removeLoggOutPages();
            loadAllPagesLoggedIn();
            await requestData();
            $("#createQuote").addClass("d-none");
            $("#logOutBtn").on("click", () => {
              localStorage.removeItem("isLoggedIn");
              location.reload();
            });
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  }
});
