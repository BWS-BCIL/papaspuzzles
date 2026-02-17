const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Puzzle Swap API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
