import api from "@/api";

export const login = async (token) => {
  const { data } = await api.post("/api/auth/login", {
    FireBaseToken: token,
  });
  return data;
};
export const logout = async () => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};
export const me = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};
