
jQuery(document).ready(function () {

    var abi;
    var address;
    var ethprice;
    var tokenUsd = 0.6;
    var urlParams;
    var ethereum = window.ethereum;
    var web3 = window.web3;

    function ethEnabled() {
        if (web3) {
            ethereum.enable();
            return true;
        }
        return false;
    }

    if (typeof (web3) === 'undefined') {
        alert("Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3")
    } else {
        jQuery.getJSON('assets/js/peacockfinance.json', function (data) {
            address = data.caddress;
            abi = data.cabi;

        });

        jQuery("#buyshit").click(function () {
            ;
            buyshit();
        });

        jQuery(".copy").click(function () {
            ;
            copyFun();
        });

        jQuery("#price").html(tokenUsd + ' USD');

        jQuery("#closeresgitro").click(function () {
            jQuery('#resgitro').hide()
            jQuery('.awesome-overlay').hide()
        });

        function openModal() {
            jQuery('#resgitro').show()
            jQuery('.awesome-overlay').show();
            jQuery('#input-subject-upline').val(localStorage.getItem("upline"));
            jQuery('#input-subject').val(ethereum.selectedAddress);
        }


        function buyshit() {
            if (typeof (web3) === 'undefined') {
                alert("Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3")
            }
            else {
                console.log(Number(web3.version.network))
                if (Number(web3.version.network) != 1) {
                    alert("Wrong network detected. Please switch to the Ethereum Main Network");
                }
                else {
                    buyTokens();
                }
            }
        }

        var refarray = [];
        function getLikReferall(wallet) {
            console.log(wallet);
            var reflik = 'https://peacockfinance.org/?ref=' + wallet
            console.log(reflik, 'reflik');
            localStorage.setItem("upline", wallet);
            jQuery('#link').val(reflik);

        }
        function copyFun() {
            /* Get the text field */
            var copyText = document.getElementById("link");

            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/

            /* Copy the text inside the text field */
            document.execCommand("copy");

            /* Alert the copied text */
            alert("Copied the text: " + copyText.value);
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
            myContract.buyTokens(token, { from: ethereum.selectedAddress, gasprice: 100, value: _eth }, function (err, result) {
                if (!err) {
                    alert("Buy Peacock Finance Succes Your Tx Hash : " + result);
                }
                else
                    console.error(err);
            });
        }

        function GetRef() {
            var upline = window.location.search;
            var urlParams = new URLSearchParams(upline);
            var producturi = (urlParams.get('ref')) ? urlParams.get('ref') : "0xEE8Cf459bF6a0DDF3d9446b161ADc58B7A3ABa4b";
            if (localStorage.getItem("referred") !== producturi) {
                localStorage.clear("referred");
            }
            saveUser(producturi);
        }

        function buyTokens() {
            var myContract = web3.eth.contract(abi).at(address);
            var valToken = 0;
            var _eth = 0;
            jQuery.getJSON('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', function (data) {
                var pckf = Number(document.getElementById("pckf").value);
                valToken = tokenUsd * pckf;
                ethprice = data.USD;
                _eth = Number.parseFloat(valToken / ethprice).toFixed(5);
                _eth = _eth * 1e18;
                if (pckf >= 20) {
                    myContract.buyTokens(pckf, { from: ethereum.selectedAddress, gasprice: 100, value: _eth }, function (err, result) {
                        if (!err) {
                            alert("Buy Peacock Finance Succes Your Tx Hash : " + result);
                            console.log(result);
                            var rewardPcfk = pckf * 5 / 100;
                            saveRef();
                            saveGan(rewardPcfk);
                            //openModal();
                        }
                        else
                            alert(err.message);
                    });
                } else {
                    alert("The minimum purchase is 20 PCKF: ");
                }
            });
        }
        function saveUser() {
            if (!localStorage.getItem("myWallet")) {
                var body = {
                    wallet: ethereum.selectedAddress,
                    email: "",
                    telegram: ""
                }
                jQuery.ajax({
                    url: "https://peacockfinance.herokuapp.com/usuarios",
                    type: "POST",
                    accept: "application/json",
                    data: body,
                    dataType: "json",
                    success: function (response) {
                        var resp = JSON.parse(response)
                        localStorage.setItem("myWallet", ethereum.selectedAddress)
                    },
                    error: function (xhr, status) {
                        if (xhr.responseJSON.message.indexOf("ER_DUP_ENTRY")) {
                            alert('You are already a registered user')
                        } else {
                            console.log(xhr.responseJSON.message, status)
                        }
                    }
                });
            }

        }
        function saveRef() {
            jQuery.post("https://peacockfinance.herokuapp.com/referidos",
                {
                    wallet: ethereum.selectedAddress,
                    walletref: localStorage.getItem('referred')
                },
                function (data, status) {
                    alert("Data: " + data + "\nStatus: " + status);
                });
        }
        function saveGan(val) {
            jQuery.post("https://peacockfinance.herokuapp.com/ganancias",
                {
                    wallet: localStorage.getItem('referred'),
                    pckf: val,
                },
                function (data, status) {
                    alert("Data: " + data + "\nStatus: " + status);
                });
        }
        function getGanancia(val) {
            jQuery.get("https://peacockfinance.herokuapp.com/ganancias",
                function (data, status) {
                   console.log(data,status)
                });
        }

        setTimeout(() => {
            ethEnabled();
            viewSaldo();
            GetRef();

        }, 200);

    }
});