// Extended project data with more details
const projectsData = {
    'telegram-chatbot': {
        title: 'Telegram Woocommerce Chatbot',
        category: 'llm',
        description: `A sophisticated chatbot that integrates Telegram with WooCommerce, providing automated customer service and order management capabilities. The system uses natural language processing to understand customer queries and machine learning to improve responses over time.`,
        image: 'assets/telegram.webp',
        technologies: ['Python', 'Flask', 'LLM', 'Telegram API', 'WooCommerce API', 'MongoDB', 'Groq API', 'OpenAI API', 'RAG'],
        features: [
            'Natural language understanding for processing customer queries',
            'Automated order status tracking and updates',
            'Product catalog browsing and search',
            'Smart product recommendations based on user interaction',
            'Multi-language support with automatic language detection'
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
            },
            {
                value: '40%',
                label: 'Support Cost Reduction'
            }
        ],
        demoUrl: 'https://demo-url.com',
        sourceUrl: 'https://github.com/sebasr0/telegram-chatbot'
    },
    'bank-complaints': {
        title: 'Bank Complaints',
        category: 'analytics',
        description: `An advanced time series forecasting system that combines multiple statistical and machine learning models to provide accurate sales predictions. The interactive dashboard allows users to visualize trends, seasonality, and anomalies in the data.`,
        image: 'assets/bank-complaints.webp',
        technologies: ['Python', 'Prophet', 'Streamlit', 'Plotly', 'Pandas', 'scikit-learn'],
        features: [
            'Multi-model ensemble forecasting',
            'Interactive data visualization',
            'Automated seasonality detection',
            'Anomaly detection and alerting',
            'Export capabilities for reports'
        ],
        metrics: [
            {
                value: '35%',
                label: 'Forecast Error Reduction'
            },
            {
                value: '95%',
                label: 'Prediction Accuracy'
            },
            {
                value: '60%',
                label: 'Time Saved in Analysis'
            },
            {
                value: '100+',
                label: 'Active Users'
            }
        ],
        demoUrl: 'https://demo-forecasting.com',
        sourceUrl: 'https://github.com/sebasr0/time-series'
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
