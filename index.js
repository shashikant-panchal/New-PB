const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Student = require("./models/student");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(bodyParser.json());
app.use(cors());

const hodSchema = new mongoose.Schema({
  name: String,
  address: String,
  gender: String,
  department: String,
  phone: String,
  branch: String,
  email: String,
  password: String
});
const HOD = mongoose.model("HOD", hodSchema);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server in Running........");
});

app.post("/api/students", async (req, res) => {
  console.log("Received request to add student");
  const { name, address, gender, dob, phone, branch, email, password } = req.body;
  try {
    const student = new Student({ name, address, gender, dob, phone, branch, email, password });
    await student.save();
    res.status(201).json(student);
    console.log("Student added successfully");
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid email or password' });

    if (student.password !== password) return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ message: 'Login successful', studentId: student._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Route to fetch all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/selectStudent/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const selectedStudent = await Student.findByIdAndUpdate(
      id,
      { selected: true },
      { new: true }
    );
    if (!selectedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(selectedStudent);
  } catch (error) {
    console.error("Error selecting student:", error);
    res.status(500).json({ error: "Failed to select student" });
  }
});

app.get("/api/selectedStudents", async (req, res) => {
  try {
    const selectedStudents = await Student.find({ selected: true });
    res.json(selectedStudents);
  } catch (err) {
    console.error("Error fetching selected students:", err);
    res.status(500).json({ error: "Failed to fetch selected students" });
  }
});

// Route to fetch all students
app.get("/api/students", async (req, res) => {
  console.log("Received request to fetch students");
  try {
    const students = await Student.find();
    res.json(students);
    console.log("Students fetched successfully");
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: err.message });
  }
});

// HOD Routes
app.post("/api/hods", async (req, res) => {
  console.log("Received request to add HOD");
  const { name, address, gender, department, phone, branch, email, password } = req.body;
  try {
    const hod = new HOD({ name, address, gender, department, phone, branch, email, password });
    await hod.save();
    res.status(201).json(hod);
    console.log("HOD added successfully");
  } catch (error) {
    console.error("Error adding HOD:", error);
    res.status(500).json({ error: "Failed to add HOD" });
  }
});

app.post("/api/hods/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hod = await HOD.findOne({ email });
    if (!hod) return res.status(400).json({ message: 'Invalid email or password' });
    if (hod.password !== password) return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ message: 'Login successful', hodId: hod._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get("/api/hods", async (req, res) => {
  console.log("Received request to fetch HODs");
  try {
    const hods = await HOD.find();
    res.json(hods);
    console.log("HODs fetched successfully");
  } catch (error) {
    console.error("Error fetching HODs:", error);
    res.status(500).json({ error: "Failed to fetch HODs" });
  }
});

app.delete("/api/hods/:id", async (req, res) => {
  console.log(`Received request to delete HOD with ID: ${req.params.id}`);
  const { id } = req.params;
  try {
    await HOD.findByIdAndDelete(id);
    res.status(200).json({ message: "HOD deleted successfully" });
    console.log("HOD deleted successfully");
  } catch (error) {
    console.error("Error deleting HOD:", error);
    res.status(500).json({ error: "Failed to delete HOD" });
  }
});

// Company Schema and Routes
const companySchema = new mongoose.Schema({
  companyName: String,
  address: String,
  website: String,
  phone: String,
  email: String,
  password: String, 
});
const Company = mongoose.model("Company", companySchema);

app.get("/api/companies", async (req, res) => {
  console.log("Received request to fetch companies");
  try {
    const companies = await Company.find();
    res.json(companies);
    console.log("Companies fetched successfully");
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

app.post("/api/companies", async (req, res) => {
  console.log("Received request to add company");
  const { companyName, address, website, phone, email, password } = req.body;
  try {
    const newCompany = new Company({ companyName, address, website, phone, email, password });
    await newCompany.save();
    res.status(201).json(newCompany);
    console.log("Company added successfully");
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ error: "Failed to add company" });
  }
});

app.post("/api/companies/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ message: 'Invalid email or password' });
    if (company.password !== password) return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ message: 'Login successful', companyId: company._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.delete("/api/companies/:id", async (req, res) => {
  console.log(`Received request to delete company with ID: ${req.params.id}`);
  const { id } = req.params;
  try {
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: "Company deleted successfully" });
    console.log("Company deleted successfully");
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});


const jobSchema = new mongoose.Schema({
  companyName: String,
  designation: String,
  twelfthPercentage: Number,
  graduationGPA: Number,
  salaryPackage: Number,
  jobDescription: String,
  location: String,
  experienceRequired: String,
});

const Job = mongoose.model("Job", jobSchema);

app.post("/api/jobs", async (req, res) => {
  console.log("Received request to add job");
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
    console.log("Job added successfully");
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ error: "Failed to add job" });
  }
});

// Route to fetch all jobs
app.get("/api/jobs", async (req, res) => {
  console.log("Received request to fetch jobs");
  try {
    const jobs = await Job.find();
    res.json(jobs);
    console.log("Jobs fetched successfully");
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Notifications Routes
app.post('/api/notifications', async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }
  try {
    const newNotification = new Notification({ title, message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: 'Failed to add notification' });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
