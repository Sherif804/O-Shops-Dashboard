
apiBaseUrl = "https://oshops-app.herokuapp.com/"


serverUrl = `https://o-shop.online/html`

function logIn() {
    let uName = document.getElementById("uName").value;
    let uPassword = document.getElementById("uPassword").value;
    let error;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}adminSignIn`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json =  JSON.parse(xhr.responseText);
            if(json.status == 200) {
                error = ``;
                localStorage.setItem("token", json.token)
                window.location.href = `./home.html`;
            }
            else {
                error = `<div id="error" class="alert alert-danger my-2 d-block">${json.message}</div>`
            }
            document.getElementById('alertDiv').innerHTML = error; 
        }
    };

    var data = JSON.stringify({ "userName": uName, "password": uPassword});
    xhr.send(data);
}
document.getElementById("logInButton").addEventListener("click", logIn);
