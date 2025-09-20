import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/public`));


app.get('/home', async (req, res) => {
  try {
  const response = await axios.get("https://api.alquran.cloud/v1/quran/en.asad");
  const quranData = response.data;

  // getting random ayah
  const totalAyahs = quranData.data.surahs.reduce((sum, surah) => sum + surah.ayahs.length, 0);
  const randomAyahIndex = Math.floor(Math.random() * totalAyahs);
  let currentIndex = 0;
  let randomAyah;

  for (const surah of quranData.data.surahs) {
    if (randomAyahIndex < currentIndex + surah.ayahs.length) {
      randomAyah = surah.ayahs[randomAyahIndex - currentIndex];
      break;
    }
    currentIndex += surah.ayahs.length;
  }

  console.log('Random Ayah:', randomAyah);
  // console.log('Quran Data:', quranData);

  res.render('home.ejs', { surah : quranData , aya: randomAyah }); 
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/', async (req, res) => {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get("https://api.alquran.cloud/v1/quran/en.asad", { httpsAgent: agent });
    const quranData = response.data;
    res.render('index.ejs', { surah: quranData, aya: quranData });
  } catch (error) {
    console.error('Error fetching data from API:', error);
    // Log more error details for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});