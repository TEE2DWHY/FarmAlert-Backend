const router = require("express").Router();
const {
  registerSales,
  getAllSales,
  updateSale,
  deleteSale,
  getSale,
} = require("../../controllers/sales/cattle");

router.post("/cattle/register-sales", registerSales);
router.get("/cattle/all-sales", getAllSales);
router.get("/cattle/:cattleId", getSale);
router.put("/cattle/:saleId", updateSale);
router.delete("/cattle/:saleId", deleteSale);

module.exports = router;
