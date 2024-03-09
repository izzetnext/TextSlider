function LoadLanguagesWithFiles() {
    const languagesApiUrl = 'https://api.github.com/repos/izzetnext/TextSlider/contents/Languages/';

    // Tüm dilleri listele
    fetch(languagesApiUrl)
        .then(response => response.json())
        .then(languages => {
            const languageDataPromises = languages.filter(item => item.type === "dir").map(language => {
                // Her bir dil klasörü için dosyaları listele
                const languageFilesApiUrl = `https://api.github.com/repos/izzetnext/TextSlider/contents/Languages/${language.name}/`;
                return fetch(languageFilesApiUrl)
                    .then(response => response.json())
                    .then(files => {
                        // Sadece .md dosyalarını al
                        return {
                            language: language.name,
                            files: files.filter(file => file.name.endsWith('.md')).map(file => file.name)
                        };
                    });
            });

            return Promise.all(languageDataPromises);
        })
        .then(languagesWithFiles => {
            // Tüm diller ve dosyaların JSON verisini oluştur
            const languagesJson = JSON.stringify(languagesWithFiles, null, 2);
            // JSON verisini ekranda göster (veya manuel olarak kaydetmek için bir yere kopyala)
            document.getElementById('jsonData').textContent = languagesJson;
        })
        .catch(error => console.error('Error:', error));
}


function copyJsonToClipboard() {
    const jsonDataElement = document.getElementById('jsonData');
    // Metin seçiliyorsa, kullanıcıdan izin al
    if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(jsonDataElement);
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            // Metni kopyalamayı dene
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy', err);
        }
        // Seçimi kaldır
        selection.removeAllRanges();
    } else {
        console.log('Copy to clipboard not supported in this browser');
    }
}

document.getElementById('copyJson').addEventListener('click', copyJsonToClipboard);

// Event listener'ı kur
document.getElementById('fetchData').addEventListener('click', LoadLanguagesWithFiles);
