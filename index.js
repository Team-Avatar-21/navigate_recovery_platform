// Bring in express components
const express = require('express');

// Bring in logger module you created
const logger = require('./middleware/logger');

// Bring in path module to deal with file paths (use sendFile(path.join()) instead of send())
const path = require('path');

// Init express
const app = express();

// Init middleware
// app.use(logger);

// Create port variable so search for available port, or port 5000
const PORT = process.env.PORT || 5000;

// When port is triggered, print statement of which port is used
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Set a static folder [use() is for middleware]
app.use(express.static(path.join(__dirname, 'public')));
