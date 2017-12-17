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
        try{
          let response =  await axios.post(url,data);
          console.log("\n=============Response to POST to "+url+" ===========\n\n" + JSON.stringify(response.data)+ "\n\n\n\n\n\n");
          return response;
        }catch(error) {
            console.log("========================Error in the api helper (POST) on "+url+"=========================");
            console.log(error)
        };
    }
}

export default exportedMethods;
