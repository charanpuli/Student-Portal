var express=require('express')
var multer=require('multer')
var GridFsStorage=require('multer-gridfs-storage')
var Grid=require('gridfs-stream')
var mongoose=require('mongoose')
var crypto=require('crypto')
var path=require('path')
var methodOverride=require('method-override')
var bodyparser=require('body-parser')
var router=express.Router()




// var app=express()

//middle wares
router.use(bodyparser.json())

router.use(bodyparser.urlencoded({extended:true}))

router.use(methodOverride('_method'))




//connection

var mongoURI = 'mongodb+srv://charanpuli:Charan@1999@clusterpuli-xs9yc.mongodb.net/test?retryWrites=true';

mongoose.connect(mongoURI, { useNewUrlParser: true })
          .then(()=>console.log('mongo db connected successfully...')
          )
          .catch(err=>console.log(err));

const db = mongoose.connection;
let gfs;



db.once('open',() => {
  gfs = Grid(db, mongoose.mongo);
  gfs.collection('questions');
});



// 
//create storage object
const storage = new GridFsStorage({
  db: db,
  file: (req, file) => {
    
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        
        // console.log(req.body);
        
        const fileInfo = {
          filename: filename,
          bucketName: 'questions',
          
          
          
          metadata: {
            
            
            details: req.body
          }
          
        };
        resolve(fileInfo);
      });
    });
  },
  

  
      
});
const upload = multer({ storage });




// @route /upload POST

router.post('/upload/up',upload.single('file'),(req,res)=>{

    
    
    res.render('display',{
      filter:'Uploaded Successfully'
      
      
    });
    
    
  
    
})

// @get /files
router.get('/files',(req,res) =>{
  gfs.files.find().toArray((err,files) =>{
    if (!files || files.length ==0  ){
      return res.status(404).json({
        err: 'file not found'
      })
      
    }
    return res.json(files)
  })
})


// @GET FILES/FILENAME

router.get('/files/:sem/:branch',(req,res) =>{
  gfs.files.find({metadata:{details:{sem: req.params.sem,branch:req.params.branch}}}).toArray((err,files) =>{
    if(err){
      res.render('files',{name:"Textbooks and Question Papers",files:false,id:"Upload"})
      // res.json({err :""})
    }
    else{
      // res.json(files)
      res.render('files',{name:"Textbooks and Questions",files:files,id:"Upload"})
  }
    // console.log(file.uploadDate.toISOString().slice(0,10));
    
    

  })
});
// @route GET /download/:filename
// @desc  Download single file object
router.get('/files/:sem/download/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
    // streaming from gridfs
    var readstream = gfs.createReadStream({
      filename: req.params.filename
    });
    //error handling, e.g. file does not exist
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });
    readstream.pipe(res);
  });
});




 var port= 3000
router.get("/",(req,res)=>{
    res.render('index',{id:"upload"})
})

// app.listen(port,()=>{
//     console.log(`app is running at ${port}`);
    
// })
module.exports=router