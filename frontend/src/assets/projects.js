const sdeProjects = [
  {
    id: "1",
    name: "Event Exchange Platform",
    status: "Completed",
    skills: [
      "JavaScript",
      "Python",
      "Kafka",
      "Redis",
      "Docker",
      "REST API",
      "Microservices",
    ],
    description:
      "A distributed messaging backbone for event-driven systems using Kafka and Redis.",
    content: `
<p>The <strong>Event Exchange Framework</strong> is a <em>distributed messaging backbone</em> designed to facilitate seamless data flow between different systems. It enables users to <strong>receive, process, and transmit events</strong> across predefined sources and destinations, allowing the creation of <strong>customized data processing pipelines</strong> with minimal effort.</p>

    <h2>Problem It Solves</h2>
    <p>Many applications require <strong>real-time data exchange</strong> between multiple systems, but managing message communication efficiently across distributed architectures can be complex. This framework <strong>simplifies event-driven communication</strong>, ensuring <strong>reliable, scalable, and structured data processing</strong> through its modular design of <em>receivers, processors, and senders</em>.</p>

    <h2>How It Works</h2>
    <ul>
        <li><strong>Receivers</strong> (Web Hook, Web API, Web Pull, Stream RTSP) <em>ingest data</em> from external systems into <strong>message topics</strong>.</li>
        <li><strong>Processors</strong> (such as a relay) <em>consume and process</em> events before passing them to the next stage.</li>
        <li><strong>Senders</strong> (e.g., Web Post) <em>transmit processed events</em> to external systems over HTTP.</li>
        <li>The <strong>Topic Console UI</strong> allows users to <em>monitor and manage</em> event topics, processors, and senders.</li>
        <li>The <strong>eStore (Event Exchange Store)</strong> serves as a <em>central storage</em> for logs, metadata, and mappings related to the event pipeline.</li>
    </ul>

    <h2>Technologies Used</h2>
    <ul>
        <li><strong>Messaging & Event Handling:</strong> Custom message topics for structured data flow</li>
        <li><strong>Data Ingestion:</strong> Web API, Web Hooks, Streaming (RTSP)</li>
        <li><strong>Processing:</strong> Relay-based event transformation</li>
        <li><strong>Delivery Mechanisms:</strong> HTTP API calls to external systems</li>
        <li><strong>Monitoring & Storage:</strong> Topic Console UI, eStore for logs and metadata</li>
    </ul>

    <p>This framework is ideal for <strong>real-time event-driven applications</strong>, <strong>data pipelines</strong>, and <strong>distributed system integrations</strong> where structured messaging and reliable communication are essential. 🚀</p>
`,
  },
  {
    id: "2",
    name: "Video Analytics Project",
    status: "Completed",
    skills: [
      "Javascript",
      "Node.js",
      "Python",
      "Redis",
      "MariaDB",
      "AWS",
      "Kafka",
      "Docker",
    ],
    description:
      "An AI-powered platform for real-time violation detection using Event Exchange Framework.",
    content: `<h2>Overview</h2>
    <p>
        The <strong>Intelligent Violation Detection & Alert System</strong> is an AI-powered platform that uses the 
        <strong>Event Exchange Framework</strong> to stream real-time data from surveillance cameras across multiple sites. 
        By applying <strong>AI/ML models</strong>, the system detects violations and automatically sends alerts to the 
        designated point of contact. 
    </p>
    <p>
        A <strong>central cloud server</strong> collects all violation data from different locations, enabling 
        multi-user access with <strong>Role-Based Access Control (RBAC)</strong> for in-depth analysis and reporting. 
    </p>

    <h2>Key Features</h2>
    <ul>
        <li><strong>Real-Time Video Streaming:</strong> Captures and processes live camera feeds using the Event Exchange Framework.</li>
        <li><strong>AI-Powered Violation Detection:</strong> Uses deep learning models to identify safety breaches, unauthorized access, and traffic violations.</li>
        <li><strong>Automated Alert System:</strong> Sends real-time notifications to security teams via email, SMS, or in-app alerts.</li>
        <li><strong>Central Cloud Storage:</strong> Aggregates violation data from multiple sites for secure storage and analysis.</li>
        <li><strong>Role-Based Access Control (RBAC):</strong> Provides different access levels for admins, security officers, and analysts.</li>
        <li><strong>Advanced Analytics:</strong> Generates reports, insights, and trends to improve security measures.</li>
    </ul>

    <h2>How It Works</h2>
    <ol>
        <li><strong>Data Ingestion:</strong> Surveillance cameras capture live video feeds from various locations.</li>
        <li><strong>AI Processing:</strong> Machine learning models analyze video feeds in near real-time.</li>
        <li><strong>Violation Detection & Alerting:</strong> Identified violations trigger instant alerts to the appropriate personnel.</li>
        <li><strong>Centralized Storage:</strong> All detected violations are stored in a cloud database for further review.</li>
        <li><strong>Role-Based Access & Monitoring:</strong> Authorized users access violation data based on predefined roles.</li>
    </ol>

    <h2>Technologies Used</h2>
    <ul>
        <li><strong>Event Streaming & Processing:</strong> Event Exchange Framework, Kafka</li>
        <li><strong>AI/ML for Violation Detection:</strong> TensorFlow, OpenCV, YOLO</li>
        <li><strong>Backend & Data Storage:</strong> Node.js, Python, Redis, MariaDB</li>
        <li><strong>Cloud Infrastructure:</strong> AWS, GCP, Azure</li>
        <li><strong>RBAC & Security:</strong> JWT Authentication, Role-Based Access Control</li>
    </ul>

    <h2>Why Use This System?</h2>
    <ul>
        <li>🚀 <strong>Automates violation detection</strong> using AI, reducing manual effort.</li>
        <li>📢 <strong>Real-time alerts</strong> ensure quick response to security breaches.</li>
        <li>☁️ <strong>Cloud-based architecture</strong> supports scalability across multiple locations.</li>
        <li>🔐 <strong>RBAC security</strong> ensures secure and structured user access.</li>
        <li>📊 <strong>Detailed analytics</strong> help organizations improve compliance and safety.</li>
    </ul>

    <p><strong>The Intelligent Violation Detection & Alert System revolutionizes automated surveillance, ensuring safety and compliance across various industries.</strong></p>
`,
  },
  {
    id: "3",
    name: "Code Search Engine",
    status: "Completed",
    skills: [
      "NodeJs",
      "ExpressJs",
      "ReactJs",
      "TF-IDF",
      "BSoup",
      "Selenium",
      "MongoDB",
    ],
    description:
      "A search engine for coding problems across various platforms like LeetCode, Codeforces, and CodeChef.",
    content: `
    <h2>Overview</h2>
    <p>
        The <strong>Coding Problem Search Engine</strong> is a powerful web application that helps programmers quickly find coding problems across various competitive programming platforms. 
        If you ever forget the name of a question on a particular website, you can simply enter relevant keywords, select the platform, and retrieve the desired problem effortlessly.
    </p>

    <h2>Problem It Solves</h2>
    <p>
        Many competitive programmers struggle to recall the exact name of a coding problem they previously encountered. Searching manually across multiple platforms like 
        <strong>LeetCode, Codeforces, and CodeChef</strong> can be time-consuming. This project eliminates that hassle by providing a <strong>search engine</strong> specifically 
        designed for coding questions. Using <strong>web scraping</strong> and <strong>TF-IDF-based ranking</strong>, the search engine ensures users get the most relevant results instantly.
    </p>

    <h2>Technologies Used</h2>
    <ul>
        <li><strong>Backend:</strong> Node.js, Express.js</li>
        <li><strong>Frontend:</strong> React.js</li>
        <li><strong>Search Algorithm:</strong> TF-IDF (Term Frequency-Inverse Document Frequency)</li>
        <li><strong>Web Scraping:</strong> BeautifulSoup, Selenium</li>
        <li><strong>Database:</strong> JSON-based storage (extendable to MongoDB or PostgreSQL)</li>
    </ul>

    <h2>Project Links</h2>
    <ul>
        <li><strong>GitHub Repository:</strong> <a href="https://github.com/oxone-999/Coding-Problem-Search-Engine" target="_blank">View on GitHub</a></li>
        <li><strong>Live Website:</strong> <a href="https://codesearch-by-oxone.netlify.app/" target="_blank">Try it Now</a></li>
    </ul>

    <h2>How It Works</h2>
    <ol>
        <li>Users enter a <strong>search query</strong> related to the problem they are looking for.</li>
        <li>The system <strong>scrapes and indexes</strong> coding problems from various platforms.</li>
        <li>The <strong>TF-IDF algorithm</strong> ranks the most relevant questions based on the search query.</li>
        <li>Users get a list of <strong>matching questions</strong> with links to the original problem pages.</li>
    </ol>

    <h2>Why Use This Project?</h2>
    <ul>
        <li>Saves time by searching multiple coding platforms at once.</li>
        <li>Uses an <strong>efficient search algorithm</strong> to provide the best results.</li>
        <li>Simple and user-friendly web interface.</li>
    </ul>

    <p>This project is perfect for competitive programmers and students preparing for coding interviews! 🚀</p>

      `,
  },
  {
    id: "4",
    name: "Seat Booking System",
    status: "Completed",
    skills: ["Python", "Selenium"],
    description:
      "A web automation project to book seats in offices using Selenium.",
    content: `
    <p>The <strong>Seat Reservation System</strong> is an intelligent automation project designed to streamline the process of reserving seats in offices, libraries, and shared workspaces. Built using <strong>Python</strong> and <strong>Selenium</strong>, this system automates seat booking, ensuring users secure their preferred seats without hassle.</p>

    <h2>🛠 Problem It Solves</h2>
    <p>Manually checking and booking seats in shared spaces can be frustrating. This system:</p>
    <ul>
        <li>Automates the seat booking process.</li>
        <li>Runs on a scheduled basis to check for available seats.</li>
        <li>Sends notifications once a reservation is confirmed.</li>
    </ul>

    <h2>⚙️ How It Works</h2>
    <ul>
        <li><strong>User Authentication:</strong> Logs into the reservation portal.</li>
        <li><strong>Seat Availability Check:</strong> Scans for open seats.</li>
        <li><strong>Auto-Booking:</strong> Reserves available seats instantly.</li>
        <li><strong>Failure Handling:</strong> Keeps checking periodically if no seats are found.</li>
        <li><strong>Notifications:</strong> Sends email/SMS alerts upon successful booking.</li>
    </ul>

    <h2>🛠 Technologies Used</h2>
    <ul>
        <li><strong>Python 🐍</strong> – Core programming language.</li>
        <li><strong>Selenium 🌐</strong> – Automates browser interactions.</li>
        <li><strong>ChromeDriver 🖥️</strong> – Executes Selenium scripts.</li>
        <li><strong>Twilio / SMTP ✉️</strong> – Sends booking confirmations.</li>
        <li><strong>Cron Jobs / Task Scheduler ⏳</strong> – Automates script execution.</li>
    </ul>

    <h2>🔍 Features & Benefits</h2>
    <ul>
        <li>✔ <strong>Automated seat booking</strong> – No manual intervention needed.</li>
        <li>✔ <strong>Custom preferences</strong> – Users can choose seat locations and times.</li>
        <li>✔ <strong>Real-time monitoring</strong> – Continually checks for availability.</li>
        <li>✔ <strong>Multi-user support</strong> – Works for multiple users with different needs.</li>
        <li>✔ <strong>Cloud deployment</strong> – Can run 24/7 on a cloud server.</li>
    </ul>

    <h2>🌍 Potential Use Cases</h2>
    <ul>
        <li>🏢 <strong>Corporate Offices</strong> – Reserve meeting rooms or desks.</li>
        <li>📚 <strong>Libraries & Study Halls</strong> – Book reading spaces.</li>
        <li>🏠 <strong>Co-working Spaces</strong> – Reserve shared desks for freelancers.</li>
    </ul>

    <h2>Project Links</h2>
    <ul>
        <li><strong>GitHub Repository:</strong> <a href="https://github.com/oxone-999/Time-Spent-Chrome-Extension" target="_blank">View on GitHub</a></li>
    </ul>

    <p>The <strong>Seat Reservation System</strong> simplifies booking, making it <strong>smarter, faster, and hassle-free</strong>! 🚀✨</p>
j`,
  },
  {
    id: "5",
    name: "App-Gen",
    status: "Completed",
    skills: ["React", "Node.js", "MariaDB", "Docker"],
    description:
      "A web-based utility that automates the creation of full-stack applications.",
    content: `
        <h2>Overview</h2>
        <p><strong>AppGen</strong> is a powerful web-based utility that automates the creation of full-stack applications. By taking a <strong>JSON data model</strong> as input, it generates a <strong>frontend, backend, and database</strong> for a fully functional <strong>CRUD application</strong>. The generated source code is packaged into a <strong>ZIP file</strong>, complete with a <strong>Dockerfile</strong> and deployment instructions, allowing users to easily build and deploy their application as a <strong>Docker container</strong>.</p>

        <h2>Problem It Solves</h2>
        <p>Developing a CRUD-based application from scratch requires setting up a frontend, backend, and database, which can be time-consuming and repetitive. <strong>AppGen automates this process</strong>, significantly reducing development time and effort. With <strong>just a JSON data model</strong>, developers can instantly generate a working application, download the source code, and deploy it effortlessly.</p>

        <h2>How It Works</h2>
        <ul>
            <li><strong>Input:</strong> The user provides a <strong>data model in JSON format</strong> that defines the structure of the application.</li>
            <li><strong>Code Generation:</strong> AppGen automatically generates:
                <ul>
                    <li><strong>Frontend:</strong> Built with <strong>React.js</strong></li>
                    <li><strong>Backend:</strong> Developed using <strong>Node.js</strong></li>
                    <li><strong>Database:</strong> Schema and queries for <strong>MariaDB</strong></li>
                </ul>
            </li>
            <li><strong>Packaging & Delivery:</strong>
                <ul>
                    <li>The generated application is bundled into a <strong>ZIP file</strong></li>
                    <li>The ZIP includes a <strong>Dockerfile</strong> and setup instructions</li>
                    <li>A <strong>download link</strong> is provided for the user to access their code</li>
                </ul>
            </li>
        </ul>

        <h2>Technologies Used</h2>
        <ul>
            <li><strong>Frontend:</strong> React.js</li>
            <li><strong>Backend:</strong> Node.js</li>
            <li><strong>Database:</strong> MariaDB</li>
            <li><strong>Deployment:</strong> Docker</li>
        </ul>

        <h2>Future Enhancements</h2>
        <p>AppGen is designed to be <strong>extensible</strong>, with the potential to support additional technologies, including:</p>
        <ul>
            <li><strong>Frontend:</strong> Angular, Vue.js</li>
            <li><strong>Backend:</strong> Java, Python, Go</li>
            <li><strong>Database:</strong> MySQL, PostgreSQL, MongoDB</li>
        </ul>

        <p>With its ability to <strong>automate and accelerate web app development</strong>, AppGen is an ideal tool for developers looking to quickly scaffold applications while maintaining flexibility for further customization. 🚀</p>`,
  },
  {
    id: "6",
    name: "Time-Spent Chrome Extension",
    status: "Completed",
    skills: ["JavaScript", "Chrome Extension", "HTML", "CSS"],
    description:
      "A Chrome extension to track time spent on different websites.",
    content: `
        <h2>Overview</h2>
        <p>The <strong>Time Spent Chrome Extension</strong> helps users track the amount of time they spend on various websites, providing insights into browsing habits.</p>

        <h2>Latest Version: 0.2.0 (Released on 17-09-2023)</h2>
        <p>New features added in this release:</p>
        <ul>
            <li>📊 <span class="highlight">Top 5 Most Visited Websites:</span> View a list of the websites where you have spent the most time.</li>
            <li>📅 <span class="highlight">Date-wise Time Tracking:</span> Track time spent on different websites for specific dates using the Select Date menu.</li>
        </ul>

        <h2>Problem It Solves</h2>
        <p>Many users are unaware of how much time they spend on different websites. This extension provides <strong>real-time insights</strong> into browsing behavior, helping users:</p>
        <ul>
            <li>Improve productivity by identifying time-wasting websites.</li>
            <li>Manage screen time more effectively.</li>
            <li>Gain a better understanding of daily web usage trends.</li>
        </ul>

        <h2>How It Works</h2>
        <ol>
            <li>The extension automatically tracks time spent on different websites.</li>
            <li>Users can <strong>view their browsing history in an intuitive dashboard</strong>.</li>
            <li>Data can be analyzed based on <strong>daily usage or cumulative top websites</strong>.</li>
        </ol>

        <h2>Project Links</h2>
        <ul>
            <li><strong>GitHub Repository:</strong> <a href="https://github.com/oxone-999/Time-Spent-Chrome-Extension" target="_blank">View on GitHub</a></li>
        </ul>

        <h2>Project Contributor</h2>
        <p>👤 <strong>Name:</strong> Anuj Verma</p>
        <p>🏫 <strong>Institute:</strong> IIT Kharagpur</p>
        <p>👥 <strong>Team:</strong> Individual</p>

        <p>This extension is perfect for professionals, students, and anyone looking to optimize their online time management. 🚀</p>`,
  },
  {
    id: "7",
    name: "DFB Streaming Pipeline",
    status: "Completed",
    skills: [
      "Kafka",
      "Redis",
      "Python",
      "FFmpeg",
      "NGINX",
      "Elasticsearch",
      "Kibana",
      "Logstash",
      "Microservices",
    ],
    description:
      "A live video streaming pipeline for broadcasting football matches, using Event Exchange framework.",
    content: `
<p><strong>DFB Streaming Pipeline</strong> is a <em>live event streaming architecture</em> designed to ingest, process, enhance, and distribute football match streams to multiple broadcasters using flexible configurations and protocols.</p>

<h2>Project Purpose</h2>
<p>This pipeline enables real-time acquisition and transformation of live football match streams received from production companies in formats like <strong>HLS, SRT, and RTMP</strong>. It enhances the streams with <strong>multilingual audio and subtitles</strong>, and delivers them to broadcasters in their desired format and quality.</p>

<h2>How It Works</h2>
<ul>
  <li>Streams are ingested from external production sources using the <strong>Receiver Adapters</strong> (SRT, HLS, RTMP).</li>
  <li>Data passes through the <strong>Event Exchange Framework</strong> for pipeline handling using Kafka topics and Redis caching.</li>
  <li>The pipeline <strong>processes video streams</strong>, applies audio/subtitle overlays, and transforms them using <strong>FFmpeg</strong>.</li>
  <li>Output is sent via <strong>Sender Adapters</strong> to broadcasters in configurable formats.</li>
  <li><strong>Monitoring and performance metrics</strong> are tracked through the ELK stack (Logstash, Elasticsearch, Kibana).</li>
</ul>

<h2>My Contributions</h2>
<ul>
  <li>Developed custom <strong>Receiver and Sender Adapters</strong> for live stream protocols including <strong>SRT and HLS</strong>.</li>
  <li>Researched and implemented stream transformation logic for optimal live video quality.</li>
  <li>Collaborated on adapting <strong>FFmpeg</strong> pipelines for real-time transcoding and protocol conversion.</li>
  <li>Ensured integration of <strong>Event Exchange</strong> messaging components for stable stream lifecycle management.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
  <li><strong>Streaming Protocols:</strong> SRT, HLS, RTMP</li>
  <li><strong>Media Processing:</strong> FFmpeg, NGINX (RTMP module)</li>
  <li><strong>Framework:</strong> Event Exchange (Kafka, Redis, Topic Console, eStore)</li>
  <li><strong>Logic Layer:</strong> Python for processing and control flow</li>
  <li><strong>Monitoring:</strong> Logstash, Elasticsearch, Kibana (ELK Stack)</li>
</ul>

<p>This project is ideal for <strong>broadcast-grade live sports delivery</strong>, ensuring <strong>low-latency, multilingual, and customizable output</strong> for modern streaming platforms. ⚽🎥</p>
`,
  },
  {
    id: "8",
    name: "Sports Stream Management Console",
    status: "Completed",
    skills: [
      "React",
      "Node.js",
      "TypeScript",
      "MariaDB",
      "Docker",
      "Docker CLI",
      "RBAC",
      "Real-time Logs",
      "Microservices",
    ],
    description:
      "A web-based GUI for managing real-time football streaming pipelines, built to eliminate manual DevOps and improve observability and control.",
    content: `
<p>The <strong>Sports Stream Management Console</strong> is a full-featured <em>real-time pipeline orchestration platform</em> built using <strong>React, Node.js, and TypeScript</strong>. It serves as the management interface for the <strong>DFB Streaming Pipeline</strong>, enabling technical and non-technical users to control and monitor live football streaming infrastructure without writing code.</p>

<h2>Problem It Solves</h2>
<p>The original streaming pipeline required <strong>manual intervention</strong> for:
  <ul>
    <li>Starting/stopping Docker services</li>
    <li>Editing config files manually</li>
    <li>Debugging logs via command line</li>
    <li>Maintaining client/pipeline data externally</li>
  </ul>
  Additionally, there was no <strong>Role-Based Access Control (RBAC)</strong>, no client management, and no persistent storage for pipeline configurations. The system was highly developer-dependent.
</p>

<h2>Why This Was Built</h2>
<p>To solve these issues, we designed a <strong>scalable and intuitive UI-based application</strong> that supports:
  <ul>
    <li>Pipeline lifecycle management (Create, Start, Stop, Delete, Update)</li>
    <li>Configuration persistence</li>
    <li>Stream categorization (Upcoming, InProgress, Completed)</li>
    <li>Live log streaming for debugging</li>
    <li>RBAC-based user and client management</li>
    <li>System-wide notifications and alerts</li>
  </ul>
</p>

<h2>My Contributions</h2>
<ul>
  <li>Designed and implemented key backend services using <strong>Node.js</strong> with <strong>TypeScript</strong></li>
  <li>Built REST APIs to integrate with the <strong>Event Exchange Framework</strong></li>
  <li>Configured <strong>MariaDB</strong> for persistent pipeline and user data</li>
  <li>Worked on <strong>Dockerizing the entire application</strong>, including DIND for internal service orchestration</li>
  <li>Implemented client onboarding and live pipeline view with real-time stream statuses</li>
</ul>

<h2>Technologies Used</h2>
<ul>
  <li><strong>Frontend:</strong> React + TypeScript</li>
  <li><strong>Backend:</strong> Node.js + TypeScript</li>
  <li><strong>Database:</strong> MariaDB</li>
  <li><strong>Containerization:</strong> Docker, Docker-in-Docker (DIND)</li>
  <li><strong>Others:</strong> REST API, WebSocket (for live logs), Role-Based Access Control</li>
</ul>

<p>This console enables true <strong>self-service DevOps</strong> for real-time media pipelines and eliminates manual effort, making it scalable and maintainable even by non-developers. ⚙️📺</p>
`,
  },
  {
    id: "9",
    name: "DFB Analytics Dashboard Automation",
    status: "In Progress",
    skills: [
      "Python",
      "Selenium",
      "BeautifulSoup",
      "Node.js",
      "JavaScript",
      "Microservices",
    ],
    description:
      "A web automation project to scrape and analyze football match data from the DFB analytics dashboard, providing insights and visualizations.",
  },
  {
    id: "10",
    name: "Recon+ Framework",
    status: "In Progress",
    skills: [
      "Python",
      "Airflow",
      "Kibana",
      "ElasticSearch",
      "PySpark",
    ],
    description:
      "A modular and extensible framework which automates the reconciliation of data across distributed systems, ensuring data consistency and integrity.",
  },
];

export default sdeProjects;
