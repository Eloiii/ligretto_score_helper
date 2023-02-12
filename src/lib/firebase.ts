// import type { DocumentReference, DocumentData } from 'firebase/firestore';
import type {FirebaseApp} from 'firebase/app';
import {initializeApp} from 'firebase/app';
import {writable} from 'svelte/store';
import {
    addDoc,
    CACHE_SIZE_UNLIMITED,
    collection,
    doc,
    getDoc,
    initializeFirestore,
    updateDoc
} from 'firebase/firestore';

export const firebaseAPP = writable({});

const firebaseConfig = {

    apiKey: "AIzaSyDmzeeUfeyrC6Ys2JbmMM4V87kqwxzA7o8",

    authDomain: "ligretto.firebaseapp.com",

    projectId: "ligretto",

    storageBucket: "ligretto.appspot.com",

    messagingSenderId: "586843553030",

    appId: "1:586843553030:web:b07e011328b7bc5497f287"

};


let app: FirebaseApp;

let initializedFirestore: any = null;

export const db = () => {
    if (!initializedFirestore) {
        console.log('🔥 Initializing Firestore');
        initializedFirestore = initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
        });
    }


    return initializedFirestore;
};

export const initialize = async () => {
    if (!app) {
        app = initializeApp(firebaseConfig);
        firebaseAPP.set(app)
    }
};


export const newGame = async (players: string[]) => {
    const scores = []
    for (const player of players) {
        scores.push({
            name: player,
            score: []
        })
    }
    const data = {
        scores: scores,
        date: new Date(),
        currentRound: 0
    }
    const docRef = await addDoc(collection(db(), 'games'), data)
    return docRef
};

export const getGame = async (gameId: string) => {
    await initialize()
    const docRef = doc(db(), "games", gameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data()
        data.date = data.date.toDate()
        return data
    } else {
        console.log("No such document!");
    }
};

export const updateGame = async (gameId: string, data: object) => {
    await initialize()
    const gameRef = doc(db(), "games", gameId);

    await updateDoc(gameRef, data);
}