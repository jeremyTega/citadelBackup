const express = require("express")
const compression = require ('compression')
const helmet = require ('helmet')
const morgan = require('morgan')
const app = express()
const PORT = 1165
app.use(express.json())
const cors = require('cors')
const fileUploader = require('express-fileupload')
const db = require('./config/db')
const router = require('./routers/userRouter')
const depositRouter = require('./routers/depositRouter')
const investmentRouter = require('./routers/investmestRouter')
const kycVerification = require('./routers/kycRouter')
const Ticket = require('./routers/ticketRouter')
const twoFactorAuthRoutes = require('./routers/2faRouter');
const cron = require ('node-cron')
const axios = require('axios')
require('dotenv').config();
const sendEmail = require('./middlewares/mail')
const {wakeUpMail} = require('./utils/mailTemplates')



// // Cron job to ping the website every 5 minutes and send an email
cron.schedule('*/5 * * * *', async () => {
    try {
        await axios.get('https://citadel-inv.onrender.com');
        console.log('Pinged website to keep it awake');

        // // Prepare and send the wake-up email
        // const subject = "Wake up website";
        // const html = wakeUpMail();
        // const regEmailData = {
        //     email: process.env.WAKE_UP_EMAIL, // Use the environment variable
        //     subject,
        //     html
        // };
        // await sendEmail(regEmailData);
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});


// Cron job to ping the website every minute and send an email
// cron.schedule('* * * * *', async () => {
//     try {
//         await axios.get('https://citadel-inv.onrender.com'); // Replace with your actual URL
//         console.log('Pinged website to keep it awake');

//         // Prepare and send the wake-up email
//         const subject = "Wake up website";
//         const html = wakeUpMail();
//         const regEmailData = {
//             email: process.env.WAKE_UP_EMAIL, // Use the environment variable
//             subject,
//             html
//         };
//         await sendEmail(regEmailData);
//         console.log('Wake-up email sent');
//     } catch (error) {
//         console.error('Error in cron job:', error.message);
//     }
// });



app.use(compression()); // Enable gzip compression
app.use(morgan('combined')); // Enable request logging
app.use(helmet()); // Set various HTTP headers for security
app.use(cors({origin:"*"}));
app.use(fileUploader({
    useTempFiles: true,
}))
app.use(router)
app.use(depositRouter)
app.use(investmentRouter)
app.use(kycVerification)
app.use(Ticket)

app.use('/', twoFactorAuthRoutes);



app.listen(PORT, ()=>{
    console.log(`app is listening to ${PORT}`)
})
