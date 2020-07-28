// Cycles through the list of advertising vendors in the attached 'partners' file.

// 14 Jul 2020 / tw: @mday / insta: @mday151

var myPartner;
var counter = 0;
var myOldAngle = 45;
var myOldColour = "rgba(100, 100, 118, 1)";
var myOldColour2 = "rgba(100, 90, 202, 1)";
let mySound;


// jQuery init
$(document).ready(function () {

     // set intro page background and animation properties
     $(".parent")
     .css( "background", "rgba(255, 255, 255, 1)" )
     .css("transition", "background 0.5s ease-in-out");

     // initiate button
     $("button")
     .on("click", function(){
          // user interaction initiates audio playback
          // myloop.src = "audio/Vendors2.mp3";

          // fades out intro div
          $(".intro")
          .addClass("outro")
          .on("animationend", function(){
               $(this).css("opacity", "0%")
               .removeClass(".outro");
               // starts things running
               shuffleIt();
               // Tone.Transport.start();
               // cued();
          });
          // sets background to white and fades to it
          $(".parent")
          .css( "background", "rgba(255, 255, 255, 1)" )
          .css("transition", "background 4s ease-in-out");
     });


     introduction();

});

function introduction() {
     // not sure why this needs to be here, could be refactored elsewhere
     $(".intro")
     .on("animationend", function(){
          $(this).css("opacity", "100%");
     });
}


function shuffleIt(){
     // reorders the list of vendors each time we reload
     partners.sort(function() { return 0.5 - Math.random() });

     // this will be controlled by the soundtrack eventually.
     // 4800 works for 100bpm
     // var intervalID = window.setInterval(cued, 4800);
}


function cued(){

     // start the sound
     // myloop.play();

     // get the current partner
     if(counter < partners.length) {
          myPartner = partners[counter];
     } else {
          counter = 0;
          myPartner = partners[counter];
          // forward entire page to dailymail.co.uk here
          window.location.href = 'https://www.dailymail.co.uk/';
     }
     // get the number of words of the thing from the file
     let wordCount = WordCount(myPartner) ;
     // get the number of letters in the longest word in the name of the partner
     let myLongestWord = longestWord(myPartner);
     // console.log("longest = "+ myPartner + ", "+ myLongestWord);

     splitTheScreen(myLongestWord);
     counter++;
};

function splitTheScreen(c){
     // this is left over from when there was an
     // array of divs on the index page.

     // var arr = [ "container", "container2", "container3", "container4", "container5", "container6", "container7" ];
     var arr = [ "container" ];

     // cycle through the divs (there is only one div in this version)
     $.each( arr, function(i, val) {

          // height of the div should be window inner divided by number of words
          var myHeight = window.innerHeight;

          // chooses background colours & angle and gets them ready to set the gradient
          var myColourR = Math.floor(Math.random()*255);
          var myColourG = Math.floor(Math.random()*255);
          var myColourB = Math.floor(Math.random()*255);

          var myColour  = "rgba(" + myColourR + "," + myColourG + "," + myColourB + "," + "1)";
          var myColour2 = "rgba(" + myColourG+ "," + myColourB + "," + myColourR + "," + "1)";

          var myAngle = Math.floor(Math.random()*360);

          // sets the background gradient
          $(".parent")
          .css( "background", "linear-gradient("+myAngle+"deg, "+myColour+" 0%, "+myColour2+" 68%)" )
          .css("transition", "background 1s ease-in-out");


          // This adds the text to the div
          $("." + arr[i]).text(myPartner)
          .css( "background", "none" ) // transparent
          .css( "border", "auto")
          .css( "border-color", "white")
          .addClass("animate")
          .on("animationend", function(){
               $(this).removeClass('animate');
          });

          // // This is an abortive attempt to resize the font based on word length
          // var fontSize = $("." + arr[i]).css("font-size"); // returns in px
          // fontSize = fontSize.split('px')[0]; // converts to value
          //
          // // console.log(fontSize);
          // if(c >= 7){
          //   $("." + arr[i])
          //   // decrease font size
          //     .css("font-size", fontSize - 5);
          //     console.log("fontsize r=" + (fontSize - 5));
          //   } else {
          //   // don't
          //   $("." + arr[i])
          //     .css("font-size", fontSize + 5);
          //     console.log("fontsize n=" + (fontSize + 5));
          // }
     });

}

// // Tone.js stuff ------------------------
// // set the tempo
// Tone.Transport.bpm.value = 100;
//
// // Cue up the drawing. This repeats forever
// Tone.Transport.scheduleRepeat(function(time){
//      //use the time argument to schedule a callback with Tone.Draw
//      Tone.Draw.schedule(function(){
//           // This calls the function cued() below
//           // console.log("cued");
//           cued();
//      }, time);
// }, "2m", "2m"); // first is interval, second is starttime. Startime is same as in button script in index.html
//
// // the player
// var player = new Tone.Player({
//      "url" : "./audio/Vendors2.[mp3|ogg]",
//      "loop" : true,
// }).toMaster() // adds to the output
// .sync();    // syncs to the transport timings
// // console.log("ss");



// utility functions
function WordCount(str) {
     // console.log("letter " + str.split(" ")[0]);
     return str.split(" ").length;

}
function longestWord(str){
     let myNewStr = str.split(" ");
     var longest = 0;
     for(var i = 0; i < myNewStr.length; i++){
          if(myNewStr[i].length > longest){ // If strSplit[i].length is greater than the word it is compared with...
               longest = myNewStr[i].length; // ...then longestWord takes this new value
          }
     }
     return longest;
}

var rgbToHex = function (rgb) {
     var hex = Number(rgb).toString(16);
     if (hex.length < 2) {
          hex = '0' + hex;
     }

     return hex;
};

var fullColorHex = function (r, g, b) {
     var red = rgbToHex(r);
     var green = rgbToHex(g);
     var blue = rgbToHex(b);
     return red + green + blue;
};


// JUNK ------------------------------------------------


// // THIS IS NOW IN INDEX.HTML
// // sets up the button & binds the starts
// var el = document.getElementById('playButton');
// el.addEventListener('click', function() {
//     Tone.Transport.start();
//     // this needs to happen on cue, ie, a single set interval
//     player.sync().start("2m"); // 2 measures
//     console.log("star");
// });


// stuff it does once triggered on the beat
// function cued() {
//     var myBG = Math.floor(Math.random() *255);
//     document.body.style.backgroundColor = "rgba("+myBG+","+myBG+","+myBG+",1)";
//     console.log("color change");
// }



// // Old version of this function, from when there were more containers on the page
// function splitTheScreen(c){
//   // array of divs on the index page
//   var arr = [ "container", "container2", "container3", "container4", "container5", "container6", "container7" ];
//   // cycle through the divs
//   $.each( arr, function(i, val) {
//     // height of the div should be window inner divided by number of words
//     var myHeight = window.innerHeight/c;
//     var myColour  = fullColorHex(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
//     console.log("color = " + myColour);
//     $("#" + arr[i]).text(myPartner.split(" ")[i])
//       .css("height", myHeight)
//       .css( "background", "#" + myColour )// arbitrary
//       .css("padding", 30);
//     // exit the loop if we reach c-1
//     return ( i !== c-1 );
//   });
//   // cycle through the rest of the divs
//   $.each( arr, function(i, val) {
//     // set height to 0
//     if(i >=c){
//       $("#" + arr[i])
//         .css("height", 0)
//         .css("padding", 0);
//     }
//   });
// }
