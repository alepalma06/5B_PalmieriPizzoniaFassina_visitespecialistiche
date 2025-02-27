const createMiddleware = () => {//crea il middleware
    return {
        load: async () => {//per caricare
            const response = await fetch("/booking");//fa chiamata a tabella booking
            return await response.json();
        },
        delete: async (id) => {//per cancellare ma nn la usiamo
            const response = await fetch("/delete/" + id, {
                method: 'DELETE',
            });
            return await response.json();
        },
        add: async (booking) => {//per inserire nella tabella
            const response = await fetch("/insert", {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ booking: booking })
            });
            return await response.json();
        }
    };
  };
  
  export default createMiddleware;//esporto
//importo i componenti
import { tableComponent } from './componenti/tabella.js';
import { NavBarComponent } from './componenti/navbar.js';
import { createForm } from './componenti/form.js';
//li inizializzo
const tabella = document.getElementById("tabella");
const precendente = document.getElementById("precedente");
const successiva = document.getElementById("successiva");
let starDay = 0;
const navbar = document.getElementById("navbar");
const formElement = document.getElementById("form");

const middleware = createMiddleware();
const navBarComp = NavBarComponent();
const form = createForm(formElement);
const table1 = tableComponent();
//faccio fetch types che si trova nel file server
fetch("/types")
  .then(response => response.json())
  .then(types => {
    navBarComp.setParentElement(navbar);//li passo a navbar
    navBarComp.render(form, table1, types);//faccio la render

    // Carica tutte le prenotazioni
    return middleware.load();
  })
  .then(data => {
    //mostra i dati in console log
    console.log("Dati caricati:", data);
    // Gestisci i dati delle prenotazioni mantenendo idType
    form.setLabels(data);
    table1.setData(data);  // Passa tutte le prenotazioni al componente tabella
    table1.setParentElement(tabella);//imposta dati
    table1.render();//fa render

    // se clicco pulsante precedente
    precendente.onclick = () => {
      starDay -= 7;//sotrae una settimana
      table1.start(starDay);
      table1.render();
    };
    //se clicco pulsanre successivo
    successiva.onclick = () => {
      starDay += 7;//aggiunge una settimana
      table1.start(starDay);
      table1.render();
    };

    // fa render form per aggiungere prenotazioni
    form.render(table1, middleware);
  })
  .catch(error => console.error("Errore nel caricamento dei dati:", error));
