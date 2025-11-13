interface ProjectDetail {
  overview: string;
  background: string;
  architecture: string[];
  challenges: string[];
  results: string;
  timeline: string;
  tools: string[];
  links: { label: string; url: string }[];
}

export const projectDetails: Record<string, ProjectDetail> = {
  cocode: {
    overview: "CoCode is a collaborative, web-based code editor designed for real-time programming and team workflows. Inspired by the simplicity of Google Docs and the familiarity of desktop IDEs, it combines multi-user concurrency, conflict resolution, and project persistence with a VS Code–like interface powered by Monaco Editor. What started as a \"glorified Notepad++ online\" grew into a fully featured development platform for teams.",
    background: "The idea began with the frustration of juggling local editors and external collaboration tools for quick coding sessions. The vision was to create a browser-based environment that felt as effortless as sharing a Google Doc — open a link, start coding, and see changes sync live. As the project grew, the focus shifted from a lightweight text editor into a scalable IDE-like system: persistent projects, structured file management, secure authentication, and real-time collaboration. The challenge was balancing the simplicity of early prototypes with the power and polish expected of a serious coding platform.",
    architecture: [
      "Frontend: TypeScript, React, Tailwind CSS for scalable UI/UX",
      "Editor Core: Monaco Editor integration providing syntax highlighting, auto-detection of languages, and a VS Code–like editing experience",
      "Backend & Persistence: Firebase Realtime Database for live synchronization and Firestore/Storage for structured persistence",
      "Authentication: Firebase Authentication supporting Google, GitHub, and email login",
      "Collaboration Features: Live cursors, session presence tracking, tabbed file navigation, and cross-user project sync",
      "Deployment: Vercel-hosted with GitHub workflows for CI/CD"
    ],
    challenges: [
      "Designing real-time concurrency without merge conflicts across multiple users",
      "Persisting files across sessions while retaining metadata like type and structure",
      "Creating a consistent dark-mode UI that scales across login, signup, and editor pages",
      "Handling Git automation securely for commit notifications and repository updates"
    ],
    results: "CoCode successfully delivers a real-time collaborative editor that bridges the gap between Google Docs–style simplicity and IDE-level power. Demoed at the University of Waterloo CS Club, it received strong feedback for its approachable design and seamless collaboration features. The project shows how browser-first applications can evolve from simple tools into professional-grade platforms, with future directions including AI-powered code assistance and one-click deployment.",
    timeline: "October 2024 – June 2025",
    tools: ["TypeScript", "React", "Tailwind CSS", "Firebase", "Monaco Editor", "Bash", "GitHub Workflows", "Vercel"],
    links: [
      { label: "Visit Website", url: "https://co-c0de.vercel.app/" },
      { label: "View Source", url: "https://github.com/Koiiichi/CoCode" }
    ]
  },
  mlox: {
    overview: "MLOX is a custom interpreted programming language built in C, extending the Lox language from Crafting Interpreters with modern runtime features. Designed as both a learning project and a language playground, MLOX introduces ternary operators, object-oriented primitives, native string methods, mathematical operations, and file I/O. The project blends language design theory with practical compiler engineering, showcasing how interpreters evolve from minimal teaching tools into extensible, real-world systems.",
    background: "The motivation for MLOX came from studying Crafting Interpreters by Bob Nystrom and wanting to go beyond simply replicating Lox. Lox served as the foundation, but the curiosity was in exploring \"what if this language felt more practical and closer to what developers expect today?\" This led to experimenting with runtime enhancements: building richer arithmetic operators, introducing ternary syntax for cleaner conditional expressions, and adding object-oriented primitives to edge Lox closer to a modern scripting language. The process was not just about adding features, but about deeply understanding parser design, bytecode execution, and virtual machine architecture.",
    architecture: [
      "Core Interpreter: Written in C with a focus on performance and clarity",
      "Parsing: Recursive descent parser extended to handle ternary operators and new language constructs",
      "Bytecode VM: Stack-based virtual machine handling execution with dispatch loops and dynamic memory management",
      "Object-Oriented Primitives: Extended value system to support class-like structures, methods, and property access",
      "Native Methods: Implemented standard library features for string manipulation, file I/O, and math operations",
      "Documentation: Doxygen-style wiki generated directly from annotated C source to provide language documentation"
    ],
    challenges: [
      "Extending the grammar while keeping the recursive descent parser clean and readable",
      "Managing memory safety in C without garbage collection frameworks, while supporting dynamic objects and strings",
      "Designing OOP primitives that feel natural while preserving interpreter simplicity",
      "Ensuring that runtime enhancements (e.g. file I/O, string ops) didn't compromise performance or increase complexity unnecessarily"
    ],
    results: "MLOX evolved into more than just a Lox fork — it became a sandbox for experimenting with language design. The project demonstrates the trade-offs between minimalism vs. practicality, showing how small syntactic and runtime additions can transform the feel of a language. By building a bytecode interpreter in C, MLOX provided hands-on experience with parsing theory, virtual machine execution, and the delicate balance between performance and extensibility. The Doxygen-generated documentation also turned the project into a language others could learn and use.",
    timeline: "June 2025 – August 2025",
    tools: ["C", "Make", "Doxygen", "Vim", "GCC/Clang"],
    links: [
      { label: "View Source", url: "https://github.com/Koiiichi/mlox" },
      { label: "Documentation", url: "https://github.com/Koiiichi/mlox#documentation" }
    ]
  },

  'planetary-explorer': {
  overview: "Planetary Explorer is an AI-powered planetary visualization platform built for NASA Space Apps 2025. It unifies NASA and USGS imagery datasets of Mars, the Moon, and Mercury into an interactive environment that lets users semantically search, explore, and contextualize planetary features. The goal was to make complex planetary data accessible through intelligent search and fluid, zoomable navigation — bridging the gap between professional researchers and the public.",
  background: "The project began during NASA Space Apps 2025, when the team noticed that planetary data from NASA Trek and the USGS Gazetteer were often siloed, making it hard for users to explore related regions across planets. We envisioned a unified explorer that combined these sources into a smooth, AI-enhanced interface — capable of understanding what users meant, not just what they typed. The system had to handle gigapixel imagery, semantic search, and cross-planet relationships, while staying performant enough to run in a browser.",
  architecture: [
    "Frontend: React + Next.js powered interface for planetary browsing and dynamic UI rendering",
    "Imagery Viewer: OpenSeadragon integration for smooth deep-zoom navigation across gigapixel NASA imagery",
    "Backend: FastAPI microservice handling search, feature retrieval, and semantic indexing",
    "AI Layer: DeepSeek embeddings for semantic similarity search with keyword fallback and circuit-breaker caching for fault tolerance",
    "Data Ingestion: KMZ parser transforming NASA Trek and USGS Gazetteer data into structured, searchable JSON corpora",
    "Deployment: Hosted on Vercel with serverless API routes and CDN caching for sub-second query performance"
  ],
  challenges: [
    "Integrating heterogeneous datasets (NASA Trek, USGS Gazetteer) into one coherent search index",
    "Balancing semantic search accuracy with performance, especially under large embedding corpora",
    "Implementing smooth, lag-free multi-body zoom on high-resolution maps with OpenSeadragon",
    "Designing a responsive UI that felt both scientific and exploratory for general audiences"
  ],
  results: "Planetary Explorer achieved its vision of making planetary data intuitive to explore. The final prototype could perform sub-second semantic searches across gigapixel imagery, visualize related planetary features, and allow users to 'fly' between Mars, the Moon, and Mercury seamlessly. It was recognized by NASA Space Apps judges for accessibility and UX design. The system serves as a proof of concept for AI-augmented planetary exploration tools that democratize access to scientific data.",
  timeline: "September 2025",
  tools: ["React", "Next.js", "FastAPI", "DeepSeek API", "OpenSeadragon", "Vercel", "Python", "TypeScript"],
  links: [
    { label: "View Source", url: "https://github.com/ketjandr/nasa-spaceapps-project" },
    { label: "Live Demo", url: "https://planetaryexplorer.vercel.app/" },
    { label: "NASA Space Apps Page", url: "https://www.spaceappschallenge.org/2025/find-a-team/slack-overflow/?tab=project" }
  ]
},

'symphony-lite': {
  overview: "Symphony-Lite is a multi-agent orchestration framework designed to autonomously generate, test, and refine web applications using natural language goals. The system coordinates two agents — Brain and Sensory — that collaborate through typed contracts to iteratively improve codebases. By introducing structured feedback loops and quality gates, Symphony-Lite turns subjective UI and code quality assessments into measurable, automatable processes.",
  background: "The idea behind Symphony-Lite emerged from frustration with manual scaffolding and iteration in full-stack development. Developers often rewrite the same setup code, wait for feedback, and tweak layout or accessibility by hand. Symphony-Lite reimagines this process by letting AI agents collaborate through a contract-based system — one that understands both visual and structural code constraints. The project began as a CLI automation tool and evolved into a framework for agentic cooperation, blending symbolic reasoning with sensory feedback.",
  architecture: [
    "Core System: Python-based orchestration layer coordinating Brain (LLM) and Sensory (evaluation) agents",
    "CLI Interface: Built with Typer for command-driven interaction and isolated project runs",
    "Brain Agent: Handles code generation, refactoring, and adherence to typed interface contracts",
    "Sensory Agent: Executes generated web apps via Selenium, measuring layout, color contrast, and UI compliance",
    "Quality Gates: Typed evaluation schema transforming qualitative feedback (e.g., spacing, accessibility) into quantitative metrics",
    "Persistence Layer: Local JSON-based run history for iterative refinement and reproducibility"
  ],
  challenges: [
    "Designing robust agent communication without manual oversight or prompt leaks between tasks",
    "Building an interpretable evaluation pipeline capable of scoring subjective design attributes like spacing and contrast",
    "Coordinating iterative improvements while ensuring reproducibility across runs",
    "Maintaining consistent output structure and preventing mode collapse in agent loops"
  ],
  results: "Symphony-Lite successfully demonstrated autonomous web application creation guided by quantifiable quality metrics. The framework reduced iteration time by 20% in tests compared to manual refinement and provided consistent improvements in UI layout balance and color accessibility. The project laid groundwork for future multi-agent research by showing how structured feedback and typed contracts can create self-improving development loops.",
  timeline: "August – October 2025",
  tools: ["Python", "Typer", "Selenium", "OpenAI API", "JSON Schema", "Bash"],
  links: [
    { label: "View Source", url: "https://github.com/Koiiichi/symphony-lite" }
  ]
},


  chabacrunch: {
    overview: "ChabaCrunch is a data science project built during the TouchBistro x UW Hackathon (Feb 2025) that analyzed over 8 million restaurant transactions across Canada and the U.S. The system unified messy bill- and venue-level datasets into an analysis-ready pipeline, enabling insights into tipping culture across cities, venue concepts, and order types. By merging data cleaning, feature engineering, and predictive modeling, ChabaCrunch revealed that tipping behaviors are shaped more by venue type and order style than by country borders — offering restaurants actionable strategies to optimize service, boost tips, and improve operations.",
    background: "The project was inspired by the team's shared interest in machine learning, natural language understanding, and data visualization. Building on outreach experiences like Project Harmonics, the goal was to design something impactful and well-structured for real-world use. We saw an opportunity in the TouchBistro dataset to answer fundamental questions: Do Canadians and Americans tip differently? How do venue concepts (bars, cafés, fine dining) affect tipping? What role does order type (dine-in, takeout, delivery) play? The messy, large-scale data provided the perfect challenge to explore these ideas while also developing technical expertise in pipeline design, memory optimization, and ML-driven imputation.",
    architecture: [
      "Data Integration: Merged bills.csv and venues.csv on venue_xref_id to build a unified dataset",
      "Data Cleaning: Tagged transactions as refunds vs. sales based on negative monetary values, removed invalid rows (e.g., negative order durations), applied concept-based outlier capping at the 99th percentile for sales to prevent skew",
      "Feature Engineering: Derived tip percentage per transaction, aggregated venue-level features (avg bill size, avg tip %, takeout fraction)",
      "Modeling: Used a tuned Random Forest to impute missing venue concepts (22% missing) with ~85% accuracy. Hyperparameter tuning was a key difficulty, requiring extensive trial-and-error",
      "Exploratory Data Analysis: Visualized average tip percentages and amounts by city, explored concept distributions (bars vs. cafés) in high vs. low tipping locales, boxplot analysis of tip amounts, order duration, and billed amounts by order type",
      "Collaboration: Built iteratively in Google Colab for reproducibility, memory efficiency, and multi-user development"
    ],
    challenges: [
      "Data Quality: Outliers, zero values, and missing fields (e.g., waiter UUIDs, venue concepts) required tailored fixes",
      "Memory Management: Processing 3.3 GB datasets under Colab's 12 GB cap demanded numeric downcasting and garbage collection",
      "Model Tuning: Predicting missing venue concepts with Random Forest involved navigating imbalanced classes, merging rare concepts, and tuning parameters like depth, estimators, and class weights",
      "Time Constraints: Hackathon format forced trade-offs between depth of analysis and model complexity"
    ],
    results: "ChabaCrunch delivered a complete pipeline that achieved ~85% accuracy in imputing missing venue concepts, demonstrated that venue type (bars/family dining vs. cafés/fast casual) is the strongest predictor of tipping behavior, showed order style matters significantly — dine-in and bar tabs yield higher tips, while takeout/delivery lag, and found no simple Canada vs. U.S. divide; tipping norms are more local and cultural than national. The project underscored the importance of robust preprocessing, iterative refinement, and collaborative workflows. It also highlighted how hackathon projects can bridge raw data and actionable insights, turning messy CSVs into strategic recommendations.",
    timeline: "February 2025",
    tools: ["Python", "Pandas", "scikit-learn", "NumPy", "Matplotlib", "Seaborn", "Google Colab"],
    links: [
      { label: "Devpost", url: "https://devpost.com/software/chabacrunch" },
      { label: "View Source", url: "https://github.com/Koiiichi/ChabaCrunch-CXC2025" }
    ]
  },

  harmonics: {
    overview: "Project Harmonics is a data sonification tool that transforms particle physics datasets into sound, creating auditory representations of scientific phenomena. Originally developed in 2023 as a scientific outreach initiative, it maps collision data to musical parameters such as pitch, velocity, and timing using MIDI-based outputs. The result is an alternative way to explore physics data — by listening to patterns rather than only visualizing them.",
    background: "The project began with the goal of making particle physics more accessible, particularly to audiences who benefit from non-visual learning. Traditional methods rely heavily on mathematical notation and graphs, which can be limiting for differently abled learners. By mapping data attributes such as particle IDs, momentum, and scattering angles into musical parameters, Harmonics introduced a new medium for engagement. Harmonics was used in outreach sessions with the Rising Sun Foundation, teaching electron–proton scattering to 30+ differently abled students. The overwhelmingly positive response validated the idea: sound can be an inclusive gateway into STEM.",
    architecture: [
      "Data Processing: Python + Pandas to clean and structure physics datasets",
      "Mapping Engine: Converts attributes (particle type, momentum, angle) into musical values (pitch, velocity, timing)",
      "MIDI Generation: Outputs portable MIDI files for use in DAWs (Digital Audio Workstations)",
      "Pipeline: sonify_dataset.py transforms raw CSV physics data into playable .mid files",
      "Future Expansion: Planned real-time interaction and advanced data processing for more expressive, accurate sonification"
    ],
    challenges: [
      "Defining meaningful, intuitive mappings between complex data and sound",
      "Balancing scientific accuracy with musical clarity, so patterns remain recognizable",
      "Designing the system to be flexible enough for both classroom use and creative experimentation"
    ],
    results: "Harmonics achieved its core goal of making particle physics data more accessible through auditory representation. Beyond outreach, it demonstrates the potential of sonification as a scientific tool, complementing traditional visualization techniques. The project's next stage focuses on interactivity and richer mappings, evolving from static MIDI files into dynamic, real-time exploration tools. This positions Harmonics as both an educational platform and a research prototype for auditory data analysis.",
    timeline: "March 2023 – Present (Ongoing Expansion)",
    tools: ["Python", "Pandas", "MIDI Libraries", "Digital Audio Workstation (DAW)"],
    links: [
      { label: "View Source", url: "https://github.com/Koiiichi/project-harmonics/tree/main" },
      { label: "Listen Demo", url: "https://projectharmonics.wixsite.com/about/method" },
      { label: "Original Project Page", url: "https://projectharmonics.wixsite.com/about" }
    ]
  },
};
