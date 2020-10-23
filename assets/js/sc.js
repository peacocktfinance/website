
jQuery(document).ready(function(){

    var abi;
    var address;
    var ethprice;
    var tokenUsd = 0.6;
    var urlParams;

    if (typeof(web3) === 'undefined') {
        alert("Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3")
       }else{
    console.log('ppppp')
    jQuery.getJSON('assets/js/peacockfinance.json', function (data) {
        address = data.caddress;
        abi = data.cabi;
    });
    
    jQuery("#buyshit").click(function(){
        console.log('okokoko');
        buyshit();
      });
      
     
    
    async function buyshit() {
        console.log('okokoko')
    
        if (typeof(web3) === 'undefined') {
         alert("Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3")
        }
        else {
            console.log(Number(web3.version.network) )
            if (Number(web3.version.network) != 1) {
                alert("Wrong network detected. Please switch to the Ethereum Main Network");
            }
            else {
                buyTokens();
                function buyTokens() {
                    var myContract = web3.eth.contract(abi).at(address);
                    var valToken = 0;
                    var _eth = 0;
                    jQuery.getJSON('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', function (data) {
                        var pckf = document.getElementById("pckf").value;
                        valToken = tokenUsd * pckf;
                        ethprice = data.USD;
                        _eth = Number.parseFloat(valToken / ethprice).toFixed(5);
                        console.log(_eth, '_eth');
                        console.log(valToken, 'valToken');
                        _eth = _eth * 1e18;
                        console.log(_eth, '_eth');
                        myContract.buyTokens.estimateGas(valToken, { from: ethereum.selectedAddress, value: _eth }, function (err, result) {
                            if (!err) {
                                var _gas = result + 1000;
                                myContract.buyTokens(valToken, { from: ethereum.selectedAddress, gas: _gas, value: _eth }, function (err, result) {
                                    if (!err) {
                                        document.getElementById("popmsg").innerHTML = "Buy Peacock Finance Succes Your Tx Hash : " + result;
                                        modal.style.display = "inline-block";
                                        console.log(result);
                                        var rewardPcfk = valToken * 5 / 100;
                                        withdrawReward(rewardPcfk, ethereum.selectedAddress);
                                    }
                                    else
                                        console.error(err);
                                });
                            }
                            else
                                console.error(err);
                        });
                    });
                }
    
            }
        }
    }
    
    var refarray = [];
    function getLikReferall(wallet) {
        console.log(wallet);
        var reflik = 'https://peacockfinance.org/?ref=' + wallet
        console.log(reflik, 'reflik');
        localStorage.setItem("upline", wallet);
    
    }
    function withdrawReward(reward, wallet) {
        refarray.push({
            "referred": localStorage.getItem("referred"),
            "wallet": wallet,
            "date": Date.now(),
            "reward": reward
        });
        console.log('reward', reward);
        console.log('refarray', refarray);
        localStorage.setItem("reward", JSON.stringify(refarray));
    }
    function withdraw() {
        var x = localStorage.getItem("reward");
        var array = JSON.parse(x);
        var task_names = 0;
        array.map(function (task, index, array) {
            task_names += task.reward;
        });
        GetTokens(task_names);
    }
    
    function viewSaldo() {
        if (web3.version.network != 1) {
          alert("Wrong network detected. Please switch to the Ethereum Main Network");
        }
    
        var myContract = web3.eth.contract(abi).at(address);
    
    
        myContract.totalSupply(function (err, result) {
            console.log('err', err)
            console.log('tokenOwner', result)
        })
    
        myContract.balanceOf(ethereum.selectedAddress, function (err, result) {
            console.log('err', err)
            console.log('balanceOf', result)
        })
        myContract.allowance('0xEE8Cf459bF6a0DDF3d9446b161ADc58B7A3ABa4b', ethereum.selectedAddress, function (err, result) {
            console.log('err', err)
            console.log('balanceOf', result)
        })
        getLikReferall(ethereum.selectedAddress);
    
    }
    function GetTokens(token) {
        var myContract = web3.eth.contract(abi).at(address);
        var _eth = 0.001 * 1e18;
        myContract.buyTokens.estimateGas(token, { from: ethereum.selectedAddress, value: _eth }, function (err, result) {
            if (!err) {
                var _gas = result + 1000;
                myContract.buyTokens(token, { from: ethereum.selectedAddress, gas: _gas, value: _eth }, function (err, result) {
                    if (!err) {
                        alert( "Buy Peacock Finance Succes Your Tx Hash : " + result);
    
                        console.log(result);
                    }
                    else
                        console.error(err);
                });
            }
            else
                console.error(err);
        });
    }
    
    function GetRef(){
        var upline= window.location.search;
        var urlParams = new URLSearchParams(upline);
        var producturi = urlParams.get('ref');
        if(producturi){
            localStorage.setItem("referred", producturi);
        }
    }
    
    setTimeout(() => {
        viewSaldo();
         ethereum.enable();
    }, 400);
}
    });