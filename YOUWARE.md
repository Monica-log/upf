# YOUWARE - CAS UPF Login Service

This project is a faithful implementation of the CAS UPF Login Service based on the provided Figma design. It is built with React 18, TypeScript, Vite, and Tailwind CSS.

## Project Overview

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx`
- **Design Source**: Figma (https://www.figma.com/design/WmCeynnUdXHR1l7ImOcl3t/https---cas.upf.pf-login-service-?m=auto&t=XMOwFtZGFYanEN0p-6)
- **Styling**: Tailwind CSS with custom configuration for colors and fonts matching the design.

## Key Features

- **Login Page**: A responsive login page matching the Figma mockup.
- **Custom Assets**: Extracted logos and icons from Figma.
- **Typography**: Ubuntu font integration.
- **Theme**: Custom Tailwind colors (`primary`, `secondary`, `text-dark`, `text-gray`).

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`
- **Preview build**: `npm run preview`

## Project Architecture

### Directory Structure

```
src/
├── assets/            # Images and icons (upf-logo.png, login-icon.svg, password-icon.svg)
├── pages/
│   └── LoginPage.tsx  # Main login page component
├── App.tsx            # Application root, renders LoginPage
├── main.tsx           # Entry point
├── index.css          # Global styles and font imports
└── vite-env.d.ts      # Type definitions
```

### Styling

The project uses Tailwind CSS. Custom colors and fonts are defined in `tailwind.config.js`:

- **Colors**:
  - `primary`: `#114377`
  - `secondary`: `#0471A6`
- **Fonts**:
  - `Ubuntu`: Imported via Google Fonts in `index.css`.

## Deployment

The project is built using Vite. The output is located in the `dist/` directory.
To deploy, serve the contents of the `dist/` directory.
