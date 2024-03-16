const router = require("express").Router();
const {
  registerSales,
  getAllSales,
  updateSale,
  deleteSale,
  getSale,
} = require("../../controllers/sales/cattle");

router.post("/register-sales", registerSales);
router.get("/all-sales", getAllSales);
router.get("/:cattleId", getSale);
router.put("/:saleId", updateSale);
router.delete("/:saleId", deleteSale);

module.exports = router;
