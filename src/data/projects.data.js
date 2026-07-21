/**
 * Single source of truth for project content. Card data and detail data used
 * to live in two files keyed by id and drifted apart (the thesis project
 * 404'd); now every page reads from this one list via the repository.
 */
export const PROJECT_RECORDS = [
  {
    id: 'tdg-forex',
    title: 'Machine Learning Models for Trend Prediction in Forex Currency Pairs',
    category: 'machine-learning',
    summary:
      'Master’s thesis: gradient-boosted models forecasting directional trends in forex pairs, validated walk-forward on out-of-sample data.',
    paragraphs: [
      'Grade project for the Master’s degree in Data Science and Analytics at EAFIT University. The work benchmarks gradient-boosting models (XGBoost, CatBoost) against classical baselines for predicting directional trends in major forex currency pairs.',
      'The pipeline covers feature engineering over price action and technical indicators, time-series aware cross-validation (walk-forward splits, no look-ahead leakage), and evaluation focused on out-of-sample directional accuracy rather than in-sample fit.',
    ],
    image: 'assets/forex.webp',
    imageAlt: 'Forex trend prediction model — charts of currency pair predictions',
    technologies: ['Python', 'XGBoost', 'CatBoost', 'Scikit-Learn', 'Feature Engineering', 'Time Series'],
    features: [
      'Feature engineering over technical indicators and price action',
      'Walk-forward validation designed to prevent look-ahead leakage',
      'Model benchmarking: gradient boosting vs. classical baselines',
    ],
    metrics: [],
    status: 'Paper in progress',
  },
  {
    id: 'bank-complaints',
    title: 'Bank Complaints Text Processing with Spark NLP',
    category: 'nlp',
    summary:
      'Large-scale NLP over U.S. consumer bank complaints on AWS EMR — topic modeling plus supervised classification, served through a Streamlit dashboard.',
    paragraphs: [
      'A text processing and analysis project that uses Spark NLP to analyze bank complaints data at scale on AWS EMR Studio. NLP techniques extract insights, categorize complaints, and predict complaint categories.',
      'The application is containerized with Docker and features a Streamlit interface for interactive analysis. Models include CountVectorizer + IDF features, LDA for topic modeling, and supervised classifiers (logistic regression, decision trees).',
      'A modular architecture separates the application layer, configuration, and analytics components. MLflow tracks experiments and versions models for reproducibility.',
    ],
    image: 'assets/bank-complaints.webp',
    imageAlt: 'Bank complaints NLP dashboard — topic and classification views',
    technologies: ['PySpark', 'Spark NLP', 'AWS EMR', 'Docker', 'MLflow', 'Streamlit'],
    features: [
      'Distributed text processing pipeline with Spark NLP',
      'LDA topic modeling to surface complaint themes',
      'Supervised classification with logistic regression and decision trees',
      'Interactive Streamlit dashboard, containerized with Docker',
      'Experiment tracking and model versioning with MLflow',
    ],
    metrics: [
      { value: '79.9%', label: 'Logistic regression F1' },
      { value: '5', label: 'Topic categories found' },
      { value: '53.9%', label: 'Decision tree accuracy' },
    ],
    sourceUrl: 'https://github.com/sebasr0/SparkNLP-Project-Bank-Complaints',
  },
  {
    id: 'telegram-chatbot',
    title: 'Telegram WooCommerce Sales Chatbot',
    category: 'llm',
    summary:
      'RAG-backed LLM agent answering store customers on Telegram — catalog search, order status, and stock updates against a live WooCommerce shop.',
    paragraphs: [
      'A chatbot with retrieval-augmented generation (RAG) that integrates Telegram with WooCommerce, providing automated customer service and order management. Natural language understanding routes customer queries to catalog, order, and support flows.',
      'Built with Python and Flask; OpenAI embeddings power retrieval, and generation runs on the Groq API with Llama. MongoDB stores customer information, orders, and chat history.',
      'The bot detects the customer’s language automatically and answers in it, so shoppers get help in their own language without configuration.',
    ],
    image: 'assets/telegram.webp',
    imageAlt: 'Telegram chatbot conversation with a WooCommerce store',
    technologies: ['Python', 'Flask', 'RAG', 'OpenAI API', 'Groq · Llama', 'MongoDB', 'WooCommerce API'],
    features: [
      'Natural language understanding for customer queries',
      'Product catalog browsing and semantic search',
      'Automatic language detection with multi-language replies',
      'Live stock and order-status updates from WooCommerce',
    ],
    metrics: [
      { value: '85%', label: 'Query resolution rate' },
      { value: '3.5s', label: 'Avg. response time' },
      { value: '24/7', label: 'Availability' },
    ],
    sourceUrl: 'https://github.com/sebasr0/TelegramBot',
  },
];
