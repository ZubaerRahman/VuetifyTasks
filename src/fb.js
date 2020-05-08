import firebase from 'firebase/app'
// eslint-disable-next-line no-unused-vars
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA2QvWDG0UoMZ9pGMu8S7gTn1KsgSCtYFs",
    authDomain: "materialtodo-8512f.firebaseapp.com",
    databaseURL: "https://materialtodo-8512f.firebaseio.com",
    projectId: "materialtodo-8512f",
    storageBucket: "materialtodo-8512f.appspot.com",
    messagingSenderId: "655596167556",
    appId: "1:655596167556:web:ab704937d5654feb827dd1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db