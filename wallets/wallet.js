/*
 
wallet.js - combines ANCHOR- and SCATTER/TP/WOMBAT-wallets in a single lib
 
*/


// ---
const walletversion = "0.0.1b";
const identifier = "sovspacegame";
var currentwallet = "";
var func_setaccountname = null;
var func_logout         = null;
var chainID = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";

//var chainID = "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840"; // Jungle3


// --
// Node-selection
//var   thenode      = "eos.greymass.com"; // Default RPC-node. Testnet:  "jungle3.greymass.com"
var   thenode      = "eos.api.eosnation.io"; // Default RPC-node. Testnet:  "jungle3.greymass.com"

//var   thenode      = "eos.api.eosnation.io"; // 

//var   thenode      = "jungle3.greymass.com"; // 
//var   thenode      = "jungle3.cryptolions.io"; // 
// https://jungle4.cryptolions.io/v2/docs/

var mylastnode = _getCookie("mylastnode");
if (mylastnode != "" && mylastnode != undefined) 
   {
   thenode = mylastnode;
   //alert("take from cookie " + mylastnode);
   }

const thenode_param = getAllUrlParams().node;
if (thenode_param != "" && thenode_param != undefined) 
   {
   //alert("thenode...x "+ thenode_param );
   thenode = thenode_param;
   _setCookie("mylastnode",thenode,30);
   
   //   alert("set  cookie " + thenode);
    } 




// --
// anchor globals
var transport = new AnchorLinkBrowserTransport()

    
var link = new AnchorLink
               ({
                chains: [{
                         chainId: chainID,
                         nodeUrl: "https://"+thenode
                         }],
                        transport
               });
      
   
// --    
// scatter globals
let scatter, scattereos;
let isconnected, eosobj;
let scatter_account           = "";
let global_account            = "";
let global_account_permission = ""; 
let session;

ScatterJS.plugins(new ScatterEOS());
const scatter_host = thenode; // e.g. 'eos.greymass.com'
const network = ScatterJS.Network.fromJson({
                            blockchain: 'eos',
                            chainId: chainID,
                            host: scatter_host,
                            port: 443,
                            protocol: 'https'
                            });
                        


//
// init_wallets()
//
function init_wallets( _identifier, _func_setaccountname, _func_logout )
{
console.log("walletlib: " + walletversion);
console.log("thenode: "+thenode);
//identifier = _identifier;
func_setaccountname = _func_setaccountname;
func_logout         = _func_logout;

// --
// anchor
//

console.log("init wallets" );

// Autologin Anchor
var myeosaccount = _getCookie("myeosaccount");

console.log("myeosaccount:" + myeosaccount);
if (myeosaccount != "" && myeosaccount != null) 
   {
   link.restoreSession(identifier).then((result) => {
                session = result
                if (session) {
                             session.auth.actor
                             currentwallet = "ANCHOR";
                             func_setaccountname( session.auth.actor );
                             global_account_permission = session.auth.permission;
                             global_account = session.auth.actor;
                             }
                })
        
   } // if (myeosaccount != "" && myeosaccount != null) 



// --
// scatter
//
  
ScatterJS.connect(identifier, 
                  {network, allowHttp:true} 
                 ).then(connected => 
                 {
                                     if (!connected)
                                        {
                           	            console.log("!connected");
                                        return false;
                                        } else
                                             {
                                             console.log("connected");
                                             }
				 scatter = ScatterJS.scatter;
                                                                                            
				 var myeosaccount = _getCookie("myeosaccount");
				 if (myeosaccount != "" && myeosaccount != null) 
   					{
  				    login_scatter();
   					}

				scattereos = scatter.eos(network, Eos);
				scatter.addEventHandler((event, payload) => 
					{
					});
                                                
                });		  


} // init_wallets()




function login_anchor()
{

link.login(identifier).then((result) => 
            {
            session = result.session            
            currentwallet = "ANCHOR";
            func_setaccountname( session.auth.actor );
            //console.log("session.auth.actor:" + session.auth.actor);
            _setCookie("myeosaccount",session.auth.actor,30);
            
            //console.log("autologin");
            var myeosaccount2 = _getCookie("myeosaccount");
             console.log("--- myeosaccount2: " + myeosaccount2);
            
            global_account = session.auth.actor;   
            external_login_action();                
            })
                                  
                                
} // login_anchor()



function login_scatter()
{
scatterdologin();

} // login_scatter()


 

function logout_all()
{

if (currentwallet == "SCATTER")
   {   
   dologout();  
   }
   
if (currentwallet == "ANCHOR")
   {
   session.remove();
   func_logout();
   }

global_account = 22;
_eraseCookie("myeosaccount");
} // logout_all()


  
 

function transact( func_transfer_success, func_transfer_error, myactions )
{


if (currentwallet == "ANCHOR")
   {

   session.transact(   {  actions: myactions }    ).then((result) => 
            {                        
            func_transfer_success(result.processed.id);            
            })  ;       
   } // ANCHOR



if (currentwallet == "SCATTER")
   {   
   /*
   const signatureProvider = new eosjs_jssig.JsSignatureProvider([defaultPrivateKey]);
  const api = new eosjs_api.Api({ rpc, signatureProvider });

   */
   console.log("scatter aaa " + thenode);
//                const rpc = new eosjs_jsonrpc.default(network.fullhost());
                
//                  const rpc = new eosjs_jsonrpc.JsonRpc('https://eos.greymass.com');

                  var rpc = new eosjs_jsonrpc.JsonRpc("https://"+thenode);
                  
   console.log("scatter bbb " + eosjs_api.default);

//                  api = ScatterJS.eos(network, eosjs_api.default, {rpc});
//                  api = ScatterJS.eos(network, eosjs_api.default, {rpc});
                    var api = new eosjs_api.Api({ rpc: rpc, signatureProvider: scatter.eosHook(network), textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

                
//                api = scatter.eos(network, Eos);
   console.log("scatter ccc"); 
            
              
  (async () => {
    try {
      const result = await api.transact({
        actions: myactions
         
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      func_transfer_success(result.processed.id);          
    } catch (e) {
                 refreshcounter = 4; // update-hack from index.html
     console.log("Scatter tx Error:");
     console.log(e);
//       err = JSON.parse(e);
                        
         //   func_transfer_error( JSON.stringify(e.json, null, 2) );
//      pre.textContent = '\nCaught exception: ' + e;
//      if (e instanceof eosjs_jsonrpc.RpcError)
  //      pre.textContent += '\n\n' + JSON.stringify(e.json, null, 2);
    }
  })();
            
            
    
   } // SCATTER
   
 
} // transact




//
// Universal transfer (any token)
//
function transfer(func_transfer_success, func_transfer_error, contract, method, to, quantity, memo)
{
  
var myaction = 
  [{             
   account: contract,
   name:    method, // transfer/xtransfer
   authorization: [{
                   actor:      global_account,
                   permission: global_account_permission
                  }]
                  ,
                  data: {
                        from:     global_account,
                        to:       to,
                        quantity: quantity,
                        memo:     memo
                        }
   }];
            

if (currentwallet == "ANCHOR")
   {                 
   session.transact(   {  actions: myaction }    ).then((result) => 
       		{
                        
            func_transfer_success(result.processed.id);
            
            })            
   }



if (currentwallet == "SCATTER")
   {   
   scattereos.transaction(   {  actions: myaction  }  ).then(result => 
   			{
                            
            console.log("Success!!!");
            func_transfer_success("Success");
            return;
            }).catch(error => {
                              console.log("jsonerr: " + error);
                              err = JSON.parse(error);
                        
                              func_transfer_error( err.error.details[0].message );
                              return;
                              });
   }
   
} // transfer



//
// getdata()
//
 function getdata( callback, _code, _scope, _table, _lower, _index, _key_type, _limit )
{

/*
 $data_string2 = '{"table":"collections","scope":"atomicassets","code":"atomicassets","limit":1, "lower_bound":"'.$acc.'" ,  "json":"true"}';
 
 
    const rows = await link.client.v1.chain.get_table_rows({
          code: 'claimdropbox',
          scope: 'claimdropbox',
          table: 'drops',
          index_position: 3,
          lower_bound: eosio_account
        })
        
        
  const rows = await link.client.v1.chain.get_table_rows({
          code: 'claimdropbox',
          scope: 'claimdropbox',
          table: 'drops',
          index_position: 3,
          lower_bound: "goldstandard"
        })
     "sovorderbook", "sovorderbook", "token", "9"

          json: true,      
          code : code,
          scope: scope,
          table: table,
          index_position: 1,
          lower_bound: 9

*/

var rows = null;

//     var url = "https://jungle3.greymass.com/v1/chain/get_table_rows";
    // var url = "https://eos.greymass.com/v1/chain/get_table_rows";
//     var url = "https://eos.api.eosnation.io/v1/chain/get_table_rows";
     
     var url = "https://"+thenode+"/v1/chain/get_table_rows";
    
var xhr = new XMLHttpRequest();

//var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"12" ,  "json":true } );
//var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"asks", "lower_bound":"10", "index_position":2 , "key_type": "i64",  "json":true } );
//var params = JSON.stringify(  {"code":_code,"scope":_scope,"table":_table, "lower_bound":_lower, "index_position":2 , "key_type": "i64",  "json":true } );
var params = JSON.stringify(  {"code":_code,"scope":_scope,"table":_table, "lower_bound":_lower, "index_position":_index , "key_type": _key_type, "limit": _limit,  "json":true } );

xhr.open("POST", url);

//xhr.setRequestHeader("Content-length", params.length);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");



xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
//      console.log("hic--2-");
  //    console.log(xhr.status);
   //   console.log(xhr.responseText);
      json = xhr.responseText;
      
      const rows = JSON.parse(json);

      callback(rows);
//      document.getElementById('backdata').innerHTML = "XXX:"+xhr.responseText+"AA";
   }};

//var mydata = {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"10" ,  "json":true };

xhr.send(params);
         
         /*

const rows = await link.client.v1.chain.get_table_rows({
          json: true,      
           lower_bound: _lower,
          code : _code,
          scope: _scope,
          table: _table,
//         index_position: 2,
          limit: _limit,       
          
         
               
          });
*/
// console.log("back");
} // getdata



//
// getdata()
//
   function getdata2( callback, externparams, _code, _scope, _table, _lower, _index, _key_type, _limit )
{

/*
 $data_string2 = '{"table":"collections","scope":"atomicassets","code":"atomicassets","limit":1, "lower_bound":"'.$acc.'" ,  "json":"true"}';
 
 
    const rows = await link.client.v1.chain.get_table_rows({
          code: 'claimdropbox',
          scope: 'claimdropbox',
          table: 'drops',
          index_position: 3,
          lower_bound: eosio_account
        })
        
        
  const rows = await link.client.v1.chain.get_table_rows({
          code: 'claimdropbox',
          scope: 'claimdropbox',
          table: 'drops',
          index_position: 3,
          lower_bound: "goldstandard"
        })
     "sovorderbook", "sovorderbook", "token", "9"

          json: true,      
          code : code,
          scope: scope,
          table: table,
          index_position: 1,
          lower_bound: 9

*/

var rows = null;

//     var url = "https://jungle3.greymass.com/v1/chain/get_table_rows";
    // var url = "https://eos.greymass.com/v1/chain/get_table_rows";
//     var url = "https://eos.api.eosnation.io/v1/chain/get_table_rows";
     
     var url = "https://"+thenode+"/v1/chain/get_table_rows";
    
var xhr = new XMLHttpRequest();

//var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"12" ,  "json":true } );
//var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"asks", "lower_bound":"10", "index_position":2 , "key_type": "i64",  "json":true } );
//var params = JSON.stringify(  {"code":_code,"scope":_scope,"table":_table, "lower_bound":_lower, "index_position":2 , "key_type": "i64",  "json":true } );
var params = JSON.stringify(  {"code":_code,"scope":_scope,"table":_table, "lower_bound":_lower, "index_position":_index , "key_type": _key_type, "limit": _limit,  "json":true } );

xhr.open("POST", url);

//xhr.setRequestHeader("Content-length", params.length);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");



xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
//      console.log("hic--2-");
  //    console.log(xhr.status);
   //   console.log(xhr.responseText);
      json = xhr.responseText;
      
      const rows = JSON.parse(json);
//console.log(" CB2 ");
//console.log(externparams);
      callback(rows,externparams);
//      document.getElementById('backdata').innerHTML = "XXX:"+xhr.responseText+"AA";
   }};

//var mydata = {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"10" ,  "json":true };

xhr.send(params);
         
         /*

const rows = await link.client.v1.chain.get_table_rows({
          json: true,      
           lower_bound: _lower,
          code : _code,
          scope: _scope,
          table: _table,
//         index_position: 2,
          limit: _limit,       
          
         
               
          });
*/
// console.log("back");
} // getdata2


//
// getaccount()
//
async function getaccount( account )
{

var data = await link.client.v1.chain.get_account( account );
 
return(data);
} // getdata



function getstatus()
{
alert("(" + walletversion+ ") Status..." + currentwallet + " " + global_account + " " +  global_account_permission);


} 
 
            


// scatter


 
window.scatterdologin = async () => 
    {
    
    try {
    
        await ScatterJS.login();
        var eos = null;
     
        setStatus();
        
        /*
        setStatus();
        setInterval(() => {
                          setStatus();
                          }, 1000);                          
   */
        } catch (err) {
            	      return Promise.reject(err);
                      }    
    };
    
    
    

window.dologout = async() => 
	{
	
    try {
        await scatter.forgetIdentity();
        scatter_account = "";
        func_logout();
        } catch (err) {
   					  return Promise.reject(err);
                      }
    };
    

 
  
function setStatus() {
               
                     if (!scatter) { return }

                     // get accountname
                     const account = ScatterJS.account('eos');
                     if (account)
                        {
                        scatter_account = account.name;
                        curaccount = _getCookie("myeosaccount");
                              
                        if (scatter_account != "" && curaccount != scatter_account)
                           {
                           global_account            = scatter_account; 
                            external_login_action();  
                           _setCookie("myeosaccount",scatter_account,30);                          
                           }
                           
                        currentwallet = "SCATTER"; 
                        func_setaccountname(scatter_account);     
                        global_account            = scatter_account;    
                        global_account_permission = account.authority;   
                                                   
                  
                        } else
                             {
                             console.log("no account object");
                             }

}; // setStatus()
                    
 
// end scatter



function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


function _setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function _getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function _eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// EOF