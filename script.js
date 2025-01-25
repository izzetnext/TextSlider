document.addEventListener('DOMContentLoaded', () => {

    // Klavye kontrolü için olay dinleyicisi
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowRight':
                stopCurrentPlayback();
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateSlide();
                break;
            case 'ArrowLeft':
                stopCurrentPlayback();
                currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                updateSlide();
                break;
            case 'Enter':
                isPlaying = !isPlaying;
                playPauseBtn.src = isPlaying ? 'images/pause.png' : 'images/play.png';
                if (isPlaying) {
                    updateSlide();
                } else {
                    stopCurrentPlayback();
                }
                break;
            case ' ': // Boşluk tuşu
                isSoundOn = !isSoundOn;
                soundToggle.src = isSoundOn ? 'images/sound-on.png' : 'images/sound-off.png';
                // Eğer oynatma devam ediyorsa ve ses açıldıysa, mevcut slaytı seslendir
                if (isPlaying && isSoundOn) {
                    speakCurrentSlide();
                }
                break;
        }
    });

    const fileInput = document.getElementById('file-input');
    const chooseLocalFile = document.getElementById('choose-local-file');
    const textContent = document.getElementById('text-content');
    const slideInfo = document.getElementById('slide-info');
    const playPauseBtn = document.getElementById('play-pause');
    const previousBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    const fastBackwardBtn = document.getElementById('fast-backward');
    const fastForwardBtn = document.getElementById('fast-forward');

    const soundToggle = document.getElementById('sound-toggle');
    const shuffleToggle = document.getElementById('shuffle-toggle');

    const delaySlider = document.getElementById('slider-value');
    const slideDelayValue = document.getElementById('slide-delay-value'); // slide-delay-value elemanını seçin
       

    const chooseFromCloud = document.getElementById('choose-from-cloud');
    const cloudModal = document.getElementById('cloudModal');

    chooseLocalFile.addEventListener('click', () => fileInput.click());

    chooseFromCloud.addEventListener('click', () => {
        cloudModal.style.display = 'block';
        loadLanguages();
    });
    

    let slides = [];
    let currentSlideIndex = 0;
    let isPlaying = false;
    let isSoundOn = false;
    let isShuffleOn = false;
    let playTimeout = null;

    const speechSynthesis = window.speechSynthesis;
    let currentSpeech = null;

    // Function to clean text
    function cleanText(text) {
        // Remove all * characters
        text = text.replace(/\*/g, '');
        return text.trim();
    }

    
    function loadLanguages() {
        fetch('languages.json')
            .then(response => response.json())
            .then(data => {
                const select_language = document.getElementById('select_language');
                data.forEach(language => {
                    const option = document.createElement('option');
                    option.value = option.textContent = language.language;
                    select_language.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function handleLanguageChange() {
        const language = document.getElementById('select_language').value;
        const select_text_slide = document.getElementById('select_text_slide');
        select_text_slide.innerHTML = '<option value="" selected>Select a text.slide</option>';
    
        if (language) {
            fetch('languages.json')
                .then(response => response.json())
                .then(data => {
                    const languageFiles = data.find(l => l.language === language)?.files || []; // Boş dizi atadık
                    languageFiles.forEach(fileName => {
                        const option = document.createElement('option');
                        option.value = option.textContent = fileName;
                        select_text_slide.appendChild(option);
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    }

    function handleTextSlideChange() {
        const select_language = document.getElementById('select_language');
        const select_text_slide = document.getElementById('select_text_slide');
        const filePath = `Languages/${select_language.value}/${select_text_slide.value}`;
        const fileUrl = `https://raw.githubusercontent.com/izzetnext/TextSlider/main/${filePath}`;

        if (select_text_slide.value) {
            fetch(fileUrl)
                .then(response => response.text())
                .then(data => {
                    slides = data.split(/\n\n|\n/)
                        .filter(slide => slide.trim() !== '')
                        .map(cleanText);

                    if (slides.length > 0) {
                        currentSlideIndex = 0;
                        updateSlide();
                        closeCloudModal();
                    }
                })
                .catch((error) => {
                    console.error('Fetch error: ', error);
                });
        }
    }

    function closeCloudModal() {
        cloudModal.style.display = 'none';
    }


    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const text = await file.text();
                slides = text.split(/\n\n|\n/)
                    .filter(slide => slide.trim() !== '')
                    .map(cleanText);
                
                if (slides.length > 0) {
                    currentSlideIndex = 0;
                    updateSlide();
                }
            } catch (error) {
                console.error('Error reading file:', error);
                textContent.textContent = 'Error reading file: ' + error.message;
            }
        }
    });

    function stopCurrentPlayback() {
        if (currentSpeech) {
            speechSynthesis.cancel();
            currentSpeech = null;
        }
        if (playTimeout) {
            clearTimeout(playTimeout);
            playTimeout = null;
        }
    }

    delaySlider.addEventListener('input', () => {
        slideDelayValue.textContent = delaySlider.value; // Metni güncelle
    });

    function updateSlide(index = currentSlideIndex) {
        if (slides.length > 0) {
            currentSlideIndex = index;
    
            // Metni "(((" ve ")))" işaretlerinden ayırın
            const parts = slides[currentSlideIndex].split('((');
            const beforeParentheses = parts[0];
            const insideParentheses = parts[1] ? parts[1].split('))')[0] : '';
            const afterParentheses = parts[1] ? parts[1].split('))')[1] : '';
    
            // Metni birleştirerek iki satır atlayın
            textContent.innerHTML = `${beforeParentheses}<br><br><br><br><span style="color:grey">${insideParentheses}</span><br>${afterParentheses}`;
    



            slideInfo.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
    
            stopCurrentPlayback();
    
            if (isSoundOn) {
                speakCurrentSlide();
            } else if (isPlaying) {
                playTimeout = setTimeout(proceedToNextSlide, delaySlider.value * 1000);
            }
        }
    }

    function speakCurrentSlide() {
        // Split the text at the first "((" occurrence
        const textBeforeParentheses = slides[currentSlideIndex].split('((')[0];
        
        currentSpeech = new SpeechSynthesisUtterance(textBeforeParentheses);
        
        currentSpeech.lang = 'de-DE';
        const germanVoices = speechSynthesis.getVoices()
            .filter(voice => voice.lang.startsWith('de-'));
        
        if (germanVoices.length > 0) {
            currentSpeech.voice = germanVoices[0];
        }

        currentSpeech.onend = () => {
            if (isPlaying) {
                playTimeout = setTimeout(proceedToNextSlide, delaySlider.value * 1000); // delaySlider değerini kullan
            }
        };
        speechSynthesis.speak(currentSpeech);



    }

    function proceedToNextSlide() {
        if (!isPlaying) return;

        if (isShuffleOn) {
            currentSlideIndex = Math.floor(Math.random() * slides.length);
        } else {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        }
        updateSlide();
    }

    // Calculate jump size based on total slides
    function calculateJumpSize() {
        return Math.max(1, Math.floor(slides.length / 12));
    }

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.src = isPlaying ? 'images/pause.png' : 'images/play.png';

        if (isPlaying) {
            updateSlide();
        } else {
            stopCurrentPlayback();
        }
    });

    previousBtn.addEventListener('click', () => {
        stopCurrentPlayback();
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopCurrentPlayback();
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlide();
    });

    fastBackwardBtn.addEventListener('click', () => {
        stopCurrentPlayback();
        const jumpSize = calculateJumpSize();
        currentSlideIndex = Math.max(0, currentSlideIndex - jumpSize);
        updateSlide();
    });

    fastForwardBtn.addEventListener('click', () => {
        stopCurrentPlayback();
        const jumpSize = calculateJumpSize();
        currentSlideIndex = Math.min(slides.length - 1, currentSlideIndex + jumpSize);
        updateSlide();
    });

    soundToggle.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundToggle.src = isSoundOn 
            ? 'images/sound-on.png' 
            : 'images/sound-off.png';
    });

    shuffleToggle.addEventListener('click', () => {
        isShuffleOn = !isShuffleOn;
        shuffleToggle.src = isShuffleOn 
            ? 'images/shuffle-on.png' 
            : 'images/shuffle-off.png';
    });
});