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

router.post("/dog/vaccination", createVaccination);
router.get("/dog/vaccination", getVaccinatedAnimals);
router.post("/dog/medication", createMedication);
router.get("/dog/medication", getMedicatedAnimals);
router.post("/dog/pregnancy", createPregnancy);
router.get("/dog/pregnancy", getPregnantAnimals);
router.post("/dog/vet-visit", createVetVisit);
router.get("/dog/vet-visit", getVetVisit);
router.post("/dog/birth", createBirth);
router.get("/dog/birth", getBirth);
router.post("/dog/death", createDeath);
router.get("/dog/death", getDeath);

module.exports = router;
