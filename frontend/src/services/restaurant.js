import http from '../http-common';

class RestaurantDataService {
  getAll(page = 0) {
    return http.get(`/restaurants?page=${page}`);
  }

  get(id) {
    return http.get(`/restaurant?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`restaurants?${by}=${query}&page=${page}`);
  } 

  createReview(data) {
    return http.post("/review", data);
  }

  updateReview(data) {
    return http.put("/reviewedit", data);
  }

  deleteReview(id, userId) {
    return http.delete(`/reviewdelete?id=${id}`);
  }

  getCuisines(id) {
    return http.get(`/cuisines`);
  }

}

export default new RestaurantDataService();