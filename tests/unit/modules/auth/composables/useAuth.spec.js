import useAuth from "@/modules/auth/composables/useAuth"; //EL COMPOSABLE ES LO QUE RETORNA, NO SON TODAS LAS FUNCIONES QUE TIENE

const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  getters: {
    //contiene la informacion que quiero que retorne, lo importante para la prueba es que retonre los valores que espero
    "auth/currentState": "authenticated",
    "auth/username": "Oscar",
  },
};

jest.mock("vuex", () => ({
  //fingir librerias con jest, se hace un mock completo de vuex y esto me da mas control para hacer seguimiento
  //el router es mas complicado porque tiene mucha cosa
  useStore: () => mockStore,
}));

describe("Pruebas en useAuth", () => {
  beforeEach(() => jest.clearAllMocks()); //es buena practica limpiar cuando haya jest.fn()

  //NO HACE FALTA HACER PRUEBAS EN EL STORE PORQUE YA SE HIZO,
  //HAY QUE SIMULAR EL STORE CON UN MOCK

  test("createUser exitoso", async () => {
    const { createUser } = useAuth();

    const newUser = { name: "Oscar", email: "ox69@gmail.com" };
    mockStore.dispatch.mockReturnValue({ ok: true }); //simula el retorno sin necesidad de llegar al backend

    const resp = await createUser(newUser);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser);
    expect(resp).toEqual({ ok: true });
  });

  test("createUser fallido, porque el usuario ya existe ", async () => {
    const { createUser } = useAuth();

    const newUser = { name: "Oscar", email: "ox69@gmail.com" };
    mockStore.dispatch.mockReturnValue({ ok: false, message: "EMAIL_EXISTS" });

    const resp = await createUser(newUser);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser);

    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
  });

  test("login exitoso", async () => {
    const { loginUser } = useAuth();
    const loginForm = { email: "test@test.com", password: "123456" };
    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await loginUser(loginForm);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "auth/signInUser",
      loginForm
    );
    expect(resp).toEqual({ ok: true });
  });

  test("login fallido", async () => {
    const { loginUser } = useAuth();
    const loginForm = { email: "test@test.com", password: "123456" };
    mockStore.dispatch.mockReturnValue({
      ok: false,
      message: "EMAIL/PASSWORD do not exist",
    });

    const resp = await loginUser(loginForm);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "auth/signInUser",
      loginForm
    );
    expect(resp).toEqual({ ok: false, message: "EMAIL/PASSWORD do not exist" });
  });

  test("checkAuthStatus", async () => {
    const { checkAuthStatus } = useAuth();

    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await checkAuthStatus();

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication");
    expect(resp).toEqual({ ok: true });
  });

  test("logout ", () => {
    const { logout } = useAuth();

    logout();

    expect(mockStore.commit).toHaveBeenCalledWith("auth/logout");
    expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries");
  });

  test("Computed getters: authState, username", () => {
    const { authStatus, username } = useAuth();

    expect(authStatus.value).toBe("authenticated");
    expect(username.value).toBe("Oscar");
  });
});
