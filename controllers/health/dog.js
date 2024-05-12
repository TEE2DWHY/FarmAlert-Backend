const Health = require("../../models/Health");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const Dog = require("../../models/Dog");

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
  const vaccinatedDogs = await Health.Vaccination.find({ createdBy: id });
  if (vaccinatedDogs.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(null, false, "No Vaccination has been Created.")
      );
  }
  const dogIds = vaccinatedDogs.map((vaccinatedDog) => vaccinatedDog.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const vaccinatedDogsWithDetails = vaccinatedDogs.map((vaccinatedDog) => {
    const details = dogs.find((d) => d.dogId === vaccinatedDog.tagId);
    return {
      ...vaccinatedDog._doc,
      dogImage: details ? details.dogImage : null,
      health: details ? details.health : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        vaccinatedDogs: vaccinatedDogsWithDetails,
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
  if (medication.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Medication has been Created."));
  }
  const dogIds = medication.map((medicatedDogs) => medicatedDogs.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const medicatedDogsWithDetails = medication.map((medicatedDogs) => {
    const details = dogs.find((d) => d.dogId === medicatedDogs.tagId);
    return {
      ...medicatedDogs._doc,
      dogImage: details ? details.dogImage : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        allMedicatedDogs: medicatedDogsWithDetails,
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
  if (pregnantAnimals.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(
          null,
          false,
          "No pregnantAnimal data has been Created."
        )
      );
  }
  const dogIds = pregnantAnimals.map((pregnantAnimal) => pregnantAnimal.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const pregnantDogsWithDetails = pregnantAnimals.map((pregnantAnimal) => {
    const details = dogs.find((d) => d.dogId === pregnantAnimal.tagId);
    return {
      ...pregnantAnimal._doc,
      dogImage: details ? details.dogImage : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        pregnantDogs: pregnantDogsWithDetails,
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
  const vetVisits = await Health.VetVisit.find({ createdBy: id });
  if (vetVisits.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(null, false, "No VetVisit data has been Created.")
      );
  }
  const dogIds = vetVisits.map((vetVisit) => vetVisit.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const vetVisitWithDetails = vetVisits.map((vetVisit) => {
    const details = dogs.find((d) => d.dogId === vetVisit.tagId);
    return {
      ...vetVisit._doc,
      dogImage: details ? details.dogImage : null,
      age: details ? details.age : null,
    };
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        vetVisitWithDetails,
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
  if (births.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Birth data has been Created."));
  }
  const dogIds = births.map((birth) => birth.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const birthWithDetails = births.map((birth) => {
    const details = dogs.find((d) => d.dogId === birth.tagId);
    return {
      ...birth._doc,
      dogImage: details ? details.dogImage : null,
      age: details ? details.age : null,
      gender: details ? details.gender : null,
      group: details ? details.group : null,
      dateOfBirth: details ? details.DOB : null,
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
  if (deaths.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Death Data has been Created."));
  }
  const dogIds = deaths.map((death) => death.tagId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });
  const deathWithDetails = deaths.map((death) => {
    const details = dogs.find((d) => d.dogId === death.tagId);
    return {
      ...death._doc,
      dogImage: details ? details.dogImage : null,
      age: details ? details.age : null,
      gender: details ? details.gender : null,
      group: details ? details.group : null,
      dateOfBirth: details ? details.DOB : null,
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
