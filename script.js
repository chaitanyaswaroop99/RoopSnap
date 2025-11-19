// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.85)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.querySelector('.close-lightbox');

// Open lightbox
function openLightbox(imageSrc, caption = '') {
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightboxFunc() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeLightbox.addEventListener('click', closeLightboxFunc);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightboxFunc();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightboxFunc();
    }
});

// API Base URL - Change this to your deployed backend URL
const API_BASE_URL = window.location.origin;

// Gallery initialization - Load photos from API
async function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    // Show loading state
    galleryGrid.innerHTML = '<div class="gallery-item placeholder"><div class="placeholder-content"><p>Loading gallery...</p></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/photos`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        
        const photos = await response.json();
        
        // Clear loading state
        galleryGrid.innerHTML = '';

        if (photos.length === 0) {
            galleryGrid.innerHTML = '<div class="gallery-item placeholder"><div class="placeholder-content"><p>No photos yet. Upload some photos to get started!</p></div></div>';
            return;
        }

        // Create gallery items from API data
        photos.forEach((photo) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${API_BASE_URL}${photo.file_path}" alt="${photo.description || photo.original_name || 'Photo'}" loading="lazy">
            `;
            
            galleryItem.addEventListener('click', () => {
                openLightbox(`${API_BASE_URL}${photo.file_path}`, photo.description || photo.original_name || '');
            });
            
            galleryGrid.appendChild(galleryItem);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<div class="gallery-item placeholder"><div class="placeholder-content"><p>Error loading gallery. Please try again later.</p></div></div>';
    }
}

// Initialize gallery on page load
initGallery();

// Portfolio initialization with category filtering
let allPortfolioPhotos = [];
let currentCategory = 'all';

async function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const portfolioFilters = document.getElementById('portfolioFilters');
    
    // Show loading state
    portfolioGrid.innerHTML = '<div class="portfolio-item placeholder"><div class="placeholder-content"><p>Loading portfolio...</p></div></div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/photos`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        
        allPortfolioPhotos = await response.json();
        
        // Extract unique categories
        const categories = ['all'];
        allPortfolioPhotos.forEach(photo => {
            if (photo.category && !categories.includes(photo.category)) {
                categories.push(photo.category);
            }
        });
        
        // Create filter buttons (skip "all" as it's already there)
        categories.slice(1).forEach(category => {
            const filterBtn = document.createElement('button');
            filterBtn.className = 'filter-btn';
            filterBtn.textContent = category;
            filterBtn.setAttribute('data-category', category);
            filterBtn.addEventListener('click', () => filterPortfolio(category));
            portfolioFilters.appendChild(filterBtn);
        });
        
        // Display portfolio
        displayPortfolio();
    } catch (error) {
        console.error('Error loading portfolio:', error);
        portfolioGrid.innerHTML = '<div class="portfolio-item placeholder"><div class="placeholder-content"><p>Error loading portfolio. Please try again later.</p></div></div>';
    }
}

function filterPortfolio(category) {
    currentCategory = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    displayPortfolio();
}

function displayPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';
    
    // Filter photos by category
    const filteredPhotos = currentCategory === 'all' 
        ? allPortfolioPhotos 
        : allPortfolioPhotos.filter(photo => photo.category === currentCategory);
    
    if (filteredPhotos.length === 0) {
        portfolioGrid.innerHTML = '<div class="portfolio-item placeholder"><div class="placeholder-content"><p>No photos in this category yet.</p></div></div>';
        return;
    }
    
    // Create portfolio items
    filteredPhotos.forEach((photo) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        
        portfolioItem.innerHTML = `
            <img src="${API_BASE_URL}${photo.file_path}" alt="${photo.description || photo.original_name || 'Photo'}" loading="lazy">
            <div class="portfolio-overlay">
                ${photo.category ? `<span class="portfolio-category">${photo.category}</span>` : ''}
                ${photo.description ? `<p class="portfolio-description">${photo.description}</p>` : ''}
            </div>
        `;
        
        portfolioItem.addEventListener('click', () => {
            openLightbox(`${API_BASE_URL}${photo.file_path}`, photo.description || photo.original_name || '');
        });
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Initialize portfolio on page load
initPortfolio();

// Instagram Integration - Load posts from backend API
async function loadInstagramPosts() {
    const instagramFeed = document.getElementById('instagramFeed');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/instagram/posts?limit=6`);
        
        if (!response.ok) {
            if (response.status === 503) {
                // Access token not configured - show placeholder
                return;
            }
            throw new Error('Failed to fetch Instagram posts');
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            // No posts available
            return;
        }
        
        // Clear placeholder
        instagramFeed.innerHTML = '';
        
        // Display posts
        data.data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'instagram-post';
            
            const imageUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;
            const caption = post.caption ? post.caption.substring(0, 150) : '';
            
            postElement.innerHTML = `
                <a href="${post.permalink}" target="_blank" rel="noopener noreferrer" class="instagram-post-link">
                    <div class="instagram-post-image">
                        <img src="${imageUrl}" alt="${caption || 'Instagram post'}" loading="lazy">
                        ${post.media_type === 'VIDEO' ? '<div class="instagram-video-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>' : ''}
                    </div>
                    ${caption ? `<p class="instagram-caption">${caption}${post.caption.length > 150 ? '...' : ''}</p>` : ''}
                </a>
            `;
            
            instagramFeed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading Instagram posts:', error);
        // Keep placeholder message if API fails
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        phone: document.getElementById('phone') ? document.getElementById('phone').value : ''
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error sending message. Please try again or contact us directly.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('RoopSnap website loaded');
    
    // Set "All" filter button as active
    const allFilterBtn = document.querySelector('.filter-btn[data-category="all"]');
    if (allFilterBtn) {
        allFilterBtn.addEventListener('click', () => filterPortfolio('all'));
    }
    
    // Load Instagram posts
    loadInstagramPosts();
});

