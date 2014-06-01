var http = require('http')
,	express = require('express')
,	app = express()
,	server = http.createServer(app).listen(3000)
,	jade = require('jade')
,	io = require('socket.io').listen(server)
;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
	res.render('home.jade');
});

io.sockets.on('connection', function(socket) {

	socket.on('setPseudo', function(data) {
		console.log("setPseudo is passing " + data + " to the server");
		socket.set('pseudo', data);
	});

	socket.on('message', function(message) {
		socket.get('pseudo', function(error, name) {
			var data = { 'message' : message, 'pseudo' : name };
			console.log(data);
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});

});

