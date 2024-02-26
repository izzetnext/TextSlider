let currentIndex = 0;
let isPlaying = false;
let isMuted = false; // Eklenen değişken
let timer;
let lines = [];

  
const fileInput = document.getElementById('fileInput');
const playPauseBtn = document.getElementById('playPauseBtn');
const delayInput = document.getElementById('delayInput');
const displayText = document.getElementById('displayText');
const synth = window.speechSynthesis;
const muteUnmuteBtn = document.getElementById('muteUnmuteBtn'); // Eklenen buton
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const presetTextsSelect = document.getElementById('presetTexts');


prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
    }
});

nextBtn.addEventListener('click', function() {
    if (currentIndex < lines.length - 1) {
        currentIndex++;
        updateSlide();
    }
});

function updateSlide() {
   // displayText.innerText = lines[currentIndex];
    splitAndDisplayText (lines[currentIndex]) ;
  
    
    clearTimeout(timer);
    if (isPlaying) {
        synth.cancel(); // Hali hazırda konuşma varsa iptal et
        speakText();
    }
}


fileInput.addEventListener('change', handleFileUpload);
playPauseBtn.addEventListener('click', togglePlayPause);
muteUnmuteBtn.addEventListener('click', toggleMuteUnmute); // Eklenen event listener
 

document.body.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        togglePlayPause();
    }
});


function toggleMuteUnmute() { // Eklenen fonksiyon
    isMuted = !isMuted;
    muteUnmuteBtn.innerText = isMuted ? 'Unmute' : 'Mute';
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        lines = e.target.result.split('\n');
        currentIndex = 0;
        //displayText.innerText = lines[currentIndex];
        splitAndDisplayText (lines[currentIndex]) ;
    };
    reader.readAsText(file);
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseBtn.innerText = isPlaying ? 'Pause' : 'Play';
    if (isPlaying) {
        speakText();
    } else {
        clearTimeout(timer);
        synth.cancel(); // Konuşma duraklatıldığında mevcut seslendirmeyi durdurur.
    }
}

 

//... Diğer kodlar
function speakText() {
    if (!isMuted && !synth.speaking) { 
        
        let utterThis = new SpeechSynthesisUtterance(  lines[currentIndex].split('((')[0]   );
        utterThis.lang = 'de-DE';
        utterThis.onend = handleSpeakingEnd;
        synth.speak(utterThis);
    } else {
        // Eğer ses kapatılmışsa, konuşma bitimini simüle eder
        handleSpeakingEnd();
    }
}
 
function handleSpeakingEnd() {
    timer = setTimeout(() => {
        currentIndex++;
        if (currentIndex < lines.length) {
            //displayText.innerText = lines[currentIndex];
            splitAndDisplayText (lines[currentIndex]) ;
            speakText();
        } else {
            isPlaying = false;
            playPauseBtn.innerText = 'Play';
            currentIndex = 0;
        }
    }, delayInput.value);
}


function translateText(text) {
    // Bu fonksiyonu daha kompleks bir çeviri API'si ile değiştirebilirsiniz.
    // Burada basit bir sözlük kullanıyoruz, bu nedenle çeviri mükemmel olmayacaktır.
    const simpleDictionary = {
        "Hallo": "dddddd",
        "Welt": "Dünya",
        // Diğer kelimeleri buraya ekleyin...
    };

    const translated = text.split(" ").map(word => simpleDictionary[word] || word).join(" ");
    document.getElementById('translationText').innerText = translated;
}


 
presetTextsSelect.addEventListener('change', function() {
    if (presetTextsSelect.value) {
        fetch(presetTextsSelect.value)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                lines = data.split('\n');
                currentIndex = 0;
                updateSlide();
            })
            .catch((error) => {
                console.error('Fetch error: ', error);
            });
    }
});



document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
    }
});

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
    }
}

function nextSlide() {
    if (currentIndex < lines.length - 1) {
        currentIndex++;
        updateSlide();
    }
}



function splitAndDisplayText(text) {
    // Metni ' ((' karakterlerine göre böl ve sonucu bir dizide sakla
    const parts = text.split('((');

    // İkinci kısmın sonunda bulunan '))' karakterlerini kaldır
    if (parts[1]) {
        parts[1] = parts[1].replace('))', '');
    }

    // HTML'de gösterilecek metni oluştur
    // İlk kısmı ve ikinci kısmı ayrı satırlara koy
    const displayText = parts[0] + '<br><br><br>(  ' + parts[1] + ')';

    // Metni HTML elemanına yazdır
    document.getElementById('displayText').innerHTML = displayText;
}

 





