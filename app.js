var express=require('express');
var app=express();
var http=require('http');
var server=http.createServer(app);
var io=require('socket.io').listen(server);
var application_root=__dirname;

app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(application_root));
  app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

app.get('/', function(req,res)
{
 res.sendfile('index.html');
});

var a=new Array();
var k=0;
io.sockets.on('connection', function(socket){
  var sendher=function(title,message)
  {
    socket.emit('chat',{title:title ,
                         contents:message});
  }
  socket.on('adduser', function(username){
		  socket.username = username;
                socket.emit('roomnewlist',a);
                             a[k++]=username;
                           var t=username+" has entered the room.";
  socket.broadcast.emit('chat',{title:"Admin" ,
                         contents:username+" has entered the room."});             
  socket.broadcast.emit('roomlist',username);
  });
  socket.on('typing', function(username){
		  socket.broadcast.emit('notify',username+" is typing....");
  });
  socket.on('idle', function(){
		  socket.broadcast.emit('notify',"");
  });
  socket.on('chat',function(data)
  { 
   io.sockets.emit('chat', {title: socket.username, contents: data.text});
  });  
  socket.on('disconnect', function()
  {
     k--;
     var t=0;
     var temp=new Array();
     for(var i=0;i<a.length;i++) { 
       if(a[i]!=socket.username) {
        temp[t++]=a[i];
       }
     }
     a=temp;
    socket.broadcast.emit('chat',{title:"Admin", contents: socket.username + ' has disconnected'});
    socket.broadcast.emit('roomnewlist',a);
  });
});

var port= process.env.PORT || 8080;
server.listen(port);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
