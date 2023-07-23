const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new ImageAnnotatorClient({
  keyFilename: '/home/adam/code/sinninga/FotoMeFluent/backend/config/service_account_key.json',
});

app.post('/detect', async (req, res) => {
  try {
    const { base64Image } = req.body;
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const [result] = await client.objectLocalization(imageBuffer);
    const objects = result.localizedObjectAnnotations.map((obj) => obj.name);

    res.json({ objects });
  } catch (err) {
    console.error('Error detecting objects:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});