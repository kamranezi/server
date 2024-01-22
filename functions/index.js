const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const onRequest = functions.https.onRequest;
// Инициализация Firebase Admin SDK
const serviceAccount = require('./sneakers-5c581-firebase-adminsdk-y2ktp-ea072b08b0.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());

// Эндпоинт для получения данных пользователя Telegram и создания кастомного токена
app.post('/receive-telegram-data', async (req, res) => {
    console.log('Получены данные пользователя Telegram:', req.body.user);
    const { id, username } = req.body.user; // Используйте реальные поля данных пользователя Telegram

    try {
        // Создание UID для Firebase Auth на основе ID пользователя Telegram
        const uid = `telegram_${id}`;

        // Создание кастомного токена
        const customToken = await admin.auth().createCustomToken(uid, { username });

        res.json({ customToken });
    } catch (error) {
        console.error('Ошибка при создании кастомного токена:', error);
        res.status(500).send('Ошибка на сервере при создании кастомного токена');
    }
});

exports.app = onRequest(app);
