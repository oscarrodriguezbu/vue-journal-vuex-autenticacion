//el objetivo principal es que el store cambie y reacciones como espero

import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

import journal from "@/modules/daybook/store/journal";
import EntryList from "@/modules/daybook/components/EntryList.vue";

import { journalState } from "../../../mock-data/test-journal-state";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

describe("Pruebas en el EntryList", () => {
  //Se puede hacer como las pruebas del store creando uno o trabajando con el mock
  //el profe fernando enseña ambos metodos y deja una sencilla porque el store ya está probado

  const store = createVuexStore(journalState);
  const mockRouter = {
    push: jest.fn(),
  };

  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks(); //para limpiar todo al terminar cada test
    wrapper = shallowMount(EntryList, {
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });
  });

  test("debe de llamar el getEntriesByTerm sin termino y mostrar 3 entradas", () => {
    expect(wrapper.findAll("entry-stub").length).toBe(3);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("debe de llamar el getEntriesByTerm y filtrar las entradas", async () => {
    const input = wrapper.find("input");
    await input.setValue("segunda");

    expect(wrapper.findAll("entry-stub").length).toBe(1); //asegurar que se filtre una entrada colocando segunda en el input
  });

  test("el boton de nuevo debe de redireccionar a /new", () => {
    wrapper.find("button").trigger("click");

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "entry",
      params: { id: "new" },
    });
  });
});
