const SDK = {
    serverURL: "http://localhost:8080/api/",
    request: (options, cb) => {

    let token = SDK.Storage.load("token");


   // I nedenstående linjer foretager vi vores AJAX til serveren

$.ajax({
    url: SDK.serverURL + options.url,
    method: options.method,
    headers: {'Authorization': token}, //headers
    //contentType: "application/json;charset=utf-8",
    accept: "application/json",
    dataType: "json",
    data: JSON.stringify(options.data),
    success: (data, status, xhr) => {
    cb(null, data, status, xhr);
},
error: (xhr, status, errorThrown) => {
    cb({xhr: xhr, status: status, error: errorThrown});
}
});

},
//Alle de funktioner brugeren skal kunne, logge ind og ud

Bruger: {

    current: () => {
        return SDK.Storage.load("users");
    },


    logOut: () => {
        SDK.Storage.remove("token");
        SDK.Storage.remove("id");
        SDK.Storage.remove("username");
        window.location.href = "../login.html";


    },
    login: (username, password, cb) => {

        SDK.request({
            data: {
                username: username,
                password: password
            },
            url: "users/login/",
            method: "POST"

        }, (err, data) => {


            //On login-error
            if (err) return cb(err);
        SDK.Storage.persist("token", SDK.Encryption.encryptDecrypt(data));
        cb(null, data);


    });


    },
    // denne funktion opretter brugere
    createUser: (username, password, cb) => {
        SDK.request({
            data: {
                username: username,
                password: password,
            },
            url: "users/create/",
            method: "POST"
        }, (err, data) => {

            //on submit error
            if (err) return cb(err);

        SDK.Storage.persist("token", SDK.Encryption.encryptDecrypt(data));

        cb(null, data);
    }
    );
    },
},
// Her henter vi mad- og drikkevarene fra databasen
Mad: {
    getMad: (cb) => {
        SDK.request({
            method: "GET",
            url: "food",
        }, (err, food) => {
            if (err) return cb(err);
        cb(null, food)


    }, cb);
    }
},

Drikke: {
    getDrikke: (cb) => {
        SDK.request({
            method: "GET",
            url: "drink",
        }, (err, drink) => {
            if (err) return cb(err);
        cb(null, drink)
    }, cb);
    }
},

Bekraeft: {
    // Dette kald gennemfører køb
    bekraeftProdukt: (date, cb) => {
        SDK.request({
                data: {
                    date: date,
                },
                method: "POST",
                url: "users/order/",
            },
            (err, data) => {

            //On login-error
            if (err) return cb(err);
        cb(null, data);
    }
    );
    },

    //Tilføjer ID til ordren

    orderProductId: (id, products_id, order_id, cb) => {
        SDK.request({
                data: {
                    id: id,
                    products_id: products_id,
                    order_id: order_id,
                },
                method: "POST",
                url: "users/order/",
            },
            (err, data) => {


            //Ved login error
            if (err) return cb(err);


        SDK.Storage.persist("token", SDK.Encryption.encryptDecrypt(data));


        cb(null, data);
    }
    );
    }
},



Encryption: {
    encryptDecrypt(input) {
        let key = ['L', 'O', 'L']; //encryption code
        let output = [];

        for (let i = 0; i < input.length; i++) {
            let charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
            output.push(String.fromCharCode(charCode));
        }
        return output.join("");
    }

},
/*To load the same menu display on each side, expect homepage*/
loadNav: (cb) => {
    $("#nav-container").load("nav.html", () => {
        const currentUser = SDK.User.current();
    if (currentUser) {
        $(".navbar-right").html(`
      
      <li><a href="#" id="logout-link">Logout</a></li>
    `);
    } else {
        $(".navbar-right").html(`
      <li><a href="homepage.html">Logout <span class="sr-only">(current)</span></a></li>
    `);
    }
    $("#logout-link").click(() => SDK.User.logOut());
    cb && cb();
});
},


Storage: {
    prefix: "canteenSDK",
        persist:
    (key, value) => {
        window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load:
        (key) => {
        const val = window.localStorage.getItem(SDK.Storage.prefix + key);
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    },
    remove:
        (key) => {
        window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
}
};
