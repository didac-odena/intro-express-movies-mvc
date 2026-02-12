# LAB | Express Movies — Mongoose y Seeds

## Introducción

Has heredado una API REST de películas construida con **Express 5**. La API tiene un CRUD funcional, pero utiliza un modelo falso que simula una base de datos con un JSON en memoria.

Tu misión tiene dos partes:

1. **Migrar el modelo** para que use **Mongoose** y se conecte a una base de datos MongoDB real.
2. **Crear un script de seeds** que limpie la base de datos y la llene con **100 películas aleatorias** usando **faker.js**.

## Requisitos

- [Node.js](https://nodejs.org/) v22 o superior.
- [MongoDB](https://www.mongodb.com/) corriendo localmente o una URI de MongoDB Atlas.

## Punto de partida

```
app.js                          ← Servidor Express
app.test.js                     ← Tests (tu guía para saber si vas bien)
config/routes.config.js         ← Definición de rutas
controllers/movie.controller.js ← Lógica de cada endpoint
models/movie.model.js           ← ⚠️ Modelo falso (a migrar a Mongoose)
data/movies.json                ← Datos estáticos originales
```

### Endpoints existentes

| Método   | Ruta          | Descripción                 |
| -------- | ------------- | --------------------------- |
| `GET`    | `/movies`     | Listar todas las películas  |
| `GET`    | `/movies/:id` | Obtener una película por ID |
| `POST`   | `/movies`     | Crear una nueva película    |
| `PATCH`  | `/movies/:id` | Actualizar una película     |
| `DELETE` | `/movies/:id` | Eliminar una película       |

### Configuración inicial

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

---

## Iteración 1: Migrar el modelo a Mongoose

El archivo `models/movie.model.js` actualmente simula una base de datos usando un array en memoria con `setTimeout` para emular latencia. Tu tarea es reemplazarlo por un **modelo de Mongoose real**.

### 1.1 Instalar Mongoose

```bash
npm install mongoose
```

### 1.2 Conectar a MongoDB

Abre `app.js` y añade la conexión a MongoDB **antes** de arrancar el servidor. Usa `mongoose.connect()` para conectar a una base de datos local llamada `movies-db`:

```js
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/movies-db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
```

### 1.3 Crear el modelo de Mongoose

Reemplaza el contenido de `models/movie.model.js` por un modelo de Mongoose. El schema debe reflejar la estructura de las películas en `data/movies.json`:

| Campo      | Tipo       | Requerido |
| ---------- | ---------- | :-------: |
| `title`    | `String`   |    ✅     |
| `year`     | `String`   |    ✅     |
| `director` | `String`   |    ✅     |
| `duration` | `String`   |    ❌     |
| `genre`    | `[String]` |    ❌     |
| `rate`     | `String`   |    ❌     |

> 💡 **Pista:** Necesitas importar `Schema` y `model` de `mongoose`, definir un schema con `new Schema({...})` y exportar el modelo con `model("Movie", movieSchema)`.

### 1.4 Adaptar el controlador

Una vez migrado el modelo, revisa `controllers/movie.controller.js`. Los métodos del controlador ya usan `Movie.find()`, `Movie.findById()`, `Movie.create()` y `Movie.findByIdAndUpdate()`, que son métodos nativos de Mongoose, por lo que deberían funcionar directamente.

Sin embargo, hay un problema: la función `deleteMovie` usa `Movie.delete()`, que **no es un método de Mongoose**. Cámbialo a `Movie.findByIdAndDelete(req.params.id)`.

---

## Iteración 2: Crear un script de seeds

Ahora que la API usa MongoDB, necesitamos poblar la base de datos. Crea un script que genere **100 películas aleatorias** usando la librería `@faker-js/faker`.

### 2.1 Instalar faker.js

```bash
npm install @faker-js/faker
```

### 2.2 Crear el archivo de seeds

Crea un archivo `seeds/movies.seed.js` con la siguiente lógica:

1. **Conectar** a MongoDB (misma URI que en `app.js`).
2. **Limpiar** la colección de películas (`Movie.deleteMany({})`).
3. **Generar** un array de 100 películas con datos aleatorios usando faker.
4. **Insertar** las películas en la base de datos (`Movie.create(movies)` o `Movie.insertMany(movies)`).
5. **Desconectar** de MongoDB y mostrar un mensaje de confirmación.

Cada película generada debería tener campos realistas. Aquí tienes ideas para generarlos con faker:

| Campo      | Ejemplo con faker                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | `faker.music.songName()` o `faker.word.words({ count: { min: 1, max: 4 } })`                                                             |
| `year`     | `faker.date.past({ years: 50 }).getFullYear().toString()`                                                                                |
| `director` | `faker.person.fullName()`                                                                                                                |
| `duration` | `` `${faker.number.int({ min: 1, max: 3 })}h ${faker.number.int({ min: 0, max: 59 })}min` ``                                             |
| `genre`    | `faker.helpers.arrayElements(["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Animation"], { min: 1, max: 3 })` |
| `rate`     | `faker.number.float({ min: 1, max: 10, fractionDigits: 1 }).toString()`                                                                  |

### 2.3 Añadir el script a `package.json`

Añade un script en `package.json` para poder ejecutar el seed fácilmente:

```json
"scripts": {
  "seed": "node seeds/movies.seed.js"
}
```

### 2.4 Ejecutar el seed

```bash
npm run seed
```

Deberías ver un mensaje como:

```
Connected to MongoDB
Collection cleaned
100 movies created
MongoDB connection closed
```

Después de ejecutar el seed, arranca el servidor con `npm run dev` y comprueba que `GET /movies` devuelve las 100 películas generadas.

---

## Resultado esperado

Cuando hayas terminado:

- `npm run seed` → Limpia la base de datos e inserta 100 películas aleatorias.
- `GET /movies` → 200 con array de 100 películas de la base de datos.
- `GET /movies/:id` con ID válido → 200 con la película.
- `POST /movies` con body válido → 201 con la película creada.
- `PATCH /movies/:id` → 200 con la película actualizada.
- `DELETE /movies/:id` → 204 sin contenido.

Happy coding! 💙
