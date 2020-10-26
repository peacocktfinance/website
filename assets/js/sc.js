
jQuery(document).ready(function () {

    var abi;
    var address;
    var ethprice;
    var tokenUsd = 0.6;
    var urlParams;
    var ethereum = window.ethereum;
    var web3 = window.web3;
    var profitPckf = 0;
    var producturi = null;

    function ethEnabled() {
        if (web3) {
            ethereum.enable();
            return true;
        }
        return false;
    }

    if (typeof (web3) === 'undefined') {
        swal({
            title: 'Error',
            text: "Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3",
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-info'
        })
    } else {
        jQuery.getJSON('assets/js/peacockfinance.json', function (data) {
            address = data.caddress;
            abi = data.cabi;

        });

        jQuery("#buyshit").click(function () {
           
            buyshit();
        });

        jQuery(".copy").click(function () {
            
            copyFun();
        });

        jQuery("#price").html(tokenUsd + ' USD');

        jQuery("#closeresgitro").click(function () {
            jQuery('#resgitro').hide()
            jQuery('.awesome-overlay').hide()
        });
        jQuery('#getprofits').click(function () {
            withdraw();
        });
        
        jQuery('#staking').click(function () {
            openModal();
        });
        jQuery('#input-submit').click(function () {
            jQuery('#resgitro').hide()
            jQuery('.awesome-overlay').hide();
            UpdayeUser();

        });


        

        function openModal() {
            jQuery('#resgitro').show()
            jQuery('.awesome-overlay').show();
            jQuery('#input-subject-upline').val(localStorage.getItem("upline"));
            jQuery('#input-subject').val(ethereum.selectedAddress);
        }


        function buyshit() {
            if (typeof (web3) === 'undefined') {
                swal({
                    title: 'Error',
                    text: "Unable to find web3. Please run MetaMask or TrustWallet App (or something else that injects web3",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-info'
                })
            }
            else {
                console.log(Number(web3.version.network))
                if (Number(web3.version.network) != 1) {
                    swal({
                        title: 'Error',
                        text: "Wrong network detected. Please switch to the Ethereum Main Network",
                        type: 'error',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-info'
                    })
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
        
            swal({
                title: 'Info',
                text: 'Copied the text,'+ copyText.value,
                type: 'info',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-info'
            })
        }

        function withdraw() {
           var prod =  Number(jQuery('#pcfks').text());
            GetTokens(prod);
        }

        function viewSaldo() {
            if (web3.version.network != 1) {
                swal({
                    title: 'Error',
                    text: "Wrong network detected. Please switch to the Ethereum Main Network",
                    type: 'error',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-info'
                })
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
                    swal({
                        title: 'Info',
                        text: "Buy Peacock Finance Succes Your Tx Hash : " + result,
                        type: 'info',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-info'
                    });

                }
                else
                    console.error(err);
            });
        }

        function GetRef() {
            var upline = window.location.search;
            var urlParams = new URLSearchParams(upline);
             producturi = urlParams.get('ref');
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
                           

                            swal({
                                title: 'Success',
                                text: 'Buy Peacock Finance Succes Your Tx Hash ,'+ result,
                                type: 'success',
                                buttonsStyling: false,
                                confirmButtonClass: 'btn btn-info'
                            })
                    
                            var rewardPcfk = pckf * 5 / 100;
                            saveRef();
                            saveGan(rewardPcfk);
                            //openModal();
                        }
                        else
                          
                            swal({
                                title: 'Error',
                                text: err.message,
                                type: 'error',
                                buttonsStyling: false,
                                confirmButtonClass: 'btn btn-info'
                            })
                    
                    });
                } else {
                   
                    swal({
                        title: 'Error',
                        text: "The minimum purchase is 20 PCKF",
                        type: 'error',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-info'
                    })
                }
            });
        }
        function UpdayeUser() {
            
                var body = {
                    wallet: ethereum.selectedAddress,
                    email: jQuery('#input-email').val(),
                    telegram: jQuery('#input-name').val()
                }
                jQuery.ajax({
                    url: "https://peacockfinance.herokuapp.com/usuarios/"+ethereum.selectedAddress,
                    type: "PUT",
                    accept: "application/json",
                    data: body,
                    dataType: "json",
                    success: function (response) {
                        var resp = JSON.parse(response)
                        localStorage.setItem("myWallet", ethereum.selectedAddress)
                    },
                    error: function (xhr, status) {
                        if (xhr.responseJSON.message.indexOf("ER_DUP_ENTRY")) {
                            swal({
                                title: 'Error',
                                text: "You are already a registered user",
                                type: 'error',
                                buttonsStyling: false,
                                confirmButtonClass: 'btn btn-info'
                            })
                        } else {
                            console.log(xhr.responseJSON.message, status)
                        }
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
                            swal({
                                title: 'Error',
                                text: "You are already a registered user",
                                type: 'error',
                                buttonsStyling: false,
                                confirmButtonClass: 'btn btn-info'
                            })
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
                    wallet:  localStorage.getItem('referred') ?localStorage.getItem('referred') : producturi,
                    walletref: ethereum.selectedAddress,
                },
                function (data, status) {
                    alert("Data: " + data + "\nStatus: " + status);
                    swal({
                        title: 'Success',
                        text: "Data: " + data + "\nStatus: " + status,
                        type: 'Success',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-info'
                    })
                });
        }
        function saveGan(val) {
            jQuery.post("https://peacockfinance.herokuapp.com/ganancias",
                {
                    wallet: localStorage.getItem('referred') ? localStorage.getItem('referred') : producturi,
                    pckf: val,
                },
                function (data, status) {
             
                    swal({
                        title: 'Success',
                        text: "Data: " + data + "\nStatus: " + status,
                        type: 'Success',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-info'
                    })
                });
        }
        function saveRet(pckf,hash) {
            jQuery.post("https://peacockfinance.herokuapp.com/retiros",
            {
                "pckf": pckf,
                "wallet": ethereum.selectedAddress,
                "hash": "",
                "estado": 1
            },
                function (data, status) {
                    getRet();
                });
        }
        function getRet() {
            jQuery.get("https://peacockfinance.herokuapp.com/retiros/"+ethereum.selectedAddress,
                function (data, status) {
                profitPckf = data.pckf;
               
                console.log('getRet',data.pckf)
           
                   
                });
        }
        function getGanancia() {
            jQuery.get("https://peacockfinance.herokuapp.com/ganancias-wallet/"+ethereum.selectedAddress,
                function (data, status) {
                    
                    if(data.pckfprofit === 0){
                        jQuery('#pcfks').html(0);
                        jQuery('#getprofits').html('Invite your friends and win pckf');
                        jQuery('#getprofits').prop('disabled', true);
                        //jQuery('.copy').click();
                    }else{
                        getRet();
                        console.log(data)
                        calculaProfit(data.pckfprofit);
                    }
                   
                });
        }
        function getGanaRef() {
            jQuery.get("https://peacockfinance.herokuapp.com/referidos/"+ethereum.selectedAddress,
                function (data, status) {
                    jQuery('#refer').html(data.referidos);
                });
        }

        function calculaProfit(val){
            var pro = 0;
            console.log(profitPckf,val)
            if(profitPckf > val){
                pro = profitPckf - val;
            }else{
                pro = val - profitPckf;
            }
    
            jQuery('#pcfks').html(pro);
        }


        setTimeout(() => {
            ethEnabled();
            viewSaldo();
            getGanancia();
            GetRef();
            getRet();
            getGanaRef();
           
        }, 200);

    }
});