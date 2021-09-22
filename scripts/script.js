// ### 1.Global Variables ###

// array to keep track of which all filters are currently active
let activeRoles = [];

// ### 2.Functions ###

// function to fetch data from API
function getData(url, cb) {
  fetch(url)
    .then((response) => response.json())
    .then((result) => cb(result));
}

// since the fetchemployee endpoint is giving all the role related data in it's json I'm not going to assign role of an employee from the role class
// There could be Normal Form mismatch between the roles sent by fetchroles and roles sent by fetchemployess
// if the api was giving only a role id in fetchemployee to which a role exists in fetchroles, that'll be the best implementation
// but since nowhere it's mentioned that the roles in fetchemployee are always going be 100% included in fetchroles, i'm implementing it like this

// Employee class to hold the employee info from API
class Employee {
  constructor(empData) {
    this.id = empData.employeeid;
    this.fName = empData.employeefname;
    this.lName = empData.employeelname;
    this.bio = empData.employeebio;
    this.hasPic = empData.employeehaspic;
    this.isFeatured = empData.employeeisfeatured;
    this.roles = empData.roles;
    if (this.hasPic) {
      this.image = `http://sandbox.bittsdevelopment.com/code1/employeepics/${this.id}.jpg`;
    } else {
      this.image = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png`;
    }
  }
}

// Role class to hold role info from API
class Role {
  constructor(roleData) {
    this.id = roleData.roleid;
    this.name = roleData.rolename;
    this.color = roleData.rolecolor;
  }
}

// function to fetch employee details
function fetchEmployee() {
  let roleList = "";
  // code for filtering the fetch according to role
  if (activeRoles.length != 0) {
    roleList = activeRoles.toString();
  }
  getData(
    "http://sandbox.bittsdevelopment.com/code1/fetchemployees.php?roles=" +
      roleList,
    (data) => {
      console.log(data);
      for (var a in data) {
        let emp = new Employee(data[a]);
        // populate the cards into the DOM
        populateCards(emp);
      }
    }
  );
}

// function to populate the buttons in the DOM for filtering
function populateButtons(role) {
  let buttonListClass = document.getElementById("role-buttons");
  let buttonDiv = `<button id=${role.id} class="role-button" onclick="filter(${role.id})">${role.name}</button>`;
  buttonListClass.innerHTML += buttonDiv;
}

// function to take care of filtering
// input is the roleID
// roleID added to the activeRoles array if it's not found
// if found, remove from array to offer toggling functionality
// if roleID === showAll reset the array
function filter(roleID) {
  if (roleID === "showAll") {
    activeRoles = [];
  } else if (activeRoles.includes(roleID)) {
    activeRoles = activeRoles.filter((a) => a !== roleID);
  } else {
    activeRoles.push(roleID);
  }
  styleButtons();
  document.getElementById("employee-list").innerHTML = "";
  fetchEmployee();
}

// function to take care of styling the filter buttons on click
function styleButtons() {
  var buttons = document.getElementsByClassName("role-button");
  // reset all button styles
  for (var button of buttons) {
    button.classList.remove("role-button__active");
  }
  // add active class to the buttons whose id is present in activeRoles array
  for (var a of activeRoles) {
    const button = document.getElementById(a);
    button.classList.add("role-button__active");
  }
  // if the array is empty, style All filter so that user knows all the results are shown
  if (activeRoles.length == 0) {
    document.getElementById("showAll").classList.add("role-button__active");
  }
}

// function to populate the cards which contains employee details
function populateCards(emp) {
  let empListClass = document.getElementById("employee-list");
  let role = "";
  for (var a of emp.roles) {
    let color = "white";
    // for accessibility reverse the font color to black when the role color of the button is white
    if (a.rolecolor === "#FDFFF7") {
      color = "black";
    }
    role += `<div class="role" style="color:${color}; background-color:${a.rolecolor}"><span class="role-name">${a.rolename}</span></div>`;
  }
  empListClass.innerHTML += `<div class="card">
  <div class="icon">${emp.isFeatured == 1 ? "&#128081" : ""}</div>
  <div class="picture">
    <img class="circular" src="${
      emp.image
    }" height="150px" width="150px" alt="image of employee ${emp.fName} ${
    emp.lName
  }" >
  </div>
  <h2 class="name">${emp.fName} ${emp.lName}
  </h2>
  <div class="bio">${emp.bio}
  </div>
  <div class="role-container">
  ${role}
  </div>
</div>`;
}

// function to fetch all the roles from API and show it in the DOM
function fetchRoles() {
  getData(
    "http://sandbox.bittsdevelopment.com/code1/fetchroles.php",
    (data) => {
      for (var a in data) {
        let role = new Role(data[a]);
        populateButtons(role);
      }
    }
  );
}

// ### 3.Execution starts here ###

fetchEmployee();

fetchRoles();
