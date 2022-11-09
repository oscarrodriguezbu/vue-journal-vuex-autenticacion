import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

import Swal from "sweetalert2";

import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../mock-data/test-journal-state";

import EntryView from "@/modules/daybook/views/EntryView.vue";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

jest.mock("sweetalert2", () => ({
  //mock del sweetalert
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe("Pruebas en el EntryView", () => {
  //A la hora de crear el store, podemos evitar que cualquier dispatch llegue a su destino y tener control sobre el dispatch. Funciona de la misma forma con las mutaciones y lo que sea
  const store = createVuexStore(journalState);
  store.dispatch = jest.fn(); //con esto se tiene control absoluto del dispatch

  const mockRouter = {
    push: jest.fn(),
  };

  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallowMount(EntryView, {
      props: {
        id: "ABC123",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });
  });

  test("debe de sacar al usuario porque el id no existe", () => {
    const wrapper = shallowMount(EntryView, {
      props: {
        id: "Este ID no existe en el STORE",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });

    expect(mockRouter.push).toHaveBeenCalledWith({ name: "no-entry" });
  });

  test("debe de mostrar la entrada correctamente", () => {
    expect(wrapper.html()).toMatchSnapshot();
    expect(mockRouter.push).not.toHaveBeenCalled(); // que el router no haya sido llamado al final
  });

  test("debe de borrar la entrada y salir", (done) => {
    Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true })); //simula que el swal se ejecuta con una promesa resuelta de true

    wrapper.find(".btn-danger").trigger("click");

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "¿Está seguro?",
      text: "Una vez borrado, no se puede recuperar",
      showDenyButton: true,
      confirmButtonText: "Si, estoy seguro",
    }); //que el swall sea llamado con todo ese objeto tal cual

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        "journal/deleteEntry",
        "ABC123"
      ); //llama una accion para eliminar con los parametros enviados
      expect(mockRouter.push).toHaveBeenCalled();
      done();
    }, 1); // 1 milisegundo para esperar la respuesta del swal
  });
});
