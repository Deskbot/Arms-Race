let Log = function() {
	//constructor
	function Log(game) {
		this.game = game;
		this.elem = game.container.children('#log');
	}

	//attributes


	//methods
	Log.prototype.put = function (line, player) {
		this.elem.append('<li class="' + player.class + '">' + line + '</li>');
		this.elem.scrollTop(this.elem.prop('scrollHeight'));
	}

	return Log;
}();