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

// Event listener'ı kur
document.getElementById('fetchData').addEventListener('click', LoadLanguagesWithFiles);
