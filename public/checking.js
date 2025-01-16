// Firebase Authentication and Firestore
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

// Variables to export
let isLoggedIn = false;
let userRole = "default";

// On authentication state change, fetch user role and update the variables
onAuthStateChanged(auth, async (user) => {
  if (user) {
    isLoggedIn = true; // Set logged-in status to true
    console.log("Hello");
    const userId = user.uid;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      userRole = userData.role || "default"; // Set the user role
      console.log("User role:", userRole);
    } else {
      console.log("User not found in Firestore.");
      userRole = "default"; // Handle case where the user does not have a role set
    }
  } else {
    isLoggedIn = false; // Set logged-in status to false
    userRole = "default"; // Reset role to default when no user is logged in
    console.log("User not logged in.");
  }
});

// Export the variables
export { isLoggedIn, userRole };
