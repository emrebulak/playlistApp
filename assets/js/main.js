const showModalIcon = document.querySelector('#showModalIcon');
const modal = document.querySelector('#modal');
const closeModalIcon = document.querySelector('#closeModalIcon');
const modaDetail = document.querySelector('#modalDetail');

const artistImage = document.querySelector('#artistImage');
const songTitle = document.querySelector('#songTitle');
const songArtist = document.querySelector('#songArtist');
const audio = document.querySelector('#audio');

const play = document.querySelector('#play');
const stop = document.querySelector('#stop');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const mix = document.querySelector('#mix');
const loop = document.querySelector('#loop');

const songCurrentTime = document.querySelector('#songCurrentTime');
const songDuration = document.querySelector('#songTotatTime');

const progress = document.querySelector('#progress');
const progressContainer = document.querySelector('#progressContainer');


let songs = [];
let mixStatus = false;
let loopStatus = false;

document.addEventListener('DOMContentLoaded', async () => {
    songs = await getAllData();
    let temp = await songs.map((data) => `<div onclick="handleClick('${data.name}')" class="song-detail">
    <img class="song-detail-image" src="${data.image}" alt="${data.artist}" />
    <div class="song-detail-info">
      <h4 class="song-detail-title">${data.name}</h4>
      <h4 class="song-detail-artist">${data.artist}</h4>
    </div>
  </div>`).join('');
    modaDetail.innerHTML = temp;
    audio.src = songs[0].link;
    artistImage.src = songs[0].image;
    songTitle.textContent = songs[0].name;
    songArtist.textContent = songs[0].artist;
});

progressContainer.addEventListener('click', (e) => {
    let width = progressContainer.clientWidth;
    let clickX = e.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('loadedmetadata', () => {
    songCurrentTime.textContent = timeChangeMinute(audio.currentTime);
    songDuration.textContent = timeChangeMinute(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    let temp = (100 * audio.currentTime) / audio.duration;
    if (timeChangeMinute(audio.currentTime) != timeChangeMinute(audio.duration)) {
        songCurrentTime.textContent = timeChangeMinute(audio.currentTime);
        progress.style.width = `${temp}%`;
    }
});

audio.addEventListener('ended', () => {

    if (loopStatus) {
        audio.play();
        return;
    } else {
        next.click();
    }

});

play.addEventListener('click', () => {
    audio.play();
    play.classList.add('hide');
    stop.classList.remove('hide');
});

stop.addEventListener('click', () => {
    audio.pause();
    stop.classList.add('hide');
    play.classList.remove('hide');
});

prev.addEventListener('click', () => {

    let index;
    if (mixStatus) {
        index = Math.floor(Math.random() * songs.length);
    } else {
        index = songs.findIndex(song => song.name == songTitle.textContent);
        if (index === 0) {
            index = songs.length - 1;
        } else {
            index--;
        }
    }

    artistImage.src = songs[index].image;
    songTitle.textContent = songs[index].name;
    songArtist.textContent = songs[index].artist;
    audio.src = songs[index].link;
    audio.play();
    play.classList.add('hide');
    stop.classList.remove('hide');
});

next.addEventListener('click', () => {
    let index;

    if (mixStatus) {
        index = Math.floor(Math.random() * songs.length);
    } else {
        index = songs.findIndex(song => song.name == songTitle.textContent);
        if (index === songs.length - 1) {
            index = 0;
        } else {
            index++;
        }
    }

    artistImage.src = songs[index].image;
    songTitle.textContent = songs[index].name;
    songArtist.textContent = songs[index].artist;
    audio.src = songs[index].link;
    audio.play();
    play.classList.add('hide');
    stop.classList.remove('hide');
});

showModalIcon.addEventListener('click', () => {
    modal.classList.remove('hide');
});

closeModalIcon.addEventListener('click', () => {
    modal.classList.add('hide');
});

const handleClick = (name) => {
    let song = songs.find(s => s.name == name);
    artistImage.src = song.image;
    songTitle.textContent = song.name;
    songArtist.textContent = song.artist;
    audio.src = song.link;
    audio.play();
    play.classList.add('hide');
    stop.classList.remove('hide');
    modal.classList.add('hide');

}

loop.addEventListener('click', () => {
    loop.classList.toggle('active');
    loopStatus = !mixStatus;
});

mix.addEventListener('click', () => {
    mix.classList.toggle('active');
    mixStatus = !mixStatus;
});

const getAllData = async () => {
    const response = await fetch('./db.json');
    const data = await response.json();
    return data;

};

timeChangeMinute = (time) => {

    minutes = Math.floor(time / 60);
    second = Math.floor(time % 60);

    let tempMinutes = minutes < 10 ? "0" + minutes : minutes;
    let tempSecond = second < 10 ? "0" + second : second;

    return tempMinutes + ":" + tempSecond;
}