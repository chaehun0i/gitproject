export const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export const mockOrEmpty = (items) => {
  return useMocks ? items : [];
};
