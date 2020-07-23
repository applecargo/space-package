$( document ).ready(function() {

  //overlay-ed flasher
  var flasher = new Flasher($('.flasher')[0], 2000);

  //network
  var socket = io('https://choir.run:8443');
  var netstat = new Tgl($(".netstat")[0], 'bg-white', 'bg-near-black', null, null);
  socket.on('connect', function() {
    netstat.set();
    socket.on('disconnect', function() {
      netstat.clear();
    });
  });

  //sound enabler (especially for iOS users/devices)
  var touch = new Btn($(".touch")[0], 'bg-white', 'bg-near-black', 300, function() {
    synth_beep.osc.frequency.value =
      Tone.Frequency(Math.floor(Math.random()*12 + 72), "midi").toFrequency();
    synth_beep.start();
    // socket.emit('sound','touch'); // this will feed-forward forever. fun, but out of control.
  });

  //wonjung's or dooho's
  var group = Math.ceil(Math.random()*2); //1 or 2
  console.log('group:' + group);

  ////audio sample loading
  var boo = new Tone.MultiPlayer(
    [
      "audio/boobab@3/01.wav",
      "audio/boobab@3/02.wav",
      "audio/boobab@3/03.wav"
    ]
  ).toMaster();
  var marimba = new Tone.MultiPlayer(
    [
      "audio/marimba@15/01.wav",
      "audio/marimba@15/02.wav",
      "audio/marimba@15/03.wav",
      "audio/marimba@15/04.wav",
      "audio/marimba@15/05.wav",
      "audio/marimba@15/06.wav",
      "audio/marimba@15/07.wav",
      "audio/marimba@15/08.wav",
      "audio/marimba@15/09.wav",
      "audio/marimba@15/10.wav",
      "audio/marimba@15/11.wav",
      "audio/marimba@15/12.wav",
      "audio/marimba@15/13.wav",
      "audio/marimba@15/14.wav",
      "audio/marimba@15/15.wav"
    ]
  ).toMaster();

  //alucan
  var alucan_pitch = new Tone.PitchShift().toMaster();
  alucan_pitch.pitch = -12;
  alucan_pitch.windowSize = 0.1;
  // var alucan = new Tone.Player("audio/alucan@1/" + ("0" + (Math.ceil(Math.random()*1))).slice(-2) + ".mp3").connect(alucan_pitch);
  var alucan = new Tone.MultiPlayer(
    [
      "audio/alucan@12/01.mp3",
      "audio/alucan@12/02.mp3",
      "audio/alucan@12/03.mp3",
      "audio/alucan@12/04.mp3",
      "audio/alucan@12/05.mp3",
      "audio/alucan@12/06.mp3",
      "audio/alucan@12/07.mp3",
      "audio/alucan@12/08.mp3",
      "audio/alucan@12/09.mp3",
      "audio/alucan@12/10.mp3",
      "audio/alucan@12/11.mp3",
      "audio/alucan@12/12.mp3"
    ]
  ).connect(alucan_pitch);//.toMaster();

  //phone
  var phone = new Tone.Player("audio/phone@5/" + ("0" + (Math.ceil(Math.random()*5))).slice(-2) + ".mp3").toMaster();

  //trk01
  var trk01 = new Tone.Player("audio/trk01@7/" + ("0" + (Math.ceil(Math.random()*7))).slice(-2) + ".mp3").toMaster();

  //cricket
  var cricket = new Tone.Player("audio/cricket-short@10/" + ("0" + (Math.ceil(Math.random()*10))).slice(-2) + ".mp3").toMaster();

  ////////audio
  ////beep-tone
  var synth_beep = new Synth_beep();

  // ////noise
  // var synth_whistle = new Synth_whistle();

  //program change by network msg.
  //program list
  //0 : invitation (boobab)
  //1 : phone-ringing
  //2 : silence (won&doo performance) + sit down msg on projector screen
  //3 : won&doo network sync enable
  //4 : disable sync & start soundscape (2min)
  //5 : silence
  var program = 0;
  socket.on('sound', function(msg) {
    program = msg;
    console.log(program);
    $('.prog-no').text(program);
    if (msg == 1) {
      //start phone
      phone.start();
      //screen bang!
      flasher.flash();
    }
    else if (msg == 2) {
      //all stop
      phone.stop();
      trk01.stop();
      cricket.stop();
      marimba.stopAll();
      alucan.stopAll();
      //screen bang!
      flasher.flash();
    }
    else if (msg == 4) {
      //start trk01, cue cricket
      trk01.start();
      setTimeout(function () { cricket.start(); flasher.flash(); }, 85000); //85sec after : 1min 25sec.
      //screen bang!
      flasher.flash();
    }
    else if (msg == 5) {
      //all stop
      phone.stop();
      trk01.stop();
      cricket.stop();
      marimba.stopAll();
      alucan.stopAll();
      //screen bang!
      flasher.flash();
    }
  });

  //sync
  socket.on('sing-note', function(msg) {
    if (program == 3) {
      if (msg < 100 && group == 1) { // group 1
        //marimba
        marimba.start(msg);
        //screen bang!
        flasher.flash();
      }
      else if (msg >= 100 && group == 2) { // group 2
        msg = msg - 100;
        //alucan
        alucan.start(msg);
        //screen bang!
        flasher.flash();
      }
    }
  });

  //programs
  function actioncallback(poser, posep) {
    switch(program) {
      // case 0: //marimba
      //   //bang!
      //   if (poser < 0.7) {
      //     if (posep < 0.5) {// snap, front
      //       marimba.start(Math.floor(Math.random()*15));
      //     }
      //     else {// snap, back
      //       marimba.start(Math.floor(Math.random()*15));
      //       // synth_beep.osc.frequency.value =
      //       //         Tone.Frequency(Math.floor(Math.random()*12 + 60), "midi").toFrequency();
      //       // synth_beep.start();
      //     }
      //   }
      //   else {// waving
      //     marimba.start(Math.floor(Math.random()*15));
      //   }
      //   //screen bang!
      //   flasher.flash();
      //   break;
    case 0: // boo/bap
      //bang!
      if (poser < 0.7) {
        if (posep < 0.5) {// snap, front
          boo.start(0);
        }
        else {// snap, back
          boo.start(1);
        }
      }
      else {// waving
        boo.start(2);
      }
      //screen bang!
      flasher.flash();
      break;
      // case 3: //noise
      //   //bang!
      //   if (poser < 0.7) {
      //     if (posep < 0.5) {// snap, front
      //       synth_whistle.filter.frequency.value =
      //         Tone.Frequency(Math.floor(Math.random()*12 + 72), "midi").toFrequency();
      //       synth_whistle.start();
      //     }
      //     else {// snap, back
      //       synth_whistle.stop();
      //       // marimba.start(Math.floor(Math.random()*15));
      //     }
      //   }
      //   else {// waving
      //     // marimba.start(Math.floor(Math.random()*15));
      //   }
      //   //screen bang!
      //   flasher.flash();
      //   break;
    case 5: //silence
      //screen bang!
      // flasher.flash();
      $(flasher.elem).fadeIn();
      synth_whistle.stop();
      break;
    default:
      ;
    }
  }

  //// motion capture
  //refer --> motion.js
  motionprocessing(actioncallback);

  // var ws_poser = new Webscope($('.ws_poser')[0], -2, 2, 300);
  // var ws_posep = new Webscope($('.ws_posep')[0], -2, 2, 300);
  // var ws_motionr = new Webscope($('.ws_motionr')[0], -2, 2, 300);
  // var ws_tiltsy = new Webscope($('.ws_tiltsy')[0], -2, 2, 300);
  // var motionscope = setInterval(function() {
  //    ws_poser.update(g_poser);
  //    ws_posep.update(g_posep);
  //    ws_motionr.update(Math.abs(g_motionr));
  //    ws_tiltsy.update(Math.abs(g_tiltsy));
  // }, 50);
});
