/**
 * context-menu js
 */

(function($) {
	
var contextMenu = null;


$.contextMenu = function() {
	//do not create the context menu twice
	if(contextMenu !== null) {
		return;
	}
	
	
	$("body").on("contextmenu", openContextMenu);
	$("body").click(hideContextMenu);
	$('body').on('click', '#context-menu .menu-checkbox', function(e) {
		e.stopPropagation();
		var checkbox = $(this).find('input[type=checkbox]');
		var newValue = !checkbox.prop('checked')
		checkbox.prop('checked', newValue);
		
		var id = checkbox.attr('id');
		var module = getCurrentModule();
		
		if(module) {
			if(id === 'update-server') {
				module.updateServer = newValue;
			} else if(id === 'update-client') {
				module.updateClient = newValue;
			}
		}
		
	    
	});
	
	$('body').on('click', '#context-menu input[type=checkbox]', function(e) {
		e.stopPropagation();
	});
	
	$('body').on('click', '#hide-module', function(e) {
		var module = getCurrentModule();
		if(module) {
			module.element.addClass('hidden');
		}
	});
	
	
	$.ajax({
	   async: false,
	   type: 'GET',
	   url: 'menus/context-menu.html',
	   dataType: 'html',
	   success: function( html ) {
		   //add the context menu
		   $('body').append(html);
	   }
	});

	
	contextMenu = $('#context-menu');
	return contextMenu;
}

function getCurrentModule() {
	var moduleID = contextMenu.attr('module-id');
	var module = $.getIOModule(moduleID);
	return module;
}
	


function openContextMenu(e) {
	if(contextMenu === null) {
		return;
	}
	
	var modules = $.getIOModules();
	//check to see which module was clicked
	var moduleClicked = null;
	//console.log('_______________________');
	//console.log('mouse: (' + e.pageX + ', ' + e.pageY + ')');
	for(key in modules) {
		var x = modules[key].element.position().left;
		var y = modules[key].element.position().top;
		var width = modules[key].element.outerWidth();
		var height = modules[key].element.outerHeight();
		
		//console.log(key + ': (' + x + ', ' + y + '), (' + (x + width) + ', ' + (y + height) + ')');
		if(x < e.pageX && e.pageX < (x + width) && y < e.pageY && e.pageY < (y + height)) {
			moduleClicked = modules[key];
			break;
		}
	}
	
	//if no module was clicked do not show context menu
	if(moduleClicked === null) {
		hideContextMenu();
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
	contextMenu.find('#update-server').prop('checked', moduleClicked.updateServer);
	contextMenu.find('#update-client').prop('checked', moduleClicked.updateClient);
}

function hideContextMenu() {
	if(contextMenu === null) {
		return;
	}
	
	$('#context-menu').hide();
}

function toggleUpdates() {
	$( elem ).prop( "checked" )
	if(contextMenu.find('#update-client').prop("checked")) {
		
	}
	
	if(contextMenu.find('#update-server').prop("checked")) {
		
	}
}

	
	
}(jQuery))

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