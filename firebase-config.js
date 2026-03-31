// Paste your Firebase web app config values below.
// You can copy them from: Firebase Console -> Project settings -> Your apps -> Web app
// These values are safe for client-side use in a static website.

export const firebaseConfig = {
  apiKey: 'AIzaSyChQddt12Ns7BW2DNOa8RQsfaQt05ppFIQ',
  authDomain: 'live-updates-9f655.firebaseapp.com',
  projectId: 'live-updates-9f655',
  storageBucket: 'live-updates-9f655.firebasestorage.app',
  messagingSenderId: '886754711197',
  appId: '1:886754711197:web:4cbbe2c311dfac1a332674',
  measurementId: 'G-4TBYM6LTQ5',
};

// Firestore document watched by the homepage for live updates.
// Example fields:
// {
//   heroTitle: 'Official JMEXE AI',
//   heroText: 'Your live-updated message from Firebase.'
// }
export const homepageDocPath = {
  collection: 'siteContent',
  document: 'homepage',
};
