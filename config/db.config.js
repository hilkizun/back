const mongoose = require('mongoose');

const DB_NAME = 'dupidu';
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_URI = `${URI}/${DB_NAME}`;


mongoose.connect(DB_URI)
    .then(() => console.info('Te has conectado, primo'))
    .catch((error) => {
        console.error('No se ha podido, primo', error);
        process.exit(0);
    })

process.on('SGINIT' , () => {
    mongoose.connection.close()
        .then(function () {
            console.log('Mongoose se ha desconectado');
            process.exit(0);
        })
});