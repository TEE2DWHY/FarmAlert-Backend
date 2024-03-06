const Health = require("../../models/Health");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");

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
  const vaccinatedCattles = await Health.Vaccination.find();
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        vaccinatedCattles,
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
  const medication = await Health.Medication.find();
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        medication,
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
  const pregnantAnimals = await Health.Pregnant.find();
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        pregnantAnimals,
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

const getVetVisits = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const vetVisit = await Health.VetVisit.find();
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
  const birth = await Health.Birth.find();
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        birth,
        registrarName: {
          fullName: name,
        },
      },
      false,
      "Death Data is Returned Successfully."
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
  const death = await Health.Death.find();
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        death,
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
  getVetVisits,
  createBirth,
  getBirth,
  createDeath,
  getDeath,
};
