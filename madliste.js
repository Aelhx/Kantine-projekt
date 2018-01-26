$ (document).ready(() => {
    const madliste = $("#madliste");

    //Metoden her henter listen med mad

    SDK.Mad.getMad((err, data) => {
        let mader = JSON.parse(SDK.Encryption.encryptDecrypt(data));
        mader.forEach(mad => {
            madliste.append(`
           <tr>
           <td>${mad.productName}</td> 
           <td>${mad.productPrice}</td>
           <td><input type="date" class="form-control" id="inputDato" placeholder="dato"></td>
           <td><button class="btn btn-success bekraeftknap" data-order-id="${mad.id}">Bestil</button></td>
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