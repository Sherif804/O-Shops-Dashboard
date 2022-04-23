let token = localStorage.getItem('token');
let data;

let productName = document.getElementById("productName").value;
let productPrice = document.getElementById("productPrice").value;
let productRate = document.getElementById("productRate");
let productStore = document.getElementById("productStore");
let productCategory = document.getElementById("productCategory");
let productImageURL = document.getElementById("productImageURL");
let inStock = document.getElementById("inStock").checked;
let topProduct = document.getElementById("topProduct").checked;


apiBaseUrl = "https://oshops-app.herokuapp.com/"



function getAllStores() {
    let url = `${apiBaseUrl}getAllStores`;
    let stores = `<option value="" disabled selected>Choose Store...</option>`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                for (let index = 0; index < json.allStores.length; index++) {
                    stores = stores + `
                    <option value="${json.allStores[index].storeName}"  id="${json.allStores[index]._id}">${json.allStores[index].storeName}</option>`;

                }

            }


            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                document.getElementById("msg").innerHTML = msg;
            }
        }
        document.getElementById("productStore").innerHTML = stores;
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function getAllCategories() {
    let url = `${apiBaseUrl}getAllCategories`;
    let categories = `<option value="" disabled selected>Choose Category...</option>`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                for (let index = 0; index < json.allCategories.length; index++) {
                    categories = categories + `
                    <option value="${json.allCategories[index].categoryName}" id="${json.allCategories[index]._id}">${json.allCategories[index].categoryName}</option>`;
                }
            }

            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                document.getElementById("msg").innerHTML = msg;
            }
        }
        document.getElementById("productCategory").innerHTML = categories;
    }
    var data = JSON.stringify({ "token": token });
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


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function getIdOfSelectedOption(optionValue, listId) {
    let optionId;
    for (var option of document.getElementById(listId)) {
        if (option.value == optionValue) {
            optionId = option.id;
        }
    }
    return optionId;
}


productImageURL.addEventListener("change", (e) => {
    productName = document.getElementById("productName").value;
    productPrice = document.getElementById("productPrice").value;
    productRate = document.getElementById("productRate").value;
    productStore = document.getElementById("productStore").value;
    productCategory = document.getElementById("productCategory").value;
    inStock = document.getElementById("inStock").checked;
    topProduct = document.getElementById("topProduct").checked;

    const img = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        data = JSON.stringify({
            "productName": productName,
            "productImageURL": {
                "data": base64String,
                "name": img.name
            },
            "price": productPrice,
            "rate": productRate,
            "storeId": getIdOfSelectedOption(productStore, "productStore"),
            "categoryId": getIdOfSelectedOption(productCategory, "productCategory"),
            "inStock": inStock,
            "topProduct": topProduct,

        });
    }
    reader.readAsDataURL(e.target.files[0]);
})


function addProduct() {
    if (productImageURL.files.length == 0) {
        productName = document.getElementById("productName").value;
        productPrice = document.getElementById("productPrice").value;
        productRate = document.getElementById("productRate").value;
        productStore = document.getElementById("productStore").value;
        productCategory = document.getElementById("productCategory").value;
        inStock = document.getElementById("inStock").checked;
        topProduct = document.getElementById("topProduct").checked;
        data = JSON.stringify({
            "productName": productName,
            "price": productPrice,
            "rate": productRate,
            "storeId": productStore,
            "categoryId": productCategory,
            "inStock": inStock,
            "topProduct": topProduct
        });
    }
    let msg = '';
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}addProduct`;
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
                    location.reload();
                }, 2000);
                document.getElementById('msg').innerHTML = msg;
               
            }
            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                setTimeout(() => {
                    msg = ``;
                    document.getElementById('msg').innerHTML = msg;
                    location.reload();
                }, 2000);
                document.getElementById('msg').innerHTML = msg;
            }
        }
    }
   
    xhr.send(data);
}

getAllStores();
getAllCategories();
getCurrentAdmin();
document.getElementById("saveBtn").addEventListener("click", addProduct);
