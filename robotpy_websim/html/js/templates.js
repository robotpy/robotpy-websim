
/*
 * Templates
 */
(function(sim) {

	sim.templates = {};
	sim.compileTemplate = {
		handlebars : function(templateContent, data) {
			var template = Handlebars.compile(templateContent);
			return template(data);
		},
		lodash : function(templateContent, data) {
			var template = _.template(templateContent)
			return template(data);
		}
	};

	'Visible:', 'visible', true, [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]

	// Register block expressions and helpers for handlebars
	Handlebars.registerHelper('configInput', function(input) {

		var name = input.name,
			label = input.label,
			attrs = input.attrs || {};

		var inputAttrs = ' ';
		_.forEach(attrs, function(value, attr) {
			inputAttrs += attr + '="' + value + '" ';
		});

		var result = '<div class="input-holder single-line-input">' +
					 	'<label for="' + name + '">' + label + '</label>' +
						'<span>' +
							'<input class="form-control" name="' + name +'" ' + inputAttrs + '>' +
						'</span>' +
				 	'</div>';

		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('configCheckboxGroup', function(data) {

		var label = data.label,
			name = data.name, 
			inline = data.inline,
			checkboxes = data.checkboxes;

		var result = '<label for="' + name + '">' + label + '</label><br />';
		
		if(!inline) {
			for(var i = 0; i < checkboxes.length; i++) {
				var checked = checkboxes[i].checked ? 'checked="checked"' : '';
				result += '<div class="checkbox">' +
							'<label>' +
								'<input type="checkbox" name="' + name + '" value="' + checkboxes[i].value + '" ' + checked + '>' +
									checkboxes[i].label +
								'</label>' +
						  '</div>';
			}
		} else {
			for(var i = 0; i < checkboxes.length; i++) {
				var checked = checkboxes[i].checked ? 'checked="checked"' : '';
				result += '<label class="checkbox-inline">' +
							'<input type="checkbox" name="' + name + '" value="' + checkboxes[i].value + '" ' + checked + '>' +
								checkboxes[i].label +
						  '</label>';
			}
		}

		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('configRadioGroup', function(data) {

		var label = data.label,
			name = data.name, 
			inline = data.inline,
			radios = data.radios;


		var result = '<label for="' + name + '" style="margin-right: 10px;">' + label + '</label>';
		
		if(!inline) {
			result += '<br />';
			for(var i = 0; i < radios.length; i++) {
				result += '<div class="radio">' +
							'<label>' +
								'<input type="radio" name="' + name + '" value="' + radios[i].value + '">' +
									radios[i].label +
								'</label>' +
						  '</div>';
			}
		} else {
			for(var i = 0; i < radios.length; i++) {
				result += '<label class="radio-inline" style="padding-top: 0px;">' +
							'<input type="radio" name="' + name + '" value="' + radios[i].value + '">' +
								radios[i].label +
						  '</label>';
			}
		}

		return new Handlebars.SafeString(result);
	});


	Handlebars.registerHelper('configSelect', function(data) {

		var options = '';
		_.forEach(data.options, function(label, value) {
			options += '<option value="' + value + '" style="font-weight: bold">' + label + '</option>';
		});

		var result = '<div class="row" style="padding-bottom: 15px;">' +
						'<div class="col-sm-5">' +
							'<select id="' + data.id + '" class="form-control">' +
								options + 
				 			'</select>' + 
						'</div>' +
					  '</div>';

		return new Handlebars.SafeString(result);
	});

})(window.sim = window.sim || {});