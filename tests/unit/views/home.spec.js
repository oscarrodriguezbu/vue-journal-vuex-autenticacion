import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home'

describe('Pruebas en el Home View', () => {
    
    test('debe de renderizar el componente correctamente', () => {

        const wrapper = shallowMount( Home )
        expect( wrapper.html() ).toMatchSnapshot()

    })
    
    test('Hacer click en un boton debe redireccionar a no-entry', () => {
        const mockRouter = { 
            push: jest.fn() //jest.fn()  me permite hacer muchas cosas con el push como saber cuantas veces fue llamado y etc
        }

        const wrapper = shallowMount( Home, {
            global: {
                mocks: {
                    $router: mockRouter    //para que el router apunte al mock y no al real
                }
            }
        })

        wrapper.find('button').trigger('click')

        expect( mockRouter.push ).toHaveBeenCalled()
        expect( mockRouter.push ).toHaveBeenCalledWith({ name: 'no-entry' }) //llamado con esta información
    });

})
