

App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.setAccountType()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0];
    },

    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const prescriptions = await $.getJSON('Prescriptions.json')
      App.contracts.prescriptions = TruffleContract(prescriptions)
      App.contracts.prescriptions.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.prescriptions = await App.contracts.prescriptions.deployed()
    },

    // Checks the user type and loads appropriate view
    setAccountType: async() => {  
      App.prescriptions.adminAddress().
        then(function(admin){
          $("#address").html(App.account);
          if(App.account.toUpperCase() === admin.toUpperCase())
          {
            $("#account").html("You are an admin");
            $("#main-container").load("/adminview.html");
            $("#address").html(App.account);
            App.prescriptions.pId().then(function(np){
              $("#patients").append(new Option("Select an address from the list"));
              for(i = 0; i < np; i++)
              {
                App.prescriptions.patients(i)
                .then(function(p){  
                  $("#patients").append(new Option(p[1].toLowerCase() + " : " + p[2]));
                });
              }
              
              for(i = 0; i < 4; i++)
              {
                App.prescriptions.medications(i).
                  then(function(med){
                    $("#medication").append(new Option(med[1], med[0]));
                  });
              }
            });
            return ;
          }else{
            App.prescriptions.doctors(App.account).
            then(function(acc)
            {
              if(acc[1] != '')
              {
                $("#account").html("You are a doctor");
                $("#main-container").load("/doctorview.html");
                App.prescriptions.pId().then(function(np){
                  $("#patients").append(new Option("Select patient from the list"));
                  for(i = 0; i < np; i++)
                  {
                    App.prescriptions.patients(i)
                    .then(function(p){  
                      $("#patients").append(new Option(p[2], p[1]));
                    });
                  }

                  for(i = 0; i < 4; i++)
                  {
                    App.prescriptions.medications(i).
                      then(function(med){
                        $("#medication").append(new Option(med[1], med[0]));
                      });
                  }
                });
                return ;
              }
            });
          }
          //App.prescriptions.buyTheMedication();
        });
        $("#account").html("You are a patient!");
        $("#main-container").load("/patientview.html");
        
        App.prescriptions.prId()
        .then(function(preNum){
          for(i = 0; i < preNum; i++)
          {
            App.prescriptions.prescriptions(i)
            .then(function(element)
            {
              App.prescriptions.doctors(element[3])
              .then(function(doc){
                if(element[4].toLowerCase() == App.account.toLowerCase())
                {
                  window.alert(element[5])
                  state = (element[5] == "1")? "purchased":"not purchased";
                    table = $("#prescriptions tbody");
                    row = "<tr><td>" + element[0] + "</th>" 
                                 + "<td>" + doc[1] + "</td>"
                                 + "<td>" + element[1] + "</td>"
                               + "<td>" + element[2] + " ETH" + "</td>"
                              + "<td>" + state + "</td>"
                            + "<td><button id="+ element[0] +  " onclick='App.buyTheMedication("+ element[0] +")'>BUY</button></td></tr>" 
                    table.append(row);
                    if(element[5] == "1")
                      {
                        document.getElementById(element[0]).disabled = true;
                      }
                }
              });
            });
          }
        });
        
      },
    
    //Renders the user appropriate view
    render: async() => {
      // Prevent double render
      if (App.loading) {
        return
      }
      // Render Account

    },


    addDoctor: async() => {
      walletAddress = $("#wa").val();
      docName = $("#dname").val();
      window.alert(walletAddress + " " + docName);
      await App.prescriptions.addDoctor(walletAddress, docName);
    },

    addPrescription: async() => {
      patient = $("#patients ").val();
      medication = $('#medication option:selected').val();
      window.alert(medication);
      await App.prescriptions.createPrescription(medication,
                                             App.account, patient);
    },

    buyTheMedication: async(presId) => {
      App.contracts.prescriptions.deployed().then(function(instance)
      {
        return instance.buyTheMedication(presId, { from: web3.eth.coinbase});
      }
      );
    }, 
  

  changeMedicationPrice: async(id, price) => {
    App.prescriptions.changeMedicationPrice(id, price);
  },
}

  


  $(() => {
    $(window).load(() => {
      App.load();

    })
  })