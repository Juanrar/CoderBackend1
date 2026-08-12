import express from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'


const app =  express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log('Error al conectar a Mongo:', err));


// Rutas Producto
 app.use('/api/products', productsRouter)
 app.use('/api/carts', cartRouter)


const serverExp = app.listen(8080, () => {
    console.log("Servidor ON en puerto 8080");
});