//INITIALIZING GPIO

var onoff = require('onoff'); //#A

var Gpio = onoff.Gpio,
  gpios = [new Gpio(18, 'out')]; //#B

function startGPIO(phase, time, callbackStart, callbackEnd) {
  var theGpio = gpios[phase-1];
  var value = 1;
console.log(phase);
console.log(time);
  theGpio.write(value, function() {
console.log('starting gpio...')
    setTimeout(function() {
      console.log('ending gpio...');
      theGpio.write(0, function() {
        callbackEnd();
      });
    }, time*1000);
    callbackStart();
  });

}

function resetGPIOs() {
  gpios.forEach(function(theGpio) {
    theGpio.write(0);
  });
};


process.on('SIGINT', function (err) { 
  resetGPIOs();
  console.log('Bye, bye!');
    console.log(err.stack);
 process.exit(1);
});

process.on('exit', function (err) {
  resetGPIOs();
  console.log('Bye, bye!');
 process.exit(1);
});

process.on('uncaughtException', function (err) { 
  resetGPIOs();
console.log("boom");
    console.log(err.stack);
  console.log('Bye, bye!');
   process.exit(1);

});

//INITIALIZING FUNCTIONS TO DO REMOTE REQUESTS

function doRequest(endPoint, requestData, callback) {
  var http = require('http');
  var querystring = require('querystring');

  // write data to request body
  var post_data = querystring.stringify(requestData);
  var options = {
    host: '54.171.57.179',
    port: 8080,
    method: 'POST',
    path: '/'+endPoint,
    headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
    }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (stateReturnedByServer) {
      callback(stateReturnedByServer);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(post_data);
  req.end();
};
//END INITIALIZING REMOTE REQUEST FUNCTIONS


function initiateSystem(systemInfo) {
  clearInterval(pingInterval);
  console.log('initiating system!!!');
  var requestData = {
       message: 'Initiating system...',
       messagedate: new Date().toISOString(),
       type: 'INFO'
    };

  doRequest('systemInitiating', requestData, function(stateReturnedByServer) {
    //GPIO
console.log(systemInfo);
    startGPIO(systemInfo.phase, systemInfo.time, function() {
      var startedData = {
        message: 'System initiated  in phase'+systemInfo.phase,
        messagedate: new Date().toISOString(),
        type: 'INFO'
      };
      doRequest('systemHasStarted', startedData, function(){});
    }, function() {
      var startedData = {
        message: 'System finished in phase '+systemInfo.phase,
        messagedate: new Date().toISOString(),
        type: 'INFO'
      };
      doRequest('systemHasFinished', startedData, function(){
        initiateMainPing();
      });
    });
  });
};


//Main application ping to the server
var pingInterval;

function initiateMainPing() {
  pingInterval = setInterval(function(){
    var requestData = {
       message: 'Status normal',
       messagedate: new Date().toISOString(),
       type: 'INFO'
    };
  
    doRequest('ping', requestData, function(stateReturnedByServer){
      console.log('State returned by server: ' + stateReturnedByServer);
      var returnedState = JSON.parse(stateReturnedByServer);
      if(returnedState.opCode===0) {
        //Everything is ok, no special action
      } else if(returnedState.opCode===1) {
        initiateSystem(returnedState.systemInfo[0]);
      }
    });
  }, 1000);
};

initiateMainPing();

