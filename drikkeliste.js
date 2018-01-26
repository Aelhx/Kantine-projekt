$ (document).ready(() => {
    const drikkeliste = $("#drikkeliste");

    //Metoden her henter listen med drikke

    SDK.Drikke.getDrikke((err, data) => {
        let drikke = JSON.parse(SDK.Encryption.encryptDecrypt(data));
        drikke.forEach(drik => {
            drikkeliste.append(`
           <tr>
           <td>${drik.productName}</td> 
           <td>${drik.productPrice}</td>
           <td><input type="date" class="form-control" id="inputDato" placeholder="dato"></td>
           <td><button class="btn btn-success bekraeftknap" data-order-id="${drik.id}">Bestil</button></td>
           </tr> 
        `)

        })
        $(".bekraeftknap").click(function () {
            const dato = $("#inputDato").val();
            SDK.Bekraeft.bekraeftProdukt(dato, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error");

                }
                else if (err) {
                    window.alert("Noget gik galt - prøv igen")

                } else {
                    window.alert("Din ordrer er modtaget")

                }

            })
        })
    })
});