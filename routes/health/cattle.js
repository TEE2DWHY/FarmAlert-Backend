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
} = require("../../controllers/health/cattle");

router.post("/cattle/vaccination", createVaccination);
router.get("/cattle/vaccination", getVaccinatedAnimals);
router.post("/cattle/medication", createMedication);
router.get("/cattle/medication", getMedicatedAnimals);
router.post("/cattle/pregnancy", createPregnancy);
router.get("/cattle/pregnancy", getPregnantAnimals);
router.post("/cattle/vet-visit", createVetVisit);
router.get("/cattle/vet-visit", getVetVisit);
router.post("/cattle/birth", createBirth);
router.get("/cattle/birth", getBirth);
router.post("/cattle/death", createDeath);
router.get("/cattle/death", getDeath);

module.exports = router;
