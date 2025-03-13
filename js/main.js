// DOM Elements
const navbar = document.querySelector('[data-navbar]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelectorAll('.navbar__link');
const projectsGrid = document.querySelector('[data-projects-grid]');
const filterButtons = document.querySelector('[data-filters]');
const contactForm = document.querySelector('[data-contact-form]');
const navMenu = document.querySelector('.navbar__menu');

// Projects Data
const projects = [
    {
        id: 'telegram-chatbot',
        title: 'Telegram Woocommerce Chatbot',
        description: 'Developed a chatbot that integrates Telegram with WooCommerce and MongoDB, providing automated customer service.',
        image: 'assets/telegram.webp',
        category: 'llm',
        technologies: ['Python', 'Flask', 'Telegram API', 'LLM Sales Agent', 'OpenAI API', 'WooCommerce API', 'MongoDB'],
        link: '#' 
    },
    {
        id: 'bank-complaints',
        title: 'Bank Complaints Analysis with NLP and Spark',
        description: 'Analyzed bank customer complaints to identify trends and patterns, using natural language processing and big data techniques using AWS EMRStudio and Spark-NLP library.',
        image: 'assets/bank-complaints.webp',
        category: 'nlp',
        technologies: ['Python', 'PySpark', 'Streamlit', 'Docker', 'AWS', 'Spark-NLP', 'JhonSnowLabs'],
        link: '#' 
    },
    {
        id: 'tdg-forex',
        title: 'Implementation of Machine Learning Models for Trend Prediction in Forex Currency Pairs',
        description: 'Grade Project for Masters Degree in Data Science',
        image: 'assets/forex.webp',
        category: 'machine-learning',
        technologies: ['Python', 'XGBoost', 'Scikit-Learn', 'CatBoost', 'Feature Engineering', 'Time Series Analysis'],
        link: '#' 
    },
];

// Navigation
function initNavigation() {
    // Scroll handling
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });

    // Function to update the active nav link based on scroll position
    function updateActiveNavLink() {
        // Get all sections that have an ID corresponding to a nav link
        const sections = document.querySelectorAll('section[id]');
        
        // Find which section is currently in view
        let currentSectionId = '';
        
        // Check if we're at the bottom of the page - if so, activate the last section
        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
        
        if (isAtBottom) {
            // If at bottom, set the contact section as active
            currentSectionId = '#contact';
        } else {
            // Otherwise check which section is in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; // 100px offset for navbar height
                const sectionHeight = section.offsetHeight;
                const currentScroll = window.scrollY;
                
                if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                    currentSectionId = '#' + section.getAttribute('id');
                }
            });
            
            // If we're at the top of the page and no section is active, set home as active
            if (currentSectionId === '' && window.scrollY < 100) {
                currentSectionId = '#home';
            }
        }
        
        // Update the active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            }
        });
    });
    
    // Initial active link update
    updateActiveNavLink();
}

// Projects
function initProjects() {
    // Render projects
    function renderProjects(items = projects) {
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = items.map(project => `
            <article class="project-card" data-category="${project.category}">
                <div class="project-card__image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-card__content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-card__tags">
                        ${project.technologies.map(tech => `
                            <span class="tag">${tech}</span>
                        `).join('')}
                    </div>
                    <div class="project-card__actions">
                        <a href="project-detail.html?id=${project.id}" class="btn btn--primary">View Details</a>
                        ${project.link && project.link !== '#' ? `<a href="${project.link}" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    }

    // Filter projects
    if (filterButtons) {
        filterButtons.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                const category = e.target.dataset.filter;
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Filter projects
                const filteredProjects = category === 'all' 
                    ? projects 
                    : projects.filter(project => project.category === category);
                
                renderProjects(filteredProjects);
            }
        });
    }

    // Initial render
    renderProjects();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjects();
});
