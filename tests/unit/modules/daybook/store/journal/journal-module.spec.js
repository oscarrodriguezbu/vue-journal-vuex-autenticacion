// AQUI SE PRUEBA TODO EL STORE:

import { createStore } from "vuex";
import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../../mock-data/test-journal-state";

import authApi from '@/api/authApi'

//cREAR UN STORE PARACIDO AL REAL. LO QUE SE LLAMA MOCK
//Exacamente lo mas parecido a lo que está en src\store\index.js
const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

describe("Vuex - Pruebas en el Journal Module", () => {

    beforeAll( async() => {

        const { data } = await authApi.post(':signInWithPassword', {
            email: 'test@test.com',
            password: '123456',
            returnSecureToken: true
        })

        localStorage.setItem('idToken', data.idToken )

    })

  // Basicas ==================
  test("este es el estado inicial, debe de tener este state", () => {
    const store = createVuexStore(journalState); //Aca se crea el vuex store
    // console.log(store.state);
    const { isLoading, entries } = store.state.journal; //se desestructura data que viene del store

    expect(isLoading).toBeFalsy();
    expect(entries).toEqual(journalState.entries);
  });

  // Mutations ==================
  test("mutation: setEntries", () => {
    const store = createVuexStore({ isLoading: true, entries: [] }); //estado inicial del store como quiero

    //Se carga el store
    store.commit("journal/setEntries", journalState.entries); //journal/setEntries porque se está trabajando por modulos
    //Se revisa si se se ha cargado o no con la cantidad de items enviados en el anterior puntos
    expect(store.state.journal.entries.length).toBe(3);

    // store.commit('journal/setEntries', journalState.entries )
    // expect( store.state.journal.entries.length ).toBe(4)

    expect(store.state.journal.isLoading).toBeFalsy();
  });

  test("mutation: updateEntry", () => {
    const store = createVuexStore(journalState);
    const updatedEntry = {
      id: "-NG2PseEMQq4FMHSu2qt",
      date: 1667578345920,
      picture:
        "https://res.cloudinary.com/dgmznkfua/image/upload/v1667585824/lesxqdazopz8edddylod.jpg",
      text: "Hola mundo desde pruebas",
    };

    store.commit("journal/updateEntry", updatedEntry);

    const storeEntries = store.state.journal.entries;

    expect(storeEntries.length).toBe(3); //Para ver que lo guardado en el store no cree otro item
    expect(storeEntries.find((e) => e.id === updatedEntry.id)).toEqual(
      updatedEntry
    ); //Asegurar que exista el updatedEntry y que tenga la info actualizada
  });

  test("mutation: addEntry and deleteEntry", () => {
    const store = createVuexStore(journalState);

    //ADD
    store.commit("journal/addEntry", {
      id: "DOREMIFASOLLASI69",
      text: "Hola Mundo",
    });

    const stateEntries = store.state.journal.entries;

    expect(stateEntries.length).toBe(4); // antes habia 3 y ahora tiene que haber 4
    expect(stateEntries.find((e) => e.id === "DOREMIFASOLLASI69")).toBeTruthy(); //verificar que la entrada agregada exista

    //delete
    store.commit("journal/deleteEntry", "DOREMIFASOLLASI69");
    expect(store.state.journal.entries.length).toBe(3); //SE BORRA Y QUEDAN 3 DE NUEVO
    expect(
      store.state.journal.entries.find((e) => e.id === "DOREMIFASOLLASI69")
    ).toBeFalsy(); //VERIFICAR QUE LO BORRADO NO ESTÉ
  });

  // Getters ==================
  test("getters: getEntriesByTerm and getEntryById", () => {
    const store = createVuexStore(journalState);

    const [entry1, entry2] = journalState.entries;

    expect(store.getters["journal/getEntriesByTerm"]("").length).toBe(3); //TRES ENTRADAS QUE YA ESTAN EN EL STORE
    expect(store.getters["journal/getEntriesByTerm"]("segunda").length).toBe(1); //MIRA SI HAY ALGO QUE DICE SEGUNDA

    expect(store.getters["journal/getEntriesByTerm"]("segunda")).toEqual([
      entry2,
    ]); //Compara la entra dos con el objeto que tiene el termino segunda

    //console.log(entry1);
    expect(
      store.getters["journal/getEntryById"]("-NG2PseEMQq4FMHSu2qt")
    ).toEqual(entry1); //los ids sean iguales
  });

  // Actions ==================
  //Hacen modificaciones en la base de datos
  
  test("actions: loadEntries", async () => {
    const store = createVuexStore({ isLoading: true, entries: [] }); //estado inicial del store como quiero

    await store.dispatch("journal/loadEntries"); //await porque hay que esperar a que este proceso termine

    expect(store.state.journal.entries.length).toBe(4); //Porque es lo que tengo en la bd de firebase
  });

  test("actions: updateEntry", async () => {
    const store = createVuexStore(journalState);

    const updatedEntry = {
      //va a ser la entrada actualizada
      id: "-NG2PseEMQq4FMHSu2qt",
      date: 1627077227978,
      text: "Hola mundo desde mock data",
      otroCampo: true, // esto no deberia perjudicar la prueba
      otroMas: { a: 1 },
    };

    await store.dispatch("journal/updateEntry", updatedEntry); //actualiza la base de datos

    expect(store.state.journal.entries.length).toBe(3); //verificar que solo haya 3 entradas guardas
    expect(
      store.state.journal.entries.find((e) => e.id === updatedEntry.id)
    ).toEqual({
      id: "-NG2PseEMQq4FMHSu2qt",
      date: 1627077227978,
      text: "Hola mundo desde mock data",
    }); //confirmar que una entrada sea igual a la que se compara
  });

  test("actions: createEntry and  deleteEntry", async () => {
    const store = createVuexStore(journalState);

    const newEntry = {
      date: 1627077227978,
      text: "Nueva entrada desde las pruebas",
    };

    const id = await store.dispatch("journal/createEntry", newEntry);

    expect(typeof id).toBe("string"); //tipo del id

    expect(store.state.journal.entries.find((e) => e.id === id)).toBeTruthy(); //que la entrada creada exista por el id
    //tambien se podria evaluar que haya una cuarta entrada

    await store.dispatch("journal/deleteEntry", id);

    expect(store.state.journal.entries.find((e) => e.id === id)).toBeFalsy(); //que el id creado esté eliminado
  });
});
