

/*
 *	Main
 */
(function(sim) {

	//websocket object
	var socket = null;
	// dictionary received from server
	var dataFromServer = null;
	// dictionary that can be transmitted to sim
	var dataToServer = null;

	function setupSocket() {
		var l = window.location;
		var url = "ws://" + l.hostname + ":" + l.port + "/api";
		
		socket = new WebSocket(url);
		socket.onopen = function() {
			
			// reset vars
			dataFromServer = null;
			dataToServer = null;

			sim.events.trigger('simConnected');
		};

		socket.onclose = function(a) {
			sim.events.trigger('simDisconnected');
		};
		
		// called when sim data comes from the server
		// -> rate is controlled by the server
		socket.onmessage = function(msg) {
			
			var data = JSON.parse(msg.data);
			
			// first message is in/out data, all other messages are just out data
			// -> TODO: support message types
			if (dataFromServer == null) {
				dataFromServer = data.out;
				dataToServer = data.in;
			} else {
				dataFromServer = data;
			}
			
			var enabled = dataFromServer.control.enabled;
			sim.events.trigger('serverDataUpdate', [dataFromServer, enabled]);
			sim.events.trigger('requestWebDataUpdate', [dataToServer, enabled]);
			
			var simMsg = {};
			simMsg.msgtype = 'input';
			simMsg.data = dataToServer;
			socket.send(JSON.stringify(simMsg));
		};
		
	}

	sim.main = {
		start : function() {
			if(!this.isRunning()) {
				setupSocket();
			}
		},
		stop : function() {
			if (socket != null) {
				socket.close();
				socket = null;
			}
		},
		isRunning : function() {
			return (socket && socket.readyState == WebSocket.OPEN) ? true : false;
		},
		setRobotMode : function(mode, enabled) {
			if (socket == null)
				return;
			
			var msg = {};
			msg.msgtype = 'mode';
			msg.mode = mode;
			msg.enabled = enabled;
			
			socket.send(JSON.stringify(msg));
		}
	};


})(window.sim = window.sim || {});