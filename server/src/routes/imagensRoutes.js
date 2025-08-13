const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ImagensControllers = require('../controllers/ImagensControllers');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const pastaUploads = path.join(__dirname, '../../uploads/imagens');
        verificarECriarPasta(pastaUploads);
        cb(null, pastaUploads)
    },
    filename: function(req, file, cb){
          cb(null,  Date.now() + '_imagens_' + file.originalname)
        //cb(null, file.originalname + Date.now() + '.' + file.mimetype.split('/')[1])
        //cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})

// Função para verificar se a pasta existe e criar se não existir
function verificarECriarPasta(pastaPath) {
    if (!fs.existsSync(pastaPath)) {
        fs.mkdirSync(pastaPath, { recursive: true });
        console.log(`A pasta ${pastaPath} foi criada.`);
    } else {
        console.log(`A pasta ${pastaPath} já existe.`);
    }
  }

const upload = multer({ storage })

const router = Router()
router.get('/imagens', ImagensControllers.pegaImagens)
router.get('/imagem/:id', ImagensControllers.pegaimagemById)

router.post('/cadastraimagens',  upload.array('files'), ImagensControllers.cadastraImagens)



module.exports = router