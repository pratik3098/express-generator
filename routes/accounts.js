var express = require('express');
var router = express.Router();
const Web3 = require('web3'); 
var con= require('../public/javascripts/contract.js');
var Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];
var TestContract = new web3.eth.Contract(con.abi, con.con_address);
var privateKey = new Buffer.from(con.privateKey,"hex");


async function getDefaultFunction(){
    await web3.eth.defaultAccount
}

router.get('/accounts', function(req, res, next) {
    var rawTx = {
        nonce: web3.utils.toHex(2),
        gas: "0x470000",
        to: con.con_address,
        value: '0x00',
        data: TestContract.methods.setStock(web3.utils.fromAscii("Server signed"), 15, 210).encodeABI()
      }
      var tx = new Tx(rawTx);
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log);
});

module.exports = router;
