import api from "./api"; 

// Add a new contact query
export const addContactQuery = async (formData) => {
  const payload = {
    name: formData.name,
    email: formData.email,
    mobileNumber: formData.phone,
    subject: "General Query", 
    query: formData.comment,
  };

  const response = await api.post("/contact-us/user/add", payload);
  return response.data;
};
