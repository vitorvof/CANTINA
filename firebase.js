import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {

    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc

}

from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "SUA_API",

    authDomain:
    "cantina-fatec.firebaseapp.com",

    projectId:
    "cantina-fatec",

    storageBucket:
    "cantina-fatec.firebasestorage.app",

    messagingSenderId:
    "667107364749",

    appId:
    "1:667107364749:web:29ef8d1693acae744977c4"

};


const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);


window.db = db;

window.collection = collection;

window.addDoc = addDoc;

window.getDocs = getDocs;

window.query = query;

window.where = where;

window.updateDoc = updateDoc;

window.doc = doc;