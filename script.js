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
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
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

// Instagram Integration
// Note: Instagram's API requires authentication. For production use, you'll need:
// 1. Instagram Basic Display API access token
// 2. Or use a third-party service like Instagram Feed plugin

// Function to embed Instagram posts using oEmbed API
// This requires the post URL to work
async function embedInstagramPost(postUrl) {
    try {
        // Instagram oEmbed endpoint (requires CORS proxy or backend for production)
        const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}`;
        
        // Note: This will fail due to CORS in browser. You'll need a backend proxy or use a service.
        // For now, this is a placeholder showing the structure
        
        const response = await fetch(oembedUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        return data.html;
    } catch (error) {
        console.error('Error embedding Instagram post:', error);
        return null;
    }
}

// Alternative: Display Instagram posts using iframe embeds
// You can get embed code from Instagram by going to a post > ... > Embed
function addInstagramEmbed(embedCode) {
    const instagramFeed = document.getElementById('instagramFeed');
    const embedContainer = document.createElement('div');
    embedContainer.className = 'instagram-embed-container';
    embedContainer.innerHTML = embedCode;
    instagramFeed.appendChild(embedContainer);
}

// Function to load Instagram posts from Basic Display API
// This requires an access token from Instagram
async function loadInstagramPosts(accessToken) {
    try {
        // Instagram Basic Display API endpoint
        const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch Instagram posts');
        
        const data = await response.json();
        
        const instagramFeed = document.getElementById('instagramFeed');
        instagramFeed.innerHTML = ''; // Clear placeholder
        
        data.data.slice(0, 6).forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'instagram-post';
            
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            
            postElement.innerHTML = `
                <a href="${post.permalink}" target="_blank" rel="noopener noreferrer">
                    <img src="${imageUrl}" alt="${post.caption || 'Instagram post'}" loading="lazy">
                    ${post.caption ? `<p class="instagram-caption">${post.caption.substring(0, 100)}...</p>` : ''}
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
    
    // If you have an Instagram access token, uncomment and add it here:
    // const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
    // loadInstagramPosts(INSTAGRAM_ACCESS_TOKEN);
});

