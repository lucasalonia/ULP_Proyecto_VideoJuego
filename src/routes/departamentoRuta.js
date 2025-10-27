const express = require("express");
const router = express.Router();

// Datos base de los departamentos
const departamentos = {
  pringles: {
    nombre: "CORONEL PRINGLES",
    colorFondo: "#5cc9f5",
    colorBorde: "#007bb8",
    silabas: ["CO", "RO", "NEL", "PRIN", "GLES"],
  },
  ayacucho: {
    nombre: "AYACUCHO",
    colorFondo: "#0066ff",
    colorBorde: "#000080",
    silabas: ["A", "YA", "CU", "CHO"],
  },
};

router.get("/departamento/:id", (req, res) => {
  const { id } = req.params;
  const data = departamentos[id];
  if (!data) return res.status(404).render("notFound");
  res.render("departamento", { departamento: data });
});

module.exports = router;
