//opret bruger funktion

$("#opretbruger-knap").on('click', () => {

    let username = $("#inputUsername").val();
    let password = $("#inputPassword").val();

    SDK.Bruger.createUser(username, password, (err, data) => {
        if (err && err.xhr.status === 401) {
            $(".form-group").addClass("has-error");
        } else {
            window.alert("Tillykke, du er oprettet!");
            window.location.href = "shop.html";

        }
    })
});