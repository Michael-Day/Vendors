// Plays the soundtrack for Vendors.

// 27 Jul 2020 / tw: @mday / insta: @mday151


let ready = false;

// set the tempo
Tone.Transport.bpm.value = 100;
Tone.Master.volume.value = -4;
Tone.context.latencyHint = 'playback';

let synth, kickSynth, snareSynth, topSynth;
// Can be 'sine', 'sawtooth', 'triangle', 'square'
// Can also add suffixes like sine8, square4
const type = 'sine2';
const types = [ "sine2", "sawtooth4", "square3"];

let feedbackDelay;
let bassSeq, kickSeq, snareSeq, topSeq; // sequences
let bassVolToggle = false;
let snareDelayToggle = false;

setup();

function setup(){
     // Set up the bass synth
     synth = new Tone.Synth({
          "oscillator" : {
               // We prefix 'fat' so we can spread the oscillator over multiple frequencies
               "type" : `fat${type}`,
               "count" : 3,
               "spread" : 40
          },
          "envelope": {
               "attack": 0.001,
               "decay": 0.1,
               "sustain": 0.7,
               "release": 0.5,
               "attackCurve" : "exponential"
          }
     });

     // Set up the drum synth
     kickSynth = new Tone.MembraneSynth({
          octaves: 1
     });
     kickSynth.volume.value = -2;


     // Set up the snare synth
     snareSynth = new Tone.NoiseSynth();
     snareSynth.volume.value = -12;



     // set up delay effect
     feedbackDelay = new Tone.FeedbackDelay("32t", 0.3);

     // Wire up connections
     // topSynth.connect(Tone.Master);
     kickSynth.connect(Tone.Master);
     synth.connect(Tone.Master);
     snareSynth.connect(Tone.Master);
     feedbackDelay.connect(Tone.Master);

     // Define the sequences
     bassSeq = new Tone.Sequence(function(time, note){
          synth.triggerAttackRelease(note, "5n", time);
     }, bassPatterns[0], "8n");

     kickSeq = new Tone.Sequence(function(time, note){
          kickSynth.triggerAttackRelease(note, "4n", time);
     }, kickPatterns[0], "4n");

     snareSeq = new Tone.Sequence(function(time, note){
          snareSynth.triggerAttack(time);
     }, snarePatterns[0], "4n");


     // because we have loaded everything we can now get on
     ready = true;
     console.log("ready");
}

// -----------------
// Cue up the drawing. This repeats forever
Tone.Transport.scheduleRepeat(function(time){
     //use the time argument to schedule a callback with Tone.Draw
     Tone.Draw.schedule(function(){
          // This calls the function cued() below
          // console.log("cued");
          cued();
     }, time);
}, "2m", "2m"); // first is interval, second is starttime


// -----------------
// These are scheduling functions to make changes to the audio over time

// -----------------
// Shuffle the snare loops
Tone.Transport.scheduleRepeat(function(time){
     snareSeq.events = snarePatterns[Math.floor(Math.random() * snarePatterns.length)];
     // console.log("snare loop shuffled");
}, "16m", "26m"); // first is interval, second is starttime

// -----------------
// Shuffle the bass loops
Tone.Transport.scheduleRepeat(function(time){
     var eve = Math.floor(Math.random() * bassPatterns.length);

     bassSeq.events = bassPatterns[eve];
     if(Math.random() > 0.8){
          newType = types[Math.floor(Math.random() * types.length)]
          changeSynth(synth, newType);
     }
     // console.log("bass loop shuffled: "+ eve);
}, "8m", "18m"); // first is interval, second is starttime

// -----------------
// Shuffle the kick loops
Tone.Transport.scheduleRepeat(function(time){
     kickSeq.events = kickPatterns[Math.floor(Math.random() * kickPatterns.length)];
     // console.log("kick loop shuffled");
}, "8m", "22m"); // first is interval, second is starttime


// -----------------
// Decide whether to Volume Drop the bass drum
Tone.Transport.scheduleRepeat(function(time){
     // synth.volume.value = -64;
     bassSeq.events = [];
     console.log(synth + " volume down at " + Tone.Transport.position);
}, "30m", "34m"); // first is interval, second is starttime


// -----------------
// Call the delay change
Tone.Transport.scheduleRepeat(function(time){
     delayOn(snareSynth);
}, "16m", "18m"); // first is interval, second is starttime


// -----------------
// These are utility functions to change the audio

function delayOn(whichPlayer){
     if (!snareDelayToggle) {
          whichPlayer.chain(feedbackDelay);
          feedbackDelay.wet.value = 1;
          whichPlayer.volume.value=-8;
          // console.log("delay on");
          snareDelayToggle = true;
     } else {
          feedbackDelay.wet.value = 0;
          whichPlayer.volume.value =-8;
          // console.log("delay off");
          snareDelayToggle = false;
     }
}

// function filterFreq() {
// if(fxU < 1){
//      filter.frequency.value = filter.frequency.value+50; // 2 measures
//      // console.log("autoFilter.frequency.value = " + autoFilter.frequency.value);
//      fxU = fxU + 0.01;
// } else {
//      // autoFilter.wet.value = 0;
//      // console.log("filter disconnected");
//      fxU = 0;
// }
// }
// function volumeDrop(whichPlayer) {
//      // this random bit is all wrong!
//
//      // console.log("voluming");
//      if(bassVolToggle){
//           whichPlayer.volume.value = -64; // 2 measures
//           console.log(whichPlayer + " volume down = " + whichPlayer.volume.value);
//           bassVolToggle = false;
//      } else {
//           whichPlayer.volume.value = -2;
//           console.log(synth + " volume up = " + synth.volume.value + " at " + Tone.Transport.position);
//           // bassVolToggle = true;
//           //
//      }
//
// }

// function volumeUp(whichPlayer) {
//      if(whichPlayer.volume.value < -2){
//           whichPlayer.volume.value = -2; // 2 measures
//           console.log(whichPlayer + " volume = " + whichPlayer.volume.value);
//      } else {
//           // BassDrum.volume.value = -5;
//      }
// }

function changeSynth (whichSynth, synthType) {
     // Can be 'sine', 'sawtooth', 'triangle', 'square'
     // Can also add suffixes like sine8, square4
     whichSynth.oscillator.type = `fat${synthType}`;
}
// Drawing function triggered on the beat
// Needs to be removed for the final version when integrated into the thing
function cued() {
     // basically just draws a background change
     var myBG = Math.floor(Math.random() *255);
     document.body.style.backgroundColor = "rgba("+myBG+","+myBG+","+myBG+",1)";
     // console.log(Tone.Transport.position);
}
