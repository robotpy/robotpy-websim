var modeModule = $('#mode').ioModule('mode', {
	title : 'Mode',
	init : function() {
		//update state when form input changes
		$("input[name='mode']").change(function() {
			var mode = $(this).val();
			var enabled = mode != 'disabled';
			if (mode == 'disabled')
				mode = 'teleop';
			$.setRobotMode(mode, enabled);
		});
	},
	getData : function(data) {
		// empty
	},
	setData : function(data) {
		// do something with the data here...
		var control = data.control;

		if (control.has_source) {
			$('#control_source').text("Mode externally controlled!")
			$("input[name='mode']").prop("checked", false)
		}

		if (control.enabled) {
			if (control.autonomous)
				$('#robot_state').text('Autonomous')
			else if (control.test)
				$('#robot_state').text('Test')
			else
				$('#robot_state').text('Teleoperated')
		} else {
			$('#robot_state').text('Disabled')
		}
	}
});
