const contentIdLoggedInArray = ["topNavHeader", "footer", "sideNav", "topNavMobile", "mainContent"];

const contentIdLoggedOutArray = ["topNavHeader", "footer", "logIn"];

let allViolations = [];

let allYears = [];

let allExtra = {};

let selectedQuote = {};

let isLoggedIn = false;

// Load pages when user is logged in
function loadAllPagesLoggedIn() {
  const headerPromise = createPageLoadPromise("./pages/header.html");
  const footerPromise = createPageLoadPromise("./pages/footer.html");
  const sideNavPromise = createPageLoadPromise("./pages/sideNav.html");
  const topNavPromise = createPageLoadPromise("./pages/topNav.html");
  const mainContentPromise = createPageLoadPromise("./pages/mainContent.html");
  return Promise.all([headerPromise, footerPromise, sideNavPromise, topNavPromise, mainContentPromise]).then((values) => {
    for (let i = 0; i < values.length; i++) {
      $(`#${contentIdLoggedInArray[i]}`).removeClass("d-none");
      $(`#${contentIdLoggedInArray[i]}`).html(values[i]);
    }
  });
}

// Load pages when user is logged out
function loadAllPagesLoggedOut() {
  const headerPromise = createPageLoadPromise("./pages/header.html");
  const footerPromise = createPageLoadPromise("./pages/footer.html");
  const logInPromise = createPageLoadPromise("./pages/login.html");
  return Promise.all([headerPromise, footerPromise, logInPromise]).then((values) => {
    for (let i = 0; i < values.length; i++) {
      $(`#${contentIdLoggedOutArray[i]}`).html(values[i]);
    }
  });
}

// Show Quotes when clicked on sidebar/top-bar
function showQuotes() {
  $("#showQuotes").addClass("text-bg-light");
  $("#showQuotes").removeClass("text-light");
  $("#createQuote").removeClass("text-bg-light");
  $("#createQuote").addClass("text-light");
  $("#showQuotesTop").addClass("text-bg-light");
  $("#showQuotesTop").removeClass("text-light");
  $("#createQuoteTop").removeClass("text-bg-light");
  $("#createQuoteTop").addClass("text-light");
  $("#quoteList").removeClass("d-none");
  $("#addQuote").addClass("d-none");
}

// Create Quotes when clicked on sidebar/top-bar
function createQuote(editQuote, quoteID) {
  $("#createQuote").addClass("text-bg-light");
  $("#createQuote").removeClass("text-light");
  $("#showQuotes").removeClass("text-bg-light");
  $("#showQuotes").addClass("text-light");
  $("#createQuoteTop").addClass("text-bg-light");
  $("#createQuoteTop").removeClass("text-light");
  $("#showQuotesTop").removeClass("text-bg-light");
  $("#showQuotesTop").addClass("text-light");
  $("#quoteList").addClass("d-none");
  $("#addQuote").empty();
  $("#addQuote").removeClass("d-none");
  if (editQuote) {
    getQuoteDetails(quoteID);
  } else {
    createNewQuote();
  }
}

// function to load html for create quote
function createNewQuote() {
  const cardHtml = `<form id="quoteForm">
  <div class="alert alert-info d-none mt-2" role="alert" id="alertMessage"></div>
  <div class="my-3"><h3>Add Quote</h3></div>
  <hr />
  <div class="accordion" id="quoteAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#vehicleDetails">
          <strong>Vehicle Details</strong>
        </button>
      </h2>
      <div id="vehicleDetails" class="accordion-collapse collapse show">
        <div class="accordion-body row g-2">
          <div class="col-4">
            <label for="regNumber" class="form-label">Reg. Number</label>
            <input type="text" name="regNumber" id="regNumber" class="form-control" value="" />
          </div>
          <div class="col-4">
            <label for="chesisNumber" class="form-label">Chassis. Number</label>
            <input type="text" name="chesisNumber" id="chesisNumber" class="form-control" value="" />
          </div>
          <div class="col-4">
            <label for="vehColor" class="form-label">Color</label>
            <input type="text" name="vehColor" id="vehColor" class="form-control" value="" />
          </div>
          <div class="col-4">
            <label for="vehYear" class="form-label">Model Year</label>
            <select name="vehYear" class="form-select" id="vehYear" onChange="selectYear(this)"><option>Loading...</option></select>
          </div>
          <div class="col-4">
            <label for="vehMan" class="form-label">Manufacturer</label>
            <select name="vehMan" class="form-select" id="vehMan" onChange="selectMan(this)"><option>Please choose year</option></select>
          </div>
          <div class="col-4">
            <label for="vehModel" class="form-label">Model</label>
            <select name="vehModel" class="form-select" id="vehModel" onChange="selectModel(this)"><option>Please choose manufacturer</option></select>
          </div>
          <div class="col-4">
            <label for="vehEngine" class="form-label">Engine</label>
            <select name="vehEngine" class="form-select" id="vehEngine"><option>Please choose model</option></select>
          </div>
          <div class="col-4">
            <label class="form-label">Sun Roof</label>
            <div class="mt-1">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="sunRoofOptions" id="sunRoofYes" value="Yes" />
                <label class="form-check-label" for="sunRoofYes">Available</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="sunRoofOptions" id="sunRoofNo" value="No" />
                <label class="form-check-label" for="sunRoofNo">Not Available</label>
              </div>
            </div>
          </div>
          <div class="col-4">
            <label class="form-label">Suspension</label>
            <div class="mt-1">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="susOptions" id="susHard" value="Hard" />
                <label class="form-check-label" for="susHard">Hard</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="susOptions" id="susSoft" value="Soft" />
                <label class="form-check-label" for="susSoft">Soft</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="susOptions" id="susSmooth" value="Smooth" />
                <label class="form-check-label" for="susSmooth">Smooth</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accidentDetails">
          <strong>Accident Details</strong>
        </button>
      </h2>
      <div id="accidentDetails" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div id="accidentList"></div>
          <div class="row d-none mt-3" id="violationSelectHeading">
            <div class="col-6"><strong>Add Violation</strong></div>
          </div>
          <div id="violationSelect"></div>
          <button type="button" class="btn btn-primary mt-2" onClick="addNewViolation()">Add New Violation</button>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#driverDetails">
          <strong>Driver Details</strong>
        </button>
      </h2>
      <div id="driverDetails" class="accordion-collapse collapse">
        <div class="accordion-body">
          <div class="row g-2">
            <div class="col-6">
              <label for="driverName" class="form-label">Driver Name</label>
              <input name="driverName" type="text" class="form-control" id="driverName" placeholder="" value="" />
            </div>
            <div class="col-6">
              <label for="driverAge" class="form-label">Driver Age</label>
              <input name="driverAge" type="number" class="form-control" id="driverAge" placeholder="" value="" />
            </div>
            <div class="col-8">
              <label for="driverEmail" class="form-label">Driver Email</label>
              <input name="driverEmail" type="email" class="form-control" id="driverEmail" placeholder="" value="" />
            </div>
            <div class="col-4">
              <label class="form-label">Gender</label>
              <div class="mt-1">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="driverGender" id="genderMale" value="M" />
                  <label class="form-check-label" for="genderMale">Male</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="driverGender" id="genderFemale" value="F" />
                  <label class="form-check-label" for="genderFemale">Female</label>
                </div>
              </div>
            </div>
            <div class="col-12">
              <label for="addressLine1" class="form-label">Address Line 1</label>
              <input name="addressLine1" type="text" class="form-control" id="addressLine1" value="" />
            </div>
            <div class="col-12">
              <label for="addressLine2" class="form-label">Address Line 2 <span class="text-body-secondary">(Optional)</span></label>
              <input name="addressLine2" type="text" class="form-control" id="addressLine2" value="" />
            </div>
            <div class="col-md-4">
              <label for="state" class="form-label">State</label>
              <input name="state" type="text" class="form-control" id="state" placeholder="" value="" />
            </div>
            <div class="col-md-4">
              <label for="city" class="form-label">City</label>
              <input name="city" type="text" class="form-control" id="city" placeholder="" value="" />
            </div>
            <div class="col-md-4">
              <label for="addressPin" class="form-label">Pin Code</label>
              <input name="addressPin" type="text" class="form-control" id="addressPin" placeholder="" value="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr />
  <button type="button" class="btn btn-primary" onClick="submitForm()">Save Quote</button>
</form>`;
  $("#addQuote").html(cardHtml);
  loadYears();
}

// function to load html for edit quote
async function getQuoteDetails(quoteID) {
  $("#addQuote").empty();
  const response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getQuoteById/" + quoteID, "GET", null);
  selectedQuote = response.data;
  const cardHtml = `<form id="quoteForm">
    <input type="hidden" value="${response.data.id}" name="id" />
    <div class="alert alert-info d-none mt-2" role="alert" id="alertMessage"></div>
    <div class="my-3"><h3>Edit Quote</h3></div>
    <hr />
    <div class="row m-2 text-center">
      <div class="col-4">Quote No.: ${response.data.id}</div>
      <div class="col-4">Start Date: ${response.data.createdDate}</div>
      <div class="col-4">Amount: ${response.data.quoteAmount}</div>
    </div>
    <hr />
    <div class="accordion" id="quoteAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#vehicleDetails">
            <strong>Vehicle Details</strong>
          </button>
        </h2>
        <div id="vehicleDetails" class="accordion-collapse collapse show">
          <div class="accordion-body row g-2">
            <div class="col-4">
              <label for="regNumber" class="form-label">Reg. Number</label>
              <input name="regNumber" type="text" id="regNumber" class="form-control" value="${response.data.vehicleDetails.regNumber}" />
            </div>
            <div class="col-4">
              <label for="chesisNumber" class="form-label">Chassis. Number</label>
              <input name="chesisNumber" type="text" id="chesisNumber" class="form-control" value="${
                response.data.vehicleDetails.chassisNumber
              }" />
            </div>
            <div class="col-4">
              <label for="vehColor" class="form-label">Color</label>
              <input name="vehColor" type="text" id="vehColor" class="form-control" value="${response.data.vehicleDetails.color}" />
            </div>
            <div class="col-4">
              <label for="vehYear" class="form-label">Model Year</label>
              <select name="vehYear" class="form-select" id="vehYear"><option>Loading...</option></select>
            </div>
            <div class="col-4">
              <label for="vehMan" class="form-label">Manufacturer</label>
              <select name="vehMan" class="form-select" id="vehMan"><option>Loading...</option></select>
            </div>
            <div class="col-4">
              <label for="vehModel" class="form-label">Model</label>
              <select name="vehModel" class="form-select" id="vehModel"><option>Loading...</option></select>
            </div>
            <div class="col-4">
              <label for="vehEngine" class="form-label">Engine</label>
              <select name="vehEngine" class="form-select" id="vehEngine"><option>Loading...</option></select>
            </div>
            <div class="col-4">
              <label class="form-label">Sun Roof</label>
              <div class="mt-1">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="sunRoofOptions" id="sunRoofYes" value="Yes" />
                  <label class="form-check-label" for="sunRoofYes">Available</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="sunRoofOptions" id="sunRoofNo" value="No" />
                  <label class="form-check-label" for="sunRoofNo">Not Available</label>
                </div>
              </div>
            </div>
            <div class="col-4">
              <label class="form-label">Suspension</label>
              <div class="mt-1">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="susOptions" id="susHard" value="Hard" />
                  <label class="form-check-label" for="susHard">Hard</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="susOptions" id="susSoft" value="Soft" />
                  <label class="form-check-label" for="susSoft">Soft</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="susOptions" id="susSmooth" value="Smooth" />
                  <label class="form-check-label" for="susSmooth">Smooth</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accidentDetails">
            <strong>Accident Details</strong>
          </button>
        </h2>
        <div id="accidentDetails" class="accordion-collapse collapse">
          <div class="accordion-body">
            <div class="row">
              <div class="col-6"><strong>Violation Description</strong></div>
              <div class="col-6"><strong>Violation Code</strong></div>
            </div>
            <hr />
            <div id="accidentList"></div>
            <div class="row d-none mt-3" id="violationSelectHeading">
              <hr>
              <div class="col-6"><strong>Add Violation</strong></div>
            </div>
            <div id="violationSelect"></div>
            <button type="button" class="btn btn-primary mt-2" onClick="addNewViolation()">Add New Violation</button>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#driverDetails">
            <strong>Driver Details</strong>
          </button>
        </h2>
        <div id="driverDetails" class="accordion-collapse collapse">
          <div class="accordion-body">
            <div class="row g-2">
              <div class="col-6">
                <label for="driverName" class="form-label">Driver Name</label>
                <input name="driverName" type="text" class="form-control" id="driverName" placeholder="" value="${
                  response.data.driverDetails.name
                }" />
              </div>
              <div class="col-6">
                <label for="driverAge" class="form-label">Driver Age</label>
                <input name="driverAge" type="number" class="form-control" id="driverAge" placeholder="" value="${
                  response.data.driverDetails.age
                }" />
              </div>
              <div class="col-8">
                <label for="driverEmail" class="form-label">Driver Email</label>
                <input name="driverEmail" type="email" class="form-control" id="driverEmail" placeholder="" value="${
                  response.data.driverDetails.email
                }" />
              </div>
              <div class="col-4">
                <label class="form-label">Gender</label>
                <div class="mt-1">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="driverGender" id="genderMale" value="M" ${
                      response.data.driverDetails.gender === "M" ? "checked" : ""
                    }/>
                    <label class="form-check-label" for="genderMale">Male</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="driverGender" id="genderFemale" value="F" ${
                      response.data.driverDetails.gender === "F" ? "checked" : ""
                    }/>
                    <label class="form-check-label" for="genderFemale">Female</label>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <label for="addressLine1" class="form-label">Address Line 1</label>
                <input name="addressLine1" type="text" class="form-control" id="addressLine1" value="${
                  response.data.driverDetails.address.addressLine1
                }" />
              </div>
              <div class="col-12">
                <label for="addressLine2" class="form-label">Address Line 2 <span class="text-body-secondary">(Optional)</span></label>
                <input name="addressLine2" type="text" class="form-control" id="addressLine2" value="${
                  response.data.driverDetails.address.addressLine2
                }" />
              </div>
              <div class="col-md-4">
                <label for="state" class="form-label">State</label>
                <input name="state" type="text" class="form-control" id="state" placeholder="" value="${
                  response.data.driverDetails.address.state
                }" />
              </div>
              <div class="col-md-4">
                <label for="city" class="form-label">City</label>
                <input name="city" type="text" class="form-control" id="city" placeholder="" value="${
                  response.data.driverDetails.address.city
                }" />
              </div>
              <div class="col-md-4">
                <label for="addressPin" class="form-label">Pin Code</label>
                <input name="addressPin" type="text" class="form-control" id="addressPin" placeholder="" value="${
                  response.data.driverDetails.address.pincode
                }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <button type="button" class="btn btn-primary" onClick="submitForm()">Save Quote</button>
  </form>`;
  $("#addQuote").html(cardHtml);
  loadAdditionalQuoteDetails(response.data);
  loadViolations();
}

// Add html for a new violation
async function addNewViolation() {
  if (allViolations.length === 0) {
    let response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getViolations", "GET", null);
    allViolations = response.data;
  }
  let options = "<option>Choose a violation</option>";
  allViolations.forEach((vio) => {
    options += `
      <option value="${vio.code}">${vio.name}</option>
    `;
  });
  const count = $(".violationValue").length + 1;
  const htmlElement = `
    <div class="row mt-2 g-2 violationValue">
      <div class="col-11">
        <select class="form-select" id="violation${count}">${options}</select>
      </div>
      <div class="col-1"><button type="button" class="btn-close mt-1" aria-label="Close" onClick="removeViolation(this)"></button></div>
    </div>`;
  $("#violationSelectHeading").removeClass("d-none");
  $("#violationSelect").append(htmlElement);
}

// remove html for a violation
function removeViolation(item) {
  $(item).closest(".row").remove();
}

// select year onchange and call ajax for manufactures
function selectYear(element) {
  loadManufactures("", $(element).val());
}

// select manufac onchange and call ajax for models
function selectMan() {
  loadModels("", $("#vehMan option:selected").text());
}

// select model onchange and call ajax for models
function selectModel() {
  loadExtraChars("");
}

// load and add html for initial quotes
async function loadQuotes() {
  const response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getQuotes", "GET", null);
  for (let i = 0; i < response.data.length; i++) {
    const cardHtml = `<div class="col-12 col-md-6 col-lg-4">
      <div class="card">
        <div class="card-header">Quote No. ${response.data[i].id} <button onClick="createQuote(true, ${response.data[i].id})" type="button" class="btn btn-primary btn-sm float-end editButton">Edit</button></div>
        <img src="../images/logo.svg" class="quoteImage" alt="Quote Text" />
        <hr />
        <div class="card-body">
          <div><strong>Quote Amount:</strong> ${response.data[i].quoteAmount}</div>
          <div><strong>Created Date:</strong> ${response.data[i].createdDate}</div>
          <div><strong>Reg. Number:</strong> ${response.data[i].vehicleDetails.regNumber}</div>
        </div>
      </div>
    </div>`;
    $("#quoteList").append(cardHtml);
  }
}

// submit the form and create a payload.
async function submitForm() {
  const tempArr = $("#quoteForm").serializeArray();
  const obj = {};
  for (const item of tempArr) {
    obj[item["name"]] = item["value"];
  }
  const data = {
    id: obj.id ? obj.id : "",
    createdDate: "04/04/2024",
    quoteAmount: "",
    driverDetails: {
      name: obj.driverName,
      age: obj.driverAge,
      gender: obj.driverGender,
      address: {
        addressLine1: obj.addressLine1,
        addressLine2: obj.addressLine2,
        city: obj.city,
        state: obj.state,
        pincode: obj.addressPin,
      },
      email: obj.driverEmail,
    },
    vehicleDetails: {
      chassisNumber: obj.chesisNumber,
      color: obj.vehColor,
      regNumber: obj.regNumber,
      year: obj.vehYear,
      manufacturer: obj.vehMan,
      model: obj.vehModel,
      engine: obj.vehEngine,
      suspension: obj.susOptions,
      sunRoof: obj.sunRoofOptions,
    },
    trafficViolations: [],
  };
  const selectViolations = await $("#violationSelect select");
  const textViolations = await $(".vioCode");
  for (let i = 0; i < selectViolations.length; i++) {
    data.trafficViolations.push($(selectViolations[i]).val());
  }
  for (let i = 0; i < textViolations.length; i++) {
    data.trafficViolations.push($(textViolations[i]).text());
  }
  const response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/saveUpdateQuote", "POST", data);
  if (response.status) {
    $("#alertMessage").removeClass("d-none");
    $("#alertMessage").html("Quote Saved/Updated");
    setTimeout(() => {
      $("#alertMessage").addClass("d-none");
    }, 5000);
  } else {
    $("#alertMessage").removeClass("d-none");
    $("#alertMessage").html("Error while quote saving/updating");
    setTimeout(() => {
      $("#alertMessage").addClass("d-none");
    }, 5000);
  }
}

// this is document.ready function and it will be the first thing to run when page loads.
$(async function () {
  // check if logged in
  if (localStorage.getItem("isLoggedIn")) {
    isLoggedIn = true;
  }
  // if user is logged in then load the pages or if not logged in then load other pages
  if (isLoggedIn) {
    await loadAllPagesLoggedIn();
    $("#beforeLogin").remove();
    $(`#afterLogin`).removeClass("d-none");
    loadQuotes();
    $("#logoutButton").on("click", async function () {
      localStorage.clear();
      window.location.reload();
    });
    $("#logoutButton").removeClass("d-none");
  } else {
    await loadAllPagesLoggedOut();
    $("#logoutButton").addClass("d-none");
  }

  const loadingModal = new bootstrap.Modal("#loadingModal");

  // event handle to enable our login button
  $("#emailInput, #passwordInput").on("keyup", function () {
    const emailValue = $("#emailInput").val();
    const passwordValue = $("#passwordInput").val();
    if (emailValue !== "" && passwordValue !== "") {
      $("#loginButton").removeAttr("disabled");
    } else {
      $("#loginButton").attr("disabled", true);
    }
  });

  // on click of the login button
  $("#loginButton").on("click", async function () {
    loadingModal.show();
    try {
      const data = {
        userEmail: "yashik@insureinfinite.com",
        password: "h7CBzfwN7AN1IYMv",
      };
      const response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/doLogin", "POST", data);
      if (response.status) {
        $("#beforeLogin").remove();
        $(`#afterLogin`).removeClass("d-none");
        await loadAllPagesLoggedIn();
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("privateToken", response.data.privateToken);
        setTimeout(() => {
          loadingModal.hide();
        }, 1000);
        loadQuotes();

        $("#logoutButton").on("click", async function () {
          localStorage.clear();
          window.location.reload();
        });
      } else {
        $("#errorMessage").removeClass("d-none");
        $("#errorMessage").text(response.message);
        setTimeout(() => {
          $("#errorMessage").addClass("d-none");
          loadingModal.hide();
        }, 7000);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

/* Common Functions */

// Send Ajax Request
function ajaxRequest(url, type, data) {
  return $.ajax({
    url: url,
    type: type,
    data: type === "POST" || type === "PUT" ? data : null,
    accepts: {
      text: "application/json",
    },
  })
    .done((response) => {
      return response;
    })
    .fail((error) => {
      throw new Error(error);
    });
}

function createPageLoadPromise(url) {
  return new Promise((resolve, reject) => {
    try {
      resolve(ajaxRequest(url, "GET", null));
    } catch (error) {
      console.log(error);
      reject("Unable to load page. Contact yashikgulati22@gmail.com");
    }
  });
}

async function loadAdditionalQuoteDetails(quoteData) {
  await loadYears(quoteData);
  let selectedMan = await loadManufactures(quoteData);
  await loadModels(quoteData, selectedMan);
  loadExtraChars(quoteData);
}

async function loadYears(quoteData) {
  // more efficient code, we are checking if we really need to make the api call as we are saving the constant data
  if (allYears.length === 0) {
    let response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getYears", "GET", null);
    allYears = response.data;
  }
  if (allYears.length > 0) $("#vehYear").empty();
  const option = `<option>Please choose a year</option>`;
  $("#vehYear").append(option);
  allYears.forEach((year) => {
    const option = `<option value="${year}" ${quoteData && quoteData.vehicleDetails.year === year ? "selected" : ""}>${year}</option>`;
    $("#vehYear").append(option);
  });
}

async function loadManufactures(quoteData, year) {
  if (quoteData) {
    year = quoteData.vehicleDetails.year;
  }
  // load manufacturer
  response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getManufactures/" + year, "GET", null);
  const manufactures = response.data;
  if (manufactures.length > 0) $("#vehMan").empty();
  const option = `<option>Please choose a manufacture</option>`;
  $("#vehMan").append(option);
  let selectedMan = "";
  manufactures.forEach((man) => {
    if (quoteData && quoteData.vehicleDetails.manufacturer === man.value) selectedMan = man.name;
    const option = `<option value="${man.value}" ${quoteData && quoteData.vehicleDetails.manufacturer === man.value ? "selected" : ""}>${
      man.name
    }</option>`;
    $("#vehMan").append(option);
  });
  return selectedMan;
}

async function loadModels(quoteData, selectedMan) {
  // load model
  response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getModels/" + selectedMan, "GET", null);
  const model = response.data;
  if (model.length > 0) $("#vehModel").empty();
  const option = `<option>Please choose a model</option>`;
  $("#vehModel").append(option);
  model.forEach((model) => {
    const option = `<option value="${model.value}" ${quoteData && quoteData.vehicleDetails.model === model.value ? "selected" : ""}>${
      model.name
    }</option>`;
    $("#vehModel").append(option);
  });
}

async function loadExtraChars(quoteData) {
  // load extra Char
  // more efficient code, we are checking if we really need to make the api call as we are saving the constant data
  if (Object.keys(allExtra).length === 0) {
    response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getExtraCharacteristics", "GET", null);
    allExtra = response.data;
  }
  const engines = allExtra.engine;

  if (engines.length > 0) $("#vehEngine").empty();
  const option = `<option>Please choose an engine</option>`;
  $("#vehEngine").append(option);
  engines.forEach((engine) => {
    const option = `<option value="${engine.value}" ${quoteData && quoteData.vehicleDetails.engine === engine.value ? "selected" : ""}>${
      engine.name
    }</option>`;
    $("#vehEngine").append(option);
  });

  if (quoteData && quoteData.vehicleDetails.sunRoof === "Yes") {
    $("#sunRoofYes").attr("checked", "checked");
  } else if (quoteData && quoteData.vehicleDetails.sunRoof === "Yes") {
    $("#sunRoofNo").attr("checked", "checked");
  }

  if (quoteData && quoteData.vehicleDetails.suspension === "Soft") {
    $("#susSoft").attr("checked", "checked");
  } else if (quoteData && quoteData.vehicleDetails.suspension === "Hard") {
    $("#susHard").attr("checked", "checked");
  } else if (quoteData && quoteData.vehicleDetails.suspension === "Smooth") {
    $("#susSmooth").attr("checked", "checked");
  }
}

async function loadViolations() {
  $("#accidentList").html("Loading...");
  // more efficient code, we are checking if we really need to make the api call as we are saving the constant data
  if (allViolations.length === 0) {
    let response = await ajaxRequest("https://iic-insurance-project-backend.vercel.app/api/getViolations", "GET", null);
    allViolations = response.data;
  }
  const quoteViolations = selectedQuote.trafficViolations;
  if (quoteViolations.length === 0) {
    $("#accidentList").html("No Violations");
  } else {
    $("#accidentList").empty();
    allViolations.forEach((vio) => {
      if (quoteViolations.includes(vio.code)) {
        const violationRow = `
          <div class="row my-2">
            <div class="col-6">${vio.name}</div>
            <div class="col-5 vioCode">${vio.code}</div>
            <div class="col-1"><button type="button" class="btn-close" aria-label="Close" onClick="removeViolation(this)"></button></div>
          </div>`;
        $("#accidentList").append(violationRow);
      }
    });
  }
}
