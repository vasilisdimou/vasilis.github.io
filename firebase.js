// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
          apiKey: "AIzaSyAJUJbeZ9ceRwaQOCboy79LEwbN-I7R9ro",
          authDomain: "billakosmodelhorses.firebaseapp.com",
          projectId: "billakosmodelhorses",
          storageBucket: "billakosmodelhorses.appspot.com",
          messagingSenderId: "988607299628",
          appId: "1:988607299628:web:b7c2139b095a0afba8d189",
          measurementId: "G-RWHNVMHN2P"
        };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
