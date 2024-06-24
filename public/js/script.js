document.addEventListener('DOMContentLoaded', function () {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const sizeText = document.getElementById('sizeText');
    const speedText = document.getElementById('speedText');
    const dropZone = document.getElementById('dropZone');
    const fileName = document.getElementById('fileName');
    const fileList = document.getElementById('fileList');
    const searchInput = document.getElementById('searchInput');

    // Determine if we are on uploads.html page
    const isUploadsPage = location.pathname.includes('uploads.html');
    const apiUrl = isUploadsPage ? '/list-uploads' : '/download';

    if (dropZone) {
        dropZone.addEventListener('click', function () {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', function () {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files; // Set the input's files to the dropped files
                handleFileSelect();
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    function handleFileSelect() {
        const file = fileInput.files[0];
        if (file) {
            fileName.textContent = `Selected file: ${file.name}`;
            fileName.style.display = 'block';
            uploadBtn.style.display = 'inline-block';
        } else {
            fileName.style.display = 'none';
            uploadBtn.style.display = 'none';
        }
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', function () {
            const file = fileInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload', true);

            progressBar.style.display = 'block'; // Show the progress bar

            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressBar.value = percentComplete;
                    progressPercent.textContent = `Progress: ${percentComplete.toFixed(2)}%`;

                    const elapsed = (Date.now() - startTime) / 1000; // seconds
                    const speed = (e.loaded / elapsed / (1024 * 1024) * 8).toFixed(2); // Convert to Mbps
                    speedText.textContent = `Speed: ${speed} Mbps`;

                    let loadedSize = e.loaded / 1024; // in KB
                    if (loadedSize >= 1024) {
                        loadedSize = (loadedSize / 1024).toFixed(2) + ' MB';
                    } else {
                        loadedSize = loadedSize.toFixed(2) + ' KB';
                    }

                    let totalSize = e.total / 1024; // in KB
                    if (totalSize >= 1024) {
                        totalSize = totalSize / 1024; // in MB
                        if (totalSize >= 1024) {
                            totalSize = (totalSize / 1024).toFixed(2) + ' GB';
                        } else {
                            totalSize = totalSize.toFixed(2) + ' MB';
                        }
                    } else {
                        totalSize = totalSize.toFixed(2) + ' KB';
                    }

                    sizeText.textContent = `Uploaded: ${loadedSize} / ${totalSize}`;
                }
            });

            xhr.onload = function () {
                if (xhr.status === 200) {
                    alert('File uploaded successfully!');
                    progressBar.style.display = 'none'; // Hide the progress bar
                    progressBar.value = 0;
                    progressPercent.textContent = '';
                    sizeText.textContent = '';
                    speedText.textContent = '';
                    fileName.style.display = 'none';
                    uploadBtn.style.display = 'none';
                }
            };

            const startTime = Date.now();
            xhr.send(formData);
        });
    }

    if (searchInput && fileList) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.toLowerCase();
            Array.from(fileList.children).forEach(file => {
                const fileName = file.textContent.toLowerCase();
                file.style.display = fileName.includes(query) ? '' : 'none';
            });
        });

        fetch(apiUrl)
            .then(response => response.json())
            .then(files => {
                fileList.innerHTML = ''; // Clear the list before adding new items
                files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = `${file.name} - ${file.size}`;
                    li.addEventListener('click', () => {
                        if (isUploadsPage) {
                            location.href = `/uploads/${file.name}`;
                        } else {
                            location.href = `/download/${file.name}`;
                        }
                    });
                    fileList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching files:', error));
    }
});