const mongoose = require('mongoose');
let connection = null;

async function connect(){
    try {
        connection = await mongoose.connect('mongodb+srv://computehub:pRV17marYSO2HxKh@computehub.pkauzod.mongodb.net/ComputeHub?retryWrites=true&w=majority')
        console.log("Connection successful!");
    } catch (error) {
        console.error("Connection failed\n", error);
    }
}

function getConn(){
    return connection;
}

module.exports = {connect, getConn}