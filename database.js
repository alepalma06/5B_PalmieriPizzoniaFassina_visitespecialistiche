const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));//leggo il conf json
conf.ssl = {
   ca: fs.readFileSync(__dirname + '/ca.pem')//leggo il ca pem
};
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject(err);
         }
         console.log('done');
         resolve(result);
      });
   });
};

const database = {
   createTable: async () => {//creo tabella type nel caso nn esiste
      await executeQuery(`
         CREATE TABLE IF NOT EXISTS type (
         id INT PRIMARY KEY AUTO_INCREMENT,
         name VARCHAR(20) NOT NULL
         )`
      );
      //creo tabella booking se nn esiste
      await executeQuery(`
         CREATE TABLE IF NOT EXISTS booking (
         id INT PRIMARY KEY AUTO_INCREMENT,
         idType INT NOT NULL,
         date DATE NOT NULL,
         hour INT NOT NULL,
         name VARCHAR(50),
         FOREIGN KEY (idType) REFERENCES type(id)
         )`
      );
   },
   //faccio insert nella tabella booking
   insert: async (booking) => {
      let sql = `
         INSERT INTO booking (idType, date, hour, name)
         VALUES (
            '${booking.idType}', 
            '${booking.date}', 
            '${booking.hour}', 
            '${booking.name}')`
      ;
      return await executeQuery(sql);
   },
   delete: (id) => {//delete ma nn viene usato
      let sql = `
        DELETE FROM booking
        WHERE id=${id}`
      ;
      return executeQuery(sql);
   },
   select: async () => {//per date_format va a prendere solamente yy-mm-dd senza andare a prendere tutto il resto che restituisce il formato date
      let sql = `
    SELECT id, idType, DATE_FORMAT(date, '%Y-%m-%d') AS date, hour, name
    FROM booking
`;
      let result = await executeQuery(sql);
  
      if (!result || result.length === 0) {//se non ce niente restituisce vuoto
          return [];
      }
  
      return result;
  },   
   drop: async () => {//cancella completamente i contenuto ma nn la usiamo
      let sql = `
            DROP TABLE IF EXISTS type
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS booking`
           ;
      await executeQuery(sql);
   },
   getTypes: async () => {//seleziona tutto il contenuto della tabella type quindi id e name
      let sql = `SELECT * FROM type;  `
      return await executeQuery(sql);
   }
};

module.exports = database;//esposta database
