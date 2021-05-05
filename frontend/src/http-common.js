import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:7000/api/restaurants',
  headers: {
    "Content-type": "application/json"
  }
})