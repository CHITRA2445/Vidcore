import multer from "multer";


/*
What is multer used for?
multer is used to:

✅ Accept and process files uploaded via HTML forms (<input type="file" />)
✅ Store those files on disk or in memory
✅ Add the file data to your req object (req.file or req.files) so you can access it in your route handlers
*/



const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, './public/temp')            /// cb: callback
  },
  filename: function (req, file, cb) {//
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage })




