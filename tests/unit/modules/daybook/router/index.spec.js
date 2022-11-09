import daybookRouter from "@/modules/daybook/router";

describe("Pruebas en el router module del Daybook", () => {
  test("el router debe de tener esta configuración", async () => {
    expect(daybookRouter).toMatchObject({
      //se compara la estructura de los objetos de forma general
      name: "daybook",
      component: expect.any(Function), //espera cualquier funcion
      children: [
        {
          path: "",
          name: "no-entry",
          component: expect.any(Function), //espera cualquier funcion
        },
        {
          path: ":id",
          name: "entry",
          component: expect.any(Function), //espera cualquier funcion
          props: expect.any(Function), //espera cualquier funcion
        },
      ],
    });

    //Esto queda mejor en otro test:

    // expect( (await daybookRouter.children[0].component()).default.name  ).toBe('NoEntrySelected')
    // expect( (await daybookRouter.children[1].component()).default.name  ).toBe('EntryView')
    
    //Lo mismo de lo comentado pero mas flexible
    const promiseRoutes = [];
    daybookRouter.children.forEach((child) =>
      promiseRoutes.push(child.component())
    );

    const routes = (await Promise.all(promiseRoutes)).map(
      (r) => r.default.name
    );

    expect(routes).toContain("EntryView");
    expect(routes).toContain("NoEntrySelected");
  });

  test("debe de retornar el id de la ruta", () => {
    const route = {
      params: {
        id: "ABC-123",
      },
    };

    // console.log(daybookRouter.children[1].props(route));  //Es para ver el id que trae en consola

    // expect( daybookRouter.children[1].props( route ) ).toEqual({ id: 'ABC-123' })
    const entryRoute = daybookRouter.children.find(
      (route) => route.name === "entry"
    );
    expect(entryRoute.props(route)).toEqual({ id: "ABC-123" });
  });
});
