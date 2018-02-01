/**
 * Created by yanghang on 2018/1/31.
 */
var web3 = window.web3;
var results;


// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider.
    web3 = new Web3(web3.currentProvider);
    results = {
        web3: web3
    }
} else {
    // Fallback to localhost if no web3 injection. We've configured this to
    // use the development console's port by default.
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');

    web3 = new Web3(provider);

    results = {
        web3: web3
    }
}