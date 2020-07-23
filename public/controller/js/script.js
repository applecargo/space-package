$( document ).ready(function() {

  //network
  var socket = io('https://choir.run:8443');
  var netstat = new Tgl($(".netstat")[0], 'bg-white', 'bg-near-black', null, null);
  socket.on('connect', function() {
    netstat.set();
    socket.on('disconnect', function() {
      netstat.clear();
    });
  });

  //program controller
  var prog_zero = new Btn($(".prog-zero")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',0);
  });
  var prog_one = new Btn($(".prog-one")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',1);
  });
  var prog_two = new Btn($(".prog-two")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',2);
  });
  var prog_three = new Btn($(".prog-three")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',3);
    socket.emit('sing-note',3);
  });
  var prog_four = new Btn($(".prog-four")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',4);
  });
  var prog_five = new Btn($(".prog-five")[0], 'bg-white', 'bg-near-black', 300, function() {
    socket.emit('sound',5);
  });
});
