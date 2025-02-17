// DOM Elements
const navbar = document.querySelector('[data-navbar]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelectorAll('.navbar__link');
const projectsGrid = document.querySelector('[data-projects-grid]');
const filterButtons = document.querySelector('[data-filters]');
const contactForm = document.querySelector('[data-contact-form]');
const navMenu = document.querySelector('.navbar__menu');

// Projects Data - using URL-friendly IDs
const projects = [
    {
        id: 'telegram-chatbot',
        title: 'Telegram Woocommerce Chatbot',
        description: 'Developed a machine learning model to predict customer churn with 92% accuracy using XGBoost and feature engineering techniques.',
        image: 'assets/telegram.webp',
        category: 'llm',
        technologies: ['Python', 'Flask', 'Telegram API', 'LLM Sales Agent', 'OpenAI API', 'WooCommerce API'],
        link: 'https://github.com/yourusername/telegram-chatbot' // Ejemplo de proyecto con demo
    },
    {
        id: 'bank-complaints',
        title: 'Bank Complaints Analysis with NLP and Spark',
        description: 'Analyzed bank customer complaints to identify trends and patterns, using natural language processing and big data techniques.',
        image: 'assets/bank-complaints.webp',
        category: 'nlp',
        technologies: ['Python', 'PySpark', 'Streamlit', 'Docker', 'AWS', 'Spark-NLP', 'JhonSnowLabs'],
        link: '#' // Proyecto sin demo
    },
    {
        id: 'tdg-forex',
        title: 'Implementation ofMachine Learning Models for Trend Prediction in Forex Currency Pairs',
        description: 'Grade Project for Masters Degree in Data Science',
        image: 'assets/forex.webp',
        category: 'machine-learning',
        technologies: ['Python', 'XGBoost', 'Scikit-Learn', 'CatBoost', 'Feature Engineering', 'Time Series Analysis'],
        link: '#' // Proyecto sin demo
    },
    {
        id: 'image-classification',
        title: 'Image Classification System',
        description: 'Implemented a CNN-based image classification system for product categorization, deployed on AWS with auto-scaling.',
        image: 'assets/image-classification.webp',
        category: 'deep-learning',
        technologies: ['TensorFlow', 'AWS', 'Docker', 'REST API'],
        link: '#' // Proyecto sin demo
    },
    {
        id: 'ab-testing',
        title: 'A/B Testing Framework',
        description: 'Developed an automated A/B testing framework that increased experiment velocity by 200% and improved decision-making accuracy.',
        image: 'assets/ab-testing.webp',
        category: 'analytics',
        technologies: ['Python', 'Statistics', 'SQL', 'Airflow'],
        link: '#' // Proyecto sin demo
    },
    {
        id: 'big-data',
        title: 'Big Data Pipeline',
        description: 'Architected and implemented a real-time data processing pipeline handling 1TB+ daily data using Apache Spark.',
        image: 'assets/big-data.webp',
        category: 'big-data',
        technologies: ['Spark', 'Kafka', 'AWS EMR', 'Python'],
        link: '#' // Proyecto sin demo
    }
];

// Navigation
function initNavigation() {
    // Scroll handling
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

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
