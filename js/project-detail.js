// Extended project data with more details
const projectsData = {
    'telegram-chatbot': {
        title: 'Telegram Woocommerce Chatbot',
        category: 'llm',
        description: `A chatbot with Retrieval Augmented Generation (RAG) that integrates Telegram with WooCommerce, providing automated customer service and order management capabilities. The system uses natural language processing to understand customer queries and machine learning to improve responses over time.
        
        The chatbot is built with Python and Flask, and uses the OpenAI API for creating embeddings and generating responses. It is connected to a MongoDB database for storing customer information and order and chat history, and is also integrated with the Groq API with llama.
        
        The chatbot is available in multiple languages and can automatically detect the user's language, making it easy for customers to get the help they need in their preferred language.`,

        image: 'assets/telegram.webp',
        technologies: ['Python', 'Flask', 'LLM', 'Telegram API', 'WooCommerce API', 'MongoDB', 'Groq API', 'OpenAI API', 'RAG'],
        features: [
            'Natural language understanding for processing customer queries',
            'Product catalog browsing and search',
            'Multi-language support with automatic language detection',
            'Automated stock updates for the customer'
        ],
        metrics: [
            {
                value: '85%',
                label: 'Query Resolution Rate'
            },
            {
                value: '24/7',
                label: 'Availability'
            },
            {
                value: '3.5s',
                label: 'Average Response Time'
            }
        ],
        sourceUrl: 'https://github.com/sebasr0/TelegramBot'
    },
    'bank-complaints': {
        title: 'Bank Complaints Text Processing with Spark NLP',
        category: 'analytics',
        description: `A comprehensive text processing and analysis project that utilizes Spark NLP to analyze bank complaints data. The project implements various natural language processing techniques to extract insights, categorize complaints, and predict complaint categories.
        
        The application is containerized using Docker and features a Streamlit interface for interactive analysis. It incorporates sophisticated machine learning models including CountVectorizer, IDF, LDA for topic modeling, and supervised classification models like Logistic Regression and Decision Trees.
        
        The project is structured with a modular architecture that separates the application layer, configuration, and analytics components. MlFlow is utilized for experiment tracking and model versioning, ensuring reproducibility and performance monitoring.`,
        image: 'assets/bank-complaints.webp',
        technologies: ['Spark NLP', 'Python', 'Streamlit', 'Docker', 'MlFlow', 'Logistic Regression', 'LDA', 'CountVectorizer', 'IDF', 'Decision Tree', 'Jupyter Notebook'],
        features: [
            'Text processing pipeline with Spark NLP',
            'Topic modeling to categorize complaints (LDA)',
            'Supervised classification with Logistic Regression and Decision Trees',
            'Interactive Streamlit dashboard for analysis',
            'Containerized deployment with Docker',
            'Model tracking and versioning with MlFlow'
        ],
        metrics: [
            {
                value: '79.9%',
                label: 'Logistic Regression Accuracy'
            },
            {
                value: '79.9%',
                label: 'F1 Score'
            },
            {
                value: '5',
                label: 'Identified Topic Categories'
            },
            {
                value: '53.9%',
                label: 'Decision Tree Accuracy'
            }
        ],
        sourceUrl: 'https://github.com/sebasr0/SparkNLP-Project-Bank-Complaints'
    }
    // Add more detailed project data as needed
};

// Get project ID from URL
const getProjectId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// Update page content
const updateProjectContent = (project) => {
    if (!project) {
        window.location.href = 'index.html';
        return;
    }

    // Update title and meta
    document.title = `${project.title} | Portfolio`;
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectCategory').textContent = project.category;
    
    // Update image
    const projectImage = document.getElementById('projectImage');
    projectImage.src = project.image;
    projectImage.alt = project.title;
    
    // Update description
    document.getElementById('projectDescription').textContent = project.description;
    
    // Update technologies
    const techList = document.getElementById('techList');
    techList.innerHTML = project.technologies.map(tech => `
        <li>${tech}</li>
    `).join('');
    
    // Update features
    const featureList = document.getElementById('featureList');
    featureList.innerHTML = project.features.map(feature => `
        <li>${feature}</li>
    `).join('');
    
    // Update metrics
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = project.metrics.map(metric => `
        <div class="metric-card">
            <div class="metric-card__value">${metric.value}</div>
            <div class="metric-card__label">${metric.label}</div>
        </div>
    `).join('');
    
    // Update action buttons
    const liveDemo = document.getElementById('liveDemo');
    const sourceCode = document.getElementById('sourceCode');
    
    if (project.demoUrl) {
        liveDemo.href = project.demoUrl;
        liveDemo.style.display = 'inline-flex';
    } else {
        liveDemo.style.display = 'none';
    }
    
    if (project.sourceUrl) {
        sourceCode.href = project.sourceUrl;
        sourceCode.style.display = 'inline-flex';
    } else {
        sourceCode.style.display = 'none';
    }
};

// Handle 404 cases
const handleProjectNotFound = () => {
    const container = document.querySelector('.project-detail .container');
    if (container) {
        container.innerHTML = `
            <div class="project-not-found">
                <h1>Project Not Found</h1>
                <p>The project you're looking for doesn't exist or has been moved.</p>
                <a href="index.html" class="btn btn--primary">Back to Projects</a>
            </div>
        `;
    }
};

// Initialize page
const initProjectDetail = () => {
    const projectId = getProjectId();
    
    if (!projectId) {
        handleProjectNotFound();
        return;
    }

    const project = projectsData[projectId];
    
    if (project) {
        updateProjectContent(project);
    } else {
        handleProjectNotFound();
    }
};

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectDetail);
