// Hardcoded JSON data for students
const studentsData = [
  {
    id: 1,
    username: "aryanS",
    name: "Aryan Sharma",
    rollNo: "ST2025001",
    year: 3,
    branch: "Information Technology", // Changed from Computer Science
    intro: "A passionate coder and aspiring software engineer.",
    skills: ["JavaScript", "Python", "Data Structures"],
    email: "aryan.s@example.edu",
    linkedin: "https://linkedin.com/in/aryansharma",
    github: "https://github.com/aryan-s",
  },
  {
    id: 2,
    username: "priyaP",
    name: "Priya Patel",
    rollNo: "ST2025002",
    year: 4,
    branch: "Electrical Engineering",
    intro: "Focused on embedded systems and robotics.",
    skills: ["C++", "Embedded Systems", "Robotics"],
    email: "priya.p@example.edu",
    linkedin: "https://linkedin.com/in/priyapatel",
    github: "https://github.com/priyap",
  },
  {
    id: 3,
    username: "rohanK",
    name: "Rohan Kumar",
    rollNo: "ST2025003",
    year: 2,
    branch: "Mechanical Engineering",
    intro: "Loves CAD design and thermodynamics.",
    skills: ["AutoCAD", "Thermodynamics", "3D Printing"],
    email: "rohan.k@example.edu",
    linkedin: "https://linkedin.com/in/rohankumar",
    github: "https://github.com/rohank",
  },
  {
    id: 4,
    username: "ananyaS",
    name: "Ananya Singh",
    rollNo: "ST2025004",
    year: 3,
    branch: "Information Technology", // Changed from Computer Science
    intro: "Interested in machine learning and AI.",
    skills: ["Python", "TensorFlow", "Machine Learning"],
    email: "ananya.s@example.edu",
    linkedin: "https://linkedin.com/in/ananyasingh",
    github: "https://github.com/ananyas",
  },
  {
    id: 5,
    username: "vikramR",
    name: "Vikram Rathore",
    rollNo: "ST2025005",
    year: 4,
    branch: "Electrical Engineering",
    intro: "Specializing in power systems and renewable energy.",
    skills: ["Power Systems", "MATLAB", "Renewable Energy"],
    email: "vikram.r@example.edu",
    linkedin: "https://linkedin.com/in/vikramrathore",
    github: "https://github.com/vikramr",
  },
  {
    id: 6,
    username: "sameerK",
    name: "Sameer Khan",
    rollNo: "ST20250651",
    year: 1,
    branch: "Information Technology", // Changed from Computer Science
    intro: "A passionate coder and aspiring software engineer.",
    skills: ["JavaScript", "Python", "Data Structures"],
    email: "sameer.k@example.edu",
    linkedin: "https://linkedin.com/in/sameerkhan",
    github: "https://github.com/sameerk",
  },
];

// Hardcoded JSON data for faculty
const facultyData =  [
  {
    id: 1,
    username: "rajeshk",
    name: "Dr. Rajesh Kumar",
    branch: "Information Technology",
    designation: "Professor",
    email: "rajesh.k@example.edu",
    research: "Artificial Intelligence, Natural Language Processing",
  },
  {
    id: 2,
    username: "sunitash",
    name: "Dr. Sunita Sharma",
    branch: "Electrical Engineering",
    designation: "Associate Professor",
    email: "sunita.s@example.edu",
    research: "Power Electronics, Smart Grids",
  },
  {
    id: 3,
    username: "anilv",
    name: "Dr. Anil Verma",
    branch: "Mechanical Engineering",
    designation: "Professor & Head of Department",
    email: "anil.v@example.edu",
    research: "Robotics, Mechatronics",
  },
  {
    id: 4,
    username: "poojam",
    name: "Ms. Pooja Mehta",
    branch: "Information Technology",
    designation: "Assistant Professor",
    email: "pooja.m@example.edu",
    research: "Cybersecurity, Blockchain",
  },
  {
    id: 5,
    username: "vijays",
    name: "Mr. Vijay Singh",
    branch: "Electrical Engineering",
    designation: "Assistant Professor",
    email: "vijay.s@example.edu",
    research: "Control Systems, Signal Processing",
  },
  {
    id: 6,
    username: "kavitan",
    name: "Dr. Kavita Nair",
    branch: "Computer Science",
    designation: "Professor",
    email: "kavita.n@example.edu",
    research: "Quantum Computing, Theoretical CS",
  },
];

const eventsData = [
  {
    id: 1,
    title: "Annual Tech Fest 2025",
    description: "A week-long festival of technology, coding competitions, and guest lectures from industry experts.",
    date: "2025-10-20",
    time: "09:00",
    venue: "Main Auditorium",
    organizer: "Department of Information Technology",
    createdBy: "sadhnay" // username of a faculty member
  },
  {
    id: 2,
    title: "Guest Lecture on Renewable Energy",
    description: "Join us for an insightful session with Dr. Vikram Rathore on the future of sustainable energy sources.",
    date: "2025-11-05",
    time: "14:30",
    venue: "Seminar Hall B",
    organizer: "Department of Electrical Engineering",
    createdBy: "nikitag" // username of a faculty member
  }
];

const clubsData = [
  {
    id: 1,
    logo: "fas fa-code", // Font Awesome icon class
    name: "Student Developer Club",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  },
  {
    id: 2,
    logo: "fas fa-microchip",
    name: "Internet of Things (IoT) Club",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  },
  {
    id: 3,
    logo: "fas fa-laptop-code",
    name: "Web Development Club (WDC)",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  },
  {
    id: 4,
    logo: "fas fa-plane-departure",
    name: "Drone Club",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  },
  {
    id: 5,
    logo: "fas fa-bolt",
    name: "IEEE Student Branch",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  },
  {
    id: 6,
    logo: "fas fa-cogs",
    name: "MDAC Club",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://via.placeholder.com/100"
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"]
    }
  }
];

// NEW: Single source of truth for default subjects
const subjectsByYearBranch = {
  "3": {
    "Information Technology": [
      { id: "IT301", name: "Design analysis and Algorithm", type: "Theory" },
      { id: "IT302", name: "Computer Graphic", type: "Theory" },
      { id: "IT303", name: "Web Technology", type: "Theory" },
      { id: "IT304", name: "Image processing", type: "Theory" },
      { id: "IT305", name: "Database management systeam", type: "Theory" },
      { id: "OE01", name: "Constitution", type: "Theory" },
      { id: "IT301L", name: "DBMS LAB", type: "Lab" },
      { id: "IT303L", name: "Web Technology Lab", type: "Lab" },
      { id: "IT304L", name: "DAA LAB", type: "Lab" },
      { id: "MiniP", name: "Mini Project", type: "Lab" },
    ]
  },
  "4": {
    "Information Technology": [
      { id: "IT401", name: "Cloud Computing", type: "Theory" },
      { id: "IT402", name: "AI", type: "Theory" },
    ]
  }
};

// NEW: Hardcoded JSON data for alumni
const alumniData = [
  {
    id: 1,
    username: "alumni_rahul",
    name: "Rahul Verma",
    branch: "Information Technology",
    graduationYear: 2022,
    currentRole: "Software Engineer",
    company: "Google",
    email: "rahul.v@example.com",
    linkedin: "https://linkedin.com/in/rahulverma"
  },
  {
    id: 2,
    username: "alumni_sneha",
    name: "Sneha Reddy",
    branch: "Electrical Engineering",
    graduationYear: 2021,
    currentRole: "Hardware Engineer",
    company: "Intel",
    email: "sneha.r@example.com",
    linkedin: "https://linkedin.com/in/snehareddy"
  },
  {
    id: 3,
    username: "alumni_arjun",
    name: "Arjun Mehta",
    branch: "Mechanical Engineering",
    graduationYear: 2020,
    currentRole: "Design Engineer",
    company: "Tesla",
    email: "arjun.m@example.com",
    linkedin: "https://linkedin.com/in/arjunmehta"
  },
  {
    id: 4,
    username: "alumni_priya",
    name: "Priya Jain",
    branch: "Information Technology",
    graduationYear: 2023,
    currentRole: "Data Scientist",
    company: "Microsoft",
    email: "priya.j@example.com",
    linkedin: "https://linkedin.com/in/priyajain"
  },
  {
    id: 5,
    username: "alumni_karan",
    name: "Karan Gupta",
    branch: "Electrical Engineering",
    graduationYear: 2019,
    currentRole: "Project Manager",
    company: "Siemens",
    email: "karan.g@example.com",
    linkedin: "https://linkedin.com/in/karangupta"
  },
  {
    id: 6,
    username: "alumni_nisha",
    name: "Nisha Singh",
    branch: "Mechanical Engineering",
    graduationYear: 2021,
    currentRole: "Automotive Engineer",
    company: "Ford",
    email: "nisha.s@example.com",
    linkedin: "https://linkedin.com/in/nishasingh"
  },
  {
    id: 7,
    username: "alumni_rohit",
    name: "Rohit Sharma",
    branch: "Information Technology",
    graduationYear: 2022,
    currentRole: "DevOps Engineer",
    company: "Amazon",
    email: "rohit.s@example.com",
    linkedin: "https://linkedin.com/in/rohitsharma"
  },
  {
    id: 8,
    username: "alumni_anita",
    name: "Anita Kumar",
    branch: "Electrical Engineering",
    graduationYear: 2020,
    currentRole: "Research Engineer",
    company: "GE",
    email: "anita.k@example.com",
    linkedin: "https://linkedin.com/in/anitakumar"
  },
  {
    id: 9,
    username: "alumni_vivek",
    name: "Vivek Patel",
    branch: "Mechanical Engineering",
    graduationYear: 2023,
    currentRole: "Manufacturing Engineer",
    company: "Boeing",
    email: "vivek.p@example.com",
    linkedin: "https://linkedin.com/in/vivekpatel"
  },
  {
    id: 10,
    username: "alumni_simran",
    name: "Simran Kaur",
    branch: "Information Technology",
    graduationYear: 2024,
    currentRole: "Frontend Developer",
    company: "Facebook",
    email: "simran.k@example.com",
    linkedin: "https://linkedin.com/in/simrankaur"
  }
];

window.alumniData = alumniData;
