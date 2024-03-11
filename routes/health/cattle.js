const appRouter = require("../../utils/appRouter");
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

appRouter.post("/vaccination", createVaccination);
appRouter.get("/vaccination", getVaccinatedAnimals);
appRouter.post("/medication", createMedication);
appRouter.get("/medication", getMedicatedAnimals);
appRouter.post("/pregnancy", createPregnancy);
appRouter.get("/pregnancy", getPregnantAnimals);
appRouter.post("/vet-visit", createVetVisit);
appRouter.get("/vet-visit", getVetVisit);
appRouter.post("/birth", createBirth);
appRouter.get("/birth", getBirth);
appRouter.post("/death", createDeath);
appRouter.get("/death", getDeath);

module.exports = appRouter;