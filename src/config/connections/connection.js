import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const dbCon=()=>{
  mongoose.connect(process.env.DB_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`DB Connected...!`);
  })
  .catch((err) => {
    console.log(`Could not connect to the database. Exiting now...${err}`);
  });
}  
export default dbCon