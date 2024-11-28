// Background music tracks
const backgroundTracks = [
    {
        title: "Calm Jazz",
        url: "https://github.com/anars/blank-audio/blob/master/250-milliseconds-of-silence.mp3?raw=true" // Placeholder - replace with actual music file
    }
];

class BackgroundMusic {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.isPlaying = false;
        this.volume = 0.5;
        this.initialize();
    }

    initialize() {
        this.audio.src = backgroundTracks[0].url;
        this.audio.volume = this.volume;
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = value;
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
}

const bgMusic = new BackgroundMusic();
