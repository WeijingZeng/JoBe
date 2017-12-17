const axios = require('axios');

let exportedMethods = { 
    async get(url){
        try{
              let response =  await axios.get(url);
            console.log(`response to GET ${url} is ${response}`);
            return response;
        }catch(error) {
            console.log("========================Error in the api helper=========================");
            console.log(error);
        };
    },
    async post(url,data){
        if(data == undefined){
            
            console.log("\n=============Response to POST to UNDEIFNED DATA =================\n\n\n\n\n\n");
            return;
        }
        try{
          let response =  await axios.post(url,data);
          console.log("this is the POST data " + data);
          console.log("\n=============Response to POST to "+url+JSON.stringify(data)+" ===========\n\n" + JSON.stringify(response.data)+ "\n\n\n\n\n\n");
          return response;
        }catch(error) {
            console.log("========================Error in the api helper (POST) on "+url+"=========================");
            console.log(error)
        };
    }
}

export default exportedMethods;
