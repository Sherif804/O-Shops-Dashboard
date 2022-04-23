let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
var url = `${apiBaseUrl}getAllStores/?page=1&&size=25`;
let msg = ``;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function deleteStore(id) {
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}deleteStore/${id}`;
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                getAllCategories(`${apiBaseUrl}getAllStores/?page=${currentPage}&&size=25`);
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


function getAllCategories(baseUrl) {
    let storeTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                for (let index = 0; index < json.allStores.length; index++) {
                    storeTable = storeTable + `<tr>
                                    <td class="text-info">${((currentPage - 1) * 25) + (index + 1)} -</td>
                                    <td><i class="fas fa-store text-success" style="font-size: 20px;"></i> ${json.allStores[index].storeName}</td>
                                    <td><img src="${apiBaseUrl}${json.allStores[index].storeLogoURL}" alt="Jumia" width="55px"
                                    height="auto"></td>
                                    <td><i class="fas fa-external-link-alt text-info" style="font-siz: 20px"></i> ${json.allStores[index].website}</td>
                                    <td><i class="fas fa-phone-alt text-success" style="font-siz: 20px"></i> ${json.allStores[index].telephoneNumber}</td>
                                    <td><button class="btn btn-outline-info" onclick="onUpdate('${json.allStores[index]._id}')"><i class="fas fa-pencil-alt"></i> Veiw & Update</button></td>
                                    <td><button class="btn btn-outline-danger" id="delete" onclick="deleteStore('${json.allStores[index]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td>
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
            document.getElementById("storeTable").innerHTML = storeTable;
            document.getElementById("totalPages").innerHTML = totalPages;
        }
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function paginate(index) {
    currentPage = index;
    getAllCategories(`${apiBaseUrl}getAllStores/?page=${index}&&size=25`);
}


function previousPaginate() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        getAllCategories(`${apiBaseUrl}getAllStores/?page=${currentPage}&&size=25`);
    }
    else {
        currentPage = 1;
        getAllCategories(`${apiBaseUrl}getAllStores/?page=${currentPage}&&size=25`);
    }
}


function nextPaginate() {
    if (currentPage <= numOfPages) {
        currentPage = currentPage + 1;
        getAllCategories(`${apiBaseUrl}getAllStores/?page=${currentPage}&&size=25`);
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
    let storeId = id;
    var xhr = new XMLHttpRequest();
    msg = ``;
    var url = `${apiBaseUrl}getStoreById/${storeId}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                console.log(json.store[0].storeName);
                localStorage.setItem('storeName', json.store[0].storeName);
                localStorage.setItem('storeId', json.store[0]._id);
                localStorage.setItem('telephoneNumber', JSON.stringify(json.store[0].telephoneNumber));
                localStorage.setItem('website', json.store[0].website);
                localStorage.setItem('storeCategories', JSON.stringify(json.store[0].storeCategories));
                window.location.href = "./updateStore.html";
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
getAllCategories(url);