/**
 * Hearth Brunch Cafe - Main Script
 * Contains: Sticky GNB, Mobile Hamburg Menu, Hero Banner Slider, Scroll Reveal, and Interactive Map (Leaflet.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. Sticky GNB & Scroll Effects
     ========================================== */
  const header = document.querySelector('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Initial check in case of page refresh
  handleScroll();


  /* ==========================================
     2. Mobile Hamburger Menu
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };
  
  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };
  
  hamburger.addEventListener('click', toggleMenu);
  
  // Close menu when clicking navigation links (smooth experience)
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ==========================================
     3. Hero Image Slider (Rolling Effect)
     ========================================== */
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds
  
  const nextSlide = () => {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    // Calculate next slide index
    currentSlide = (currentSlide + 1) % slides.length;
    // Add active class to next slide
    slides[currentSlide].classList.add('active');
  };
  
  if (slides.length > 0) {
    // Set first slide active
    slides[0].classList.add('active');
    // Start rolling interval
    setInterval(nextSlide, slideInterval);
  }


  /* ==========================================
     4. Scroll Reveal (Fade-in Animations)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, no need to observe anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });


  /* ==========================================
     5. Interactive Map (Leaflet.js)
     ========================================== */
  const mapContainer = document.getElementById('map');
  const mapLoader = document.getElementById('map-loader');
  
  // Hearth Cafe Coordinates (Myeongdong Cathedral Alley area, Seoul)
  const hearthCoords = [37.5663, 126.9840]; 
  
  if (mapContainer) {
    // 1. Initialize Map with a default view (Hearth center)
    const map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false // Prevent accidental scrolling when scrolling page
    }).setView(hearthCoords, 15);
    
    // 2. Add Warm/Cozy styled Map Tiles (CartoDB Positron style matches warm ivory/beige mood)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // 3. Define Custom DivIcons for Brown and Beige Markers
    const brownIcon = L.divIcon({
      className: 'custom-marker-brown',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
    
    const beigeIcon = L.divIcon({
      className: 'custom-marker-beige',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    // 4. Place Hearth Cafe Marker (Brown Marker)
    const hearthMarker = L.marker(hearthCoords, { icon: brownIcon }).addTo(map);
    hearthMarker.bindPopup(`
      <div style="font-family: 'Noto Sans KR', sans-serif; text-align: center; padding: 5px;">
        <strong style="color: #9E503C; font-size: 1.1rem; display:block; margin-bottom:5px;">Hearth</strong>
        <p style="font-size: 0.85rem; margin: 0; color: #4A3B32;">따뜻한 화로 곁의 브런치 카페</p>
      </div>
    `).openPopup();

    // 5. Try Geolocation for User Current Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          
          // Place User Marker (Beige Marker)
          const userMarker = L.marker(userCoords, { icon: beigeIcon }).addTo(map);
          userMarker.bindPopup(`
            <div style="font-family: 'Noto Sans KR', sans-serif; text-align: center; padding: 5px;">
              <strong style="color: #4A3B32; font-size: 0.95rem; display:block;">현재 나의 위치</strong>
            </div>
          `);
          
          // Fit map bounds to show both markers comfortably
          const bounds = L.latLngBounds([hearthCoords, userCoords]);
          map.fitBounds(bounds, { padding: [50, 50] });
          
          // Hide Loader
          if (mapLoader) mapLoader.classList.add('hidden');
        },
        (error) => {
          console.warn("Geolocation warning or denied:", error.message);
          // If denied/failed, just keep showing Hearth coordinates
          if (mapLoader) mapLoader.classList.add('hidden');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation not supported, hide loader immediately
      if (mapLoader) mapLoader.classList.add('hidden');
    }
  }
});
