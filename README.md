
Please Test : https://izzetnext.github.io/TextSlider/

**Text Slider User Guide**  

### **Introduction**  
Text Slider is a hobby project designed to help users learn languages through interactive slides. It supports text playback with speech synthesis, keyboard controls, and cloud integration for easy access to language files.  

---

### **Key Features**  
- **Slide Navigation**: Move between slides manually or automatically.  
- **Speech Synthesis**: German text-to-speech for pronunciation support.  
- **Keyboard Shortcuts**: Use arrow keys, Enter, and Space for quick control.  
- **Local/Cloud File Support**: Load slides from your device or pre-made cloud files.  
- **Adjustable Speed**: Set slide delay for automatic playback.  
- **Shuffle Mode**: Randomize slide order.  
- **Jump Controls**: Fast-forward/backward through slides.  

---

### **Getting Started**  
1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/izzetnext/TextSlider  
   ```  
   Host the files on a local server or open `index.html` directly in a browser.  

2. **Browser Requirements**:  
   - Ensure your browser supports Web Speech API (Chrome recommended).  
   - Enable JavaScript.  

---

### **Usage Instructions**  

#### **1. Loading Slides**  
- **Local File**:  
  - Click "Choose Local File" or the folder icon.  
  - Select a text file with slides separated by empty lines.  
  - Example slide format:  
    ```  
    - Um 7:30 fange ich mit der Arbeit an.  
    - 7: 30'da çalışmaya başlıyorum.  
    ```  

- **Cloud Files**:  
  - Click "Choose From Cloud."  
  - Select a language (e.g., German) and a file (e.g., `Genetiv_de.md`).  
  - Click "Load File" to load the slides.  

---

#### **2. Controls**  
- **Play/Pause**: Start/stop automatic playback. The slides advance based on the set delay.  
- **Previous/Next**: Navigate slides manually.  
- **Fast Forward/Backward**: Jump multiple slides (jump size adapts to total slides).  
- **Shuffle**: Toggle shuffle mode to randomize slide order.  
- **Sound Toggle**: Enable/disable text-to-speech.  

---

#### **3. Adjust Settings**  
- **Slide Delay**: Use the slider to set the delay (in seconds) between slides during automatic playback.  
- **Voice Settings**: The app uses the default German voice. Custom voices are not yet supported.  

---

### **Keyboard Shortcuts**  
- **→ (Right Arrow)**: Next slide.  
- **← (Left Arrow)**: Previous slide.  
- **Enter**: Toggle play/pause.  
- **Space**: Toggle sound on/off.  

---

### **Cloud Integration**  
Pre-made language files are stored in the `Languages/` directory on GitHub. Files are organized by language (e.g., `German/`, `Turkish/`) and topic (e.g., grammar, vocabulary).  

---

### **Troubleshooting**  
- **No Sound**:  
  - Check if the sound icon is toggled on.  
  - Ensure your browser supports speech synthesis.  
- **File Loading Errors**:  
  - Use plain text files with UTF-8 encoding.  
  - Avoid special formatting in slides.  

---

### **Example Workflow**  
1. Load a German vocabulary file from the cloud.  
2. Enable sound and press "Play" to hear pronunciation.  
3. Use arrow keys to review challenging slides.  
4. Adjust the slider to slow down automatic playback.  

--- 

Explore the [GitHub Repository](https://github.com/izzetnext/TextSlider) for updates and contributions! 🚀



