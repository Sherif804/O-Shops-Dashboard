let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
apiBaseUrl = "https://oshops-app.herokuapp.com/"
var url = `${apiBaseUrl}getAllAdvertisments/?page=1&&size=25`;
let msg = ``;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function deleteAdvertisment(id) {
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}deleteAdvertisment/${id}`;
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (json.status == 200) {
                getAllAdvertisments(`${apiBaseUrl}getAllAdvertisments/?page=${currentPage}&&size=25`);
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


function getAllAdvertisments(baseUrl) {
    let advertismentTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                let isActive;
               
                for (let index = 0; index < json.allAdvertisments.length; index++) {
                    if (json.allAdvertisments[index].isActive) {
                        isActive = `<i class="fas fa-check text-success" style="font-size: 30px"></i>`;
                    } else {
                        isActive = `<i class="fas fa-times text-danger" style="font-size: 30px"></i>`;

                    }

                    advertismentTable = advertismentTable + `<tr>
                                    <td class="text-info">${((currentPage - 1) * 25) + (index + 1)} -</td>
                                    <td><i class="fas fa-hashtag text-info"></i> ${json.allAdvertisments[index].title}</td>
                                    <td><img src="${apiBaseUrl}${json.allAdvertisments[index].advertismentImageURL}" alt="Jumia" width="55px"
                                    height="auto"></td>
                                    <td>${isActive}</td>
                                    
                                    <td><button class="btn btn-outline-info" onclick="onUpdate('${json.allAdvertisments[index]._id}')"><i class="fas fa-pencil-alt"></i> Veiw & Update</button></td>
                                    <td><button class="btn btn-outline-danger" id="delete" onclick="deleteAdvertisment('${json.allAdvertisments[index]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td>
                                </tr>`;
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
            document.getElementById("advertismentTable").innerHTML = advertismentTable;
            document.getElementById("totalPages").innerHTML = totalPages;
        }
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function paginate(index) {
    currentPage = index;
    getAllProducts(`${apiBaseUrl}getAllProducts/?page=${index}&&size=25`);
}


function previousPaginate() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        getAllAdvertisments(`${apiBaseUrl}getAllAdvertisments/?page=${currentPage}&&size=25`);
    }
    else {
        currentPage = 1;
        getAllAdvertisments(`${apiBaseUrl}getAllAdvertisments/?page=${currentPage}&&size=25`);
    }
}


function nextPaginate() {
    if (currentPage <= numOfPages) {
        currentPage = currentPage + 1;
        getAllAdvertisments(`${apiBaseUrl}getAllAdvertisments/?page=${currentPage}&&size=25`);
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


function onUpdate(id) {
    let advertismentId = id;
    console.log(advertismentId);
    var xhr = new XMLHttpRequest();
    msg = ``;
    var url = `${apiBaseUrl}getAdvertismentById/${advertismentId}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
           
            if (json.status == 200) {
                localStorage.setItem('advertismentId', json.advertisment._id);
                localStorage.setItem('title', json.advertisment.title);
                localStorage.setItem('isActive', JSON.parse(json.advertisment.isActive));
                window.location.href = "./updateAdvertisment.html";
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

getCurrentAdmin();
getAllAdvertisments(url);