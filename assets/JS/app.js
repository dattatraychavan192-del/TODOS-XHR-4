let baseURL = "https://jsonplaceholder.typicode.com";

const cl = console.log;

const loginForm = document.getElementById("loginForm");
const name = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const editBtn = document.getElementById("editBtn");
const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");

const spinner = document.getElementById("spinner");

let userArr = [];

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

function fetchUser() {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  let postUrl = `${baseURL}/users`;

  xhr.open("GET", postUrl);
  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      userArr = JSON.parse(xhr.response);
      creatCard(userArr.reverse());
      spinner.classList.add("d-none");
    }
  };
}
fetchUser();

function creatCard(ele) {
  let result = "";

  ele.forEach((ele, i) => {
    result += `
      <tr id="${ele.id}">
        <td>${userArr.length - i}</td>
        <td>${ele.name}</td>
        <td>${ele.username}</td>
        <td>${ele.email}</td>
        <td>${ele.address.city}</td>
        <td>${ele.phone}</td>

        <td>
          <button class="btn btn-light"
                  onclick="onEdit(this)">
            <i class="fa-solid text-success fa-2x fa-pen-to-square"></i>
          </button>
        </td>

        <td>
          <button class="btn btn-light"
                  onclick="onDelete(this)">
            <i class="fa-solid  text-danger fa-2x  fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  cardContainer.innerHTML = result;
}

function onSubmit(ele) {
  ele.preventDefault();
  spinner.classList.remove("d-none");

  let newObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  userArr.push(newObj);

  let posturl = `${baseURL}/users`;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", posturl);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let tr = document.createElement("tr");
      tr.id = response.id;
      tr.innerHTML = `
        <td>${userArr.length}</td>
      <td>${newObj.name}</td>
      <td>${newObj.username}</td>
      <td>${newObj.email}</td>
      <td>${newObj.address}</td>
      <td>${newObj.phone}</td>
      <td> <button class="btn btn-light " onclick="onEdit(this)"><i class="fa-solid text-success fa-2x  fa-pen-to-square"></i></button></td>
      <td> <button class="btn btn-light " onclick="onDelete(this)"><i class="fa-solid fa-trash fa-2x  text-danger"></i></button></td>
  
        `;
      cardContainer.prepend(tr);
    }

    loginForm.reset();
    spinner.classList.add("d-none");
    snackbar("New user add successfully.", "success");
  };
}

function onEdit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest("tr").id;

  let editUrl = `${baseURL}/users/${editId}`;

  let xhr = new XMLHttpRequest();

  xhr.open("GET", editUrl);
  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      name.value = editObj.name;
      username.value = editObj.username;
      email.value = editObj.email;
      address.value = editObj.address.city;
      phone.value = editObj.phone;

      localStorage.setItem("editId", editId);

      editBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");

      loginForm.classList.remove("d-none");

      loginForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    spinner.classList.add("d-none");
  };
}

function onUpdate() {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId");

  let updateObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: {
      city: address.value,
    },
    phone: phone.value,
  };

  let updateUrl = `${baseURL}/users/${updateId}`;

  let xhr = new XMLHttpRequest();

  xhr.open("PUT", updateUrl);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(JSON.stringify(updateObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let tr = document.getElementById(updateId);
      tr.innerHTML = `
        <td>${userArr.length}</td>
      <td>${updateObj.name}</td>
      <td>${updateObj.username}</td>
      <td>${updateObj.email}</td>
      <td>${updateObj.address.city}</td>
      <td>${updateObj.phone}</td>
      <td> <button class="btn btn-light " onclick="onEdit(this)"><i class="fa-solid text-success fa-2x  fa-pen-to-square"></i></button></td>
      <td> <button class="btn btn-light " onclick="onDelete(this)"><i class="fa-solid fa-trash fa-2x  text-danger"></i></button></td>
  
        `;

      editBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");

      tr.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    loginForm.reset();
    spinner.classList.add("d-none");
    snackbar("user update successfully.", "success");
  };
}

function onDelete(ele) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete it!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      spinner.classList.remove("d-none");

      let deletId = ele.closest("tr").id;
      let deleteUrl = `${baseURL}/users/${deletId}`;

      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", deleteUrl);
      xhr.send(null);

      xhr.onload = function () {
        spinner.classList.add("d-none");

        if (xhr.status >= 200 && xhr.status <= 299) {
          document.getElementById(deletId).remove();
          snackbar("User deleted successfully.", "success");
        } else {
          snackbar("Failed to delete user.", "error");
        }
      };

      xhr.onerror = function () {
        spinner.classList.add("d-none");
        snackbar("Network error.", "error");
      };
    }
  });
}

loginForm.addEventListener("submit", onSubmit);

updateBtn.addEventListener("click", onUpdate);
