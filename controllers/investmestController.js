const userModel = require('../models/userModel');
const investmentModel = require('../models/investmentModel');
const withdrawalModel = require('../models/witdrawalModel')
const schedule = require('node-schedule');
const transationModel = require('../models/transationModel')
const sendEmail = require ('../middlewares/mail')
const mongoose = require('mongoose')
require('dotenv').config();
const {withdrawalRequestMail,withdrawalRejectedMail,withdrawalAcceptedMail,adminWithdrawalRequestMail} = require('../utils/mailTemplates')

// // Schedule a job to run every day at midnight
// const job = schedule.scheduleJob('0 0 * * *', async () => {
//     // Check if 30 days have elapsed since the investment was made
//     const currentDate = new Date();
//     const endDate = new Date(investment.endDate);
//     const daysElapsed = Math.floor((currentDate - endDate) / (1000 * 60 * 60 * 24));

//     if (daysElapsed >= 30) {
//         // Add interest to the user's balance
//         user.balance += investment.expectedReturn - investment.amount;

//         // Save the updated user document
//         await user.save();

//         console.log(`Interest of ${investment.expectedReturn - investment.amount} added to user ${userId} after 30 days.`);
//     }
//});




const basicPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        let { amount, scheduleType, scheduleTime, wallet } = req.body;

        // Find the user
        const user = await userModel.findById(userId);

         // Generate a random deposit number
         function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const investmentNumber = randomNumbers.join(''); // Convert array to string
            return `#${investmentNumber}`; // Prepend "#" symbol to the ticket number
        }
      
       
        // Check if the user has sufficient balance in the selected wallet
        if (user[wallet] < amount) {
            return res.status(400).json({ message: 'Insufficient balance, please deposit' });
        }

        // Determine investment amount within the range of 2000 to 10000
        if (amount < 2000 || amount > 9999) {
            return res.status(400).json({ message: 'Investment amount must be between $2000 and $9999' });
        }

        // Validate the scheduleTime
        let scheduleDate;
        if (scheduleType === 'later') {
            // Parse the scheduleTime as a Date object
            scheduleDate = new Date(scheduleTime);

            // Validate scheduleTime is not in the past
            if (scheduleDate < new Date()) {
                return res.status(400).json({ message: 'Schedule time cannot be in the past' });
            }

            // Check if the parsing was successful and if the result is a valid date
            if (isNaN(scheduleDate.getTime())) {
                return res.status(400).json({ message: 'Invalid scheduleTime format. Must be a valid date and time.' });
            }

            // Calculate the time difference between now and the scheduled time
            const timeDifference = scheduleDate.getTime() - Date.now();

            // If the scheduled time is within 5 minutes, log a message
            if (timeDifference <= 5 * 60 * 1000) {
                console.log('Investment plan is about to start.');
            }
        } else {
            // Default to current date if not scheduled for later
            scheduleDate = new Date();
        }

        // //     // Deduct the investment amount from the selected wallet
        // //     // Deduct withdrawal amount from all wallets
        // const wallets = ['depositWallet', 'intrestWallet', 'referalWallet'];

        // for (let wallet of wallets) {
        //     if (user[wallet] > 0) {
        //         // Deduct from wallet if balance is not zero
        //         user[wallet] -= amount;
        //     }
        // }

      // Deduct the full investment amount from each of the three wallets
      const wallets = ['accountBalance','depositWallet', 'intrestWallet', 'referalWallet'];
      for (let wallet of wallets) {
          const deductionAmount = Math.min(amount, user[wallet]); // Deduct the minimum of amount or wallet balance
          user[wallet] -= deductionAmount;
      }
          
           //   user.accountBalance -= amount
             await user.save();
        // Create investment plan
        const investment = new investmentModel({
            userId,
            amount,
            scheduleType,
            plan: 'basic',
            wallet,
            startDate: scheduleDate,
            ongoing: true, // Set the ongoing status to true
            investmentId:generateRandomNumbers()
        
        });
        await investment.save();
          
    

        // Calculate profit (25% of the investment amount)
        const profitPerDay = amount * 0.25;
        const totalProfit = profitPerDay * 30;

        // Calculate the date when the balance should be updated (30 days from now or scheduled date)
        const updateBalanceDate = new Date(scheduleDate);
        updateBalanceDate.setDate(updateBalanceDate.getDate() + 30);

        // Schedule a job to update the balance after 30 days
        schedule.scheduleJob(updateBalanceDate, async () => {
            // Update the ongoing status to false
            investment.ongoing = false;
            await investment.save();

            // Add total profit to the user's balance after 30 days
            // user.intrestWallet += totalProfit;
            // user.accountBalance +=totalProfit
            user.referralCount += totalProfit
            
            await user.save();

            console.log(`Total profit of ${totalProfit} added to user ${userId} after 30 days.`);
        });
        const depositTransaction = new transationModel({
            type: 'investment',
            amount:amount ,
            userId: req.params.userId,
             Id:investment.investmentId
        });
        await depositTransaction.save();

        // Return investment details
        res.status(200).json({ 
            message: 'Investment  successfully', 
            investment: { userId, amount, plan: 'basic', scheduleType, scheduleTime },
            user,
            expectedReturn: amount + totalProfit,
            depositTransaction
        });
       
    } catch (error) {
        console.error('Error scheduling investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};






const proPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        let { amount, scheduleType, scheduleTime,wallet } = req.body;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has sufficient balance in the selected wallet
        if (user[wallet] < amount) {
            return res.status(400).json({ message: 'Insufficient balance, please deposit' });
        }

        // Determine investment amount within the range of 10000 to 50000
        if (amount < 10000 || amount > 49999) {
            return res.status(400).json({ message: 'Investment amount must be between $10000 and $49990' });
        }

        // Generate a random deposit number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const investmentNumber = randomNumbers.join(''); // Convert array to string
            return `#${investmentNumber}`; // Prepend "#" symbol to the ticket number
        }

        // Validate the scheduleTime
        let scheduleDate;
        if (scheduleType === 'later') {
            // Parse the scheduleTime as a Date object
            scheduleDate = new Date(scheduleTime);

            // Validate scheduleTime is not in the past
            if (scheduleDate < new Date()) {
                return res.status(400).json({ message: 'Schedule time cannot be in the past' });
            }

            // Check if the parsing was successful and if the result is a valid date
            if (isNaN(scheduleDate.getTime())) {
                return res.status(400).json({ message: 'Invalid scheduleTime format. Must be a valid date and time.' });
            }

            // Calculate the time difference between now and the scheduled time
            const timeDifference = scheduleDate.getTime() - Date.now();

            // If the scheduled time is within 5 minutes, log a message
            if (timeDifference <= 5 * 60 * 1000) {
                console.log('Investment plan is about to start.');
            }
        } else {
            // Default to current date if not scheduled for later
            scheduleDate = new Date();
        }
      // Deduct the full investment amount from each of the three wallets
      const wallets = ['accountBalance','depositWallet', 'intrestWallet', 'referalWallet'];
      for (let wallet of wallets) {
          const deductionAmount = Math.min(amount, user[wallet]); // Deduct the minimum of amount or wallet balance
          user[wallet] -= deductionAmount;
      }
          
           //   user.accountBalance -= amount
             await user.save();

        // Create investment plan
        const investment = new investmentModel({
            userId,
            amount,
            scheduleType,
            plan: 'pro',
            wallet,
            startDate: scheduleDate,
            ongoing: true,// Set the ongoing status to true
            investmentId:generateRandomNumbers()
        });
        await investment.save();

        // Calculate profit (25% of the investment amount)
        const profitPerDay = amount * 0.35;
        const totalProfit = profitPerDay * 30;

        // Calculate the date when the balance should be updated (30 days from now or scheduled date)
        const updateBalanceDate = new Date(scheduleDate);
        updateBalanceDate.setDate(updateBalanceDate.getDate() + 30);

        // Schedule a job to update the balance after 30 days
        schedule.scheduleJob(updateBalanceDate, async () => {
            // Update the ongoing status to false
            investment.ongoing = false;
            await investment.save();

           // Add total profit to the user's balance after 30 days
        //    user.intrestWallet += totalProfit;
        //    user.accountBalance +=totalProfit
        user.referralCount += totalProfit
           await user.save()

            console.log(`Total profit of ${totalProfit} added to user ${userId} after 30 days.`);
        });
        const depositTransaction = new transationModel({
            type: 'investment',
            amount:amount ,
            userId: req.params.userId,
             Id:investment.investmentId
        });
        await depositTransaction.save();

        // Return investment details
        res.status(200).json({ 
            message: 'Investment  successfully', 
            investment: { userId, amount, plan: 'basic', scheduleType, scheduleTime },
            user,
            expectedReturn: amount + totalProfit,
            depositTransaction
        });
    } catch (error) {
        console.error('Error scheduling investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





const premiumPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        let { amount, scheduleType, scheduleTime,wallet } = req.body;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has sufficient balance in the selected wallet
        if (user[wallet] < amount) {
            return res.status(400).json({ message: 'Insufficient balance, please deposit' });
        }

         // Determine investment amount within the range of50000 to 100000
         
         if (amount < 50000 || amount > 99999) {
            return res.status(400).json({ message: 'Investment amount must be between $99999 and $100000' });
        }

        // Generate a random deposit number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const investmentNumber = randomNumbers.join(''); // Convert array to string
            return `#${investmentNumber}`; // Prepend "#" symbol to the ticket number
        }

        // Validate the scheduleTime
        let scheduleDate;
        if (scheduleType === 'later') {
            // Parse the scheduleTime as a Date object
            scheduleDate = new Date(scheduleTime);

            // Validate scheduleTime is not in the past
            if (scheduleDate < new Date()) {
                return res.status(400).json({ message: 'Schedule time cannot be in the past' });
            }

            // Check if the parsing was successful and if the result is a valid date
            if (isNaN(scheduleDate.getTime())) {
                return res.status(400).json({ message: 'Invalid scheduleTime format. Must be a valid date and time.' });
            }

            // Calculate the time difference between now and the scheduled time
            const timeDifference = scheduleDate.getTime() - Date.now();

            // If the scheduled time is within 5 minutes, log a message
            if (timeDifference <= 5 * 60 * 1000) {
                console.log('Investment plan is about to start.');
            }
        } else {
            // Default to current date if not scheduled for later
            scheduleDate = new Date();
        }
      // Deduct the full investment amount from each of the three wallets
      const wallets = ['accountBalance','depositWallet', 'intrestWallet', 'referalWallet'];
      for (let wallet of wallets) {
          const deductionAmount = Math.min(amount, user[wallet]); // Deduct the minimum of amount or wallet balance
          user[wallet] -= deductionAmount;
      }
          
           //   user.accountBalance -= amount
             await user.save();

        // Create investment plan
        const investment = new investmentModel({
            userId,
            amount,
            scheduleType,
            plan: 'premium',
            wallet,
            startDate: scheduleDate,
            ongoing: true, // Set the ongoing status to true
            investmentId:generateRandomNumbers()
        });
        await investment.save();

      // Calculate profit (25% of the investment amount)
      const profitPerDay = amount * 0.50;
      const totalProfit = profitPerDay * 30;

        // Calculate the date when the balance should be updated (30 days from now or scheduled date)
        const updateBalanceDate = new Date(scheduleDate);
        updateBalanceDate.setDate(updateBalanceDate.getDate() + 30);

        // Schedule a job to update the balance after 30 days
        schedule.scheduleJob(updateBalanceDate, async () => {
            // Update the ongoing status to false
            investment.ongoing = false;
            await investment.save();

          // Add total profit to the user's balance after 30 days
        //   user.intrestWallet += totalProfit;
        //   user.accountBalance +=totalProfit
        user.referralCount += totalProfit
            await user.save();

            console.log(`Total profit of ${totalProfit} added to user ${userId} after 30 days.`);
        });

        const depositTransaction = new transationModel({
            type: 'investment',
            amount:amount ,
            userId: req.params.userId,
             Id:investment.investmentId
        });
        await depositTransaction.save();

        // Return investment details
        res.status(200).json({ 
            message: 'Investment  successfully', 
            investment: { userId, amount, plan: 'basic', scheduleType, scheduleTime },
            user,
            expectedReturn: amount + totalProfit,
            depositTransaction
        });
    } catch (error) {
        console.error('Error scheduling investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};






const retirementPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        let { amount, scheduleType, scheduleTime,wallet } = req.body;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has sufficient balance in the selected wallet
        if (user[wallet] < amount) {
            return res.status(400).json({ message: 'Insufficient balance, please deposit' });
        }

         // Determine investment amount within the range of 10000 to 10000000000
         if (amount < 100000 || amount > 100000000000000) {
            return res.status(400).json({ message: 'Investment amount must be between $100000 and $1000000000' });
        }


        // Generate a random deposit number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const investmentNumber = randomNumbers.join(''); // Convert array to string
            return `#${investmentNumber}`; // Prepend "#" symbol to the ticket number
        }

        // Validate the scheduleTime
        let scheduleDate;
        if (scheduleType === 'later') {
            // Parse the scheduleTime as a Date object
            scheduleDate = new Date(scheduleTime);

            // Validate scheduleTime is not in the past
            if (scheduleDate < new Date()) {
                return res.status(400).json({ message: 'Schedule time cannot be in the past' });
            }            

            // Check if the parsing was successful and if the result is a valid date
            if (isNaN(scheduleDate.getTime())) {
                return res.status(400).json({ message: 'Invalid scheduleTime format. Must be a valid date and time.' });
            }
            


            // Calculate the time difference between now and the scheduled time
            const timeDifference = scheduleDate.getTime() - Date.now();

            // If the scheduled time is within 5 minutes, log a message
            if (timeDifference <= 5 * 60 * 1000) {
                console.log('Investment plan is about to start.');
            }
        } else {
            // Default to current date if not scheduled for later
            scheduleDate = new Date();
        }

          // Deduct the full investment amount from each of the three wallets
   const wallets = ['accountBalance','depositWallet', 'intrestWallet', 'referalWallet'];
   for (let wallet of wallets) {
       const deductionAmount = Math.min(amount, user[wallet]); // Deduct the minimum of amount or wallet balance
       user[wallet] -= deductionAmount;
   }
       
        //   user.accountBalance -= amount
          await user.save();

        // Create investment plan
        const investment = new investmentModel({
            userId,
            amount,
            scheduleType,
            plan: 'retirement',
            wallet,
            startDate: scheduleDate,
            ongoing: true, // Set the ongoing status to true
            investmentId:generateRandomNumbers()
        });
        await investment.save();

     // Calculate profit (25% of the investment amount)
     const profitPerDay = amount * 0.50;
     const totalProfit = profitPerDay * 100;

        // Calculate the date when the balance should be updated (30 days from now or scheduled date)
        const updateBalanceDate = new Date(scheduleDate);
        updateBalanceDate.setDate(updateBalanceDate.getDate() + 100);

        // Schedule a job to update the balance after 30 days
        schedule.scheduleJob(updateBalanceDate, async () => {
            // Update the ongoing status to false
            investment.ongoing = false;
            await investment.save();

            // Add total profit to the user's balance after 30 days
            // user.intrestWallet += totalProfit;
            // user.accountBalance +=totalProfit
            user.referralCount += totalProfit
            await user.save();

            console.log(`Total profit of ${totalProfit} added to user ${userId} after 100 days.`);
        });

        const depositTransaction = new transationModel({
            type: 'investment',
            amount:amount ,
            userId: req.params.userId,
             Id:investment.investmentId
        });
        await depositTransaction.save();

        // Return investment details
        res.status(200).json({ 
            message: 'Investment  successfully', 
            investment: { userId, amount, plan: 'basic', scheduleType, scheduleTime },
            user,
            expectedReturn: amount + totalProfit,
            depositTransaction
        });
    } catch (error) {
        console.error('Error scheduling investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getOngoingPlans = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find ongoing investment plans for the user
        const ongoingPlans = await investmentModel.find({ userId: userId, ongoing: true });
        // Return the ongoing plans
        res.status(200).json({ ongoingPlans });
    } catch (error) {
        console.error('Error fetching ongoing plans:', error);
       
        res.status(500).json({ message: 'Internal server error' });
    }
}



const endedPlans = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find ongoing investment plans for the user
        const ongoingPlans = await investmentModel.find({ userId: userId, ongoing: false });
        // Return the ongoing plans
        res.status(200).json({ endedPlans });
    } catch (error) {
        console.error('Error fetching ongoing plans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getScheduledInvestmentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find scheduled investments for the user
        const scheduledInvestments = await investmentModel.find({ userId: userId, scheduleType: 'later' });

        // Return the scheduled investments
        res.status(200).json({ scheduledInvestments });
    } catch (error) {
        console.error('Error fetching scheduled investments by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





const calculateTotalInvestmentCount = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the count of all investments made by the user
        const totalInvestmentCount = await investmentModel.countDocuments({ userId });

        res.status(200).json({ message: 'Total investment count calculated', totalInvestmentCount });
    } catch (error) {
        console.error('Error calculating total investment count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const calculateTotalProfit = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all investments made by the user
        const investments = await investmentModel.find({ userId });

        // Calculate total profit earned
        let totalProfit = 0;
        for (const investment of investments) {
            // Calculate profit for each investment (based on the plan's profit rate)
            let profitRate = 0;
            switch (investment.plan) {
                case 1000:
                    profitRate = 0.007; // 0.7% profit for $1000 plan
                    break;
                case 10000:
                    profitRate = 1.5; // 0.5% profit for $10000 plan
                    break;
                    case 50000:
                        profitRate = 2.1; 
                        break;
                        case 200000:
                            profitRate = 2.5; 
                            break;
                            case 500000:
                                profitRate = 3; 
                                break;
                
                default:
                    break;
            }
            const profit = investment.plan * profitRate;
            totalProfit += profit;
        }

        res.status(200).json({ message: 'Total profit calculated', totalProfit });
    } catch (error) {
        console.error('Error calculating total profit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getTotalBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the user by their ID
        const user = await userModel.findById(userId);
        
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }

        // Sum up the user's balance
        let totalBalance = user.accountBalance;

        // You can add additional logic here if the user's balance is stored across multiple accounts or documents

       res.status(200).json({ message: 'User balance', data: totalBalance });
    } catch (error) {
        res.status(500).json({ message: `Error getting total balance: ${error.message}` });
    }
}; 
// 

// const withdrawMoney = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         let { usd } = req.body;

//         // Find the user
//         const user = await userModel.findById(userId);
      
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the user has completed KYC
//         if (!user.kyc.verified) {
//             return res.status(400).json({ message: 'KYC verification required for withdrawal' });
//         }

//         // Check if the withdrawal amount exceeds the total balance
//         if (usd > user.accountBalance) {
//             return res.status(400).json({ message: 'Insufficient balance for withdrawal' });
//         }


//         // Deduct withdrawal amount from all wallets
//         const wallets = ['depositWallet', 'intrestWallet', 'referalWallet'];

//         for (let wallet of wallets) {
//             if (user[wallet] > 0) {
//                 // Deduct from wallet if balance is not zero
//                 user[wallet] -= usd;
//             }
//         }

//         // Deduct from account balance
//         user.accountBalance -= usd;

//          // Update the pendingWithdraw field with the new withdrawal amount (replace the old value)
//          user.pendingWithdraw = usd;

//         // Save the updated user object
//         await user.save();

   
//         // Save the updated user object
//         await user.save();

//         // Generate a random withdrawal number
//         function generateRandomNumbers() {
//             const randomNumbers = [];
//             for (let i = 0; i < 6; i++) {
//                 randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
//             }
//             const withdrawalNumber = randomNumbers.join(''); // Convert array to string
//             return `#${withdrawalNumber}`; // Prepend "#" symbol to the ticket number
//         }

//         // Create a withdrawal record
//         const withdrawalRecord = new withdrawalModel({
//             userId: userId,
//             amount: usd,
//             withdrawId: generateRandomNumbers(),
//             timestamp: Date.now()
//         });

//         // Save the withdrawal record
//         await withdrawalRecord.save();

//         // Create a transaction record
//         const depositTransaction = new transationModel({
//             type: 'withdrawal',
//             amount: withdrawalRecord.amount,
//             userId: userId,
//             ID: withdrawalRecord.withdrawId
//         });
//         await depositTransaction.save();

//         res.status(200).json({ message: 'Withdrawal successful', remainingBalance: user.accountBalance });
//     } catch (error) {
//         console.error('Error withdrawing money:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

const withdrawMoney = async (req, res) => {
    try {
        const { userId } = req.params;
        let { usd } = req.body;

          // Convert usd to a number to avoid string concatenation
          usd = Number(usd);

          // Check if usd is a valid number
          if (isNaN(usd) || usd <= 0) {
              return res.status(400).json({ message: 'Invalid withdrawal amount' });
          }

        // Find the user
        const user = await userModel.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has completed KYC
        if (!user.kyc.verified) {
            return res.status(400).json({ message: 'KYC verification required for withdrawal' });
        }

        // Check if the withdrawal amount exceeds the total balance
        if (usd > user.accountBalance) {
            return res.status(400).json({ message: 'Insufficient balance for withdrawal' });
        }

           // Add the new withdrawal amount to the existing pending withdrawal
           user.pendingWithdraw = (user.pendingWithdraw || 0) + usd;

        // Save the updated user object
        await user.save();

         // Prepare and send rejection email
         const html = withdrawalRequestMail(user, usd);
         const notifyUserMail = {
             email: user.email,
             subject: "requesting for withdrawal",
             html
         };
         await sendEmail(notifyUserMail);

            // Prepare and send admin email
        const adminHtml = adminWithdrawalRequestMail(user, usd);
        const notifyAdminMail = {
            email:process.env.AdminMail, // Replace with actual admin email
            subject: "New Withdrawal Request",
            html: adminHtml
        };
        await sendEmail(notifyAdminMail);

        res.status(200).json({ message: 'Withdrawal request submitted. Awaiting admin approval.', pendingWithdraw: user.pendingWithdraw });
    } catch (error) {
        console.error('Error submitting withdrawal request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const withdrawalHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find withdrawal records associated with the specified user ID
        const withdrawals = await withdrawalModel.find({ userId }).sort({ timestamp: -1 });

        // if (!withdrawals) {
        //     return res.status(404).json({ message: 'Withdrawal history not found for this user' });
        // }

        res.status(200).json({ message: 'Withdrawal history retrieved successfully', data: withdrawals });
    } catch (error) {
        console.error('Error retrieving withdrawal history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getTotalWithdraw = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find all deposit records for the user
        const withdraws = await withdrawalModel.find({ userId });

        // Calculate total deposit amount
        let totalWithdraw = 0;
        withdraws.forEach(withdraw => {
            totalWithdraw += parseFloat(withdraw.amount); // Convert to number explicitly
        });

        res.status(200).json({ message: 'total withdraw amount:', totalWithdraw });
    } catch (error) {
        throw new Error("Error calculating total withdraw");
    }
};



const basicPlannm = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount, wallet } = req.body;

        // Find the user
        const user = await userModel.findById(userId);

        // Generate a random deposit number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const investmentNumber = randomNumbers.join(''); // Convert array to string
            return `#${investmentNumber}`; // Prepend "#" symbol to the ticket number
        }

        // Check if the user has sufficient balance in the selected wallet
        if (user[wallet] < amount) {
            return res.status(400).json({ message: 'Insufficient balance in the selected wallet' });
        }

        // Deduct the investment amount from the selected wallet
        user[wallet] -= amount;
        await user.save();

        // Calculate profit per minute (25% of the investment amount)
        const profitPerMinute = amount * 0.25;

        // Set timeout to simulate 2 minutes of investment
        setTimeout(async () => {
            // Add profit to the user's balance every minute
            const totalProfit = profitPerMinute * 2;
            user.intrestWallet += totalProfit;
            await user.save();

            // Create transaction record
            const depositTransaction = new transationModel({
                type: 'investment',
                amount: amount,
                userId: userId,
                Id: generateRandomNumbers()
            });
            await depositTransaction.save();

            // Return investment details
            res.status(200).json({ 
                message: 'Investment successfully', 
                investment: { userId, amount, plan: 'basic', duration: '2 minutes' },
                user,
                expectedReturn: amount + totalProfit,
                depositTransaction
            });
        }, 120000); // 2 minutes in milliseconds

    } catch (error) {
        console.error('Error scheduling investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// const getLastWithdrawal = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Find the latest withdrawal record for the user, sorted by creation date (most recent first)
//         const latestWithdrawal = await withdrawalModel.findOne({ userId }).sort({ createdAt: -1 });

//         if (!latestWithdrawal) {
//             return res.status(404).json({ message: 'No withdrawal history found for this user' });
//         }

//         // Return only the amount
//         res.status(200).json({ message: 'Latest withdrawal amount retrieved successfully', amount: latestWithdrawal.amount });
//     } catch (error) {
//         console.error('Error retrieving latest withdrawal:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


const getLastWithdrawal = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the latest withdrawal record for the user, sorted by creation date (most recent first)
        const latestWithdrawal = await withdrawalModel.findOne({ userId }).sort({ createdAt: -1 });

        if (!latestWithdrawal) {
            // Return without any message or status when there's no withdrawal history
            return res.status(204).send(); // 204 No Content
        }

        // Return only the amount, without any message
        res.status(200).json({ amount: latestWithdrawal.amount });
    } catch (error) {
        console.error('Error retrieving latest withdrawal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const acceptWithdrawal = async (req, res) => {
    try {
        const { userId } = req.body;

      // Check if userId is a valid ObjectId
      if (!mongoose.isValidObjectId(userId)) {
          return res.status(400).json({ message: 'Invalid user ID, please pass the correct user ID' });
      }

        // Find the user
        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if there is a pending withdrawal
        if (!user.pendingWithdraw || user.pendingWithdraw === 0) {
            return res.status(400).json({ message: 'No pending withdrawal request' });
        }

        const withdrawalAmount = user.pendingWithdraw;

        // Deduct the withdrawal amount from the user's account balance
        user.accountBalance -= withdrawalAmount;
        user.pendingWithdraw = 0; // Clear the pending withdrawal

        // Save the updated user object
        await user.save();

        // Generate a random withdrawal number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10));
            }
            return `#${randomNumbers.join('')}`; 
        }

        // Create a withdrawal record
        const withdrawalRecord = new withdrawalModel({
            userId: userId,
            amount: withdrawalAmount,
            withdrawId: generateRandomNumbers(),
            timestamp: Date.now()
        });

        // Save the withdrawal record
        await withdrawalRecord.save();

        // Create a transaction record
        const depositTransaction = new transationModel({
            type: 'withdrawal',
            amount: withdrawalRecord.amount,
            userId: userId,
            ID: withdrawalRecord.withdrawId
        });
        await depositTransaction.save();

        const usd = withdrawalRecord.amount
        
         // Prepare and send rejection email
         const html = withdrawalAcceptedMail(user, usd);
         const notifyUserMail = {
             email: user.email,
             subject: "Accept withdrawal",
             html
         };
         await sendEmail(notifyUserMail);

        res.status(200).json({ message: 'Withdrawal accepted and processed', remainingBalance: user.accountBalance });
    } catch (error) {
        console.error('Error accepting withdrawal request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const rejectWithdrawal = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID, please pass the correct user ID' });
        }

        // Find the user
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if there is a pending withdrawal
        if (!user.pendingWithdraw || user.pendingWithdraw === 0) {
            return res.status(400).json({ message: 'No pending withdrawal request' });
        }

        const withdrawalAmount = user.pendingWithdraw;

        // Update the rejected withdrawal field
        user.rejectedWithdraw = withdrawalAmount;
        user.pendingWithdraw = 0; // Clear the pending withdrawal

        // Save the updated user object
        await user.save();

        // Prepare and send rejection email
        const html = withdrawalRejectedMail(user, withdrawalAmount);  // Pass the withdrawal amount here
        const notifyUserMail = {
            email: user.email,
            subject: "Withdrawal Request Rejected",
            html
        };
        await sendEmail(notifyUserMail);

        res.status(200).json({ message: 'Withdrawal rejected', rejectedWithdraw: user.rejectedWithdraw });
    } catch (error) {
        console.error('Error rejecting withdrawal request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getTotalWithdrawals = async (req, res) => {
    try {
        const { userId } = req.params;

        // Calculate the total sum of all withdrawals for the user
        const totalWithdrawals = await withdrawalModel.aggregate([
            { $match: { userId } }, // Match all withdrawals for the user
            { $group: { _id: null, total: { $sum: "$amount" } } } // Sum up the 'amount' field
        ]);

        // If no withdrawals, set total to 0
        const totalWithdrawalAmount = totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 0;

        res.status(200).json({
            message: 'Total withdrawals retrieved successfully',
            totalWithdrawalAmount
        });
    } catch (error) {
        console.error('Error retrieving total withdrawals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getLastInvestment = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the latest investment record for the user, sorted by creation date (most recent first)
        const latestInvestment = await investmentModel.findOne({ userId }).sort({ createdAt: -1 });

        if (!latestInvestment) {
            return res.status(404).json({ message: 'No investment history found for this user' });
        }

        res.status(200).json({ message: 'Latest investment retrieved successfully', amount: latestInvestment.amount });
    } catch (error) {
        console.error('Error retrieving latest investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getRunningInvestment = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the running investment records for the user and sum up the amounts
        const runningInvestments = await investmentModel.find({ userId, ongoing: true });
        const totalRunningAmount = runningInvestments.reduce((acc, investment) => acc + investment.amount, 0);

        if (totalRunningAmount === 0) {
            return res.status(404).json({ message: 'No running investment found for this user' });
        }

        res.status(200).json({ message: 'Running investment retrieved successfully', amount: totalRunningAmount });
    } catch (error) {
        console.error('Error retrieving running investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCompletedInvestment = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the completed investment records for the user and sum up the amounts
        const completedInvestments = await investmentModel.find({ userId, ongoing: false });
        const totalCompletedAmount = completedInvestments.reduce((acc, investment) => acc + investment.amount, 0);

        if (totalCompletedAmount === 0) {
            return res.status(404).json({ message: 'No completed investment found for this user' });
        }

        res.status(200).json({ message: 'Completed investment retrieved successfully', amount: totalCompletedAmount });
    } catch (error) {
        console.error('Error retrieving completed investment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getWithdrawalRequests = async (req, res) => {
    try {
        // Find all users with a pending withdrawal amount greater than 0
        const usersWithPendingWithdrawals = await userModel.find({
            pendingWithdraw: { $gt: 0 } // Greater than 0
        });

        // Check if there are any users with pending withdrawals
        if (usersWithPendingWithdrawals.length === 0) {
            return res.status(404).json({ message: 'No pending withdrawal requests found' });
        }

        // Return the list of users with pending withdrawals
        res.status(200).json({ message: 'Pending withdrawal requests retrieved successfully', users: usersWithPendingWithdrawals });
    } catch (error) {
        console.error('Error retrieving withdrawal requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    basicPlan,
    proPlan,
    premiumPlan,
    retirementPlan,
 calculateTotalInvestmentCount,
    calculateTotalProfit,
    getTotalBalance,
    withdrawMoney,
    getOngoingPlans,
    endedPlans,
    getScheduledInvestmentsByUserId,
    withdrawalHistory,
    getTotalWithdraw,
    acceptWithdrawal,
    rejectWithdrawal,
    getTotalWithdrawals,
    getLastWithdrawal,
    getLastInvestment,
    getRunningInvestment,
    getCompletedInvestment,
    getWithdrawalRequests
    
};

