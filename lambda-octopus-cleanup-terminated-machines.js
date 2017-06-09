var http = require('http');

const AWS = require('aws-sdk');

const encrypted = process.env['apikey'];
let decrypted;

const octopusServer = process.env.octopusServer;

cb = function(response) {
	var str = '';
	response.on('data', function (chunk){
		str += chunk;
	})
	response.on('end', function(err, result){
	  getMachineId(JSON.parse(str));
	});
}

cbDelete = function(response) {
	var str = '';
	response.on('data', function (chunk){
		str += chunk;
	})
	response.on('end', function(err, result){
	});
}

function getMachineId (machines){
	//console.log(machines[0].Id);
	for(var i = 0; i < machines.length; i++){
			if(machines[i].Name === id){
				deleteMachine(machines[i].Id);
			}
	}
}

function deleteMachine(machineId){
	console.log("Deleting MachineId: " + machineId);
	var deleteoptions = {
	  host: octopusServer,
	  path: '/octopus/api/machines/' + machineId,
	  method: 'DELETE',
	  headers: {
	    'X-Octopus-ApiKey': decrypted,
		'Content-Type': 'application/json'
	  }
	};
	http.request(deleteoptions, cbDelete).end();
}

function processEvent(event, context, callback) {
    // TODO handle the event here
    global.id = event.detail["instance-id"]

    var options = {
			//Octopus server host name
    	host: octopusServer,
    	path: '/octopus/api/machines/all',
    	method: 'GET',
    	headers: {
        	'X-Octopus-ApiKey': decrypted,
        	'Content-Type': 'application/json'
    	}
    };
    http.request(options, cb).end();
    callback(null, 'Instance Deleted');
}

exports.handler = (event, context, callback) => {
    if (decrypted) {
        processEvent(event, context, callback);
    } else {
        // Decrypt code should run once and variables stored outside of the function
        // handler so that these are decrypted once per container
        const kms = new AWS.KMS();
        kms.decrypt({ CiphertextBlob: new Buffer(encrypted, 'base64') }, (err, data) => {
            if (err) {
                console.log('Decrypt error:', err);
                return callback(err);
            }
            decrypted = data.Plaintext.toString('ascii');
            processEvent(event, context, callback);
        });
    }
};
