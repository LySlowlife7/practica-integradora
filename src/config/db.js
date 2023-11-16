import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // Obtener la cadena de conexión desde .env

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

db.once('open', () => {
  console.log('Conectado a MongoDB Atlas');
});

export default mongoose;