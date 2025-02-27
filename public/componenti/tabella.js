export const tableComponent = () => {
    let data = [];//lista che contiene i dati che richiede
    let tipo = 1; //imposta il tipo per la navbar come predefinito
    let PrecedenteSuccessiva = 0;
    //crea il template della tabella
    let templateGiorni = `
        <tr class="tbl1">
            <td></td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
        </tr>
    `;
    let parentElement;

    return {
        setData: (dato) => { 
            data = dato; 
        },
        setParentElement: (pr) => {
            parentElement = pr;
        },
        start: (startday) => { 
            PrecedenteSuccessiva = startday; 
        },
        setTipo: (tip) => { 
            tipo = tip; 
        },
        render: () => {
            const exportData = (date) => {
                let d = date.getDate().toString().padStart(2, '0');//prende il giorno e aggiunge lo 0 nel caso sia da 1 a 9
                let m = (date.getMonth() + 1).toString().padStart(2, '0');//prende il mese e aggiunge lo 0 nel csaso sia da 1 a 9
                let y = date.getFullYear();//prende anno
                return `${y}-${m}-${d}`;//formatta tutto insieme
            };

            const lisSett = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];//lista dei giorni della settimana che compaiono nella tabella
            const ore = [8, 9, 10, 11, 12];//orari che compaiono nella colonna delle ore
            let html = templateGiorni;
            let date = new Date();//prende la data di oggi
            let giornoCorrente = date.getDay() - PrecedenteSuccessiva;

            if (giornoCorrente === 6) {//controlla se è sabato 
                date.setDate(date.getDate() + 2);//e nel cso aggiunge due per arrivare a lunedi
            } else if (giornoCorrente === 0) {//controlla se è domenica
                date.setDate(date.getDate() + 1);//e nel caso aggiunge uno per arrivare a lunedi
            } else {
                date.setDate(date.getDate() - (giornoCorrente - 1));
            }

            lisSett.forEach((day, index) => {//scorre la lista dei giorni della settimana 
                let giornoTab = `${day}<br>${exportData(date)}`;//e aggiunge a capo del giorno della settimana il numero del giorno
                html = html.replace("#D", giornoTab);
                date.setDate(date.getDate() + 1);
            });

            date.setDate(date.getDate() - 5);

            ore.forEach(ora => {
                html += `<tr class="tbl1"><td>${ora}</td>`;
                let tempDate = new Date(date);

                for (let i = 0; i < lisSett.length; i++) {
                    let giorno = exportData(tempDate);
                    
                    const filteredData = data.filter(booking => //filtra i dati delle prenotazioni
                        booking.idType == tipo && booking.date === giorno && booking.hour == ora//controllando solo quelli che hanno tipo data e ora uguali
                    );

                    if (filteredData.length > 0) {//se esiste qualcosa
                        html += `<td class="table-info">${filteredData[0].name}</td>`;//li aggiunge nella taeblla 
                    } else {
                        html += `<td></td>`;//nel caso mette la cella vuota
                    }

                    tempDate.setDate(tempDate.getDate() + 1);
                }

                date.setDate(date.getDate() - 5);
                html += `</tr>`;
            });

            parentElement.innerHTML = html;
        }
    };
};
