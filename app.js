// app.js

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAJUJbeZ9ceRwaQOCboy79LEwbN-I7R9ro",
          authDomain: "billakosmodelhorses.firebaseapp.com",
          projectId: "billakosmodelhorses",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Global variable
let lastRelapseTime = Date.now();


// LOAD TRACKER DATA
async function loadData() {

  try {

    const ref = doc(db, "tracker", "main");

    const snap = await getDoc(ref);

    if (snap.exists()) {

      const data = snap.data();

      lastRelapseTime = data.lastRelapse || Date.now();

      document.getElementById("longestStreak").textContent =
        data.longestStreak || 0;

    } else {

      await setDoc(ref, {
        lastRelapse: Date.now(),
        longestStreak: 0
      });

    }

  } catch (error) {

    console.error("Error loading tracker:", error);

  }

}


// TIMER
function startTimer() {

  setInterval(() => {

    const now = Date.now();

    const diff = now - lastRelapseTime;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    document.getElementById("timer").textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;

    document.getElementById("currentStreak").textContent =
      days;

  }, 1000);

}


// RELAPSE BUTTON
async function relapse() {

  try {

    const ref = doc(db, "tracker", "main");

    const snap = await getDoc(ref);

    const now = Date.now();

    let longest = 0;
    let last = now;

    if (snap.exists()) {

      const data = snap.data();

      last = data.lastRelapse || now;

      longest = data.longestStreak || 0;

      const days =
        Math.floor((now - last) / 86400000);

      if (days > longest)
        longest = days;

    }

    await setDoc(ref, {
      lastRelapse: now,
      longestStreak: longest
    });

    lastRelapseTime = now;

    document.getElementById("longestStreak").textContent =
      longest;

    document.getElementById("currentStreak").textContent =
      0;

  } catch (error) {

    console.error("Error saving relapse:", error);

  }

}


// SAVE NOTE
async function saveNote() {

  try {

    const date =
      document.getElementById("dateInput").value;

    const text =
      document.getElementById("noteInput").value;

    if (!date) {

      alert("Please select a date");
      return;

    }

    await setDoc(doc(db, "notes", date), {

      text: text,
      timestamp: Date.now()

    });

    document.getElementById("noteInput").value = "";

    await loadNotes();

    alert("Note saved");

  } catch (error) {

    console.error("Error saving note:", error);

  }

}


// LOAD NOTES
async function loadNotes() {

  try {

    const notesList =
      document.getElementById("notesList");

    notesList.innerHTML = "";

    const q =
      query(collection(db, "notes"), orderBy("timestamp", "desc"));

    const querySnapshot =
      await getDocs(q);

    querySnapshot.forEach((docSnap) => {

      const data = docSnap.data();

      const div =
        document.createElement("div");

      div.className = "noteItem";

      div.innerHTML = `
        <div class="noteDate">${docSnap.id}</div>
        <div class="noteText">${data.text}</div>
      `;

      notesList.appendChild(div);

    });

  } catch (error) {

    console.error("Error loading notes:", error);

  }

}


// CONNECT BUTTONS
function setupButtons() {

  document
    .getElementById("relapseBtn")
    .addEventListener("click", relapse);

  document
    .getElementById("saveNoteBtn")
    .addEventListener("click", saveNote);

}


// INIT
async function init() {

  await loadData();

  await loadNotes();

  setupButtons();

  startTimer();

  console.log("App ready");

}


// START APP
init();
