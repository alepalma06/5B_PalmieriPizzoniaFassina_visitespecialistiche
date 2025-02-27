export const createForm = (parentElement) => {
    let dato = {};
    let callback = null;
    let tipo = 1; // Tipo iniziale 
    return {
        setLabels: (labels) => { dato = labels; },
        onsubmit: (callbackInput) => { callback = callbackInput; },
        setType: (tip) => { tipo = tip; },  
        exportDiz: () => {},    
        render: (table1, middleware) => {
            parentElement.innerHTML =
                `<div>Data<br/><input id="data" type="date" class="form-label form-control"/></div>` +
                `<div>Ora<br/><select id="ora" name="ora" class="form-select"><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option></select></div>` +
                `<div>Nome<br/><input id="nome" type="text" class="form-label form-control"/></div>` +
                `<div id="outputform"></div>`;

                document.querySelector("#Prenotabottone").onclick = async () => {
                    const data = document.querySelector("#data").value;
                    const ora = document.querySelector("#ora").value;
                    const nome = document.querySelector("#nome").value;
                    const outputform = document.getElementById("outputform");
                
                    let date = new Date(data);
                    let giornoCorrente = date.getDay();
                
                    if (data === "" || ora === "" || nome === "" || giornoCorrente === 0 || giornoCorrente === 6) {
                        outputform.innerHTML = "KO";
                        console.log("errore dentro if");
                    } else {
                        const datasenzatrattini = data.split("-").join("");
                        const chiave = parseInt(tipo) + "-" + datasenzatrattini + "-" + ora;
                
                        if (dato[chiave]) {
                            outputform.innerHTML = "KO";
                            console.log("errore in datochave");
                        } else {
                            //  dato[chiave] = nome;
                            outputform.innerHTML = "OK";
                
                            const booking = {
                                idType: tipo,  
                                date: data,
                                hour: ora,
                                name: nome
                            };
                            console.log("nuova prenotazione",booking);
                            try {
                                const result = await middleware.add(booking); 
                                console.log("fatto add")
                                if (result.result === "ok") {
                                    outputform.innerHTML = "OK";
                                    console.log("Prenotazione aggiunta")
                                    const updatedData = await middleware.load();
                                    console.log("prenotazioni aggiornate",updatedData)
                                    dato = updatedData;
                                    table1.setData(updatedData);
                                    console.log("fatto setdata")
                                    table1.setTipo(tipo)
                                    console.log("fatto settipo")
                                    table1.render();
                                    console.log("fatto render")
                                    document.querySelector("#data").value = "";
                                    document.querySelector("#ora").value = 8;
                                    document.querySelector("#nome").value = "";
                                    console.log("valori reimpostati")
                                } else {
                                    outputform.innerHTML = "KO";
                                    console.log("errore dentro try");
                                    document.querySelector("#data").value = "";
                                    document.querySelector("#ora").value = 8;
                                    document.querySelector("#nome").value = "";
                                }
                            } catch (error) {
                                outputform.innerHTML = "KO";
                                console.log("errore dentro catch", error);
                                document.querySelector("#data").value = "";
                                document.querySelector("#ora").value = 8;
                                document.querySelector("#nome").value = "";
                            }
                        }
                    }
                };
                

            document.querySelector("#data").value = "";
            document.querySelector("#ora").value = 8;
            document.querySelector("#nome").value = "";
        },
    };
};