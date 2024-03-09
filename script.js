let currentSlide = 0;
let isPlaying = false;
let isMuted = false; // Eklenen değişken
let timer;
let textfile_lines = [];
let fast_track = 1;
let slide_delay = 1; 

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
    // Gizli dosya input elementini bul
    var fileInput = document.getElementById('file-input');

    // Dosya seçim diyalogunu aç
    fileInput.click();

    // Dosya seçildiğinde bir işlem yapmak için bir event listener ekleyin
    fileInput.onchange = function() {
        if (fileInput.files.length > 0) {
            // Seçilen dosyanın adını al ve bir yerde kullan
            var fileName = fileInput.files[0].name;
            // Örneğin, seçilen dosyanın adını text-content elementinde göster
            document.getElementById('text-content').textContent = "Selected file: " + fileName;
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
        document.getElementById('text-content').textContent = 'Sound off.' ;
    } else {
        img.src = "images/sound-on.png";
        document.getElementById('text-content').textContent = 'Sound on.' ;
    }
}

// Karıştır Aç/Kapa butonu işlevi
function toggleShuffle() {
    var img = document.getElementById('shuffle-toggle');
    if (img.src.includes("shuffle-on.png")) {
        img.src = "images/shuffle-off.png";
        document.getElementById('text-content').textContent = 'Shuffle off.' ;
    } else {
        img.src = "images/shuffle-on.png";
        document.getElementById('text-content').textContent = 'Shuffle on.' ;
    }
}



function handleSpeakingEnd() {
    timer = setTimeout(() => {
        currentSlide++;
        if (currentSlide < textfile_lines.length) {
            //displayText.innerText = lines[currentIndex];
            single_line_parsing (textfile_lines[currentSlide]) ;
            speakText();
        } else {
            isPlaying = false;
            currentSlide = 0;
        }
    }, slide_delay*1000 );
}



function speakText() {
    if (!isMuted && !synth.speaking) { 
        
        let utterThis = new SpeechSynthesisUtterance(  textfile_lines[currentSlide].split('((')[0]   );
        utterThis.lang = 'de-DE';

        // utterThis.pitch = 2; // Ses tonu, varsayılan değer 1'dir. Min 0.1, Max 2 arasında değer alabilir.
        // utterThis.rate = 0.3; // Konuşma hızı, varsayılan değer 1'dir. Min 0.1, Max 10 arasında değer alabilir.
        // utterThis.volume = 1; // Ses seviyesi, varsayılan değer 1'dir. Min 0, Max 1 arasında değer alabilir.

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
    // Bu fonksiyon, slayt gösterisinde bir önceki slayta geçiş yapar.
    //document.getElementById('text-content').textContent = 'Previous Slide button clicked.' ;
    if (currentSlide > 0 ) {
        currentSlide--;
        updateSlide();
    }
}

// Sonraki Slayt butonu işlevi
function nextSlide() {
    // Bu fonksiyon, slayt gösterisinde bir sonraki slayta geçiş yapar.
    //document.getElementById('text-content').textContent = 'Next Slide button clicked.' ;
    if (currentSlide < textfile_lines.length - 1) {
        currentSlide++;
        updateSlide();
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

    const displayText = parts[0] + '<br><br><br><br> <p style="color:MediumSeaGreen;"> (  ' +  parts[1] + ')</p> ';      

    // Metni HTML elemanına yazdır
    document.getElementById('text-content').innerHTML = displayText;
}




function updateSlide() {

    console.log(  "textfile_lines.length=" + textfile_lines.length );
    console.log(  "currentSlide" + currentSlide  ) ;

     
    updateSlideInfo (currentSlide+1 , textfile_lines.length);
    single_line_parsing (textfile_lines [currentSlide]) ;

    clearTimeout(timer);
    if (isPlaying) {
        synth.cancel(); // Hali hazırda konuşma varsa iptal et
        speakText();
    }
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




function LoadLanguages() {
    // JSON dosyasının yolu (örneğin 'languages.json' veya uygun yolu belirtin)
    const jsonUrl = 'languages.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const select_language = document.getElementById('select_language');
            // Önceden oluşturulmuş ve kaydedilmiş JSON verisini kullanarak dilleri listele
            data.forEach(language => {
                const option = document.createElement('option');
                option.value = option.textContent = language.language; // 'language' anahtarınızın ismine göre düzenleyin
                select_language.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
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
    LoadLanguages();

}

// Sayfa yüklendiğinde event listener'ları kur
window.onload = setupEventListeners;
// Sayfa yüklendiğinde dizin listesini yükle
 