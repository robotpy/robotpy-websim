var solenoidModule = $('#solenoid').ioModule('solenoid', {
	title : 'Solenoid',
	init : function() {		
		$('.solenoid-input').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
	},
	getData : function(dataToServer) {
		var solenoid = dataToServer.solenoid;
		for(var i = 0; i < solenoid.length; i++) {
			var id = '#solenoid-' + (i + 1);
			//solenoid[i].value = $(id).hasClass('btn-success');
		}
	},
	setData : function(newData, oldData) {
		var solenoid = newData.solenoid;
		for(var i = 0; i < solenoid.length; i++) {
			var id = '#solenoid-' + (i + 1);
			/*if(!solenoid[i].initialized) {
				$(id).closest('.col-xs-6').addClass('hide');
			} else {
				$(id).closest('.col-xs-6').removeClass('hide');
			}*/
		}
	}
});
