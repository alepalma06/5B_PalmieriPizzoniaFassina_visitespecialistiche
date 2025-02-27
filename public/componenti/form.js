export const createForm = (parentElement) => {
    let dato = {};//lista che contiene i dati
    let callback = null;
    let tipo = 1; // Tipo iniziale che passa la navbar
    return {
        setLabels: (labels) => { dato = labels; },
        onsubmit: (callbackInput) => { callback = callbackInput; },
        setType: (tip) => { tipo = tip; },  
        exportDiz: () => {},    
        render: (table1, middleware) => {//creo la form che si vede nella modale 
            parentElement.innerHTML =
                `<div>Data<br/><input id="data" type="date" class="form-label form-control"/></div>` +
                `<div>Ora<br/><select id="ora" name="ora" class="form-select"><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option></select></div>` +
                `<div>Nome<br/><input id="nome" type="text" class="form-label form-control"/></div>` +
                `<div id="outputform"></div>`;

                document.querySelector("#Prenotabottone").onclick = async () => {//quando premo il bottone per prenotare
                    const data = document.querySelector("#data").value;//legge il valore di data
                    const ora = document.querySelector("#ora").value;//legge il valore id ora
                    const nome = document.querySelector("#nome").value;//legge il valore di nome
                    const outputform = document.getElementById("outputform");//leggo output form che mostra ok o ko
                
                    let date = new Date(data);
                    let giornoCorrente = date.getDay();
                
                    if (data === "" || ora === "" || nome === "" || giornoCorrente === 0 || giornoCorrente === 6) {//controllo se inserisco tutti i valori e se è sabato o domenica
                        outputform.innerHTML = "KO";//mostro errore in outputform
                        console.log("errore dentro if");
                    } else {//altrimenti
                        const datasenzatrattini = data.split("-").join("");
                        const chiave = parseInt(tipo) + "-" + datasenzatrattini + "-" + ora;
                
                        if (dato[chiave]) {
                            outputform.innerHTML = "KO";
                            console.log("errore in datochave");
                        } else {
                            //  dato[chiave] = nome;
                            outputform.innerHTML = "OK";
                            //creo dizionario con i valori che passa sia la form che la navbar
                            const booking = {
                                idType: tipo,  
                                date: data,
                                hour: ora,
                                name: nome
                            };
                            console.log("nuova prenotazione",booking);//mostro la nuova prenotazione in console loge
                            try {
                                const result = await middleware.add(booking); //faccio add 
                                console.log("fatto add")
                                if (result.result === "ok") {//se risultato è ok
                                    outputform.innerHTML = "OK";//mostro ok in outputform
                                    console.log("Prenotazione aggiunta")
                                    const updatedData = await middleware.load();//faccio una chiamata per prendere i dati
                                    console.log("prenotazioni aggiornate",updatedData)
                                    dato = updatedData;
                                    table1.setData(updatedData);//li passo alla tabella
                                    console.log("fatto setdata")
                                    table1.setTipo(tipo)//passo nuovamente tipo alla tabella
                                    console.log("fatto settipo")
                                    table1.render();//faccio la render
                                    console.log("fatto render")
                                    document.querySelector("#data").value = "";//imposto i valori vuoti 
                                    document.querySelector("#ora").value = 8;
                                    document.querySelector("#nome").value = "";
                                    console.log("valori reimpostati")
                                } else {//nel caso sia errore
                                    outputform.innerHTML = "KO";//mostro ko
                                    console.log("errore dentro try");
                                    document.querySelector("#data").value = "";//azzero i campi
                                    document.querySelector("#ora").value = 8;
                                    document.querySelector("#nome").value = "";
                                }
                            } catch (error) {
                                outputform.innerHTML = "KO";//nel caso nn riece ad aggiungere
                                console.log("errore dentro catch", error);
                                document.querySelector("#data").value = "";//azzero i campi
                                document.querySelector("#ora").value = 8;
                                document.querySelector("#nome").value = "";
                            }
                        }
                    }
                };
                

            document.querySelector("#data").value = "";//azzero i campi nuovamente 
            document.querySelector("#ora").value = 8;
            document.querySelector("#nome").value = "";
        },
    };
};