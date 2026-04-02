// script.js (Serverless Dashboard Version)

// 1. Tell our Translator where its machinery is
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Setup our chillhop sound effect
const flipSound = new Audio('./sound.mp3'); 

// Grab our house elements
const dashboard = document.getElementById('dashboard');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-upload');
const desk = document.getElementById('desk');
const bookContainer = document.getElementById('book');

// --- THE UI/UX DRAG AND DROP BRAINS ---

// When a file is hovering over the zone, turn ON the gold CSS animations
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Stops the browser from accidentally opening the PDF as a new tab
    dropZone.classList.add('drag-over');
});

// When the file is dragged away, turn OFF the animations
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

// When the file is DROPPED onto the parchment!
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    // Grab the physical file they dropped
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
        readAndOpenBook(file); // Send it to the memory scanner
    } else {
        alert("Please drop a valid .pdf file!");
    }
});

// If they clicked the Elegant Button instead of dragging
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
        readAndOpenBook(file);
    }
});

// --- THE MEMORY SCANNER ---

function readAndOpenBook(file) {
    // 1. A FileReader acts like a digital scanner taking a picture of temporary memory
    const reader = new FileReader();

    reader.onload = async function(e) {
        // e.target.result contains the raw data (the DNA) of the PDF file
        // We convert it into a simple format (Uint8Array) that PDF.js loves
        const pdfData = new Uint8Array(e.target.result);
        
        // 2. Hide the dashboard!
        dashboard.style.opacity = '0'; // Starts the 1.5s fade out animation
        setTimeout(() => {
            dashboard.classList.add('hidden'); // Fully removes it
            desk.classList.remove('hidden');   // Turns on the desk lights
        }, 1500); // Waits exactly 1.5 seconds for the fade to finish

        // 3. Send the raw DNA data to our 3D engine!
        await loadBookFromMemory(pdfData);
    };

    // Tell the scanner to start reading the file!
    reader.readAsArrayBuffer(file);
}

// --- THE 3D PHYSICS ENGINE ---

// --- THE 3D PHYSICS ENGINE (WITH UX UPGRADES) ---

async function loadBookFromMemory(pdfData) {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const bookContainer = document.getElementById('book');
    const desk = document.getElementById('desk');
    
    // Unhide the desk, but show the UX loader first!
    loader.style.opacity = '1';
    loader.classList.remove('hidden');
    bookContainer.classList.add('hidden'); // Keep the book hidden while it is built
    
    // Open the PDF DNA
    const loadingTask = pdfjsLib.getDocument({data: pdfData});
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    bookContainer.innerHTML = ''; // Reset desk

    // Loop through every single page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // UX Enhancement: Update the UI so the user isn't staring at a frozen screen!
        loaderText.innerText = `📖 Painting page ${pageNum} / ${totalPages} from memory...`;
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // High-def scan

        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        pageDiv.appendChild(canvas);
        bookContainer.appendChild(pageDiv);
    }

    loaderText.innerText = "✨ Binding the pages together in 3D...";

    // Activate the 3D Physics Engine!
    const pageFlip = new St.PageFlip(bookContainer, {
        width: 450, 
        height: 600, 
        size: "fixed", // FIX: Force exact physics measurements
        showCover: true, 
        usePortrait: false 
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // Senses
    pageFlip.on('flip', (e) => {
        flipSound.currentTime = 0; 
        flipSound.play(); 
    });

    // UX Enhancement: Smoothly hide the loader and reveal the finished book!
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.classList.add('hidden');
        bookContainer.classList.remove('hidden');
    }, 500);
}

    // Activate the 3D Physics Engine!
    const pageFlip = new St.PageFlip(bookContainer, {
        width: 450, 
        height: 600, 
        showCover: true, 
        usePortrait: false 
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // The Senses (Audio)
    pageFlip.on('flip', (e) => {
        flipSound.currentTime = 0; 
        flipSound.play(); 
    });
}
