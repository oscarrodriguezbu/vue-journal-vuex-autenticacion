// export const myGetter = ( state ) => {
//  return state
// }

export const currentState = (state) => {
  return state.status;
};

export const username = (state) => {
//   console.log(state.user);
//   console.log(state.user.name);
//   if (state.user) {
//     return state.user.name;
//   } else {
//     return "";
//   }
  //return state.user?.name || ''

  return state.user ? state.user.name: ''
};
