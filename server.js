const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname, 'public')));
app.post('/save-file', async (req, res) => {
  try {
    const { filePath, content } = req.body;
    if (!filePath || !content) {
      return res.status(400).json({ error: 'Вкажіть шлях і вміст файлу' });
    }
    const safePath = path.join(uploadDir, filePath);
    if (!safePath.startsWith(uploadDir)) {
      return res.status(400).json({ error: 'Неприпустимий шлях' });
    }
    await fs.writeFile(safePath, content, 'utf8');
    res.status(200).json({ message: `Файл успішно збережено за шляхом: ${safePath}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Помилка під час збереження файлу: ${err.message}` });
  }
});
const aboutMe = {
  name: "Alex",
  age: "29",
  languages: ["ukrainian", "english", "italian"]
};
const myCity = {
  name: "Uman",
  location: "Ukraine",
  population: "81 525 + hasids",
};
app.get('/api', (req, res) => {
  res.json({
    message: "HI! My name is Alex.",
    endpoints: {
      "/api/about": "My personal information",
      "/api/city": "Information about my city",
      "/api/status": "Server status"
    }
  });
});
app.get('/api/about', (req, res) => {
  res.json(aboutMe);
});
app.get('/api/city', (req, res) => {
  res.json(myCity);
});
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});