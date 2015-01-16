/**
 * context-menu js
 */

$(function() {
	
//create context menu
$.ajax({
   async: false,
   type: 'GET',
   url: 'menus/context-menu.html',
   dataType: 'html',
   success: function( html ) {
	   $('body').append(html);
   }
});
	
//events to open/close context menu
$("body").on("contextmenu", openContextMenu);
$("body").click(closeContextMenu);


//event to hide module
$('body').on('click', '#hide-module', function(e) {
	var module = getCurrentModule();
	if(module) {
		module.element.addClass('hidden');
	}
});

//event to handle module specific inputs
$('body').on('click', '#context-menu .module-specific-input, #context-menu .module-specific-input input', function(e) {
	var input = null;
	if($(this).prop('tagName') === 'INPUT') {	
		input = $(this);
	} else {
		input = $(this).find('input');
	}
	
	if(!input) {
		return;
	}
	
	e.stopPropagation();
	
	var module = getCurrentModule();
	var type = input.attr('type');
	var name = input.attr('name');
	
	if (type === 'checkbox') {
		var value = !input.prop('checked');
		input.prop('checked', value);
		module.contextMenu[name].set(module, value);
		
	} else if (type === 'radio') {		
		input.prop('checked', true);
		module.contextMenu[name].set(module, input.val());
	}
});


function getCurrentModule() {
	var moduleID = $('#context-menu').attr('module-id');
	var module = $.getIOModule(moduleID);
	return module;
}
	


function openContextMenu(e) {
	var contextMenu = $('#context-menu');
	var moduleClicked = getModuleClicked(e);
	
	//if no module was clicked do not show context menu
	if(moduleClicked === null) {
		closeContextMenu();
		return;
	}

	
	e.preventDefault();
		
	//otherwise select the context menu
	contextMenu.css({
		display: 'block',
		left: e.pageX,
		top: e.pageY
	});
	
	contextMenu.attr('module-id', moduleClicked.id);	
	createContextMenu(moduleClicked);
}

function closeContextMenu() {
	$('#context-menu').hide();
}

function toggleUpdates() {
	$( elem ).prop( "checked" )
	if(contextMenu.find('#update-client').prop("checked")) {
		
	}
	
	if(contextMenu.find('#update-server').prop("checked")) {
		
	}
}

function getModuleClicked(e) {
	var modules = $.getIOModules();

	var moduleClicked = null;

	for(key in modules) {
		var x = modules[key].element.position().left;
		var y = modules[key].element.position().top;
		var width = modules[key].element.outerWidth();
		var height = modules[key].element.outerHeight();
		
		if(x < e.pageX && e.pageX < (x + width) && y < e.pageY && e.pageY < (y + height)) {
			moduleClicked = modules[key];
			break;
		}
	}
	
	return moduleClicked;
}

function createContextMenu(module) {
	//remove old module specific inputs
	$('#context-menu .module-specific-input').remove();
	
	
	var contextMenuData = module.contextMenu;
	for(name in contextMenuData) {
		var type = contextMenuData[name].type;
		
		//add checkbox input
		if(type === 'checkbox') {
			var label = contextMenuData[name].label;
			
			//add input
			var html = '';
			html += '<li class="menu-checkbox module-specific-input"><a href="#">';
			html += 	'<input type="checkbox" name="' + name + '">';
			html += 	'<span class="lbl"> ' + label + '</span>';
			html += '</a></li>';
			$('#context-menu #module-specific-divider').before(html);
			
			//set value
			$('#context-menu module-specific-input input[name=' + name + ']').prop('checked', contextMenuData[name].get(module));
		
		
		//add radio inputs
		} else if(type === 'radio') {
			
			
			var html = '';
			//add inputs			
			for(var i = 0; i < contextMenuData[name].buttons.length; i++) {
				var button = contextMenuData[name].buttons[i];
				
				html = '';
				html += '<li class="menu-radio module-specific-input"><a href="#">';
				html += 	'<input type="radio" name="' + name + '" value="' + button.value + '">';
				html += 	'<span class="lbl"> ' + button.label + '</span>';
				html += '</a></li>';
				$('#context-menu #module-specific-divider').before(html);
			}
			
			//set value
			var value = contextMenuData[name].get(module);
			$('#context-menu .module-specific-input input[name=' + name + '][value=' + value + ']').prop('checked', true);
			
		}
	}
}

	
	
});

/**
 * navbar js
 */

$(function() {
	$('.navbar').hide();
	$('body').mousemove(function(e) {
		if(e.clientY < 15) {
			if($('.navbar').is(":visible")) {
				return;
			}
			
			$('.navbar').show();
			$('.navbar #hidden-modules-dropdown').html('');
			$('.iomodule').each(function() {
				var moduleID = $(this).attr('id');
				if($(this).hasClass('hidden')) {
					var title = $(this).find('.title').text();
					$('#hidden-modules-dropdown').append('<li module-id="' + moduleID + '"><a href="#">' + title + '</a></li>');
				}
			});
		}
	});
	
	$('.navbar').mouseleave(function(e) {
		if(e.clientY > 20) {
			$('.navbar').hide();
		}
	});
	
	$('#hidden-modules-dropdown').on('click', 'li', function() {
		var id = '#' + $(this).attr('module-id');
		$(id).removeClass('hidden');
		$(this).remove();
		$('.navbar').hide();
	});
});