const router = require("express").Router();
const {
  createVaccination,
  getVaccinatedAnimals,
  createMedication,
  createPregnancy,
  createVetVisit,
  createBirth,
  createDeath,
  getMedicatedAnimals,
  getPregnantAnimals,
  getVetVisit,
  getDeath,
  getBirth,
} = require("../../controllers/health/health");

router.post("/vaccination", createVaccination);
router.get("/vaccination", getVaccinatedAnimals);
router.post("/medication", createMedication);
router.get("/medication", getMedicatedAnimals);
router.post("/pregnancy", createPregnancy);
router.get("/pregnancy", getPregnantAnimals);
router.post("/vet-visit", createVetVisit);
router.get("/vet-visit", getVetVisit);
router.post("/birth", createBirth);
router.get("/birth", getBirth);
router.post("/death", createDeath);
router.get("/death", getDeath);

module.exports = router;
