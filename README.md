# journal
## Configuración inicial
```
- Para hacer funcionar el codigo, hay que ir a firebase, crear una base de datos e inicializarla en api/journal
- Para api/authApi ir a configuracion de proyecto en firebase, copiar el key. Fuente: https://firebase.google.com/docs/reference/rest/auth#section-api-usage. Tambien pegar el baseURL si esta llegase a cambiar.
- Para el proyecto en genaral, hay que tener una cuenta de cloudinary y configurar los archivos:
    src\modules\daybook\helpers\uploadImage.js
    tests\unit\modules\daybook\helpers\uploadImage.spec.js
- Si el jest no funciona, es porque no se instaló correctamente con npm i, entonces desintalar el nodemoles e intalar todo con yarn
- Para este ejercicio se modificó las reglas en Realtime Database en firebase. Pasa de null a auth !=null. Por lo que quizá
    los repos anterires de los ejercicios de journal con vue pueden dejar de funcionar.
- Para las pruebas, al mezclar option con composition api, las de option pueden fallar por el router,
    entonces se intaló una nueva libreria que puede usarse localmente, mas info en tests\unit\modules\daybook\components\navbar.spec.js

```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
