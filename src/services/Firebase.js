import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbIY99O42wT-KuoEr6n3VVmCQueJh99M0",
  authDomain: "clone-793de.firebaseapp.com",
  projectId: "clone-793de",
  storageBucket: "clone-793de.appspot.com",
  messagingSenderId: "429538742969",
  appId: "1:429538742969:web:fba7950f016430df730168",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

const userCollectionRef = collection(db, "users");

export const signInWithGoogle = (navigate) => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);

      const userId = localStorage.getItem("email");
      const userDocRef = doc(userCollectionRef, userId);
      const existingDoc = await getDoc(userDocRef);

      if (!existingDoc.exists()) {
        await setDoc(userDocRef, {
          date_of_registration: serverTimestamp(),
          has_channel: false,
        });
        localStorage.setItem("hasChannel", "false"); 
      } else {
        const hasChannelValue = existingDoc.data().has_channel;
        localStorage.setItem("hasChannel", hasChannelValue.toString());
        localStorage.setItem("channelName", existingDoc.data().channel_name);
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      navigate("/");
      window.location.reload();
    });
};


export async function handleLogout(navigate) {
  try {
    await signOut(auth); 
    localStorage.clear();
    navigate("/"); 
    window.location.reload();
    
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
