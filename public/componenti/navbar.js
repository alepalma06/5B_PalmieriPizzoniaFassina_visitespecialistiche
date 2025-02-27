export const NavBarComponent = () => {
    //creo il template della navbar
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
                // Creiamo id unico per ogni prenotazione
                let radioId = "radio" + type.id;  // creo id
                html += template.replace(/#ID/g, radioId)//lo imposto come id
                                .replace("#CAT", type.name)// Imposta il nome 
                                .replace("#TIPO", type.id)// Imposta il valore che passa usando id
                                .replace("#CHECKED", index === 0 ? "checked" : "");// Seleziona il primo di default
            });
            
            parentElement.innerHTML = html;
            
            document.querySelectorAll(".btn-check").forEach((radio) => {
                radio.onclick = () => {//per ogni radio associo un onclick per gesite passaggio di a tabella e fomr
                    const tipoSelezionato = parseInt(radio.value);  // Assicuriamoci che sia un numero ID del tipo per fare in mod che nn ci sia l errore
                    form.setType(tipoSelezionato);  // Passa di numerico al form
                    console.log("ID passato a form", tipoSelezionato);  // mostra l'ID passato al form in console log
                    table1.setTipo(tipoSelezionato);  // Passa id numerico alla tabella
                    console.log("ID passato a tabella", tipoSelezionato);  // Mostra l'ID passato alla tabella
                    table1.render();  // Rende la tabella aggiornata con il tipo selezionato che gli passa
                };
            });
        }
    };
};