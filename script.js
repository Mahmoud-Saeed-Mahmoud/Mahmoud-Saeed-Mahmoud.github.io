// Typing Animation for Hero Section
const text = "Flutter Developer | Backend Developer | Full-Stack Developer | MERN Stack Developer | UI/UX Designer";
const typingText = document.querySelector('.typing-text');
let i = 0;

function typeWriter() {
    if (i < text.length) {
        typingText.textContent = text.substring(0, i + 1);
        i++;
        setTimeout(typeWriter, 50);
    }
}

// Start typing animation when page loads
window.addEventListener('load', typeWriter);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.style.transform = 'translateY(0)';
        navbar.classList.remove('scroll-down');
    }
    
    lastScroll = currentScroll;
});

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars if the entry is a skill item
            if (entry.target.classList.contains('skill-item')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.style.transform.replace('scaleX(', '').replace(')', '');
                    progressBar.style.transform = `scaleX(${progress})`;
                }
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and skill items
document.querySelectorAll('section:not(#home), .skill-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

// Handle service card touch events
document.querySelectorAll('.service-card').forEach(card => {
    let touchStartX = 0;
    let touchEndX = 0;

    card.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    card.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const cardInner = card.querySelector('.service-card-inner');
        if (cardInner) {
            // Check if it was a swipe left or right (optional, for more complex interactions)
            // For simplicity, we'll just toggle on tap/touchend
            if (Math.abs(touchEndX - touchStartX) < 10) { // Threshold for tap vs swipe
                 if (cardInner.style.transform === 'rotateY(180deg)') {
                    cardInner.style.transform = 'rotateY(0deg)';
                } else {
                    cardInner.style.transform = 'rotateY(180deg)';
                }
            }
        }
    });
});

// Carousel Functionality
let slideIndex = 0;
let autoScrollInterval; // Variable to hold the interval ID
const AUTO_SCROLL_DELAY = 3000; // Auto-scroll every 3 seconds

/**
 * Starts the automatic scrolling of the carousel.
 */
function startAutoScroll() {
  stopAutoScroll(); // Clear any existing interval
  autoScrollInterval = setInterval(() => {
    moveSlide(1); // Move to the next slide
  }, AUTO_SCROLL_DELAY);
}

/**
 * Stops the automatic scrolling of the carousel.
 */
function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

showSlides(slideIndex);
startAutoScroll(); // Start auto-scrolling when the page loads

// Optional: Pause auto-scroll on mouse hover over the carousel
const carouselContainer = document.querySelector('.carousel-container'); // Assuming your carousel has this class or an ID
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', stopAutoScroll);
  carouselContainer.addEventListener('mouseleave', startAutoScroll);
}

// Next/previous controls
/**
 * Moves the carousel to the next or previous slide.
 * @param {number} n - The number of slides to move (1 for next, -1 for previous).
 */
function moveSlide(n) {
  showSlides(slideIndex += n);
  // Reset auto-scroll timer when manually navigating
  // This prevents an immediate auto-scroll after a manual click
  if (autoScrollInterval) { 
    startAutoScroll();
  }
}

// Thumbnail image controls - if you add thumbnails
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

/**
 * Displays the appropriate slide in the carousel with a slide transition.
 * @param {number} n - The index of the slide to show.
 */
function showSlides(n) {
  const slides = document.getElementsByClassName("carousel-image");
  const carouselInner = document.querySelector('.carousel-inner');

  if (!carouselInner || slides.length === 0) return; // No images or container

  if (n >= slides.length) { slideIndex = 0; } // Loop to first slide
  if (n < 0) { slideIndex = slides.length - 1; } // Loop to last slide

  // Calculate the new transform value
  const newTransformValue = -slideIndex * 100; // Each slide is 100% width
  carouselInner.style.transform = `translateX(${newTransformValue}%)`;

  // If you add dots for navigation, update them here
  // let dots = document.getElementsByClassName("dot");
  // for (i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  // }
  // if (dots.length > 0) {
  //    dots[slideIndex].className += " active";
  // }
}

// Custom Cursor Implementation
let cursorDot, cursorOutline;
let lastX = 0, lastY = 0;
let dotX = 0, dotY = 0;
let outlineX = 0, outlineY = 0;
let isMoving = false;
let lastMoveTime = 0;
const DEBOUNCE_TIME = 50; // Reduced from 200ms to 50ms for faster response

/**
 * Initializes the custom cursor elements and event listeners.
 */
function initCustomCursor() {
  // Create cursor elements
  cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);

  cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-dot-outline';
  document.body.appendChild(cursorOutline);

  // Add custom-cursor class to body
  document.body.classList.add('custom-cursor');

  // Set up event listeners with passive option for better performance
  document.addEventListener('mousemove', trackMouse, { passive: true });
  document.addEventListener('mouseenter', showCursor);
  document.addEventListener('mouseleave', hideCursor);

  // Add hover effect to interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .service-card, .project-card, .tech-item, .carousel-button, .scroll-top, .contact-item, .hire-me-button'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Initial position to avoid jumps
  dotX = outlineX = window.innerWidth / 2;
  dotY = outlineY = window.innerHeight / 2;
  
  // Start animation loop
  requestAnimationFrame(animateCursor);
}

/**
 * Tracks mouse movement with debounce.
 * @param {MouseEvent} e - The mouse event.
 */
function trackMouse(e) {
  lastX = e.clientX;
  lastY = e.clientY;
  
  // Update last move time for debounce
  lastMoveTime = Date.now();
  
  if (!isMoving) {
    isMoving = true;
    document.body.classList.add('cursor-moving');
  }
}

/**
 * Shows the custom cursor.
 */
function showCursor() {
  cursorDot.style.opacity = '1';
  cursorOutline.style.opacity = '1';
}

/**
 * Hides the custom cursor.
 */
function hideCursor() {
  cursorDot.style.opacity = '0';
  cursorOutline.style.opacity = '0';
}

/**
 * Animates the cursor with smooth movement and debounce.
 */
function animateCursor() {
  // Apply debounce to detect when cursor stops moving
  const now = Date.now();
  if (isMoving && now - lastMoveTime > DEBOUNCE_TIME) {
    isMoving = false;
    document.body.classList.remove('cursor-moving');
  }

  // Smooth movement for dot (faster - allow it to move more freely)
  dotX += (lastX - dotX) * 0.6; // Increased to 0.6 for even faster response
  dotY += (lastY - dotY) * 0.6;
  
  // Smoother movement for outline (slower with 50ms delay)
  // Using a smaller factor creates more delay between inner and outer circles
  outlineX += (lastX - outlineX) * 0.08; // Reduced for more delay
  outlineY += (lastY - outlineY) * 0.08;

  // Apply positions with correct offset
  // For the dot (center is 6px from top-left since dot is now 12px)
  cursorDot.style.transform = `translate(${dotX - 6}px, ${dotY - 6}px)`;
  
  // For the outline (center is 16px from top-left since outline is now 32px)
  cursorOutline.style.transform = `translate(${outlineX - 16}px, ${outlineY - 16}px)`;

  // Continue animation loop
  requestAnimationFrame(animateCursor);
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', initCustomCursor);