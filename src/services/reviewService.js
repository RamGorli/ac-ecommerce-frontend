import api from "./api";

// Fetch latest reviews (for Home)
export const fetchRecentReviews = async (page = 0, size = 5) => {
  const res = await api.get(
    `/app-review/public/find?page=${page}&size=${size}`
  );
  return res.data; // Page<AppReview>
};

// Add review
export const addReview = async (review) => {
  const res = await api.post("/app-review/public/add", review);
  return res.data;
};

// Admin delete review
export const deleteReview = async (id) => {
  const res = await api.delete(`/app-review/admin/delete/${id}`);
  return res.data;
};
