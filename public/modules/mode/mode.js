var modeModule = $('#mode').ioModule('mode', {
	title : 'Mode',
	init : function() {
		var module = this;
		this.controlFormState = 'disabled';
		this.stateChanged = false;

		//update state when form input changes
		$("input[name='mode']").change(function() {
			module.controlFormState = $(this).val();
			module.stateChanged = true;
		});
	},
	getData : function(dataToServer) {
		var control = dataToServer.control;
		// process the data.. 
		//console.log(this.stateChanged);
		if (this.stateChanged && !control.has_source) {
			switch (this.controlFormState) {
			case 'disabled':
				control.enabled = false;
				control.autonomous = false;
				control.test = false;
				break;
			case 'auto':
				control.enabled = true;
				control.autonomous = true;
				control.test = false;
				break;
			case 'teleop':
				control.enabled = true;
				control.autonomous = false;
				control.test = false;
				break;
			}

			// this is required else the robot doesn't go into any modes
			//control.ds_attached = true;
		}
		this.stateChanged = false;
	},
	setData : function(newData, oldData) {
		// do something with the data here...
		var control = newData.control;

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
