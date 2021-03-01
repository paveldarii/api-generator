const util = require("util");
const fs = require("fs");
const jobs = require("./jobs.json");
const writeFileAsync = util.promisify(fs.writeFile);
const https = require("https");
var employeesApi = [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateRandomJob(list) {
  return list[getRandomInt(0, list.length)];
}

//if you use this application, you need to wait a couple minutes until your list of api is generated
// because if we don't use setInterval the api server will respond with an error

// also, here are not used the best practices to generate a json file because of lack of time to work on this.
async function generateApiList(apiUrl, numberOfObj) {
  let timer = await setInterval(function () {
    https.get(apiUrl, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        if (employeesApi.length >= numberOfObj) {
          clearInterval(timer);
        }
        let peopleData = JSON.parse(data);
        peopleData.job = generateRandomJob(jobs);
        employeesApi.push(peopleData);
        console.log("pending");
        writeFileAsync(
          "./generated-api/employees.json",
          JSON.stringify(employeesApi)
        );
      });
    });
  }, 3000);
}

generateApiList(
  "https://randomuser.me/api/?inc=gender,name,location,email,%20phone,picture",
  30
);
