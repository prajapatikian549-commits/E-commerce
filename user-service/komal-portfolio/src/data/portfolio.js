export const personal = {
  name: "Komal Prajapati",
  roles: ["Software Engineer", "Backend Specialist", "Microservices Developer", "Java Expert"],
  email: "prajapatikian549@gmail.com",
  phone: "+91 7017536169",
  location: "Noida, India",
  summary:
    "Software Engineer with 3+ years of experience designing and developing scalable backend systems using Java and Spring Boot. Strong expertise in Microservices Architecture, RESTful APIs, Multithreading, SQL Optimization, and Distributed Systems. Experienced in SMS module integration, CI/CD pipelines, containerization using Docker, and performance tuning for high-throughput enterprise applications.",
};

export const stats = [
  { num: "3+", label: "Years Experience" },
  { num: "6",  label: "Projects Delivered" },
  { num: "40%", label: "Scalability Gain" },
  { num: "30%", label: "Faster Deploys" },
];

export const skills = [
  {
    category: "Java Frameworks",
    icon: "☕",
    tags: ["Spring Boot", "Spring Framework", "Hibernate", "JPA", "Core Spring", "REST"],
  },
  {
    category: "Databases",
    icon: "🗄️",
    tags: ["MySQL", "PostgreSQL", "Oracle", "SQL Optimization"],
  },
  {
    category: "DevOps & Tools",
    icon: "⚙️",
    tags: ["Docker", "Kubernetes", "Jenkins", "Maven", "Kafka", "Git", "Postman"],
  },
  {
    category: "Web & API",
    icon: "🌐",
    tags: ["RESTful APIs", "Microservices", "Servlets", "JSP"],
  },
  {
    category: "Frontend",
    icon: "🎨",
    tags: ["Angular", "HTML", "CSS", "Bootstrap", "JavaScript"],
  },
  {
    category: "Core Concepts",
    icon: "🧠",
    tags: ["OOP", "Multithreading", "Distributed Systems", "CI/CD", "Performance Tuning"],
  },
];

export const experience = [
  {
    company: "Paytm",
    role: "Software Engineer",
    period: "Jul 2025 – Present",
    location: "Noida",
    current: true,
    bullets: [
      "Led legacy monolith → microservices migration in Java + Spring Boot — 40% scalability gain, 30% faster deploys.",
      "Designed a scalable SMS module for reliable high-throughput message processing.",
      "Implemented multithreading & concurrent processing for high-load performance.",
      "Performed SQL query optimization and backend performance tuning.",
      "Supported CI/CD pipelines via Jenkins, Docker, and Kubernetes with DevOps team.",
    ],
  },
  {
    company: "Gravit Infosystems Pvt. Ltd.",
    role: "Full Stack Developer",
    period: "Jan 2025 – Jul 2025",
    location: "New Delhi",
    current: false,
    bullets: [
      "Built backend services for government healthcare systems using Java and Spring Boot.",
      "Designed REST APIs and managed PostgreSQL database operations.",
      "Translated business requirements into scalable technical solutions.",
      "Worked directly with WHO-affiliated HMIS government teams and clients.",
    ],
  },
  {
    company: "Planet e Com Solutions Pvt. Ltd.",
    role: "Java Developer",
    period: "Jul 2022 – Apr 2024",
    location: "New Delhi",
    current: false,
    bullets: [
      "Developed enterprise banking & reporting applications using Spring Boot and Hibernate.",
      "Implemented business logic and database integration with Oracle and PostgreSQL.",
      "Contributed to backend enhancements, performance tuning, and production support.",
      "Delivered solutions for PNB, Indian Oil Corporation, UCO Bank, and LIC.",
    ],
  },
];

export const projects = [
  {
    title: "Campaign Processing as a Service (CPASS)",
    company: "Paytm",
    period: "Jul 2025 – Present",
    client: null,
    desc: "Enables businesses to run large-scale customer campaigns across WhatsApp, SMS, email, and push notifications — improving delivery reliability and driving higher engagement.",
    tags: ["Microservices", "Kafka", "Spring Boot", "Java"],
  },
  {
    title: "HMIS – Health Management Information System",
    company: "Gravit Infosystems",
    period: "Jan – Jul 2025",
    client: "WHO (India)",
    desc: "Digital system for collecting, storing, and reporting health data across government healthcare facilities. Covers patient info, disease patterns, and treatment outcomes.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "REST APIs"],
  },
  {
    title: "PNB PFMS",
    company: "PECS Pvt. Ltd.",
    period: "Dec 2023 – Apr 2024",
    client: "Punjab National Bank",
    desc: "Middleware bridging Government and Bank for the Public Financial Management System, enabling secure financial data exchange.",
    tags: ["Java", "Spring Boot", "Banking"],
  },
  {
    title: "BRSR – Business Responsibility & Sustainability Reporting",
    company: "PECS Pvt. Ltd.",
    period: "May – Dec 2023",
    client: "Indian Oil Corporation",
    desc: "Full-stack app to streamline data entry with validations and generate comprehensive sustainability reports.",
    tags: ["Angular", "Spring Boot", "Reporting"],
  },
  {
    title: "UCO Bank – Framework Migration",
    company: "PECS Pvt. Ltd.",
    period: "Jan – May 2023",
    client: "UCO Bank",
    desc: "Migrated ASP.Net environment to Liferay Framework with FTL frontend and Java backend.",
    tags: ["Java", "Liferay", "FTL"],
  },
  {
    title: "LIC – Framework Migration",
    company: "PECS Pvt. Ltd.",
    period: "Jul – Dec 2022",
    client: "Life Insurance Corporation of India",
    desc: "Migrated Kentico to Liferay framework. Stack: FTL frontend, Java backend, LDS, Tomcat, PostgreSQL.",
    tags: ["Java", "Liferay", "PostgreSQL", "Tomcat"],
  },
];

export const education = {
  institution: "FET, Agra College, Agra",
  degree: "B.Tech – Computer Science & Engineering",
  period: "July 2016 – June 2020",
  gpa: "8.0 / 10",
};
