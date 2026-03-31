# officialjmexe-ai.github.io

A simple GitHub Pages landing site with optional live Firebase / Firestore content.

## Firebase setup

### 1) Web app config
Paste your Firebase web config into [`firebase-config.js`](./firebase-config.js).

### 2) Firestore document
Create this document in Firestore:

- **Collection:** `siteContent`
- **Document:** `homepage`

Use fields like these:

```json
{
  "heroTitle": "Official JMEXE AI",
  "heroText": "AI-powered websites, automation, and digital tools built to launch fast and look polished.",
  "aboutTitle": "Practical AI experiences with a clean public presence.",
  "servicesTitle": "What Official JMEXE AI can present.",
  "highlightsLeft": ["Live text updates from Firestore", "Fast static hosting on GitHub Pages"],
  "highlightsRight": ["Simple HTML, CSS, and JavaScript stack", "Easy to expand as your brand grows"],
  "contactButtonLabel": "View GitHub",
  "contactButtonUrl": "https://github.com/officialjmexe-ai"
}
```

The homepage listens to that document and updates the hero, about, services, highlights, and contact sections automatically.

### 3) Firestore rules
A starter rules file is included in [`firestore.rules`](./firestore.rules).
For a public landing page, public read access is usually needed for `siteContent/*`.

### 4) Publish on GitHub Pages
Deploy from:

- **Branch:** `main`
- **Folder:** `/ (root)`

Your site URL will be:

```text
https://officialjmexe-ai.github.io/
```