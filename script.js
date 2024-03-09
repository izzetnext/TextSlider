let currentSlide = 0;
let isPlaying = false;
let isMuted = false; // Eklenen değişken
let timer;
let textfile_lines = [];
let fast_track = 1;
let slide_delay = 1; 
let volume_level = 1;

const synth = window.speechSynthesis;
 

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  if (this.value < 1) {
         this.value =1 ; 
        }
  output.innerHTML = this.value;
  slide_delay = this.value;
}


// Buton efektleri için örnek
document.querySelectorAll('.toolbar img').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.9)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });
});


// Dosya Seç butonu işlevi
function chooseFile() {
    var fileInput = document.getElementById('file-input');

    fileInput.click(); // Kullanıcıdan dosya seçmesini isteyen diyalog kutusunu aç

    fileInput.onchange = function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            // Dil ve text slide seçim kutularının seçili indekslerini sıfırla
            document.getElementById('select_language').selectedIndex = 0;
            document.getElementById('select_text_slide').innerHTML = '<option value="" selected>Select a text.slide</option>';

            reader.onload = function(e) {
                const fileContent = e.target.result;
                // Dosyanın içeriğini kullanarak textfile_lines dizisini doldur
                textfile_lines = fileContent.split('\n');
                currentSlide = 0; // Başlangıç slaytını sıfırla
                fast_track = Math.floor(textfile_lines.length / 11); // fast_track hesapla
                updateSlide(); // İlk slaytı göster
            };

            reader.readAsText(file); // Dosyayı metin olarak oku
            // Seçilen dosyanın adını göster
            document.getElementById('text-content').textContent = "Selected file: " + file.name;
        }
    };
}





// Slayt Bilgisi Güncelleme
function updateSlideInfo(currentSlide, totalSlides) {
    // Slayt bilgisini günceller
    var slideInfo = document.getElementById('slide-info');
    slideInfo.textContent = `${currentSlide} / ${totalSlides}`;
}


// Oynat/Duraklat butonu işlevi
function togglePlayPause() {
    var img = document.getElementById('play-pause');
    if (img.src.includes("play.png")) {
        img.src = "images/pause.png";
        //document.getElementById('text-content').textContent = 'Playing slides.' ;
    } else {
        img.src = "images/play.png";
        //document.getElementById('text-content').textContent = 'Paused slides.' ;
    }

    isPlaying = !isPlaying;
    if (isPlaying) {
        speakText();
    } else {
        clearTimeout(timer);
        synth.cancel(); // Konuşma duraklatıldığında mevcut seslendirmeyi durdurur.
    }

}



// Ses Aç/Kapa butonu işlevi
function toggleSound() {
    var img = document.getElementById('sound-toggle');
    if (img.src.includes("sound-on.png")) {
        img.src = "images/sound-off.png";
        volume_level = 0 ;
        synth.cancel(); // Hali hazırda konuşma varsa iptal et
        speakText();
        //document.getElementById('text-content').textContent = 'Sound off.' ;
    } else {
        img.src = "images/sound-on.png";
        volume_level = 1 ;
        //document.getElementById('text-content').textContent = 'Sound on.' ;
    }
}

// Karıştır Aç/Kapa butonu işlevi
function toggleShuffle() {
    var img = document.getElementById('shuffle-toggle');
    if (img.src.includes("shuffle-on.png")) {
        img.src = "images/shuffle-off.png";
        //document.getElementById('text-content').textContent = 'Shuffle off.' ;
    } else {
        img.src = "images/shuffle-on.png";
        //document.getElementById('text-content').textContent = 'Shuffle on.' ;
    }
}



function handleSpeakingEnd() {
    timer = setTimeout(() => {

    // shuffle-toggle butonunun şu anki durumunu kontrol et
    const shuffleEnabled = document.getElementById('shuffle-toggle').src.includes('shuffle-on.png');

    if (shuffleEnabled) {
        // Rastgele bir slayta geç
        currentSlide = Math.floor(Math.random() * textfile_lines.length);
        updateSlide();
    } else {
        // Normal bir sonraki slayta geçiş yap
        if (currentSlide < textfile_lines.length - 1) {
            currentSlide++;
            updateSlide();
        }

        
    }





        
    }, slide_delay*1000 );
}



function speakText() {
    if (!isMuted && !synth.speaking) { 
        
        let utterThis = new SpeechSynthesisUtterance(  textfile_lines[currentSlide].split('((')[0]   );
        utterThis.lang = 'de-DE';

        // utterThis.pitch = 2; // Ses tonu, varsayılan değer 1'dir. Min 0.1, Max 2 arasında değer alabilir.
        // utterThis.rate = 0.3; // Konuşma hızı, varsayılan değer 1'dir. Min 0.1, Max 10 arasında değer alabilir.
         utterThis.volume = volume_level ; // Ses seviyesi, varsayılan değer 1'dir. Min 0, Max 1 arasında değer alabilir.

        utterThis.onend = handleSpeakingEnd;
        synth.speak(utterThis);
    } else {
        // Eğer ses kapatılmışsa, konuşma bitimini simüle eder
        handleSpeakingEnd();
    }
}  


// Hızlı Geri butonu işlevi
function fastBackward() {
    // Slayt gösterisinde 20 slayt geriye gider.
    currentSlide -= fast_track;
    if (currentSlide < 0) {
        currentSlide = 0; // En baştan öncesine gitmek mümkün değilse, başa al.
    }
    updateSlide();
}

// Hızlı İleri butonu işlevi
function fastForward() {
    // Slayt gösterisinde 20 slayt ileriye gider.
    currentSlide += fast_track;
    if (currentSlide >= textfile_lines.length) {
        currentSlide = textfile_lines.length - 1; // En sondan sonrasına gitmek mümkün değilse, sona al.
    }
    updateSlide();
}

// Önceki Slayt butonu işlevi
function previousSlide() {
    // shuffle-toggle butonunun şu anki durumunu kontrol et
    const shuffleEnabled = document.getElementById('shuffle-toggle').src.includes('shuffle-on.png');

    if (shuffleEnabled) {
        // Rastgele bir slayta geç
        currentSlide = Math.floor(Math.random() * textfile_lines.length);
        updateSlide();
    } else {
        // Normal bir önceki slayta geçiş yap
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }
}


// Sonraki Slayt butonu işlevi
function nextSlide() {
    // shuffle-toggle butonunun şu anki durumunu kontrol et
    const shuffleEnabled = document.getElementById('shuffle-toggle').src.includes('shuffle-on.png');

    if (shuffleEnabled) {
        // Rastgele bir slayta geç
        currentSlide = Math.floor(Math.random() * textfile_lines.length);
        updateSlide();
    } else {
        // Normal bir sonraki slayta geçiş yap
        if (currentSlide < textfile_lines.length - 1) {
            currentSlide++;
            updateSlide();
        }
    }
}


function single_line_parsing(text) {
    // Metni ' ((' karakterlerine göre böl ve sonucu bir dizide sakla
    const parts = text.split('((');

    // İkinci kısmın sonunda bulunan '))' karakterlerini kaldır
    if (parts[1]) {
        parts[1] = parts[1].replace('))', '');
    }

    // HTML'de gösterilecek metni oluştur
    // İlk kısmı ve ikinci kısmı ayrı satırlara koy
    //const displayText = parts[0] + '<br><br><br><br>(  ' + parts[1] + ')';

    const displayText = parts[0] + '<br><br> <p style="font-size:70%; color:MediumSeaGreen;"> (  ' +  parts[1] + ')</p> ';      

    // Metni HTML elemanına yazdır
    document.getElementById('text-content').innerHTML = displayText;
}




function updateSlide() {

    updateSlideInfo (currentSlide+1 , textfile_lines.length);
    single_line_parsing (textfile_lines [currentSlide]) ;

    clearTimeout(timer);
    if (isPlaying) {
        synth.cancel(); // Hali hazırda konuşma varsa iptal et
        speakText();
    }
    //adjustFontSize() ;
}



function handleTextSlideChange() {
    const select_language = document.getElementById('select_language');
    const select_text_slide = document.getElementById('select_text_slide');

    if (select_text_slide.value) {
        // Dosyanın tam yolunu oluştur
        const filePath = `Languages/${select_language.value}/${select_text_slide.value}`;
        const fileUrl = `https://raw.githubusercontent.com/izzetnext/TextSlider/main/${filePath}`;

        fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                // Dosyanın içeriği data değişkeninde
                // Şimdi ne yapmak istediğinize bağlı olarak bu veriyi kullanabilirsiniz.
                // Örneğin, içeriği bir div veya pre etiketine yazdırabilirsiniz.
                document.getElementById('text-content').textContent = data;
                // textfile_lines ve currentSlide'ı güncelleme işlemlerinizi burada yapabilirsiniz.
                textfile_lines = data.split('\n');
                currentSlide = 0;
                fast_track = Math.floor(textfile_lines.length / 11);
                updateSlide();
            })
            .catch((error) => {
                console.error('Fetch error: ', error);
            });
    }
}



 
// Dil seçimi değiştiğinde çağrılacak fonksiyon
function handleLanguageChange() {
    
    const language = this.value; // Seçilen dil
    console.log("Dil seçimi değişti" + language);

    document.getElementById('text-content').textContent = 'Language selection changed to: ' + language;

    // JSON dosyasından seçilen dildeki text dosyalarını yüklemek için
    const jsonUrl = 'languages.json';
    
    fetch(jsonUrl)
        .then(response => response.json())
        .then(languagesWithFiles => {
            const select_text_slide = document.getElementById('select_text_slide');
            select_text_slide.innerHTML = ''; // Önceki seçenekleri temizle
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a text.slide';
            defaultOption.disabled = true; // Kullanıcı bu seçeneği seçemesin
            defaultOption.selected = true; // Varsayılan olarak bu seçenek gösterilsin
            select_text_slide.appendChild(defaultOption);

            // Seçilen dile ait dosyaları bul
            const languageFiles = languagesWithFiles.find(l => l.language === language)?.files || [];
            
            languageFiles.forEach(fileName => {
                const option = document.createElement('option');
                option.value = option.textContent = fileName;
                select_text_slide.appendChild(option);
            });

            // İlk seçeneği otomatik olarak seç
            if (select_text_slide.options.length > 1) {
                select_text_slide.selectedIndex = 1;
                // "change" olayını manuel olarak tetikle
                select_text_slide.dispatchEvent(new Event('change'));
            }
        })
        .catch(error => console.error('Error:', error));
}




function LoadLanguages(callback) {
    const jsonUrl = 'languages.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const select_language = document.getElementById('select_language');
            data.forEach(language => {
                const option = document.createElement('option');
                option.value = option.textContent = language.language; // 'language' anahtarınızın ismine göre düzenleyin
                select_language.appendChild(option);
            });
            // Veriler başarıyla işlendikten sonra callback fonksiyonunu çağır
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// Butonların Event Listener'larını tanımla
function setupEventListeners() {
    document.getElementById('choose-file').onclick = chooseFile;
    document.getElementById('fast-backward').onclick = fastBackward;
    document.getElementById('previous').onclick = previousSlide;
    document.getElementById('play-pause').onclick = togglePlayPause;
    document.getElementById('next').onclick = nextSlide;
    document.getElementById('fast-forward').onclick = fastForward;
    document.getElementById('sound-toggle').onclick = toggleSound;
    document.getElementById('shuffle-toggle').onclick = toggleShuffle;
    // Dil seçim kutusuna olay dinleyicisi ekle
    document.getElementById('select_language').addEventListener('change', handleLanguageChange);
    // Text.slide seçim kutusuna olay dinleyicisi ekle
    document.getElementById('select_text_slide').addEventListener('change', handleTextSlideChange);
    // Danke butonu için modal açma işlevselliği
    var dankeBtn = document.getElementById('danke');
    var modal = document.getElementById('myModal');
    var closeSpan = document.getElementsByClassName('close')[0];

    dankeBtn.onclick = function() {
        modal.style.display = 'block';
    }

    closeSpan.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // content-wrapper kontrolü için ek işlevsellik
    setupContentWrapperControls();
}

function setupContentWrapperControls() {
    const contentWrapper = document.querySelector('.content-wrapper');

    contentWrapper.addEventListener('click', function(event) {
        const bounds = this.getBoundingClientRect();
        const width = bounds.width;
        const clickX = event.clientX - bounds.left; // Tıklanan X koordinatı

        if (clickX < width * 0.3) { // Sol %30'luk alan
            previousSlide();
        } else if (clickX > width * 0.7) { // Sağ %30'luk alan
            nextSlide();
        } else { // Orta alan
            togglePlayPause();
        }
    });
}

 

function adjustFontSizeForScreen() {
    const textContent = document.getElementById('text-content');
    if (window.innerWidth < 768) { // Küçük ekranlar için
        textContent.style.fontSize = '18px';
    } else if (window.innerWidth < 1024) { // Orta boy ekranlar için
        textContent.style.fontSize = '26px';
    } else { // Büyük ekranlar için
        textContent.style.fontSize = '48px';
    }
}



function adjustFontSizeForTextLength() {
    const textContent = document.getElementById('text-content');
    const textLength = textContent.textContent.length;
    if (textLength < 50) { // Kısa metinler için
        textContent.style.fontSize = '18px';
    } else if (textLength < 100) { // Orta uzunlukta metinler için
        textContent.style.fontSize = '28px';
    } else { // Uzun metinler için
        textContent.style.fontSize = '48px';
    }
}



function adjustFontSize() {
    adjustFontSizeForScreen();
    adjustFontSizeForTextLength();
    // İsteğe bağlı olarak, burada ekran boyutu ve metin uzunluğuna göre daha karmaşık bir mantık uygulayabilirsiniz.
}


function setupKeyboardControls() {

    document.addEventListener('keydown', function(event) {
    const select_text_slide = document.getElementById('select_text_slide');
    const selectedIndex = select_text_slide.selectedIndex;
    let changeMade = false;

        switch (event.key) {
            case 'ArrowUp':
                // Sol yön tuşuna basıldığında önceki slayta geç
                if (selectedIndex > 0) {
                    select_text_slide.selectedIndex = selectedIndex - 1;
                    changeMade = true;
                }
                break;
            case 'ArrowDown':
                // Sol yön tuşuna basıldığında önceki slayta geç
                if (selectedIndex < select_text_slide.options.length - 1) {
                    select_text_slide.selectedIndex = selectedIndex + 1;
                    changeMade = true;
                }
                break;
            case 'ArrowLeft':
                // Sol yön tuşuna basıldığında önceki slayta geç
                previousSlide();
                break;
            case 'ArrowRight':
                // Sağ yön tuşuna basıldığında sonraki slayta geç
                nextSlide();
                break;
            case 'Space':
                // Boşluk (Space) tuşuna basıldığında oynat/duraklat
                togglePlayPause();
                break;
        }
        // Eğer bir değişiklik yapıldıysa, change olayını manuel olarak tetikle
        if (changeMade) {
            const event = new Event('change');
            select_text_slide.dispatchEvent(event);
        }        
    });
}


function selectDefaultLanguage() {
    // Varsayılan dil kodunu ayarlayın, örneğin 'en-US'
    var defaultLanguageCode = 'Deutsch';
    var selectLanguageElement = document.getElementById('select_language');

    // `select_language` <select> elementinin <option> larını dolaş
    for (var i = 0; i < selectLanguageElement.options.length; i++) {
        if (selectLanguageElement.options[i].value === defaultLanguageCode) {
            // Varsayılan dil kodunu bulduğunuzda, onu seçili yap
            selectLanguageElement.selectedIndex = i;
            break; // Döngüden çık
        }
    }
}

function selectRandomTextSlide(selectElement) {
    const optionsCount = selectElement.options.length;
    console.log( selectElement.options.length );
    if (optionsCount > 0) {
        // Rasgele bir index seç
        const randomIndex = Math.floor(Math.random() * optionsCount);
        selectElement.selectedIndex = randomIndex;
        const event = new Event('change');
        selectElement.dispatchEvent(event);        
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // DOM yüklendiğinde çalışacak kodlar
    setupEventListeners();
    // Diğer işlemler
    console.log( "DOMContentLoaded" );
});

// Sayfa yüklendiğinde tüm event listener'ları ayarla
window.onload = function() {
    setupEventListeners();
    // LoadLanguages işlemi tamamlandığında selectDefaultLanguage fonksiyonunu çağır
    LoadLanguages(function() {
        selectDefaultLanguage(); 
        console.log( "select_language"  + select_language.options.length  ); 
        const event = new Event('change');
        select_language.dispatchEvent(event);

    });

    setupKeyboardControls();

      
/*     var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
 
    // Seslerin her birini konsola yazdır
    voices.forEach(function(voice, index) {
        console.log(index + ': ' + voice.name + ' (' + voice.lang + ')');
    });

    // "Microsoft Katja - German (Germany)" sesini seç
    for(var i = 0; i < voices.length; i++) {
        if(voices[i].name === "Microsoft Hedda - German (Germany)") {
            msg.voice = voices[i];
        }
    } */
 
    console.log( "window.onload" );  
    
  //  selectRandomTextSlide(select_text_slide);

}