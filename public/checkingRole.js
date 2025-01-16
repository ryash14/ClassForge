// Firebase Authentication and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjHs-yazGlHa9CWWtcv0-GS5zGcv_JRMc",
  authDomain: "logindemo-20277.firebaseapp.com",
  projectId: "logindemo-20277",
  storageBucket: "logindemo-20277.appspot.com",
  messagingSenderId: "290534553076",
  appId: "1:290534553076:web:f35bc6a3f5041319e8f5a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// On authentication state change, fetch user role and update the content
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;
    console.log("Fetching data for user ID:", userId);
    const userDocRef = doc(db, "users", userId);

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("User data retrieved:", userData);
        displayRoleContent(userData.role); // Display content based on the role
      } else {
        console.log("User document does not exist in Firestore.");
        displayRoleContent("default"); // Handle case where the user does not have a role set
      }
    } catch (error) {
      console.error("Error fetching user document:", error.message);
      displayRoleContent("default"); // Handle errors in fetching the document
    }
  } else {
    console.log("User not logged in.");
    displayRoleContent("default"); // Set default content when no user is logged in
  }
});

// Function to dynamically change content based on the user role
function displayRoleContent(role) {
  const roleTitle = document.getElementById("roleTitle");
  const roleDescription = document.getElementById("roleDescription");
  const roleImage = document.getElementById("roleImage");
  const roleLink = document.getElementById("roleLink");

  // Update content based on the role
  if (role === "student") {
    roleTitle.textContent = "Get Instant Answers with AI Assistance";
    roleDescription.textContent =
      "As a student, quickly get AI-generated answers for your questions. Start learning smarter today!";
    roleImage.src =
      "https://s39613.pcdn.co/wp-content/uploads/2024/05/students-learning-online-in-computer-app-with-ai-helper-bot-education-assistant-e-learning.jpg_s1024x1024wisk20c9ZjFzirmnCqf0_OYhZR6a0vd1flukm2-Jv5-MNaODbY.jpg"; // Replace with student-specific image
    roleLink.textContent = "Click to Get Answers"; // Updated button text
    roleLink.href = "student/answers.html"; // Link for student
  } else if (role === "teacher") {
    roleTitle.textContent = "Generate Question Papers Instantly";
    roleDescription.textContent =
      "As a teacher, upload your syllabus and generate custom question papers in seconds. Save time and focus on teaching!";
    roleImage.src = "/images/image7.jpg"; // Replace with teacher-specific image
    roleLink.textContent = "Click to Generate Papers"; // Updated button text
    roleLink.href = "teacher/questions.html"; // Link for teacher
  } else {
    roleTitle.textContent = "Welcome to ClassForge - Your Learning Hub!";
    roleDescription.textContent =
      "Unlock the full potential of your learning and teaching experience with ClassForge! Sign in now to access personalized tools for students and teachers.";
    roleImage.src = "/images/image6.jpg"; // Fallback default image for unassigned or unknown roles
    roleLink.textContent = "Sign In and Get Started"; // Updated link text
    roleLink.href = "signin.html"; // Link to sign-in page
  }
}
