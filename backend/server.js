import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// eslint-disable-next-line import/extensions
import restaurants from './api/restaurants.routes.js';

const app = express();

app.use(cors());
app.use(morgan('combined'));

// accept json on body of a request
app.use(express.json());

app.use('/api/restaurants', restaurants);
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
