import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';


const storage = multer.memoryStorage(); 
const upload = multer({ storage });
cloudinary.config({ 
  cloud_name: 'dqvamm7h4', 
  api_key: '936518583819884', 
  api_secret: 'KUL_Yzw9wlDY6d0mSbVN5n7HTQs'
});



export const uploadFile =  async (image: any) => {
  return await new Promise((resolve, reject)=>{
    cloudinary.uploader.upload_stream({},(err,result)=>{
      if(err){
        reject(err);
        return;
      }
      resolve(result as UploadApiResponse)
    }).end(image)
  })
}