// Intalacion de la Base de Datos Mongoose
const mongoose = require('mongoose');

async function connectDB() {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección del servidor
    });

    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = connectDB;