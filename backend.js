const Web3 = require("web3");
const Contract = require("./build/Contract.abi.json");
const secrets = require("./secrets.json");
const taken = require("./build/taken.json").taken;
const ids = require("./build/ids.json").ids;
const fs = require("fs");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://:${secrets.secret}@mainnet.infura.io/v3/${secrets.apikey}`
  )
);
const addressFrom = secrets.address;
let contractABI = JSON.parse(Contract.result);
let MyContract = new web3.eth.Contract(
  contractABI,
  "0x25ed58c027921e14d86380ea2646e3a1b5c55a8b",
  { from: addressFrom }
);
let uniqueTaken = taken.filter(unique);

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function notInTaken(value, index, self) {
  return !uniqueTaken.includes(value);
}

async function getOwner(id) {
  return new Promise((resolve, reject) => {
    MyContract.methods
      .ownerOf(id)
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

const available = ids.filter(notInTaken);

let newTaken = false;
for (i = 0; i < 25; i++) {
  let id = available[i];
  console.log("sjekker", id);
  getOwner(id)
    .then((res) => {
      console.log(id, "is now taken by", res);
      taken.push(id);
      newTaken = true;
    })
    .catch((err) => {
      console.error(err.message);
    });
}

if (newTaken) {
  const filteredTaken = taken.filter(unique);
  const data = JSON.stringify({ taken: filteredTaken });
  fs.writeFile("./build/taken.json", data, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
}
