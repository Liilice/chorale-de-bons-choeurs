# Chorale de Bons Chœurs

Site vitrine et billetterie en ligne pour une chorale de Saint Barthélémy.

## Features

- 🌍 **Bilingual**: Full support for English and French with easy language switching
- 🎵 **Concert Listings**: Display upcoming concerts with date, time, and venue information
- 🎫 **Ticketing System**: Simple modal-based ticket selection with multiple ticket types
- 📱 **Responsive Design**: Works beautifully on all devices
- ⚡ **Fast & Modern**: Built with Next.js 16, TypeScript, and Tailwind CSS

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The site supports two languages:
- French (default): [http://localhost:3000/fr](http://localhost:3000/fr)
- English: [http://localhost:3000/en](http://localhost:3000/en)

## Project Structure

- `app/[locale]/` - Main application pages with i18n routing
- `components/` - React components (Header, Hero, About, Concerts, etc.)
- `messages/` - Translation files (en.json, fr.json)
- `i18n/` - Internationalization configuration

## Building for Production

```bash
npm run build
npm start
```

## Linting

```bash
npm run lint
```
