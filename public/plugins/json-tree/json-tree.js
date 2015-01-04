/**
 * Visually displays a javascript object as a collapsible
 * html menu.
 */


(function($) {

var btnEventAdded = false;
	
	
$.fn.jsonTree = function(data) {
	this.html(getNode(data));
	this.addClass('json-tree');
	//add buttons for expanding menu, hide menu
	$('.json-tree ul').each(function() {
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
		
		
		