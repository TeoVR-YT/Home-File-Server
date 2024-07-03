# Home File Server

Home File Server is a simple file server application built with Node.js. It allows users to upload and download files either on a local network or online using UPnP (Universal Plug and Play).

## Features

- **Upload Files**: Upload files to the server.
- **Download Files**: Download files from the server.
- **View Uploaded Files**: View a list of uploaded files.
- **Run Locally**: Run the server on a local network.
- **Run Online**: Use UPnP to make the server accessible over the internet (requires router support).

## Installation

1. **Install Node.js**: Ensure you have Node.js installed. [Download and install Node.js](https://nodejs.org/).

2. **Install Required Packages**:
    - Run the `install_packages.bat` script to install the necessary Node.js packages.

    ```bash
    install_packages.bat
    ```

## Usage

1. **Start the Server**:
    - Run the `run.bat` script to start the server.

    ```bash
    run.bat
    ```

2. **Select Mode**:
    - You will be prompted to choose between running the server on the local network or online using UPnP.
    - Enter `1` to run on the local network.
    - Enter `2` to run online (UPnP).

    ```plaintext
    Select mode:
    1. Run on local network
    2. Run online (UPnP)
    ```

3. **Access the Server**:
    - Open your browser and go to `http://localhost:3000`.

## File Management

- **Upload a File**:
    - Navigate to `http://localhost:3000/upload.html` and upload a file using the interface.

- **Download a File**:
    - Navigate to `http://localhost:3000/download.html` to see a list of available files for download.

- **View Uploaded Files**:
    - Navigate to `http://localhost:3000/uploads.html` to view a list of uploaded files.

## Note

- **UPnP Mode**:
    - When running in UPnP mode, ensure that UPnP is enabled in your router settings. UPnP may not be supported on all routers.

## Project Structure

```plaintext
File Server - main/
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── index.html
│   ├── upload.html
│   ├── uploads.html
│   ├── download.html
│   └── js/
│       └── script.js
│
├── uploads/  (For uploaded files)
├── downloads/  (For downloadable files)
│
├── install_packages.bat
├── run.bat
│
└── server.js
