let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
let info = ``;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
var url = `${apiBaseUrl}getAllAdmins/?page=1&&size=10`;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function deleteAdmin(id) {
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}deleteAdmin/${id}`;
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                location.reload();
            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
            }
            document.getElementById('msg').innerHTML = msg;
        }
    };
    xhr.send();
}


function getAllAdmins(baseUrl, isActive) {
    let adminTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            let adminRole = ``;

            for (let index = 0; index < json.allAdmins.length; index++) {
                if (json.allAdmins[index].role == "superAdmin") {
                    adminRole = `<i class="fas fa-user-tie text-success" style="font-size: 30px;"></i>`
                }
                else{
                    adminRole = `<i class="fas fa-user text-info" style="font-size: 30px"></i>`;
                }
                adminTable = adminTable + `<tr>
                                <td class="text-info">${index + 1} -</td>
                                <td>${json.allAdmins[index].firstName} ${json.allAdmins[index].lastName}</td>
                                <td><i class="fas fa-at text-success" style=""></i> ${json.allAdmins[index].userName}</td>
                                <td>${adminRole} ${json.allAdmins[index].role}</td>    
                                <td><button class="btn btn-outline-info" onclick="onUpdate('${json.allAdmins[index]._id}')"><i class="fas fa-pencil-alt"></i> Veiw & Update</button></td>
                                <td><button class="btn btn-outline-danger" id="delete" onclick="deleteAdmin('${json.allAdmins[index]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td>
                            </tr>`;
            }
            numOfPages = json.totalPages;
            if (numOfPages <= 5) {
                for (let i = 1; i <= numOfPages; i++) {
                    if (isActive) {
                        totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#"  style="background-color: #5f6163; color: white;">${i}</a></li>
                        `;
                    }
                    else {
                        totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#" ">${i}</a></li>
                        `;
                    }
                }
            }
            else if (numOfPages > 5) {
                if (currentPage + 4 < numOfPages) {
                    for (let i = currentPage; i <= currentPage + 4; i++) {
                        if (isActive) {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#"  style="background-color: #5f6163; color: white;">${i}</a></li>
                        `;
                        }
                        else {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#" ">${i}</a></li>
                        `;
                        }
                    }
                }
                else if (currentPage + 4 >= numOfPages) {
                    for (let i = currentPage; i <= numOfPages; i++) {
                        if (isActive) {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#"  style="background-color: #5f6163; color: white;">${i}</a></li>
                        `;
                        }
                        else {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#" ">${i}</a></li>
                        `;
                        }
                    }
                }
                else if (currentPage + 4 == numOfPages) {
                    for (let i = currentPage - 4; i < currentPage; i++) {
                        if (isActive) {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#"  style="background-color: #5f6163; color: white;">${i}</a></li>
                        `;
                        }
                        else {
                            totalPages = totalPages + `
                        <li class="page-item" id=${i}><a class="page-link" onclick="paginate(${i})" href="#" ">${i}</a></li>
                        `;
                        }
                    }
                }
            }
        }
        document.getElementById("adminTable").innerHTML = adminTable;
        document.getElementById("totalPages").innerHTML = totalPages;
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function paginate(index) {
    currentPage = index;
    if (currentPage + 3 >= numOfPages) {
        console.log("End of Range");
    }
    else {
        getAllAdmins(`${apiBaseUrl}getAllAdmins/?page=${index}&&size=10`, false);
    }
}


function previousPaginate() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        getAllAdmins(`${apiBaseUrl}getAllAdmins/?page=${currentPage}&&size=10`, false);
    }
    else {
        currentPage = 1;
        getAllAdmins(`${apiBaseUrl}getAllAdmins/?page=${currentPage}&&size=10`, false);
    }
}


function nextPaginate() {
    if (currentPage <= (numOfPages - 5)) {
        currentPage = currentPage + 1;
        getAllAdmins(`${apiBaseUrl}getAllAdmins/?page=${currentPage}&&size=10`, false);
    }
    else if (currentPage + 4 >= numOfPages) {
        console.log("End of Range");
    }
    else {
        currentPage = numOfPages;
        getAllAdmins(`${apiBaseUrl}getAllAdmins/?page=${currentPage}&&size=10`, false);
    }
}


function onUpdate(id) {
    let adminId = id;
    var xhr = new XMLHttpRequest();
    msg = ``;
    var url = `${apiBaseUrl}getAdminById/${adminId}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                localStorage.setItem('firstName', json.admin.firstName);
                localStorage.setItem('lastName', json.admin.lastName);
                localStorage.setItem('userName', json.admin.userName);
                localStorage.setItem('adminRole', json.admin.role);
                localStorage.setItem('adminId', json.admin._id);
                window.location.href = "./updateAdmin.html";

            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                Something went wrong
            </div>`;
            }
        }
    };
    xhr.send();
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

getCurrentAdmin();
getAllAdmins(url, false);