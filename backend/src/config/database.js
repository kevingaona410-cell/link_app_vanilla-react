const mongoose = require('mongoose');

// Comprueba la configuración y conecta con MongoDB.
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI

    // Falla rápido si falta la variable de conexión.
    if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección del servidor
    });

    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = connectDB;