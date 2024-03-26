const Health = require("../../models/Health");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const Cattle = require("../../models/Cattle");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

const createVaccination = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const vaccination = await Health.Vaccination.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        vaccination,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Vaccination Data is Created Successfully."
    )
  );
});

const getVaccinatedAnimals = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const vaccinatedCattles = await Health.Vaccination.find({ createdBy: id });
  const cattleIds = vaccinatedCattles.map(
    (vaccinatedCattle) => vaccinatedCattle.tagId
  );
  const cattle = await Cattle.find({ cattleId: { $in: cattleIds } });
  const vaccinatedCattlesWithDetails = vaccinatedCattles.map(
    (vaccinatedCattle) => {
      const details = cattle.find((c) => c.cattleId === vaccinatedCattle.tagId);
      return {
        ...vaccinatedCattle._doc,
        cattleImage: details ? details.cattleImage : null,
        health: details ? details.health : null,
        age: details ? details.age : null,
      };
    }
  );
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        vaccinatedCattles: vaccinatedCattlesWithDetails,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Vaccination Data is Returned Successfully."
    )
  );
});

const createMedication = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const medication = await Health.Medication.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        medication,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Medication Data is Created Successfully."
    )
  );
});

const getMedicatedAnimals = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const medication = await Health.Medication.find({ createdBy: id });
  const cattleIds = medication.map(
    (medicatedAnimals) => medicatedAnimals.tagId
  );
  const cattle = await Cattle.find({ cattleId: { $in: cattleIds } });
  const medicatedAnimalsWithDetails = medication.map((medicatedAnimals) => {
    const details = cattle.find((c) => c.cattleId === medicatedAnimals.tagId);
    return {
      ...medicatedAnimals._doc,
      cattleImage: details ? details.cattleImage : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        allMedicatedAnimals: medicatedAnimalsWithDetails,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Medication Data is Returned Successfully."
    )
  );
});

const createPregnancy = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const pregnancy = await Health.Pregnant.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        pregnancy,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Pregnancy Data is Created Successfully."
    )
  );
});

const getPregnantAnimals = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const pregnantAnimals = await Health.Pregnant.find({ createdBy: id });
  const cattleIds = pregnantAnimals.map(
    (pregnantAnimal) => pregnantAnimal.tagId
  );
  const cattle = await Cattle.find({ cattleId: { $in: cattleIds } });
  const pregnantAnimalsWithDetails = pregnantAnimals.map((pregnantAnimal) => {
    const details = cattle.find((c) => c.cattleId === pregnantAnimal.tagId);
    return {
      ...pregnantAnimal._doc,
      cattleImage: details ? details.cattleImage : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        pregnantAnimals: pregnantAnimalsWithDetails,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Medication Data is Returned Successfully."
    )
  );
});

const createVetVisit = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const vetVisit = await Health.VetVisit.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        vetVisit,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "VetVisit Data is Created Successfully."
    )
  );
});

const getVetVisit = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const vetVisit = await Health.VetVisit.find({ createdBy: id });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        vetVisit,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "VetVisits Data is Returned Successfully."
    )
  );
});

const createBirth = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const birth = await Health.Birth.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        birth,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Birth Data is Created Successfully."
    )
  );
});

const getBirth = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const births = await Health.Birth.find({ createdBy: id });
  const cattleIds = births.map((birth) => birth.tagId);
  const cattle = await Cattle.find({ cattleId: { $in: cattleIds } });
  const birthWithDetails = births.map((birth) => {
    const details = cattle.find((c) => c.cattleId === birth.tagId);
    return {
      ...birth._doc,
      cattleImage: details.cattleImage,
      age: details.age,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        births: birthWithDetails,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Birth Data is Returned Successfully."
    )
  );
});

const createDeath = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const death = await Health.Death.create({
    createdBy: {
      _id: id,
    },
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        death,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Death Data is Created Successfully."
    )
  );
});

const getDeath = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const deaths = await Health.Death.find({ createdBy: id });
  const cattleIds = deaths.map((birth) => birth.tagId);
  const cattle = await Cattle.find({ cattleId: { $in: cattleIds } });
  const deathWithDetails = births.map((death) => {
    const details = cattle.find((c) => c.cattleId === death.tagId);
    return {
      ...death._doc,
      cattleImage: details.cattleImage,
      age: details.age,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        deaths: deathWithDetails,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Death Data is Returned Successfully."
    )
  );
});

module.exports = {
  createVaccination,
  getVaccinatedAnimals,
  createMedication,
  getMedicatedAnimals,
  createPregnancy,
  getPregnantAnimals,
  createVetVisit,
  getVetVisit,
  createBirth,
  getBirth,
  createDeath,
  getDeath,
};
