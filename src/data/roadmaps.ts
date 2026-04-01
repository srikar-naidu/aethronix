export interface RoadmapModule {
    week: number;
    title: string;
    description: string;
    type: 'current' | 'locked' | 'reward';
    reward?: string;
    color?: string;
    documentation?: string;
}

export interface RoadmapGap {
    name: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface RoadmapDomain {
    description: string;
    gaps: RoadmapGap[];
    timeline: string;
    roi: string;
    roiSub: string;
    plan: RoadmapModule[];
}

export const ROADMAP_DATA: Record<string, RoadmapDomain> = {
    "Frontend Engineer": {
        description: "Focus on modern web architecture, performance, and advanced state management.",
        gaps: [
            { name: "GraphQL", priority: "High" },
            { name: "WebSockets", priority: "Medium" },
            { name: "Performance Auditing", priority: "Medium" },
            { name: "Micro-frontends", priority: "Low" }
        ],
        timeline: "6 Weeks",
        roi: "+45% Job Matches",
        roiSub: "Unlocks 120+ new startup internship opportunities",
        plan: [
            { 
                week: 1, 
                title: "GraphQL Fundamentals", 
                description: "Learn Queries, Mutations, and Apollo Client integration in Next.js.", 
                type: "current", 
                color: "var(--color-accent)",
                documentation: "GraphQL is a query language for APIs. Unlike REST, it allows clients to request exactly the data they need. \n\n**Key Concepts:**\n- **Schemas & Types**: Define the shape of your data.\n- **Queries**: Read data from the server.\n- **Mutations**: Modify data on the server.\n- **Subscriptions**: Real-time updates.\n\n**Tooling:**\n- **Apollo Client**: The industry standard for React integration.\n- **GraphQL Yoga**: A simple, high-performance server-side library."
            },
            { week: 2, title: "Advanced Hooks & Zustand", description: "Pattern-based state management for enterprise-scale React applications.", type: "locked" },
            { week: 3, title: "Real-time Architecture", description: "Socket.io for live notifications and optimizing WebSocket overhead.", type: "locked" },
            { week: 4, title: "Next.js 15 & Server Components", description: "Mastering partial pre-rendering and advanced streaming patterns.", type: "locked" },
            { week: 5, title: "Web Performance Audit", description: "Core Web Vitals, Lighthouse CI, and TBT/LCP optimization strategies.", type: "locked" },
            { week: 6, title: "Architecture Capstone", description: "Build a high-performance ecommerce storefront with AI personalization.", type: "reward", reward: '"Senior Frontend Architect" Badge' }
        ]
    },
    "Backend Engineer": {
        description: "Master distributed systems, database scaling, and high-performance APIs.",
        gaps: [
            { name: "Redis Pub/Sub", priority: "High" },
            { name: "Message Queues", priority: "High" },
            { name: "Postgres Sharding", priority: "Medium" },
            { name: "gRPC", priority: "Medium" }
        ],
        timeline: "7 Weeks",
        roi: "+38% Salary Boost",
        roiSub: "Qualifies you for infrastructure-heavy roles",
        plan: [
            { 
                week: 1, 
                title: "Advanced Caching", 
                description: "Redis clusters for session management and distributed caching.", 
                type: "current", 
                color: "var(--color-primary)",
                documentation: "Caching is the process of storing data in a temporary storage area to increase accessibility and speed. \n\n**Key Concepts:**\n- **LRU (Least Recently Used)**: Common eviction policy.\n- **Write-through vs Write-back**: Different strategies for keeping the cache and database in sync.\n- **Distributed Caching**: Shared cache across multiple server instances.\n\n**Tooling:**\n- **Redis**: An open-source, in-memory data structure store used as a database, cache, and message broker.\n- **Memcached**: A general-purpose distributed memory-caching system."
            },
            { week: 2, title: "SQL Optimization", description: "Index strategies, execution plans, and query refactoring for performance.", type: "locked" },
            { week: 3, title: "Event-Driven Arch", description: "RabbitMQ/Kafka integration for decoupled high-availability services.", type: "locked" },
            { week: 4, title: "gRPC & Protobuf", description: "Designing low-latency internal microservice communication.", type: "locked" },
            { week: 5, title: "Distributed Tracing", description: "OpenTelemetry and Jaeger for observability across microservices.", type: "locked" },
            { week: 6, title: "Database Architecture", description: "Read-replicas, partitioning, and sharding strategies at scale.", type: "locked" },
            { week: 7, title: "Scalability Capstone", description: "Architect a system handling 1M simultaneous requests safely.", type: "reward", reward: '"Backend Lead" Badge' }
        ]
    },
    "AI/ML Engineer": {
        description: "Specialize in model deployment, fine-tuning, and low-latency inference.",
        gaps: [
            { name: "Vector Database Strategy", priority: "High" },
            { name: "Model Quantization", priority: "Medium" },
            { name: "RAG Evaluation", priority: "High" }
        ],
        timeline: "8 Weeks",
        roi: "+60% AI Readiness",
        roiSub: "Top 2% Globally for AI Implementation skills",
        plan: [
            { 
                week: 1, 
                title: "Fine-tuning Patterns", 
                description: "Training LoRA and QLoRA adapters for niche Llama-3 specializations.", 
                type: "current", 
                color: "purple",
                documentation: "Model fine-tuning allows you to take a pre-trained model and modify it for a specific task. \n\n**Key Concepts:**\n- **LoRA (Low-Rank Adaptation)**: A technique to fine-tune large models with fewer parameters.\n- **Overfitting**: When a model learns the training data too well, failing to generalize.\n- **Transfer Learning**: Reusing knowledge from one task for another related task.\n\n**Tooling:**\n- **PyTorch**: A deep learning framework that provides a flexible and efficient environment for training models.\n- **Hugging Face Transformers**: A library for easily loading and using state-of-the-art pre-trained models."
            },
            { week: 2, title: "Advanced RAG", description: "Hybrid search, query re-writing, and re-ranking for enterprise search.", type: "locked" },
            { week: 3, title: "Vector DB Lifecycle", description: "Pinecone and ChromaDB indices for high-dimensional semantic search.", type: "locked" },
            { week: 4, title: "Model Deployment (LLM Ops)", description: "VLLM and TGI integration for high-throughput model inference.", type: "locked" },
            { week: 5, title: "Prompt Engineering v2", description: "Chain-of-Thought, ReAct patterns, and multi-agent orchestration.", type: "locked" },
            { week: 6, title: "Agentic Workflows", description: "Building multi-agent systems with LangChain and Autogen.", type: "locked" },
            { week: 7, title: "Observability for AI", description: "Monitoring halluncinations and token-usage costs with Arize Phoenix.", type: "locked" },
            { week: 8, title: "AI Product Capstone", description: "Deploy a private AI Knowledge agent with multi-modal capabilities.", type: "reward", reward: '"AI Solutions Architect" Badge' }
        ]
    },
    "Fullstack Developer": {
        description: "Bridge the gap between frontend fluidity and backend reliability.",
        gaps: [
            { name: "PostgreSQL Advanced", priority: "High" },
            { name: "System Design", priority: "Medium" },
            { name: "Test-Driven Dev", priority: "High" }
        ],
        timeline: "7 Weeks",
        roi: "+55% Versatility",
        roiSub: "Ideal for early-stage startup founding engineer roles",
        plan: [
            { 
                week: 1, 
                title: "Containerization Suite", 
                description: "Multi-stage Docker builds and docker-compose for Dev-Prod parity.", 
                type: "current", 
                color: "var(--color-accent)",
                documentation: "Containerization is the process of packaging an application and its dependencies into a single image. \n\n**Key Concepts:**\n- **Docker Images vs Containers**: Images are the static packages, and containers are the running instances.\n- **Docker Hub**: A repository for sharing and discovering container images.\n- **Kubernetes**: An orchestration system for managing and scaling containerized applications.\n\n**Tooling:**\n- **Docker**: The most popular containerization platform.\n- **Docker Compose**: A tool for defining and running multi-container applications."
            },
            { week: 2, title: "Comprehensive Testing", description: "Unit, Integration, and E2E testing with Jest/Playwright/Prisma.", type: "locked" },
            { week: 3, title: "Auth Protocols", description: "OAuth2, OIDC, and JWT best practices for secure multi-tenant apps.", type: "locked" },
            { week: 4, title: "Background Processing", description: "BullMQ and Redis for asynchronous task queues and jobs.", type: "locked" },
            { week: 5, title: "Production Monitoring", description: "Error tracking with Sentry and performance monitoring with New Relic.", type: "locked" },
            { week: 6, title: "CI/CD Automations", description: "GitHub Actions for automated testing and canary deployments.", type: "locked" },
            { week: 7, title: "Ship-It Capstone", description: "Deploy an end-to-end multi-platform application at scale.", type: "reward", reward: '"Fullstack Master" Badge' }
        ]
    },
    "Data Scientist": {
        description: "Transform raw data into actionable business intelligence using statistical models.",
        gaps: [
            { name: "Bayesian Modeling", priority: "Medium" },
            { name: "Feature Engineering", priority: "High" },
            { name: "NLP / Text Mining", priority: "Low" }
        ],
        timeline: "8 Weeks",
        roi: "+40% Decision Power",
        roiSub: "Enables data-driven leadership roles",
        plan: [
            { 
                week: 1, 
                title: "Data Wrangling v2", 
                description: "Advanced Pandas & Dask for datasets that exceed RAM limits.", 
                type: "current", 
                color: "cyan",
                documentation: "Data wrangling is the process of cleaning and transforming raw data into a usable format. \n\n**Key Concepts:**\n- **Data Cleaning**: Removing duplicates, handling missing values, and correcting errors.\n- **Data Transformation**: Reshaping data for analysis.\n- **Scalable Data Processing**: Techniques for handling large datasets.\n\n**Tooling:**\n- **Pandas**: A powerful Python library for data manipulation and analysis.\n- **Dask**: A library for parallel computing with Python, often used for large datasets."
            },
            { week: 2, title: "Applied Statistics", description: "Probability distributions, p-hacking avoidance, and A/B test design.", type: "locked" },
            { week: 3, title: "Feature Ops", description: "Automated feature engineering and selection for high-dimensional data.", type: "locked" },
            { week: 4, title: "NLP Fundamentals", description: "TF-IDF, Word2Vec, and Transformers for sentiment and categorization.", type: "locked" },
            { week: 5, title: "Model Explainability", description: "SHAP and LIME to interpret deep learning black-box models.", type: "locked" },
            { week: 6, title: "ML Lifecycle (MLOps)", description: "Experiment tracking with MLFlow and Weights & Biases.", type: "locked" },
            { week: 7, title: "Forecasting", description: "Time-series analysis and prophet modeling for demand prediction.", type: "locked" },
            { week: 8, title: "Executive Analyst Capstone", description: "Present a business transformation report based on data insights.", type: "reward", reward: '"Elite Data Analyst" Badge' }
        ]
    },
    "DevOps Engineer": {
        description: "Automate infrastructure, deployments, and security monitoring.",
        gaps: [
            { name: "Kubernetes Ops", priority: "High" },
            { name: "GitOps Workflows", priority: "High" },
            { name: "Cloud Networking", priority: "Medium" }
        ],
        timeline: "7 Weeks",
        roi: "+50% Reliability",
        roiSub: "Essential for 99.99% uptime enterprise apps",
        plan: [
            { 
                week: 1, 
                title: "Terraform Mastery", 
                description: "Multi-provider modules, remote state, and drift detection.", 
                type: "current", 
                color: "blue",
                documentation: "Terraform is an open-source infrastructure-as-code tool for building and managing resources. \n\n**Key Concepts:**\n- **Resource Management**: Defining and managing cloud resources using a declarative language.\n- **State Management**: Storing and managing the state of your infrastructure.\n- **Provider Management**: Interfacing with various cloud providers.\n\n**Tooling:**\n- **Terraform**: The most popular IAAC tool.\n- **Pulumi**: An IAAC framework that allows you to manage resources using standard programming languages."
            },
            { week: 2, title: "Cloud Networking", description: "VPC, Subnets, Ingress controllers, and secure load balancing.", type: "locked" },
            { week: 3, title: "Kubernetes Internals", description: "Resource quotas, storage classes, and custom controllers (CRDs).", type: "locked" },
            { week: 4, title: "GitOps Paradigms", description: "Implementing ArgoCD for continuous synchronization of K8s state.", type: "locked" },
            { week: 5, title: "SRE Observability", description: "Prometheus, Grafana, and SLI/SLO dashboard architecture.", type: "locked" },
            { week: 6, title: "Security as Code", description: "Vulnerability scanning pipelines and IAM least-privilege audits.", type: "locked" },
            { week: 7, title: "Self-Healing App Capstone", description: "Design a zero-downtime, global-auto-scaling infrastructure.", type: "reward", reward: '"Site Reliability Expert" Badge' }
        ]
    },
    "Mobile App Developer": {
        description: "Craft high-performance, native-quality experiences for iOS and Android.",
        gaps: [
            { name: "Native Module Bridge", priority: "High" },
            { name: "Offline Sync Patterns", priority: "High" },
            { name: "App Animation Performance", priority: "Medium" }
        ],
        timeline: "7 Weeks",
        roi: "+35% Reach",
        roiSub: "Direct access to billions of mobile users",
        plan: [
            { 
                week: 1, 
                title: "Native Architecture", 
                description: "React Native vision-camera and native file-system integrations.", 
                type: "current", 
                color: "orange",
                documentation: "Native architecture is the process of building mobile applications with native UI components. \n\n**Key Concepts:**\n- **Bridging**: Interfacing React Native code with native iOS/Android bridge code.\n- **Native Module Management**: Managing and developing custom native modules.\n- **Platform-Specific Implementation**: Writing platform-specific code for common functionalities.\n\n**Tooling:**\n- **React Native CLI**: The official command-line tool for React Native development.\n- **Expo**: A framework and a platform for universal React applications."
            },
            { week: 2, title: "Offline-First Sync", description: "Implementing WatermelonDB or Realm for local-first data storage.", type: "locked" },
            { week: 3, title: "App Performance Audit", description: "Solving layout thrashing, bridge-congestion, and memory leaks.", type: "locked" },
            { week: 4, title: "Native CI/CD", description: "Automating builds with Fastlane and CodePush over-the-air updates.", type: "locked" },
            { week: 5, title: "Security for Mobile", description: "Biometric auth, secure keychain storage, and SSL pinning.", type: "locked" },
            { week: 6, title: "Design to Code", description: "Advanced animations with Reanimated 3 and Skia for Mobile.", type: "locked" },
            { week: 7, title: "Mobile Product Capstone", description: "Launch and publish a high-performance cross-platform application.", type: "reward", reward: '"Mobile Engineer Lead" Badge' }
        ]
    },
    "Cybersecurity Analyst": {
        description: "Protect digital assets through threat detection, response, and ethical hacking.",
        gaps: [
            { name: "Penetration Testing", priority: "High" },
            { name: "Malware Analysis", priority: "Medium" },
            { name: "SOC Operations", priority: "Medium" }
        ],
        timeline: "8 Weeks",
        roi: "+200% Resilience",
        roiSub: "High-demand role in financial and government sectors",
        plan: [
            { 
                week: 1, 
                title: "Network Infiltration", 
                description: "Analyzing traffic with Wireshark and detecting network anomalies.", 
                type: "current", 
                color: "red",
                documentation: "Network infiltration is the process of analyzing and detecting network threats. \n\n**Key Concepts:**\n- **Packet Sniffing**: Capturing and analyzing network traffic.\n- **Network Topology Mapping**: Identifying and mapping network devices and services.\n- **Social Engineering**: Manipulating individuals into revealing sensitive information.\n\n**Tooling:**\n- **Wireshark**: The most popular network protocol analyzer.\n- **Nmap**: A free and open-source network scanner for discoverable hosts and services."
            },
            { week: 2, title: "Web Vulnerability Audit", description: "Practicing OWASP Top 10 exploits in sandbox environments.", type: "locked" },
            { week: 3, title: "Incident Response", description: "Developing playbooks for data breaches and ransomware attacks.", type: "locked" },
            { week: 4, title: "Cloud Security Hardening", description: "Auditing AWS S3 policies and IAM roles for least-privilege.", type: "locked" },
            { week: 5, title: "Endpoint Protection", description: "Configuring EDR tools and monitoring for suspicious processes.", type: "locked" },
            { week: 6, title: "Forensic Analysis", description: "Recovering data from disk images and memory dumps.", type: "locked" },
            { week: 7, title: "Zero-Trust Strategy", description: "Designing identity-based perimeters for remote workforces.", type: "locked" },
            { week: 8, title: "CISO Audit Capstone", description: "Full security report for an enterprise-level infrastructure.", type: "reward", reward: '"Cyber Guardian" Badge' }
        ]
    },
    "Cloud Architect": {
        description: "Design and implement scalable cloud solutions on AWS, Azure, or GCP.",
        gaps: [
            { name: "Serverless Scale", priority: "High" },
            { name: "Multi-region Failover", priority: "High" },
            { name: "Cloud Cost Efficiency", priority: "Medium" }
        ],
        timeline: "8 Weeks",
        roi: "95% Job Relevance",
        roiSub: "Direct path to Cloud Practitioner certifications",
        plan: [
            { 
                week: 1, 
                title: "Cloud Backbone", 
                description: "Global Transit Gateways, VPC Peering, and DNS routing.", 
                type: "current", 
                color: "teal",
                documentation: "Cloud backbone refers to the underlying infrastructure and services that power cloud computing. \n\n**Key Concepts:**\n- **Storage Architecture**: Designing and managing scalable storage systems.\n- **Compute Resources**: Provisioning and managing virtual servers and serverless compute.\n- **Network Infrastructure**: Designing and managing virtual networks and subnets.\n\n**Tooling:**\n- **AWS CloudFormation**: An IAAC service for building and managing AWS resources.\n- **Google Cloud Deployment Manager**: A service for managing infrastructure using declarative configurations."
            },
            { week: 2, title: "Compute Strategies", description: "Balancing Lambda, Fargate, and Spot-instances for cost.", type: "locked" },
            { week: 3, title: "Multi-Region Persistence", description: "Global tables with DynamoDB and Aurora multi-master clusters.", type: "locked" },
            { week: 4, title: "Disaster Recovery", description: "RTO/RPO strategies for cross-region data replication.", type: "locked" },
            { week: 5, title: "FinOps & Cost Opt", description: "Automated rightsizing and anomaly detection for cloud spend.", type: "locked" },
            { week: 6, title: "Cloud-Native Security", description: "WAF, Shield, and GuardDuty integration for edge protection.", type: "locked" },
            { week: 7, title: "Hybrid Cloud patterns", description: "DirectConnect and Site-to-Site VPN for enterprise data center sync.", type: "locked" },
            { week: 8, title: "Cloud Transformation Capstone", description: "Migrate and scale a monolith to a cloud-native ecosystem.", type: "reward", reward: '"Cloud Guru" Badge' }
        ]
    },
    "UI/UX Designer": {
        description: "Create beautiful, accessible, and user-centric digital interfaces.",
        gaps: [
            { name: "Advanced Prototyping", priority: "High" },
            { name: "Design System Ops", priority: "High" },
            { name: "WCAG Accessibility", priority: "High" }
        ],
        timeline: "5 Weeks",
        roi: "+30% Engagement",
        roiSub: "Increases conversions and user satisfaction directly",
        plan: [
            { 
                week: 1, 
                title: "Foundations & Theory", 
                description: "Color theory, accessibility hierarchy, and responsive layout.", 
                type: "current", 
                color: "pink",
                documentation: "Foundations and theory provide a strong understanding of core design principles. \n\n**Key Concepts:**\n- **Visual Theory**: Principles of layout, color theory, and typography.\n- **User Research Principles**: Conduct research to understand user needs and preferences.\n- **Usability Theory**: Designing interfaces that are easy to use and intuitive.\n\n**Tooling:**\n- **Figma Mastery**: Mastering the industry-standard design tool for creating high-fidelity interfaces."
            },
            { week: 2, title: "Interactive Prototypes", description: "Using Variables and Advanced Components in Figma for testing.", type: "locked" },
            { week: 3, title: "Design Systems", description: "Building tokens and scalable component libraries for dev sync.", type: "locked" },
            { week: 4, title: "User Research Lab", description: "Conducting heat-map analysis and A/B test UI variations.", type: "locked" },
            { week: 5, title: "Product Launch Capstone", description: "Complete UI/UX design suite for a high-traffic SaaS app.", type: "reward", reward: '"Visual Lead" Badge' }
        ]
    },
    "Blockchain Developer": {
        description: "Build decentralized applications and secure smart contracts.",
        gaps: [
            { name: "Smart Contract Security", priority: "High" },
            { name: "Layer 2 Scaling", priority: "Medium" },
            { name: "EVM Optimization", priority: "Medium" }
        ],
        timeline: "8 Weeks",
        roi: "+110% Tech Premium",
        roiSub: "Top tier salary in Web3 startup ecosystems",
        plan: [
            { 
                week: 1, 
                title: "Solidity Deep Dive", 
                description: "Gas optimization, proxy contracts, and low-level assembly (Yul).", 
                type: "current", 
                color: "yellow",
                documentation: "Solidity is a programming language for writing smart contracts for Ethereum. \n\n**Key Concepts:**\n- **Solidity Smart Contracts**: Developing and deploying secure contracts on various blockchains.\n- **Contract Auditing**: Identifying and mitigating security vulnerabilities.\n- **Solidity Deployment**: Managing contract deployment using standard tools.\n\n**Tooling:**\n- **Truffle Framework**: A development environment and testing framework for smart contracts.\n- **Ethers.js**: A high-performance Ethereum client library for JavaScript development."
            },
            { week: 2, title: "Web3 Providers", description: "Connecting frontends to Ethereum using Viem and Wagmi hooks.", type: "locked" },
            { week: 3, title: "DeFi Protocol Logic", description: "AMM mechanics, yield farming, and flash loan implementation.", type: "locked" },
            { week: 4, title: "EVM Security Audit", description: "Using Slither and Echidna to detect reentrancy and overflows.", type: "locked" },
            { week: 5, title: "L2 Scaling Solutions", description: "Deploying on Optimism/Arbitrum with bridge integrations.", type: "locked" },
            { week: 6, title: "Solana Specialization", description: "Rust-based smart contracts with the Anchor framework.", type: "locked" },
            { week: 7, title: "Zero Knowledge Proofs", description: "Introduction to Circom and ZK-SNARKs for privacy dApps.", type: "locked" },
            { week: 8, title: "DApp Launch Capstone", description: "Deploy an end-to-end decentralized financial dashboard.", type: "reward", reward: '"Web3 Legend" Badge' }
        ]
    },
    "Data Engineer": {
        description: "Build robust data pipelines to power large-scale analysis.",
        gaps: [
            { name: "Big Data Processing", priority: "High" },
            { name: "Airflow Orchestration", priority: "High" },
            { name: "Real-time Streaming", priority: "High" }
        ],
        timeline: "7 Weeks",
        roi: "+50% Pipeline Speed",
        roiSub: "Enables real-time data analysis for big tech",
        plan: [
            { 
                week: 1, 
                title: "ETL Architecture", 
                description: "Designing idempotent pipelines and data cleaning scripts.", 
                type: "current", 
                color: "indigo",
                documentation: "ETL (Extract, Transform, Load) architecture provides a strong understanding of building data pipelines. \n\n**Key Concepts:**\n- **Data Pipelines Architecture**: Building and managing scalable data pipelines using standard tools.\n- **Orchestration**: Managing complex workflows and ensuring data quality.\n- **Data Governance**: Enforcing data privacy and compliance across pipelines.\n\n**Tooling:**\n- **Snowflake**: A cloud data platform for building and managing analytical datasets.\n- **BigQuery Mastery**: A powerful cloud data warehouse for managing massive analytical datasets."
            },
            { week: 2, title: "Data Warehousing", description: "Snowflake and BigQuery optimization for analytical queries.", type: "locked" },
            { week: 3, title: "Apache Spark Ops", description: "PySpark for distributed processing of TB-scale data.", type: "locked" },
            { week: 4, title: "Workflow Orchestration", description: "Complex DAGs and sensors in Apache Airflow CI/CD.", type: "locked" },
            { week: 5, title: "Real-time Processing", description: "Kafka Streams and Flink for live event ingestion.", type: "locked" },
            { week: 6, title: "Data Quality Audits", description: "Great Expectations for automated pipeline validation.", type: "locked" },
            { week: 7, title: "Data Lake Capstone", description: "Build a scalable Delta Lake for real-time AI feeds.", type: "reward", reward: '"Pipeline Architect" Badge' }
        ]
    },
    "Embedded Systems Engineer": {
        description: "Program hardware and real-time operating systems at the core level.",
        gaps: [
            { name: "Low-level Memory Mgmt", priority: "High" },
            { name: "RTOS Task Scheduling", priority: "High" },
            { name: "Hardware Interfacing", priority: "Medium" }
        ],
        timeline: "8 Weeks",
        roi: "+30% Stability",
        roiSub: "Unlocks aerospace and automotive engineering roles",
        plan: [
            { 
                week: 1, 
                title: "ARM Cortex Internals", 
                description: "Register maps, interrupts, and bare-metal C programming.", 
                type: "current", 
                color: "lime",
                documentation: "Embedded systems engineers have a strong understanding of core hardware and systems. \n\n**Key Concepts:**\n- **Hardware Architecture**: Understanding the underlying hardware components and their interactions.\n- **RTOS Scheduling Principles**: Task prioritization and memory management in various RTOS.\n- **Microcontroller Architecture**: Mastering the core features and capabilities of microcontrollers.\n\n**Tooling:**\n- **ARM Keil MDK**: A set of development tools for building embedded systems with ARM processors.\n- **IAR Embedded Workbench**: A set of set of build tools for building embedded systems."
            },
            { week: 2, title: "Peripheral Interfacing", description: "UART, DMA, ADC, and PWM for sensor and motor control.", type: "locked" },
            { week: 3, title: "RTOS Architecture", description: "FreeRTOS Mutexes, semaphores, and real-time task priority.", type: "locked" },
            { week: 4, title: "Device Drivers", description: "Writing Linux-level kernel drivers for custom hardware.", type: "locked" },
            { week: 5, title: "Low-Power Optimization", description: "Transitioning to Deep-Sleep modes and clock scaling.", type: "locked" },
            { week: 6, title: "IoT Networking", description: "Implementing MQTT and COAP over ESP32/Nordic chips.", type: "locked" },
            { week: 7, title: "Debugging Tools", description: "JTAG, SWD, and Logic analyzer mastery for systems repair.", type: "locked" },
            { week: 8, title: "Robotics System Capstone", description: "Build a self-stabilizing drone or robotics controller pod.", type: "reward", reward: '"Systems Master" Badge' }
        ]
    },
    "Game Developer": {
        description: "Create immersive worlds and interactive experiences in 3D/2D.",
        gaps: [
            { name: "Shader Programming", priority: "High" },
            { name: "Multiplayer Engine", priority: "Medium" },
            { name: "Graphics Optimization", priority: "High" }
        ],
        timeline: "8 Weeks",
        roi: "100% Creativity",
        roiSub: "Transition into the $200B+ gaming industry",
        plan: [
            { 
                week: 1, 
                title: "Gameplay Architecture", 
                description: "Design patterns for inventory, combat, and state machines.", 
                type: "current", 
                color: "violet",
                documentation: "Gameplay architecture provide a strong understanding of building complex game mechanics. \n\n**Key Concepts:**\n- **Core Game Mechanics**: Building and managing various game mechanics using standard patterns.\n- **AI Logic & Pathfinding**: Implementing pathfinding and logic for game agents.\n- **Scripting & Logic**: Writing complex character controls and game state management scripts.\n\n**Tooling:**\n- **Unity Engine Mastery**: Mastering the industry-standard game engine for building 2D/3D games.\n- **Unreal Engine Core**: Mastering the core features and capabilities of the Unreal Engine."
            },
            { week: 2, title: "Physics & Collisions", description: "Custom raycasting, trigger systems, and 3D math (Quaternions).", type: "locked" },
            { week: 3, title: "Visual Effects (VFX)", description: "Shader Graph and Niagara/UDS for cinematic explosions.", type: "locked" },
            { week: 4, title: "Game AI Logic", description: "Behavior Trees and NavMeshes for complex enemy movement.", type: "locked" },
            { week: 5, title: "Performance Profiling", description: "Solving frame-rate drops using CPU/GPU profiling tools.", type: "locked" },
            { week: 6, title: "Network Multiplayer", description: "Handling latency and client-side prediction for live play.", type: "locked" },
            { week: 7, title: "Procedural Gen", description: "Generating infinite worlds using Perlin Noise and algorithms.", type: "locked" },
            { week: 8, title: "Gold Master Capstone", description: "Publish a fully polished playable demo with 3 levels.", type: "reward", reward: '"Game Engine Pro" Badge' }
        ]
    },
    "QA Automation Engineer": {
        description: "Ensure software quality through automated testing and CI/CD integration.",
        gaps: [
            { name: "Test Framework Arch", priority: "High" },
            { name: "Visual Regression", priority: "Medium" },
            { name: "Performance Load Testing", priority: "High" }
        ],
        timeline: "5 Weeks",
        roi: "+40% Release Speed",
        roiSub: "Reduces bugs and speeds up product delivery cycles",
        plan: [
            { 
                week: 1, 
                title: "Playwright Automation", 
                description: "Async/Await patterns and page object models for flaky-free tests.", 
                type: "current", 
                color: "emerald",
                documentation: "QA automation provide a strong understanding of building automated testing frameworks. \n\n**Key Concepts:**\n- **Automated Testing Ecosystem**: Building and managing various automated suites using standard tools.\n- **Visual Testing Integration**: Setting up visual regression for various UI and frontend components.\n- **Performance Test Design**: Creating scripts for simulating concurrent users and APIs.\n\n**Tooling:**\n- **Selenium / Playwright Suite**: Mastering the industry-standard tools for building automated tests.\n- **CI/CD Integration Tools**: Setting up automated suites for every GitHub pull request."
            },
            { week: 2, title: "API Test Automation", description: "Testing REST and GraphQL endpoints with Supertest/Axios.", type: "locked" },
            { week: 3, title: "Visual Testing", description: "Applitools and Percy for UI pixel-perfect visual difference checks.", type: "locked" },
            { week: 4, title: "Load & Stress Testing", description: "K6 scripts to simulate 1000s of concurrent users on APIs.", type: "locked" },
            { week: 5, title: "Quality Assurance Capstone", description: "Complete CI/CD integrated test suite for a microservice app.", type: "reward", reward: '"Quality Champion" Badge' }
        ]
    }
};
