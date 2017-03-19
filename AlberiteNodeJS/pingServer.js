function doRequest() {
  var http = require('http');
  var querystring = require('querystring');

  // write data to request body
  var requestData = {
    message: 'Status normal',
    messagedate: new Date().toISOString(),
    type: 'INFO'
  };
  //req.write('hola!!!');
  //req.write(JSON.stringify(requestData));
  var post_data = querystring.stringify(requestData);
  var options = {
    host: '54.171.57.179',
    port: 8080,
    method: 'POST',
    path: '/ping',
    headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
    }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (stateReturnedByServer) {
      console.log('State returned by server: ' + stateReturnedByServer);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(post_data);
  req.end();
};

setInterval(doRequest, 1000);

