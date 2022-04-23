let token = localStorage.getItem("token");
let data;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
document.getElementById('firstName').value = localStorage.getItem('firstName');
document.getElementById('lastName').value = localStorage.getItem('lastName');
document.getElementById('userName').value = localStorage.getItem('userName');
document.getElementById('role').value = localStorage.getItem('adminRole');


if (token == undefined || token == null) {
    window.location.href = "../../html/login.html";
    localStorage.clear();
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
        }            
        document.getElementById("permission").innerHTML = permission;
        document.getElementById("getCurrentAdmin").innerHTML = getCurrentAdmin;
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function logOut() {
    window.location = "../../html/login.html";
    localStorage.clear()
}


function updateAdmin() {
    let id = localStorage.getItem('adminId');
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let userName = document.getElementById("userName");
    let password = document.getElementById("password");
    let role = document.getElementById("role");
    let msg = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}updateAdmin/${id}`;
    xhr.open("PUT", url, true);
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
                    document.getElementById('msg').innerHTML = msg;
                    window.location = "./viewAdmin.html";
                }, 2000);
                localStorage.removeItem('firstName')
                localStorage.removeItem('lastName')
                localStorage.removeItem('userName')
                localStorage.removeItem('adminRole')
                localStorage.removeItem('adminId')
                document.getElementById('msg').innerHTML = msg;
            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                document.getElementById('msg').innerHTML = msg;
            }
        }
    }


    if (password == '') {
        data = JSON.stringify({ "firstName": firstName.value, "lastName": lastName.value, "userName": userName.value, "password": password.value, "role": role.value });
    }
    else {
        data = JSON.stringify({ "firstName": firstName.value, "lastName": lastName.value, "userName": userName.value, "password": password.value, "role": role.value });
    }
    xhr.send(data);
}


getCurrentAdmin();
document.getElementById("updateBtn").addEventListener("click", updateAdmin);