let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
var url = `${apiBaseUrl}getAllCategories/?page=1&&size=25`;
let msg = ``;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function deleteCategory(id) {
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}deleteCategory/${id}`;
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                getAllCategories(`${apiBaseUrl}getAllCategories/?page=${currentPage}&&size=25`);
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
    let categoryTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                for (let index = 0; index < json.allCategories.length; index++) {
                    categoryTable = categoryTable + `<tr>
                                    <td class="text-info">${((currentPage-1)*25)+(index+1)} -</td>
                                    <td><i class="far fa-folder-open text-danger" style="font-size: 25px;"></i> ${json.allCategories[index].categoryName}</td>
                                    <td><img src="${apiBaseUrl}${json.allCategories[index].categoryImageURL}" alt="Jumia" width="55px"
                                    height="auto"></td>
                                    <td><button class="btn btn-outline-info" onclick="onUpdate('${json.allCategories[index]._id}')"><i class="fas fa-pencil-alt"></i> Veiw & Update</button></td>
                                    <td><button class="btn btn-outline-danger" id="delete" onclick="deleteCategory('${json.allCategories[index]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td>
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
            else{
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
            document.getElementById("msg").innerHTML = msg;
            }
            document.getElementById("categoryTable").innerHTML = categoryTable;
            document.getElementById("totalPages").innerHTML = totalPages;
        }
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function paginate(index) {
    currentPage = index;
    getAllCategories(`${apiBaseUrl}getAllCategories/?page=${index}&&size=25`);
}


function previousPaginate() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        getAllCategories(`${apiBaseUrl}getAllCategories/?page=${currentPage}&&size=25`);
    }
    else {
        currentPage = 1;
        getAllCategories(`${apiBaseUrl}getAllCategories/?page=${currentPage}&&size=25`);
    }
}


function nextPaginate() {
    if (currentPage <= numOfPages) {
        currentPage = currentPage + 1;
        getAllCategories(`${apiBaseUrl}getAllCategories/?page=${currentPage}&&size=25`);
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
    let categoryId = id;
    var xhr = new XMLHttpRequest();
    msg = ``;
    var url = `${apiBaseUrl}getCategoryById/${categoryId}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                localStorage.setItem('categoryName', json.category.categoryName);
                localStorage.setItem('categoryId', json.category._id);
                window.location.href = "./updateCategory.html";
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




