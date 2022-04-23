let token = localStorage.getItem("token");
let currentPage = 1;
let numOfPages;
apiBaseUrl = "https://oshops-app.herokuapp.com/";
var url = `${apiBaseUrl}getAllProducts/?page=1&&size=25`;
let msg = ``;


if (token == undefined || token == null) {
    localStorage.clear();
    window.location.href = "../../html/login.html";
}


function deleteProduct(id) {
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}deleteProduct/${id}`;
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                getAllProducts(`${apiBaseUrl}getAllProducts/?page=${currentPage}&&size=25`);
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


function getAllProducts(baseUrl) {
    let productTable = ``;
    let totalPages = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                let isTop;
                let isInStock;
                let rateNum = ``;

                for (let index = 0; index < json.allProducts.length; index++) {
                    if (json.allProducts[index].topProduct) {
                        isTop = `<i class="fas fa-check text-success" style="font-size: 30px"></i>`;
                    } else {
                        isTop = `<i class="fas fa-times text-danger" style="font-size: 30px"></i>`;

                    }
                    if (json.allProducts[index].inStock) {
                        isInStock = `<i class="fas fa-check text-success" style="font-size: 30px""></i>`;
                    } else {
                        isInStock = `<i class="fas fa-times text-danger" style="font-size: 30px"></i>`;

                    }

                    switch (json.allProducts[index].rate) {
                        case 1:
                            rateNum = `<i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>`;
                            break;

                        case 2:
                            rateNum = `<i class="fas fa-star"  style="font-size: larger; color: #FFD700;">
                            </i><i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>`;
                            break;

                        case 3:
                            rateNum = `<i class="fas fa-star"  style="font-size: larger; color: #FFD700;">
                            </i><i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>`;
                            break;

                        case 4:
                            rateNum = `<i class="fas fa-star"  style="font-size: larger; color: #FFD700;">
                            </i><i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>`;
                            break;

                        case 5:
                            rateNum = `<i class="fas fa-star"  style="font-size: larger; color: #FFD700;">
                            </i><i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>
                            <i class="fas fa-star"  style="font-size: larger; color: #FFD700;"></i>`;
                            break;

                        default:
                            break;
                    }
                    let img = "";
                    let isUploaded = json.allProducts[index].productImageURL.split("/")[0];
                    if(isUploaded == "uploads")
                        img = `${apiBaseUrl}${json.allProducts[index].productImageURL}`;
                    else
                        img = `${json.allProducts[index].productImageURL}`;
                    productTable = productTable + `<tr>
                                    <td class="text-info">${((currentPage - 1) * 25) + (index + 1)} -</td>
                                    <td>${json.allProducts[index].productName}</td>
                                    <td><img src="${img}" alt="Product image" width="55px"
                                    height="auto"></td>
                                    <td>${json.allProducts[index].price} <b class="text-success">AED</b></td>
                                    <td>${rateNum}</td>
                                    <td>${isTop}</td>
                                    <td>${isInStock}</td>
                                    <td><button class="btn btn-outline-info" onclick="onUpdate('${json.allProducts[index]._id}')"><i class="fas fa-pencil-alt"></i> Veiw & Update</button></td>
                                    <td><button class="btn btn-outline-danger" id="delete" onclick="deleteProduct('${json.allProducts[index]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td>
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
            document.getElementById("productTable").innerHTML = productTable;
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
        getAllProducts(`${apiBaseUrl}getAllProducts/?page=${currentPage}&&size=25`);
    }
    else {
        currentPage = 1;
        getAllProducts(`${apiBaseUrl}getAllProducts/?page=${currentPage}&&size=25`);
    }
}


function nextPaginate() {
    if (currentPage <= numOfPages) {
        currentPage = currentPage + 1;
        getAllProducts(`${apiBaseUrl}getAllProducts/?page=${currentPage}&&size=25`);
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
    let productId = id;
    var xhr = new XMLHttpRequest();
    msg = ``;
    var url = `${apiBaseUrl}getProductById/${productId}`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
           
            if (json.status == 200) {
                localStorage.setItem('productId', json.product[0]._id);
                localStorage.setItem('productName', json.product[0].productName);
                localStorage.setItem('productPrice', json.product[0].price);
                localStorage.setItem('productRate', JSON.stringify(json.product[0].rate));
                localStorage.setItem('productStoreId', JSON.stringify(json.product[0].storeId));
                localStorage.setItem('productStoreName', JSON.stringify(json.productStoreName[0].storeName));
                localStorage.setItem('productCategoryId', JSON.stringify(json.product[0].categoryId));
                localStorage.setItem('productCategoryName', JSON.stringify(json.productCategoryName[0].categoryName));
                localStorage.setItem('inStock', json.product[0].inStock);
                localStorage.setItem('topProduct', JSON.stringify(json.product[0].topProduct));

                window.location.href = "./updateProduct.html";
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
getAllProducts(url);