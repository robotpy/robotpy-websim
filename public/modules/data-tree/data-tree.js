var dataTreeModule = $('#data-tree').ioModule('data-tree', {
	title : 'Data Tree',
	init : function() {
		this.update = true;
		var module = this;
		$('#data-tree').on('click', '.update-btn', function() {
			module.update = true;
		});
		
		
	},
	getData : function(data) {

	},
	setData : function(data) {
		if(this.update) {
			$('.tree').jsonTree(data);
			this.update = false;
		}
	}
});
