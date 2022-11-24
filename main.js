/*
1. Render songs -> OK
2. Scroll top -> OK
3. Play / pause / seek -> OK
4. CD rotate -> OK
5. next / prev -> OK
6. random -> OK
7. Next / repeat when ended -> OK
8. Active song -> OK
9. Scroll active song into view -> OK
10. play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playlist = $('.playlist');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Without Me x Hik Hik Remix',
            singer: 'Phuoc',
            path: './assets/songs/Without-Me.mp3',
            image: './img/1.jpg'
        },
        {
            name: 'Summertime Sadness Remix',
            singer: 'Thuan',
            path: './assets/songs/Summertime.mp3',
            image: './img/2.jpg'
        },
        {
            name: 'FADED LOVE Remix',
            singer: 'Thuan',
            path: './assets/songs/faded-love.mp3',
            image: './img/3.png'
        },
        {
            name: 'Diamond Remix',
            singer: 'Thuan',
            path: './assets/songs/Diamond.mp3',
            image: './img/4.jpg'
        },
        {
            name: 'Without Me x Hik Hik Remix',
            singer: 'Phuoc',
            path: './assets/songs/Without-Me.mp3',
            image: './img/1.jpg'
        },
        {
            name: 'Summertime Sadness Remix',
            singer: 'Thuan',
            path: './assets/songs/Summertime.mp3',
            image: './img/2.jpg'
        },
        {
            name: 'FADED LOVE Remix',
            singer: 'Thuan',
            path: './assets/songs/faded-love.mp3',
            image: './img/3.png'
        },
        {
            name: 'Diamond Remix',
            singer: 'Thuan',
            path: './assets/songs/Diamond.mp3',
            image: './img/4.jpg'
        },
    ],

    render: function () {
        let htmls = this.songs.map( (song, index) => {
            return `
                <div class="song  ${index === this.currentIndex ? 'active' : ' '}  ">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents : function () {
        let cdWidth = cd.offsetWidth;
        let _this  = this;

        // xử lý phóng to thu nhỏ
        document.onscroll = () => {
            let scroll =  window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scroll;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý CD quay
        let cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        }) 
        cdThumbAnimate.pause()
        audio.play()

        // xử lý click play / pause
        playBtn.onclick = () => {
            _this.isPlaying ? audio.pause() : audio.play();

        }
        // khi song play
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing');
            cdThumbAnimate.play()
        }
        // khi song pause
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = () => {
            if(audio.duration){
                let  progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
           
        }
        // Xử lý khi tua
        progress.onchange = (e) => {
            let seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // khi next song
        nextBtn.onclick = () => {

            _this.isRandom ? _this.playRandomSong() : _this.nextSong();
            // if(_this.isRandom){
            //     _this.playRandomSong();
            // } else {
            //     _this.nextSong();   
            // }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // khi prev song
        prevBtn.onclick = () => {
            _this.isRandom ? _this.playRandomSong() : _this.prevSong();
            audio.play()
        }

         // Xử lý random bật tắt
        randomBtn.onclick = () => {
            randomBtn.classList.toggle('active');
            randomBtn.classList.contains('active') ?  _this.isRandom = true : _this.isRandom = false;        
        }

        // Xử lý lặp lại 1 song
        repeatBtn.onclick = () => {
            repeatBtn.classList.toggle('active');
            repeatBtn.classList.contains('active') ? _this.isRepeat = true : _this.isRepeat = false;
            
        }
       
        // Xử lý next song khi audio ended
        audio.onended = () => {
            _this.isRepeat ? audio.play() : nextBtn.click();
        }
    },

    loadCurrentSong: function() {
        heading.textContent =this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
       
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
        
    },
    prevSong : function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 200)
    },

    start: function () {
        //  định nghĩa các thuôc tính các object
        this.defineProperties()

        // lắng nghe / xử lý các sự kiện
        this.handleEvents()

        // tải thông tin bài hát đầu tiền vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render ra các bài hát
        this.render()
    }

}

app.start();