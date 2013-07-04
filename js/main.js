    var status=0;
    var b=prompt("What's your nickname?");
    var socket = io.connect();
    this.username=b;
    socket.emit('adduser',b); 
    socket.on('chat',function(data) {
      var a=document.getElementById('chat').innerHTML;
      document.getElementById('chat').innerHTML=a+
        '<p><b>'+ data.title + '</b>: ' + data.contents + '</p>';
    });
    socket.on('notify',function(data) {
     document.getElementById('notif').innerHTML='<p>'+data+'</p>';
    });
    socket.on('roomlist',function(data) {
     document.getElementById('users').innerHTML=document.getElementById('users').innerHTML+'<p>'+data+'</p>';
    });
    socket.on('roomnewlist',function(data) {
     var a="";
     for(var i=0;i<data.length;i++) { 
       if(data[i]!=b) {
        a+='<p>'+data[i]+'</p>';
       }
     }
     document.getElementById('users').innerHTML=a;
    });

    var submitChat=function(form) {
      socket.emit('chat', {title:b, text: form.chatt.value});
      document.getElementById('chatt').value="";
      socket.emit('idle');
      return false;
    };
    var changed=function() {
      socket.emit('typing', b);
      return false;
    };
    var nottyping=function() {
      socket.emit('idle');
      return false;
    };
    window.setInterval(function() {
      var e = document.getElementById('chat');
      e.scrollTop = e.scrollHeight;
     }, 1000);

