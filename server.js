const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const natUpnp = require('nat-upnp');
const readline = require('readline');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    let targetPath = path.join(__dirname, 'uploads', file.originalname);
    let fileExtension = path.extname(file.originalname);
    let fileName = path.basename(file.originalname, fileExtension);

    let counter = 1;
    while (fs.existsSync(targetPath)) {
        targetPath = path.join(__dirname, 'uploads', `${fileName} (${counter})${fileExtension}`);
        counter++;
    }

    fs.rename(file.path, targetPath, (err) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.redirect('/upload.html?success=1');
    });
});

app.get('/download', (req, res) => {
    fs.readdir(path.join(__dirname, 'downloads'), (err, files) => {
        if (err) {
            return res.sendStatus(500);
        }
        const fileDetails = files.map(file => {
            const stats = fs.statSync(path.join(__dirname, 'downloads', file));
            let size = stats.size / 1024; // in KB
            if (size < 1024) {
                size = `${size.toFixed(2)} KB`;
            } else {
                size = size / 1024; // in MB
                if (size >= 1024) {
                    size = `${(size / 1024).toFixed(1)} GB`;
                } else {
                    size = `${size.toFixed(2)} MB`;
                }
            }
            return { name: file, size };
        });
        res.json(fileDetails);
    });
});

// Add route to download files from uploads directory
app.get('/uploads/:filename', (req, res) => {
    const file = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.status(404).send('File not found');
    }
});

// Add route to get the list of uploaded files
app.get('/list-uploads', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            return res.sendStatus(500);
        }
        const fileDetails = files.map(file => {
            const stats = fs.statSync(path.join(__dirname, 'uploads', file));
            let size = stats.size / 1024; // in KB
            if (size < 1024) {
                size = `${size.toFixed(2)} KB`;
            } else {
                size = size / 1024; // in MB
                if (size >= 1024) {
                    size = `${(size / 1024).toFixed(1)} GB`;
                } else {
                    size = `${size.toFixed(2)} MB`;
                }
            }
            return { name: file, size };
        });
        res.json(fileDetails);
    });
});

app.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, 'downloads', req.params.filename);
    res.download(file);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startServer(upnpClient) {
    const server = app.listen(3000, '0.0.0.0', () => {
        console.log('Server running on port 3000');
    });

    process.on('exit', () => {
        if (upnpClient) {
            upnpClient.portUnmapping({
                public: 3000
            }, (err) => {
                if (err) {
                    console.error('Failed to remove UPnP port mapping:', err);
                } else {
                    console.log('UPnP port mapping removed');
                }
            });
        }
    });

    process.on('SIGINT', () => {
        console.log('Shutting down server...');
        server.close(() => {
            console.log('Server closed');
            process.exit();
        });
    });
}

function configureUpnp() {
    const upnpClient = natUpnp.createClient();
    upnpClient.portMapping({
        public: 3000,
        private: 3000,
        ttl: 3600
    }, (err) => {
        if (err) {
            console.error('Failed to setup UPnP port mapping:', err);
        } else {
            console.log('UPnP port mapping setup complete');
        }
        startServer(upnpClient);
    });
}

rl.question('Select mode: \n1. Run on local network\n2. Run online (UPnP)\n> ', (answer) => {
    if (answer === '2') {
        configureUpnp();
    } else {
        startServer(null);
    }
    rl.close();
});