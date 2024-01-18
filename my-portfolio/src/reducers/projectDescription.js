const projectDescription = [];

const Description = (state = projectDescription, action) => {
  switch (action.type) {
    case "ADD_WORK":
      return [...state, action.payload];
    default:
      return state;
  }
};

export default Description;
