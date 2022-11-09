import { shallowMount } from "@vue/test-utils";
import Entry from "@/modules/daybook/components/Entry.vue";
import { journalState } from "../../../mock-data/test-journal-state";

describe("Pruebas en Entry Component", () => {
  const mockRouter = {
    push: jest.fn(), //con esto puedo saber si fue llamado y con qué y etc...
  };

  const wrapper = shallowMount(Entry, {
    props: {
      entry: journalState.entries[0], //DEL MOCK
    },
    global: {
      mocks: {
        $router: mockRouter, //No se necesita que se mueva el url pero si que sea llamado
      },
    },
  });

  test("debe de hacer match con el snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("debe de redireccionar al hacer click en el entry-container", () => {
    const entryContainer = wrapper.find(".entry-container");
    entryContainer.trigger("click");

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "entry",
      params: {
        id: journalState.entries[0].id,
      },
    }); // que haya sido llamado con esos parametros
  });

  test("pruebas en las propiedades computadas", () => {
    //wrapper.vm para ver propiedades computas

    // console.log(wrapper.vm); //son getters
    //se envia los parametros acontinuacion y se espera que pase compoarando los tipos de datos
    expect(wrapper.vm.day).toBe(4);
    expect(wrapper.vm.month).toBe("Noviembre");
    expect(wrapper.vm.yearDay).toBe("2022, Viernes");

    //esta prueba fue innecesaria segun Fernando porque la fecha ya se ve reflejada en el snapshot
  });
});
