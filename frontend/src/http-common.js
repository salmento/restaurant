import axios from 'axios';

export default axios.create({
  baseURL: 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-ruocs/service/restaurants/incoming_webhook/',
  headers: {
    "Content-type": "application/json"
  }
})