export const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export const mockOrEmpty = (items) => {
  return useMocks ? items : [];
};
