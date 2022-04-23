let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
var url = `${apiBaseUrl}getAllUsers/?page=1&&size=25`;
let msg = ``;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function getAllUsers(baseUrl) {
    let userTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (xhr.status == 200) {
                let userImge = ``;
                for (let index = 0; index < json.allUsers.length; index++) {

                    if(json.allUsers[index].profilePictureURL == null || json.allUsers[index].profilePictureURL == undefined){
                        userImge = `<i class="fas fa-user-lock text-danger" style="font-size: 35px"></i>`;
                    }
                    else{
                        userImge = `<img src="${apiBaseUrl}${json.allUsers[index].profilePictureURL}" alt="null" width="55px"
                        height="auto">`;
                    }

                    userTable = userTable + `<tr>
                                    <td class="text-info">${((currentPage - 1) * 25) + (index + 1)} -</td>
                                    <td><i class="fas fa-user-tie text-info" style="font-size: 25px"></i> ${json.allUsers[index].firstName} ${json.allUsers[index].lastName}</td>
                                    <td>${userImge}</td>
                                    <td><i class="fas fa-at text-success" style="font-size: 20px"></i> ${json.allUsers[index].email}</td>
                                    <td><i class="fas fa-map-marker-alt text-danger" style="font-size: 20px"></i> ${json.allUsers[index].address}</td></tr>`;

                }
                numOfPages = json.totalPages;
                if (numOfPages <= 5) {
                    for (let i = 1; i <= numOfPages; i++) {
                        if (currentPage == i) {
                            totalPages = totalPages + `
                            <li class="page-item" id=${i}><a class="page-link  bg-info text-white" onclick="paginate(${i})" href="#">${i}</a></li>
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
                            if (currentPage == i) {
                                totalPages = totalPages + `
                            <li class="page-item" id=${i}><a class="page-link  bg-info text-white" onclick="paginate(${i})" href="#">${i}</a></li>
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
                            if (currentPage == i) {
                                totalPages = totalPages + `
                            <li class="page-item" id=${i}><a class="page-link bg-info text-white" onclick="paginate(${i})" href="#">${i}</a></li>
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
                            if (currentPage == i) {
                                totalPages = totalPages + `
                            <li class="page-item" id=${i}><a class="page-link bg-info text-white" onclick="paginate(${i})" href="#">${i}</a></li>
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
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                document.getElementById("msg").innerHTML = msg;
            }
            document.getElementById("userTable").innerHTML = userTable;
            document.getElementById("totalPages").innerHTML = totalPages;
        }
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function paginate(index) {
    currentPage = index;
    getAllUsers(`${apiBaseUrl}getAllUsers/?page=${index}&&size=25`);
}


function previousPaginate() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        getAllUsers(`${apiBaseUrl}getAllUsers/?page=${currentPage}&&size=25`);
    }
    else {
        currentPage = 1;
        getAllUsers(`${apiBaseUrl}getAllUsers/?page=${currentPage}&&size=25`);
    }
}


function nextPaginate() {
    if (currentPage <= numOfPages) {
        currentPage = currentPage + 1;
        getAllUsers(`${apiBaseUrl}getAllUsers/?page=${currentPage}&&size=25`);
    }
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
                permission = `<a href="./admin.html"><i class="fas fa-user-cog"></i>
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
getAllUsers(url);