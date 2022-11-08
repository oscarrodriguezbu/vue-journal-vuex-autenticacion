import store from "@/store"; //para este caso tiene que ser del root store y no del modulo, es decir, con @ y no con ../

const isAuthenticatedGuard = async (to, from, next) => {
  const { ok } = await store.dispatch("auth/checkAuthentication");

  if (ok) next();
  else next({ name: "login" });
};

export default isAuthenticatedGuard;
