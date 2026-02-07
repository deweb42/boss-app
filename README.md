# Acquisition Framework OS - Desktop Application

Welcome to the **Acquisition Framework OS**. This is a premium, local-first dashboard designed to help entrepreneurs visualize and track their client acquisition framework process.

This application is built with **Electron** and **React**, allowing it to run as a standalone desktop application on Windows, macOS, and Linux without requiring an internet connection.

## 🚀 One-Click Install Guide (How to Share)

If you are a developer or the project owner and want to share this app with others so they can just "click and run":

1.  **Build the App**: You must generate the executable file first (see "Building for Distribution" below).
2.  **Locate the Output**: After building, go to the `release` folder in your project directory.
3.  **Share the File**:
    *   **Windows**: Share the `.exe` file (e.g., `Acquisition OS Setup 1.0.0.exe`).
    *   **Mac**: Share the `.dmg` file.
    *   **Linux**: Share the `.AppImage` file.

The user simply needs to double-click this file. No installation of Node.js, databases, or terminal commands is required on their end.

---

## 🛠️ Developer Guide (How to Build)

### Prerequisites

To build the application yourself, you need:

1.  **Node.js**: Download and install from [nodejs.org](https://nodejs.org/). (LTS version recommended).
2.  **Terminal**: Use Command Prompt, PowerShell, or Terminal.

### 1. Installation

Open your terminal in the project folder and run:

```bash
npm install
```

This installs all the necessary tools (React, Electron, Builders).

### 2. Custom Icon (Important!)

To give your app a professional look, you need to provide an icon.

1.  Create or find a square image (PNG format recommended, at least 512x512 pixels).
2.  Name it `icon.png`.
3.  Place it inside the `public` folder of this project.
    *   Path: `acquisition-framework-os/public/icon.png`

*If you skip this, the app will use a default Electron icon.*

### 3. Local Testing (Development Mode)

To run the app on your computer while you are making changes:

```bash
npm run electron:dev
```

This will launch the app window. Any changes you make to the code will update instantly.

### 4. Building for Distribution (Create the Exe/Dmg)

When you are ready to create the final file for users:

```bash
npm run electron:build
```

**What this does:**
1.  It bundles your React code into static files (`dist` folder).
2.  It packages those files into a desktop application wrapper.
3.  It outputs the installers to the `release` folder.

**Note for Mac Users:** Building a `.dmg` usually requires running the build command on a Mac.
**Note for Windows Users:** Building an `.exe` requires running on Windows.

### 5. Troubleshooting

*   **White Screen?** If the built app shows a white screen, check the `vite.config.ts`. It must have `base: './'`. This is already configured in the provided files.
*   **Icon not showing?** Ensure `public/icon.png` exists before running the build command.

---

## 📂 Project Structure

*   **`/src` (implied root)**: Contains the React application logic.
    *   `pages/`: The different views (Dashboard, Branding, etc.).
    *   `components/`: Reusable UI elements (Layout, Cards).
    *   `constants.ts`: Configuration of modules and branding text.
*   **`/electron`**: Contains the Node.js scripts that run the desktop window.
    *   `main.cjs`: The entry point for the desktop app.
*   **`/dist`**: Generated only after building (contains the optimized web app).
*   **`/release`**: Generated only after building (contains the `.exe` / `.dmg`).

---

**Community Project**
This tool is designed to provide clarity and structure. Keep it local, keep it private, and focus on growth.
