 
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

// Hızlı Geri butonu işlevi
function fastBackward() {
    // Bu fonksiyon, slayt gösterisini en başa alabilir.
    document.getElementById('text-content').textContent = 'Fast Backward button clicked.' ;
}

// Önceki Slayt butonu işlevi
function previousSlide() {
    // Bu fonksiyon, slayt gösterisinde bir önceki slayta geçiş yapar.
    document.getElementById('text-content').textContent = 'Previous Slide button clicked.' ;
}

// Oynat/Duraklat butonu işlevi
function togglePlayPause() {
    var img = document.getElementById('play-pause');
    if (img.src.includes("play.png")) {
        img.src = "images/pause.png";
        document.getElementById('text-content').textContent = 'Playing slides.' ;
    } else {
        img.src = "images/play.png";
        document.getElementById('text-content').textContent = 'Paused slides.' ;
    }
}

// Sonraki Slayt butonu işlevi
function nextSlide() {
    // Bu fonksiyon, slayt gösterisinde bir sonraki slayta geçiş yapar.
    document.getElementById('text-content').textContent = 'Next Slide button clicked.' ;
}

// Hızlı İleri butonu işlevi
function fastForward() {
    // Bu fonksiyon, slayt gösterisini en sona alabilir.
    document.getElementById('text-content').textContent = 'Fast Forward button clicked.';
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

// Dil seçimi değiştiğinde çağrılacak fonksiyon
function handleLanguageChange() {
    document.getElementById('text-content').textContent ='Language selection changed to: ' + this.value ; // Gerçek işlevsellik buraya eklenecek


    const secilenDizin = e.target.value;
    const apiUrl = `https://api.github.com/repos/izzetnext/TextSlider/contents/Languages/${secilenDizin}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const presetTexts = document.getElementById('select_text_slide');
            select_text_slide.innerHTML = ''; // Mevcut içeriği temizle

            data.forEach(item => {
                if (item.type === "file") {
                    const option = document.createElement('option');
                    option.value = item.download_url; // Dosyanın indirme URL'sini değer olarak kullan
                    option.textContent = item.name;
                    select_text_slide.appendChild(option);
                }
            });

            // İlk seçeneği otomatik olarak seç
            if (select_text_slide.options.length > 0) {
                select_text_slide.selectedIndex = 0;
                // "change" olayını manuel olarak tetikle
                const event = new Event('change');
                select_text_slide.dispatchEvent(event);
            }


        })
        .catch(error => console.error('Hata:', error));

}

// Text slide seçimi değiştiğinde çağrılacak fonksiyon
function handleTextSlideChange() {
    document.getElementById('text-content').textContent ='Text slide selection changed to: ' + this.value ; // Gerçek işlevsellik buraya eklenecek
}


function LoadLanguages() {
    const apiUrl = 'https://api.github.com/repos/izzetnext/TextSlider/contents/Languages/';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const dizinListesi = document.getElementById('select_language');
            data.forEach(item => {
                if (item.type === "dir") { // Yalnızca dizinleri listele
                    const option = document.createElement('option');
                    option.value = option.textContent = item.name;
                    select_language.appendChild(option);
                }
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
 