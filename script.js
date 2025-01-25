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

    const chooseFromCloud = document.getElementById('choose-from-cloud');
    const cloudModal = document.getElementById('cloudModal');
    const closeCloudModal = cloudModal.querySelector('.close');
    const selectLanguage = document.getElementById('select_language');
    const selectTextSlide = document.getElementById('select_text_slide');
    const loadCloudFileBtn = document.getElementById('load-cloud-file');
    
    chooseFromCloud.addEventListener('click', () => {
        cloudModal.style.display = 'block';
        populateLanguageOptions(); // Dil seçeneklerini doldur
    });
    
    closeCloudModal.addEventListener('click', () => {
        cloudModal.style.display = 'none';
    });



    function populateLanguageOptions() {
        fetch('languages.json')
            .then(response => response.json())
            .then(languages => {
                selectLanguage.innerHTML = '<option value="" selected>Select Language</option>'; // Reset options
                languages.forEach(language => {
                    let option = document.createElement('option');
                    option.value = language.language;
                    option.text = language.language;
                    selectLanguage.add(option);
                });
            })
            .catch(error => console.error('Error fetching languages:', error));
    }


    selectLanguage.addEventListener('change', () => {
        const selectedLanguage = selectLanguage.value;
        fetch('languages.json')
            .then(response => response.json())
            .then(languages => {
                const selectedLanguageData = languages.find(lang => lang.language === selectedLanguage);
                selectTextSlide.innerHTML = '<option value="" selected>Select a text.slide</option>'; // Reset options
                if (selectedLanguageData) {
                    selectedLanguageData.files.forEach(file => {
                        let option = document.createElement('option');
                        option.value = file;
                        option.text = file;
                        selectTextSlide.add(option);
                    });
                }
            })
            .catch(error => console.error('Error fetching languages:', error));
    });



    loadCloudFileBtn.addEventListener('click', () => {
        const selectedLanguage = selectLanguage.value;
        const selectedFile = selectTextSlide.value;
        if (selectedLanguage && selectedFile) {
            const filePath = `${selectedLanguage}/${selectedFile}`;
            fetch(filePath)
                .then(response => response.text())
                .then(text => {
                    slides = text.split(/\n\n|\n/)
                        .filter(slide => slide.trim() !== '')
                        .map(cleanText);
                    currentSlideIndex = 0;
                    updateSlide();
                })
                .catch(error => console.error('Error fetching slides:', error));
            cloudModal.style.display = 'none';
        }
    });

 




    chooseLocalFile.addEventListener('click', () => fileInput.click());
    
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