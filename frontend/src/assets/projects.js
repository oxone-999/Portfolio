const sdeProjects = [
  {
    id: "1",
    name: "Event Exchange Platform",
    status: "In Progress",
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
    status: "In Progress",
    skills: ["React", "Node.js", "MongoDB"],
    description:
      "A platform to analyze video content using AI/ML models and generate insights.",
    content:
      "### Project 2 Details\n- Feature 1\n- Feature 2\n**More Details**",
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
    name: "Seat Reservation System",
    status: "Completed",
    skills: ["React", "Node.js", "MongoDB"],
    description:
      "A platform to automate the process of reserving seats in a office.",
    content:
      "### Project 2 Details\n- Feature 1\n- Feature 2\n**More Details**",
  },
  {
    id: "5",
    name: "App-Gen",
    status: "Completed",
    skills: ["React", "Node.js", "MongoDB"],
    description:
      "A platform which takes JSON input to generate and deploy apps with ease.",
    content:
      "### Project 2 Details\n- Feature 1\n- Feature 2\n**More Details**",
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

        <h2>Project Contributor</h2>
        <p>👤 <strong>Name:</strong> Anuj Verma</p>
        <p>🏫 <strong>Institute:</strong> IIT Kharagpur</p>
        <p>👥 <strong>Team:</strong> Individual</p>

        <p>This extension is perfect for professionals, students, and anyone looking to optimize their online time management. 🚀</p>`,
  },
];

export default sdeProjects;
