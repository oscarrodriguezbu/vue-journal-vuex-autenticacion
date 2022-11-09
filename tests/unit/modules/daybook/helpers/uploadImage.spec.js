import "setimmediate";
import cloudinary from "cloudinary";
import axios from "axios";

import uploadImage from "@/modules/daybook/helpers/uploadImage";

//Es necesario para eliminar la imagen para limpiar la nube luego de la prueba
cloudinary.config({
  cloud_name: "dgmznkfua",
  api_key: "517319215422273",
  api_secret: "4trCPPOhVTAzEx5V9FbvOnoKFcM",
});

describe("Pruebas en el uploadImage ", () => {
  test("debe de cargar un archivo y retornar el url", async () => { //async (done)    

    const { data } = await axios.get(
      "https://res.cloudinary.com/dgmznkfua/image/upload/v1667585824/lesxqdazopz8edddylod.jpg",
      {
        responseType: "arraybuffer",
      }
    ); //arraybuffer me sirve para reconstruir el archivo

    const file = new File([data], "foto.jpg");

    const url = await uploadImage(file);
    console.log(url);

    expect( typeof url ).toBe('string'); //object si falla en la respuesta

    //Eliminar la imagen para limpiar el cloudinary despues de terminar las pruebas
    // Tomar el ID
    // console.log(url);
    const segments = url.split("/");
    const imageId = segments[segments.length - 1].replace(".jpg", "");
    // cloudinary.v2.api.delete_resources(imageId, {}, () => {
    //   done(); //propio del jest para decir que ya terminó la prueba
    // });
    
    //Con las nuevas versiones de jest no se puede usar donde con async function
    cloudinary.v2.api.delete_resources(imageId);
  }, 30000); //Por defecto jest tiene un timeout de 5000 y en este caso era un problema pero se puede editar ese valor
});
