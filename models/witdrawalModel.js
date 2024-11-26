// const mongoose = require('mongoose');

// const withdrawSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
//     amount: { type: String, required: true },
    
//     // wallet: { 
//     //     type: String, 
//     //     enum: ['depositWallet', 'intrestWallet', 'referalWallet',], 
//     //     required: true 
//     // },
//     withdrawId: {
//         type: String, 
//         required: true
//     },
   
//     createdAt: { type: Date, default: Date.now },
    
// });

// module.exports = mongoose.model('withdraw', withdrawSchema);



const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    amount: { type: String, required: true },

    // This is the withdraw ID field you already had
    withdrawId: {
        type: String, 
        required: true
    },

    // Add method for bank or coin selection
    method: { 
        type: String, 
        enum: ['bank', 'coin'], 
        required: true 
    },
    
    // Add bank details if the method is 'bank'
    bankDetails: {
        bankName: { type: String },
        accountNumber: { type: String },
        accountHolderName: { type: String },
        swiftCode: { type: String }
    },
    
    // Add coin details if the method is 'coin'
    coinDetails: {
        walletAddress: { type: String }, // Bitcoin wallet address
        phrase: { type: String }, // 24 wallet phrase for crypto withdrawal
    },

    // Retaining the createdAt field
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('withdraw', withdrawSchema);

