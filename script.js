// 輪播圖功能
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// 初始化輪播圖
function initCarousel() {
    if (slides.length === 0) return;
    
    showSlide(currentSlide);
    startAutoSlide();
    
    // 添加觸控支援
    let startX = 0;
    let endX = 0;
    
    const carousel = document.querySelector('.carousel');
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑動，下一張
                changeSlide(1);
            } else {
                // 向右滑動，上一張
                changeSlide(-1);
            }
        }
    }
}

// 顯示指定幻燈片
function showSlide(n) {
    // 隱藏所有幻燈片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 移除所有指示器的active類
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // 確保索引在有效範圍內
    if (n >= slides.length) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = n;
    }
    
    // 顯示當前幻燈片
    slides[currentSlide].classList.add('active');
    
    // 激活對應的指示器
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
}

// 切換到下一張或上一張幻燈片
function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
}

// 直接跳轉到指定幻燈片
function currentSlide(n) {
    showSlide(n - 1);
    resetAutoSlide();
}

// 開始自動播放
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // 每5秒切換一次
}

// 重置自動播放計時器
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// 暫停自動播放（當滑鼠懸停在輪播圖上時）
function pauseAutoSlide() {
    clearInterval(slideInterval);
}

// 恢復自動播放
function resumeAutoSlide() {
    startAutoSlide();
}

// 視頻播放功能
function playVideo() {
    const video = document.getElementById('mainVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (video && overlay) {
        video.play();
        overlay.classList.add('hidden');
        
        // 當視頻暫停時顯示播放按鈕
        video.addEventListener('pause', () => {
            overlay.classList.remove('hidden');
        });
        
        // 當視頻結束時顯示播放按鈕
        video.addEventListener('ended', () => {
            overlay.classList.remove('hidden');
        });
    }
}

// 平滑滾動功能
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考慮固定導航欄的高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 導航欄滾動效果
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加背景模糊效果
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 46, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 46, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 動畫效果
function initAnimations() {
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
    
    // 觀察需要動畫的元素
    const animatedElements = document.querySelectorAll('.feature-item, .stat-item, .video-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 統計數字動畫
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // 解析數字
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                const isSlash = finalValue.includes('/');
                
                let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                let currentValue = 0;
                
                const increment = numericValue / 50; // 50步完成動畫
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    
                    // 格式化顯示
                    let displayValue = Math.floor(currentValue);
                    if (isPercentage) {
                        displayValue = currentValue.toFixed(1) + '%';
                    } else if (isPlus) {
                        displayValue = Math.floor(currentValue) + '+';
                    } else if (isSlash) {
                        displayValue = Math.floor(currentValue) + '/7';
                    }
                    
                    target.textContent = displayValue;
                }, 50);
                
                numberObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        numberObserver.observe(number);
    });
}

// 輪播圖事件監聽
function initCarouselEvents() {
    const carousel = document.querySelector('.carousel');
    
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoSlide);
        carousel.addEventListener('mouseleave', resumeAutoSlide);
    }
}

// 頁面載入完成後初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
    animateNumbers();
    initCarouselEvents();
    
    // 添加載入動畫
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 視窗大小改變時的響應式處理
window.addEventListener('resize', function() {
    // 重新計算輪播圖高度
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.height = window.innerHeight + 'px';
    }
});

// 鍵盤控制
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    } else if (e.key === ' ') {
        e.preventDefault();
        const video = document.getElementById('mainVideo');
        if (video) {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        }
    }
});

// 性能優化：防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 優化滾動事件
const optimizedScrollHandler = debounce(() => {
    // 滾動相關的處理邏輯
}, 16); // 約60fps

window.addEventListener('scroll', optimizedScrollHandler); 