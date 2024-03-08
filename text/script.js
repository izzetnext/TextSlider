 
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
    // Bu fonksiyon, kullanıcıdan dosya seçmesini isteyebilir.
    // Örneğin, bir <input type="file"> öğesi tetiklenebilir.
    document.getElementById('text-content').textContent = 'Choose File button clicked.' ;
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
}

// Sayfa yüklendiğinde event listener'ları kur
window.onload = setupEventListeners;
