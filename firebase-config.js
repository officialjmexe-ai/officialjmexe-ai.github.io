// Replace the empty strings below with your Firebase web app settings.
// These values are safe for client-side use in a static website.

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
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
