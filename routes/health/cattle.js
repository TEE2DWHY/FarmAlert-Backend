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
  getVetVisits,
  getDeath,
} = require("../../controllers/health/health");

appRouter.post("/vaccination", createVaccination);
appRouter.get("/vaccination", getVaccinatedAnimals);
appRouter.post("/medication", createMedication);
appRouter.get("/medication", getMedicatedAnimals);
appRouter.post("/pregnancy", createPregnancy);
appRouter.get("/pregnancy", getPregnantAnimals);
appRouter.post("/vet-visit", createVetVisit);
appRouter.get("/vet-visit", getVetVisits);
appRouter.post("/birth", createBirth);
appRouter.post("/death", createDeath);
appRouter.get("/death", getDeath);

module.exports = appRouter;
