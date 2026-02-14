export function errorHandler(err, req, res, next) {
  // Error de validación de Mongoose (campos obligatorios, formatos incorrectos, etc.)
  if (err.name === "ValidationError") {
    res.status(400).json(err.errors);
    return;
  }

  // Error con status definido (http-errors)
  if (err.status) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Error de cast de Mongoose (ID con formato inválido)
  if (err.name === "CastError") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  // Error de clave duplicada en MongoDB (E11000)
  if (err.message?.includes("E11000")) {
    res.status(409).json({ error: "Resource already exist" });
    return;
  }

  // Cualquier otro error
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
