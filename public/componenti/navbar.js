export const NavBarComponent = () => {
    let template = `
    <input type="radio" class="btn-check" name="btnradio" value="#TIPO" id="#ID" #CHECKED>
    <label class="btn btn-outline-info btn-lg" for="#ID">#CAT</label>`;
    let parentElement;

    return {
        setParentElement: (pr) => {
            parentElement = pr;
        },
        render: (form, table1, types) => {
            let html = "";
            types.forEach((type, index) => {
                // Creiamo un id unico per ogni tipo di prenotazione
                let radioId = "radio" + type.id;  // Usando l'ID del tipo come ID del radio button
                html += template.replace(/#ID/g, radioId)      // Imposta l'ID del radio
                                .replace("#CAT", type.name)   // Imposta il nome visibile
                                .replace("#TIPO", type.id)   // Imposta il valore dell'input come ID
                                .replace("#CHECKED", index === 0 ? "checked" : "");  // Seleziona il primo di default
            });
            
            parentElement.innerHTML = html;
            
            document.querySelectorAll(".btn-check").forEach((radio) => {
                radio.onclick = () => {
                    const tipoSelezionato = parseInt(radio.value);  // Assicuriamoci che sia un numero (ID del tipo)
                    form.setType(tipoSelezionato);  // Passa l'ID numerico al form
                    console.log("ID passato a form", tipoSelezionato);  // Mostra l'ID passato al form
                    table1.setTipo(tipoSelezionato);  // Passa l'ID numerico alla tabella
                    console.log("ID passato a tabella", tipoSelezionato);  // Mostra l'ID passato alla tabella
                    table1.render();  // Rende la tabella aggiornata con il tipo selezionato
                };
            });
        }
    };
};