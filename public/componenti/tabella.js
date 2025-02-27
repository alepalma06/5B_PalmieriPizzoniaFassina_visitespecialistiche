export const tableComponent = () => {
    let data = [];
    let tipo = 1; 
    let PrecedenteSuccessiva = 0;
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
                let d = date.getDate().toString().padStart(2, '0');
                let m = (date.getMonth() + 1).toString().padStart(2, '0');
                let y = date.getFullYear();
                return `${y}-${m}-${d}`;
            };

            const lisSett = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];
            const ore = [8, 9, 10, 11, 12];
            let html = templateGiorni;
            let date = new Date();
            let giornoCorrente = date.getDay() - PrecedenteSuccessiva;

            if (giornoCorrente === 6) {
                date.setDate(date.getDate() + 2);
            } else if (giornoCorrente === 0) {
                date.setDate(date.getDate() + 1);
            } else {
                date.setDate(date.getDate() - (giornoCorrente - 1));
            }

            lisSett.forEach((day, index) => {
                let giornoTab = `${day}<br>${exportData(date)}`;
                html = html.replace("#D", giornoTab);
                date.setDate(date.getDate() + 1);
            });

            date.setDate(date.getDate() - 5);

            ore.forEach(ora => {
                html += `<tr class="tbl1"><td>${ora}</td>`;
                let tempDate = new Date(date);

                for (let i = 0; i < lisSett.length; i++) {
                    let giorno = exportData(tempDate);
                    
                    const filteredData = data.filter(booking => 
                        booking.idType == tipo && booking.date === giorno && booking.hour == ora
                    );

                    if (filteredData.length > 0) {
                        html += `<td class="table-info">${filteredData[0].name}</td>`;
                    } else {
                        html += `<td></td>`;
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
