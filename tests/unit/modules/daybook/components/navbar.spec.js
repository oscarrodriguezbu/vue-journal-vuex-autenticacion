import { shallowMount } from "@vue/test-utils";

import NavBar from "@/modules/daybook/components/NavBar.vue";
import createVuexStore from "../../../mock-data/mock-store";

/* ---------------------------------OPCIONAL ---------------------------------------- */
//Esto es por si quiero trabajar sin problemas en caso de que la app esté
//construida con option y composition api, de esta manera esto se ejecuta solo acá que es composition api
//y se comenta la linea 2 de jest.config.js
// import {
//   VueRouterMock,
//   createRouterMock,
//   injectRouterMock,
// } from "vue-router-mock";

// import { config } from "@vue/test-utils";

// // create one router per test file
// const router = createRouterMock();
// beforeEach(() => {
//   //marca error pero al hacer las pruebas funciona bien. eslintno-undef
//   injectRouterMock(router);
// });

// // Add properties to the wrapper
// config.plugins.VueWrapper.install(VueRouterMock);
/* ---------------------------------OPCIONAL ---------------------------------------- */

describe("Pruebas en el Navbar component", () => {
  const store = createVuexStore({
    user: {
      name: "Malenia Espada de Miquela",
      email: "malenia69@gmail.com",
    },
    status: "authenticated",
    idToken: "ABC",
    refreshToken: "XYZ",
  });

  beforeEach(() => jest.clearAllMocks());

  test("debe de mostrar el componente correctamente", () => {
    const wrapper = shallowMount(NavBar, {
      global: {
        plugins: [store], //fisicamente se encuentra el store y el composable puede probarlos
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
    //aparece un warning y hay que resolverlo instalando y configurando yarn add vue-router-mock
    //link https://github.com/posva/vue-router-mock
  });

  test("click en logout, debe de cerrar sesión y redireccionar", async () => {
    const wrapper = shallowMount(NavBar, {
      global: {
        plugins: [store],
      },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.router.push).toHaveBeenCalledWith({ name: "login" }); //router no es una funcion jest. toca instalar yarn add vue-router-mock

    expect(store.state.auth).toEqual({
      user: null,
      status: "not-authenticated",
      idToken: null,
      refreshToken: null,
    });
  });
});
