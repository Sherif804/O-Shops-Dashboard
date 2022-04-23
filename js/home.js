let token = localStorage.getItem("token");
apiBaseUrl = "https://oshops-app.herokuapp.com/"

function countData() {
    let countData = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}countUsersCategoriesStores`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            countData = `<div class="cards">
        <div class="card-single">
            <div>
                <h1>${json.allStoresCount}</h1>
                <span>Stores</span>
            </div>
            <div>
                <i class="fas fa-store"></i>
            </div>
        </div>
        <div class="card-single">
            <div>
                <h1>${json.allCategoriesCount}</h1>
                <span>Categories</span>
            </div>
            <div>
                <i class="fas fa-list"></i>
            </div>
        </div>
        <div class="card-single">
            <div>
                <h1>${json.allUersCount}</h1>
                <span>Uers</span>
            </div>
            <div>
                <i class="fas fa-users"></i>
            </div>
        </div>
    </div>`
        }
        document.getElementById("Counter").innerHTML = countData;
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}

function recentStores() {
    let recentStores = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}recentStores`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if(json.message != "There is no stores yet!"){
                for (let index = 0; index < json.recentStores.length; index++) {
                    recentStores = recentStores + `<tr>
                                            <td><i class="fas fa-store" style="font-size: 20px"></i> ${json.recentStores[index].storeName}</td>
                                            <td><img src="${apiBaseUrl}${json.recentStores[index].storeLogoURL}" alt="Jumia" width="55px"
                                                    height="auto"></td>
                                            <td><i class="fas fa-external-link-alt text-info" style="font-siz: 20px"></i> <a href="${json.recentStores[index].website}"
                                                    target="_blank">${json.recentStores[index].website}</a></td>
                                        </tr>`
    
                }
                document.getElementById("recentStores").innerHTML = recentStores;
            }
           
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}

function recentCategories() {
    let recentCategories = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}recentCategories`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            for (let index = 0; index < json.recentCategories.length; index++) {
                recentCategories = recentCategories + `<tr>
                                        <td><img src="${apiBaseUrl}${json.recentCategories[index].categoryImageURL}" alt="Jumia" width="55px"
                                                height="auto"></td>
                                        <td><i class="far fa-folder-open text-danger" style="font-size: 25px;"></i> ${json.recentCategories[index].categoryName}</td>
                                    </tr>`
            }
            document.getElementById("recentCategories").innerHTML = recentCategories;
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}

if (token == undefined || token == null) {
    window.location.href = "../html/login.html";
    localStorage.clear();
}

function logOut() {
    window.location = "../html/login.html";
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
                            <small>${json.userData.role}</small>`
            if (json.userData.role == 'superAdmin') {
                permission = `<a href="./admin/addAdmin.html"><i class="fas fa-user-cog"></i>
                <span>Admins</span>
            </a>`
            }
            document.getElementById("permission").innerHTML = permission;
            document.getElementById("getCurrentAdmin").innerHTML = getCurrentAdmin;
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}

getCurrentAdmin();
countData();
recentStores();
recentCategories();
