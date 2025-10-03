const audioPlayer = document.getElementById("audioPlayer");
const albumArt = document.getElementById("albumArt");
const songTitle = document.getElementById("songTitle");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const skipButton = document.getElementById("skipButton");
const backButton = document.getElementById("backButton");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentSpeed = document.getElementById("currentSpeed");

let startup = true;
let currentTrack = 0;

audioPlayer.playbackRate = 1.0;

const songs = [
  { file: "Better Days - LAKEY INSPIRED.mp3", songTitle: "Better Days", albumArt: "Better Days.jpg" },
  { file: "autumn_sun.mp3", songTitle: "Autumn Sun", albumArt: "autumn_sun.png" },
  { file: "Polarity.mp3", songTitle: "Polarity", albumArt: "Polarity.jpg" },
  { file: "best_part_of_me.mp3", songTitle: "Best Part of Me", albumArt: "BestPart.jpg" },
  { file: "just_relax.mp3", songTitle: "Just Relax", albumArt: "justRelax_img.jpeg" },
  { file: "paranormal-is-real-leonell-cassio.mp3", songTitle: "Paranormal is Real", albumArt: "paranormal_real_500.jpg" },
  { file: "Aidan.mp3", songTitle: "Aidan", albumArt: "Aidan.jpg" },
]

function loadTrack(currentTrack) {
  audioPlayer.src = `/songs/${songs[currentTrack].file}`;
  audioPlayer.load();
  progressBar.value = 0;
  progressFill.style.width = "0%";
  audioPlayer.playbackRate = 1.0;
  currentSpeed.textContent = "1.0x";

  albumArt.src = `/albumart/${songs[currentTrack].albumArt}`;
  songTitle.textContent = songs[currentTrack].songTitle;
}

// play button
playButton.addEventListener("click", () => {

  playButton.classList.add("hidden")
  pauseButton.classList.remove("hidden")

  // on initial startup
  if (startup === true) {
    startup = false;

    loadTrack(currentTrack);
    audioPlayer.play();
    
    albumArt.classList.remove("invisible")
  // after initial startup
  } else {
    audioPlayer.play()
  }
});

// pause button
pauseButton.addEventListener("click", () => {  
  // console.log("pause");
  pauseButton.classList.add("hidden")
  playButton.classList.remove("hidden")

  audioPlayer.pause();
});

// skip button
skipButton.addEventListener("click", () => {
  // console.log("skip");
  currentTrack += 1;

  // loop if at end of list
  if (currentTrack >= songs.length) {
    currentTrack = 0;
  }

  // load next song
  loadTrack(currentTrack);
  
  // autoplay if not paused
  if (!audioPlayer.paused || playButton.classList.contains("hidden")) {
    audioPlayer.play();
  }
});

// back button
backButton.addEventListener("click", () => {
  // console.log("back")
  
  if (audioPlayer.paused) {
    currentTrack -= 1;
  
  // loop if at beginning of list
    if (currentTrack < 0) {
      currentTrack = songs.length - 1;
    }

    loadTrack(currentTrack);

  } else {
    audioPlayer.load()

    pauseButton.classList.add("hidden")
    playButton.classList.remove("hidden")
  }
});

// autoplay next song when a song ends
audioPlayer.addEventListener("ended", () => {
    pauseButton.classList.add("hidden")
    playButton.classList.remove("hidden")
});

// speed up song
audioPlayer.addEventListener("timeupdate", () => {
  progressBar.value = audioPlayer.currentTime / audioPlayer.duration;
  progressFill.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;

  // increase speed by 0.01 and cap at 4.0x
  audioPlayer.playbackRate = Math.min(
    Math.round((audioPlayer.playbackRate + 0.01) * 100) / 100, 4.0
  );

  // show current speed
  currentSpeed.textContent = `${audioPlayer.playbackRate.toFixed(1)}x`;
});

// keybinds
document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    // m to mute
    case "m":
      event.preventDefault()
      audioPlayer.muted = !audioPlayer.muted;
      break;
    // space to pause
    case " ":
      event.preventDefault()
      if ((audioPlayer.paused || !playButton.classList.contains("hidden")) && startup === false) {
        audioPlayer.play()

        playButton.classList.add("hidden")
        pauseButton.classList.remove("hidden")
      } else if (!audioPlayer.paused || playButton.classList.contains("hidden")) {
        audioPlayer.pause()
        
        pauseButton.classList.add("hidden")
        playButton.classList.remove("hidden")
      }
      break;
    // right arrow to skip 10 seconds
    case "arrowright":
      event.preventDefault()
      audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration);
      break;
    // left arrow to rewind 10 seconds
    case "arrowleft":
      event.preventDefault()
      audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
      break;
  }
});