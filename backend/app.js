require('dotenv').config();

const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override'); 


const connectDB = require('./src/config/database');
const linkRoutes = require('./src/routes/linkRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/links', linkRoutes);
app.use('/api/links', commentRoutes);

// Middleware global de errores
function errorHandler(error, req, res, next) {
    console.error(error);

    res.status(error.status || 500).json({
        message: error.message || 'Internal server error'
    });
}

app.use(methodOverride('_method'));

app.use(errorHandler);

// Iniciar servidor
async function startServer() {
    try {
        await connectDB();

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port http://localhost:${process.env.PORT}/api/links`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

startServer();