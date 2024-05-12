const router = require("express").Router();
const {
  registerSales,
  getAllSales,
  updateSale,
  deleteSale,
  getSale,
} = require("../../controllers/sales/dog");

router.post("/dog/register-sales", registerSales);
router.get("/dog/all-sales", getAllSales);
router.get("/dog/:dogId", getSale);
router.put("/dog/:saleId", updateSale);
router.delete("/dog/:saleId", deleteSale);

module.exports = router;
