const axios = require("axios");
const instance = axios.create("http://localhost:5000/");

let ApiHelper = {
    async get(url) {
        console.log("trying to get " + url);
        try{
            return await instance.get(url);
        }catch (e) {
            console.log(e);
        }
    }
}
export default ApiHelper;
