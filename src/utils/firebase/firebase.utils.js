import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // tracks state of signed-in or signed out throughout the application
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAxLo_4zvErGZRz8HC9_GHpryJ10-g2DTI',
  authDomain: 'online-store-b2e44.firebaseapp.com',
  projectId: 'online-store-b2e44',
  storageBucket: 'online-store-b2e44.appspot.com',
  messagingSenderId: '1045847261947',
  appId: '1:1045847261947:web:dc5bac28791252a89ba65e',
  measurementId: 'G-ZK34VKXEYX',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // requires user to select an account...google docs
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider); // 1. Sign In with Google Pop Up
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider); // 2. Sign In with Google Redirect

// create db
export const db = getFirestore();
// this async function will save the user's credentials from GoogleAuth into the database
// this function is invoked in the SignIn Component when the user clicks the SignIn button
export const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid); // userAuth.uid comes from the GoogleAuth object that gets sent to the client upon successful login

  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    // console.log(userSnapShot)

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }
  return userDocRef;
};

// Email and Password Authentication
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

// sign-in with email and password
export const signInAuthWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
