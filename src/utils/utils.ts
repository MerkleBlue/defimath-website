const getImagePrefix = () => {
  return process.env.NODE_ENV === "production"
    ? ""
    : "";
};

export { getImagePrefix };
 
