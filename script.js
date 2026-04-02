// script.js
// Make sure you upload a PDF to your Github named EXACTLY "sample.pdf"
const PDF_URL = './sample.pdf';

// 1. Tell our Translator tool where to find its heavy machinery (required for PDF.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Setup our sound effect (Make sure you upload an audio file named 'sound.mp3'!)
const flipSound = new Audio('./sound.mp3'); 

async function loadBook() {
    const bookContainer = document.getElementById('book');
    
    // 2. Open the PDF file, just like opening a real book
    const loadingTask = pdfjsLib.getDocument(PDF_URL);
    const pdf = await loadingTask.promise;
    
    // Check how many pages our book has
    const totalPages = pdf.numPages;

    // 3. Loop through every single page inside the PDF, one by one
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // Grab the data for the current page
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // We scale it up so the text is crisp!

        // Create a blank physical HTML box (our paper)
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        
        // Create a blank digital canvas (Think of this as a blank digital chalkboard)
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        // Command the PDF tool to "paint" the text onto our digital chalkboard
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Stick the painted chalkboard onto our paper, and put the paper into the book!
        pageDiv.appendChild(canvas);
        bookContainer.appendChild(pageDiv);
    }

    // 4. Activate the 3D Physics Engine!
    // StPageFlip calculates exactly how the pages should bend when you drag them from the corner
    const pageFlip = new St.PageFlip(bookContainer, {
        width: 450, // Width of one single page
        height: 600, // Height of one single page
        showCover: true, // Makes the first page act like a thick hardcover
        usePortrait: false // Forces the book to always show TWO pages side-by-side
    });

    // Tell the physics engine to take complete control of all our newly created ".page" elements
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // 5. The "Senses" (Audio)
    // We tell the physics engine: "Listen closely. Whenever you detect a page flipping, do this block of code."
    pageFlip.on('flip', (e) => {
        flipSound.currentTime = 0; // Rewind the sound to the start (in case we flip pages quickly)
        flipSound.play(); // Play the page-swish sound!
    });
}

// Don't start drawing until the web browser is perfectly ready
window.onload = loadBook;
