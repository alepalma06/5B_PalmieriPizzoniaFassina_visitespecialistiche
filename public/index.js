const createMiddleware = () => {
    return {
        load: async () => {
            const response = await fetch("/booking");
            return await response.json();
        },
        delete: async (id) => {
            const response = await fetch("/delete/" + id, {
                method: 'DELETE',
            });
            return await response.json();
        },
        add: async (booking) => {
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
  
  export default createMiddleware;
  
import { tableComponent } from './componenti/tabella.js';
import { NavBarComponent } from './componenti/navbar.js';
import { createForm } from './componenti/form.js';

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

fetch("/types")
  .then(response => response.json())
  .then(types => {
    navBarComp.setParentElement(navbar);
    navBarComp.render(form, table1, types);

    // Carica tutte le prenotazioni
    return middleware.load();
  })
  .then(data => {
    console.log("Dati caricati:", data);
    // Gestisci i dati delle prenotazioni mantenendo idType
    form.setLabels(data);
    console.log("Dati form:", data[0]);
    table1.setData(data);  // Passa tutte le prenotazioni al componente tabella
    table1.setParentElement(tabella);
    table1.render();

    // Gestisci i cambiamenti tra settimane
    precendente.onclick = () => {
      starDay -= 7;
      table1.start(starDay);
      table1.render();
    };

    successiva.onclick = () => {
      starDay += 7;
      table1.start(starDay);
      table1.render();
    };

    // Rende il form per aggiungere prenotazioni
    form.render(table1, middleware);
  })
  .catch(error => console.error("Errore nel caricamento dei dati:", error));
