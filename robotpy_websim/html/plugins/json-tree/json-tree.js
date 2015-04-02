/**
 * Visually displays a javascript object as a collapsible
 * html menu.
 */


(function($) {

var btnEventAdded = false;
	
	
$.fn.jsonTree = function(options) {
		
	var settings = $.extend({
		data: {},
		on_btn_click: function() {}
	}, options);
	
	this.html(getNode(settings.data));
	this.addClass('json-tree');
	//add buttons for expanding menu, hide menu
	this.find('ul').each(function() {
		var parent = $(this).parent();
		if(parent.is('li')) {
			parent.prepend('<button class="btn btn-default">+</button>');
			$(this).hide();
		}
	});

	if(!btnEventAdded) {
		$('body').on('click', '.json-tree button', function() {
			if($(this).text() === '+') {
				$(this).text('-');
			} else {
				$(this).text('+');
			}
			$(this).parent().find('> ul').toggle();
			settings.on_btn_click();
		});
		btnEventAdded = true;
	}

	return this;
};

function getNode(data) {
	//if data isn't an object or array just insert a li
	if(!isObject(data) && !isArray(data)) {
		return data;
	}
	
	var html = '<ul>';	
	for(key in data) {
		html += '<li>';
		html += '<em>' + key + '</em>' + ': ';
		html += getNode(data[key]);
		html += '</li>';
		
	}
	html += '</ul>';
	return html;	
}

function isObject ( obj ) {
   return obj && (typeof obj  === "object");
}

function isArray ( obj ) { 
  return isObject(obj) && (obj instanceof Array);
}
	
	
	
}(jQuery))
		
		
		