 const dicomFileInput = document.getElementById('dicomFile');
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        const resultsContainer = document.getElementById('results');
        const measurementType = document.getElementById('measurementType');
        const canvasContainer = document.getElementById('canvasContainer');
        const controlsSection = document.getElementById('controls-section');

        let points = [];
        let scaleFactor = 1; // This will be updated after processing the image

        // Upload event handler
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = dicomFileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (result.error) {
                    alert(result.error);
                    return;
                }

                // Get the image and scale factor from the server
                scaleFactor = result.scale_factor;
                const imageUrl = result.image_url;

                // Display the image on canvas
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
                    ctx.drawImage(img, 0, 0);

                    // Show canvas and controls
                    canvasContainer.style.display = 'block';
                    controlsSection.style.display = 'block';
                };

                // Display the results of the DICOM processing
                resultsContainer.innerHTML = `
                    <p>Scale Factor: ${scaleFactor.toFixed(2)}</p>
                    <p>Detected Image URL: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
                `;
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload DICOM file');
            }
        });

        // Handle click on canvas for distance measurement
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            points.push({ x, y });
            drawPoint(x, y);

            // Measure distance if two points are clicked
            if (measurementType.value === 'line' && points.length % 2 === 0) {
                const p1 = points[points.length - 2];
                const p2 = points[points.length - 1];
                const distance = calculateDistance(p1, p2);
                const midpoint = {
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2
                };

                // Display the distance in millimeters
                ctx.fillStyle = 'black';
                ctx.font = '14px Arial';
                ctx.fillText(`Distance: ${distance.toFixed(2)} mm`, midpoint.x, midpoint.y);

                // Draw the line
                drawLine(p1, p2);
            }
        });

        // Clear canvas
        document.getElementById('clearButton').addEventListener('click', () => {
            points = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Reload the image to reset canvas
            const img = new Image();
            img.src = document.getElementById('dicomImage').src;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        });

        // Calculate distance in millimeters
        function calculateDistance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
            const realDistanceMM = distanceInPixels * scaleFactor; // Multiply by scale factor
            return realDistanceMM;
        }

        // Draw point
        function drawPoint(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'orange';
            ctx.fill();
        }

        // Draw line
        function drawLine(p1, p2) {
            ctx.beginPath();
            ctx.strokeStyle = 'orange';
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }