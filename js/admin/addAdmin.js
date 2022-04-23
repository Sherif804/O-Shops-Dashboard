let token = localStorage.getItem("token");
apiBaseUrl = "https://oshops-app.herokuapp.com/"
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let username = document.getElementById("username");
let password = document.getElementById("password");
let role = document.getElementById("role");

function clearForm() {
    firstName.value = "";
    lastName.value = "";
    username.value = "";
    password.value = "";
    role.value = "";
}


function addAdmin() {
    let msg = '';
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}addAdmin`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                msg = `<div class="alert alert-success" role="alert">
                ${json.message}
                </div>`;
                setTimeout(() => {
                    msg = ``;
                    document.getElementById('msg').innerHTML = msg;
                }, 3000)
                document.getElementById('msg').innerHTML = msg;
                clearForm();
            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
            document.getElementById('msg').innerHTML = msg;
            }
        }
    }
    var data = JSON.stringify({ "firstName": firstName.value, "lastName": lastName.value, "userName": username.value, "password": password.value, "role": role.value });
    xhr.send(data);
}


function getCurrentAdmin() {
    let getCurrentAdmin = ``;
    let permission = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}getCurrentAdmin`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            getCurrentAdmin = `<h5>${json.userData.firstName} ${json.userData.lastName}</h5>
                            <small>${json.userData.role}</small>`;
            if (json.userData.role == 'superAdmin') {
                permission = `<a href="./admin.html" class="active"><i class="fas fa-user-cog"></i>
                <span>Admins</span>
            </a>`;
            }
            document.getElementById("permission").innerHTML = permission;
            document.getElementById("getCurrentAdmin").innerHTML = getCurrentAdmin;
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function logOut() {
    window.location = "../../html/login.html";
    localStorage.clear();
}


if (token == undefined || token == null) {
    window.location.href = "../../html/login.html";
    localStorage.clear()
}

getCurrentAdmin();
document.getElementById("saveBtn").addEventListener("click" , addAdmin);