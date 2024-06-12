let express = require("express")
let router = express.Router()

let multer = require('multer')
const upload = multer()


const { addProduct, getProduct, getAllProducts, deleteProducts, updateProducts } = require("../controllers/productController");

const validateToken = require("../middlwares/tokenValidate");



router.post("/", upload.single('image'), addProduct)

router.get("/get-product/:id", getProduct)

router.get("/get-all-products",  getAllProducts)

router.delete("/:id", deleteProducts)

router.patch("/:id", updateProducts)



module.exports = router;