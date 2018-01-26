$ (document).ready (() => {

    //angiver at der skal ske noget når vi trykker på knappen
    $("#login-knap").on("click", () => {

        let username = $("#inputUsername").val();
        let password = $("#inputPassword").val();

        SDK.Bruger.login(username, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");

            } else {
                window.location.href = "shop.html";
            }

        })
    })
});