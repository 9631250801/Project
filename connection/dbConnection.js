const mongoose = require("mongoose");
const dbName = "M1";
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true}, (connectionError, connectionResult)=>{
    if(connectionError){
        console.log(`DB "${dbName}" is not connected `);
    } else{
        console.log(`DB "${dbName}" has been connected successfully`);
    }
});