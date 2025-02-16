// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Elements to animate
const animatedElements = document.querySelectorAll('[data-animate]');

// Callback function when element is intersecting
const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target); // Only animate once
        }
    });
};

// Create observer
const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe elements
animatedElements.forEach(element => {
    observer.observe(element);
});

// Typewriter effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typewriter effect
const heroTitle = document.querySelector('[data-typewriter]');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    typeWriter(heroTitle, text);
}

// Magnetic button effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
    });
});

// Skill progress bars animation
function initSkillBars() {
    const skills = document.querySelectorAll('.skill-progress');
    
    skills.forEach(skill => {
        const progress = skill.querySelector('.progress');
        const percentage = progress.dataset.progress;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progress.style.width = `${percentage}%`;
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(skill);
    });
}

// Initialize skill bars
initSkillBars();

// Smooth parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Scroll animations
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (1 - offset)
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 0.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initialize scroll animations
    handleScrollAnimation();
});
