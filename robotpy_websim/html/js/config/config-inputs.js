

(function(sim) {

	var configInputs = {};

	sim.configInputs = {

		register : function(id, getInputHtml, setInputValue, getInputValue) {

			Handlebars.registerHelper(id, function(configKey, params) {
				var result = getInputHtml(configKey, params);
				return new Handlebars.SafeString(result);
			});

			configInputs[id] = {
				getInputHtml : getInputHtml,
				setInputValue : setInputValue,
				getInputValue : getInputValue
			};
		},

		setInputValues : function($form) {

			var categoryId = $form.data('category-id'),
				config = $form.data('user-config') ? sim.userConfig : sim.config;
				category = config.getCategory(categoryId);

			$form.find('[data-config-input]').each(function() {

				var $input = $(this),
					inputId = $input.data('config-input'),
					configKey = $input.data('config-key'),
					configValue = _.get(category, configKey);

				configInputs[inputId].setInputValue($input, configValue);
			});

		},

		getInputValues : function($form) {

			var categoryId = $form.data('category-id'),
				config = $form.data('user-config') ? sim.userConfig : sim.config;
				category = config.getCategory(categoryId);

			$form.find('[data-config-input]').each(function() {

				var $input = $(this),
					inputId = $input.data('config-input'),
					configKey = $input.data('config-key');

				var configValue = configInputs[inputId].getInputValue($input, configValue);
				_.set(category, configKey, configValue);				
			});
		}
	};


})(window.sim = window.sim || {});




(function(sim) {


	function getInputHtml(params, configKey) {
		var name = params.name,
			label = params.label,
			attrs = params.attrs || {};

		var inputAttrs = ' ';
		_.forEach(attrs, function(value, attr) {
			inputAttrs += attr + '="' + value + '" ';
		});

		return (
			'<div data-config-input="configInput" data-config-key="' + configKey + '" class="input-holder single-line-input">' +
				'<label for="' + name + '">' + label + '</label>' +
				'<span>' +
					'<input class="form-control" name="' + name +'" ' + inputAttrs + '>' +
				'</span>' +
			'</div>'
		);
	}

	function setInputValue($input, configValue) {
		$input.find('input').val(configValue);
	}

	function getInputValue($input) {
		return $input.find('input').val();
	}

	sim.configInputs.register('configInput', getInputHtml, setInputValue, getInputValue);


})(window.sim = window.sim || {});






(function(sim) {


	function getInputHtml(params, configKey) {
		
		var label = params.label,
			name = params.name, 
			inline = params.inline,
			checkboxes = params.checkboxes;

		var result = '<div data-config-input="configCheckboxGroup" data-config-key="' + configKey + '">';
		result += '<label for="' + name + '">' + label + '</label><br />';
		
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

		result += '</div>';

		return result;
	}

	function setInputValue($input, configValue) {
		_.forEach(configValue, function(value, name) {
			$input.find('input[name=' + name + ']').prop('checked', value);
		});
	}

	function getInputValue($input) {
		var checkboxValues = {};
		$input.find('input').each(function() {
			var $checkbox = $(this),
				name = $checkbox.attr('name'),
				value = $checkbox.prop('checked');

			checkboxValues[name] = value;
		});
		return checkboxValues;
	}

	sim.configInputs.register('configCheckboxGroup', getInputHtml, setInputValue, getInputValue);


})(window.sim = window.sim || {});




(function(sim) {


	function getInputHtml(params, configKey) {
		
		var label = params.label,
			name = params.name, 
			inline = params.inline,
			radios = params.radios;

		var result = '<div data-config-input="configRadioGroup" data-config-key="' + configKey + '">';
		result += '<label for="' + name + '" style="margin-right: 10px;">' + label + '</label>';
		
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
		result += '</div>';

		return result;
	}

	function setInputValue($input, configValue) {
		$input.find('input[name=' + configValue + ']').prop('checked', true);
	}

	function getInputValue($input) {
		return $input.find('input:checked').attr('name');
	}

	sim.configInputs.register('configRadioGroup', getInputHtml, setInputValue, getInputValue);


})(window.sim = window.sim || {});

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