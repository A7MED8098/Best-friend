/**
 * ==========================================================================
 * ELEGANT BEST FRIEND MEMORY GIFT WEBSITE - JAVASCRIPT
 * ==========================================================================
 * Hardcoded Unlock Date: October 2, 2026 at 1:00 PM (13:00) Egypt Time (Africa/Cairo UTC+3)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HARDCODED UNLOCK TIMESTAMP LOGIC
       ========================================================================== */
    
    // Set to unlock in 5 seconds from page load for testing
    const UNLOCK_TARGET_TIMESTAMP = Date.now() + 5 * 1000;

    const lockedScreen = document.getElementById('locked-screen');
    const mainContent = document.getElementById('main-content');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    let countdownInterval = null;

    function lockScroll() {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function unlockScroll() {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    /**
     * Checks if website should be unlocked based on visitor's local device time
     */
    function checkUnlockState() {
        const now = new Date().getTime();
        const timeRemaining = UNLOCK_TARGET_TIMESTAMP - now;

        if (timeRemaining <= 0) {
            // Already unlocked!
            unlockWebsiteDirectly();
        } else {
            // Still locked, lock scrolling & start live countdown
            lockScroll();
            updateCountdownValues(timeRemaining);
            countdownInterval = setInterval(() => {
                const currentNow = new Date().getTime();
                const remaining = UNLOCK_TARGET_TIMESTAMP - currentNow;
                
                if (remaining <= 0) {
                    clearInterval(countdownInterval);
                    triggerCinematicUnlock();
                } else {
                    updateCountdownValues(remaining);
                }
            }, 1000);
        }
    }

    /**
     * Updates the countdown DOM elements
     */
    function updateCountdownValues(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    /**
     * Instantly reveals main website without countdown transition (if opened post-target)
     */
    function unlockWebsiteDirectly() {
        unlockScroll();
        if (lockedScreen) {
            lockedScreen.style.display = 'none';
        }
        if (mainContent) {
            mainContent.classList.remove('main-content-hidden');
            mainContent.classList.add('main-content-visible');
        }
        initScrollObservers();
    }

    /**
     * Smooth cinematic transition when countdown reaches zero live
     */
    function triggerCinematicUnlock() {
        unlockScroll();
        if (lockedScreen) {
            lockedScreen.classList.add('unlocked');
            setTimeout(() => {
                lockedScreen.style.display = 'none';
            }, 1200);
        }
        if (mainContent) {
            mainContent.classList.remove('main-content-hidden');
            mainContent.classList.add('main-content-visible');
        }
        initScrollObservers();
    }

    // Execute countdown check immediately on boot
    checkUnlockState();


    /* ==========================================================================
       2. AMBIENT BACKGROUND PARTICLES (CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedY = -(Math.random() * 0.4 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.fade = Math.random() * 0.005 + 0.002;
                // Soft Gold & Rose particle colors
                const colors = ['#dfb15b', '#f4b3c2', '#ffffff', '#e6c387'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.opacity -= this.fade;

                if (this.opacity <= 0 || this.y < 0) {
                    this.reset();
                    this.y = height + 10;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Generate 50 particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        // Check prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!motionQuery.matches) {
            animateCanvas();
        }
    }


    /* ==========================================================================
       3. FLOATING BACKGROUND MUSIC PLAYER (Autoplay & Continuous Playback)
       ========================================================================== */
    const musicContainer = document.getElementById('music-player');
    const musicBtn = document.getElementById('music-toggle-btn');
    const bgAudio = document.getElementById('bg-audio');

    function startBgAudio() {
        if (bgAudio) {
            bgAudio.volume = 1.0;
            bgAudio.muted = false;
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    if (musicContainer) musicContainer.classList.add('playing');
                    if (musicBtn) musicBtn.setAttribute('title', 'Mute / Pause Song');
                }).catch(err => {
                    console.log('Autoplay waiting for user interaction:', err);
                });
            }
        }
    }

    // Try starting audio immediately on script load
    startBgAudio();

    // Fallback: Start audio on very first user click/touch anywhere on screen if browser blocked initial autoplay
    function enableAudioOnFirstInteraction() {
        startBgAudio();
        document.removeEventListener('click', enableAudioOnFirstInteraction);
        document.removeEventListener('touchstart', enableAudioOnFirstInteraction);
    }

    document.addEventListener('click', enableAudioOnFirstInteraction, { once: true });
    document.addEventListener('touchstart', enableAudioOnFirstInteraction, { once: true });

    if (musicBtn && bgAudio) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger document fallback listener
            if (bgAudio.paused || bgAudio.muted) {
                bgAudio.volume = 1.0;
                bgAudio.muted = false;
                bgAudio.play().then(() => {
                    musicContainer.classList.add('playing');
                    musicBtn.setAttribute('title', 'Mute / Pause Song');
                }).catch(err => console.log('Audio error:', err));
            } else {
                bgAudio.pause();
                bgAudio.muted = true;
                musicContainer.classList.remove('playing');
                musicBtn.setAttribute('title', 'Play / Unmute Song');
            }
        });
    }


    /* ==========================================================================
       4. CINEMATIC INTRO VIDEO PLAYER & CONTROLS
       ========================================================================== */
    const video = document.getElementById('intro-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const videoOverlay = document.getElementById('video-overlay');
    const bigPlayBtn = document.getElementById('big-play-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const timeDisplay = document.getElementById('time-display');
    const muteBtn = document.getElementById('mute-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const continueBtn = document.getElementById('btn-continue-from-video');

    if (video) {
        function togglePlay() {
            if (video.paused || video.ended) {
                video.play().then(() => {
                    videoOverlay.classList.add('hidden');
                    if (playPauseBtn) playPauseBtn.textContent = '❚❚';
                }).catch(err => {
                    console.log('Video play error:', err);
                });
            } else {
                video.pause();
                videoOverlay.classList.remove('hidden');
                if (playPauseBtn) playPauseBtn.textContent = '▶';
            }
        }

        if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
        if (videoOverlay) videoOverlay.addEventListener('click', togglePlay);

        // Time Update & Progress
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                if (progressBar) progressBar.style.width = `${pct}%`;
                
                const curM = Math.floor(video.currentTime / 60);
                const curS = Math.floor(video.currentTime % 60);
                const durM = Math.floor(video.duration / 60);
                const durS = Math.floor(video.duration % 60);

                if (timeDisplay) {
                    timeDisplay.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${durM}:${durS < 10 ? '0' : ''}${durS}`;
                }
            }
        });

        // Seek Progress Click
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                if (video.duration) {
                    video.currentTime = (clickX / width) * video.duration;
                }
            });
        }

        // Mute / Unmute
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.textContent = video.muted ? '🔇' : '🔊';
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    videoWrapper.requestFullscreen().catch(err => console.log(err));
                } else {
                    document.exitFullscreen();
                }
            });
        }

        // Auto transition to next section when video ends
        video.addEventListener('ended', () => {
            scrollToMemoriesSection();
        });

        // Continue Button fallback
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                scrollToMemoriesSection();
            });
        }
    }

    function scrollToMemoriesSection() {
        const memoriesSec = document.getElementById('memories-section');
        if (memoriesSec) {
            memoriesSec.scrollIntoView({ behavior: 'smooth' });
        }
    }


    /* ==========================================================================
       5. PERSONAL MESSAGES MODAL (OPEN WHEN LETTERS)
       ========================================================================== */
    const letterCards = document.querySelectorAll('.letter-card');
    const letterModal = document.getElementById('letter-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalSealIcon = document.getElementById('modal-seal-icon');
    const modalCategoryTitle = document.getElementById('modal-category-title');
    const modalLetterContent = document.getElementById('modal-letter-content');

    letterCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            const icon = card.getAttribute('data-icon');
            const message = card.getAttribute('data-message');

            if (modalCategoryTitle) modalCategoryTitle.textContent = category;
            if (modalSealIcon) modalSealIcon.textContent = icon || '💌';
            if (modalLetterContent) modalLetterContent.textContent = message;

            if (letterModal) {
                letterModal.classList.add('active');
                letterModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    function closeLetterModal() {
        if (letterModal) {
            letterModal.classList.remove('active');
            letterModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLetterModal);
    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) closeLetterModal();
        });
    }


    /* ==========================================================================
       6. IMAGE LIGHTBOX
       ========================================================================== */
    const lightboxModal = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

    // Click on memory & scrapbook images to view enlarged lightbox
    const clickableImages = document.querySelectorAll('.memory-img, .scrapbook-img, .timeline-img');
    clickableImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            if (lightboxImg) lightboxImg.src = img.src;
            if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
            if (lightboxModal) {
                lightboxModal.classList.add('active');
                lightboxModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // ESC key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLetterModal();
            closeLightbox();
        }
    });


    /* ==========================================================================
       7. SCROLL-TRIGGERED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    function initScrollObservers() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

});
