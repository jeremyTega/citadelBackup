const express = require ('express')
const router = express.Router()
const {basicPlan,proPlan,premiumPlan,retirementPlan,calculateTotalInvestmentCount,calculateTotalProfit,getTotalBalance,withdrawMoney,
    getOngoingPlans,endedPlans,getScheduledInvestmentsByUserId,withdrawalHistory,
    getTotalWithdraw,rejectWithdrawal,acceptWithdrawal,getTotalWithdrawals,getLastWithdrawal,
    getCompletedInvestment,getRunningInvestment, getLastInvestment,getWithdrawalRequests} = require('../controllers/investmestController')
const {authenticateUser} = require('../middlewares/authorisation')

router.route("/basicPlan/:userId").post(basicPlan)
router.route("/proPlan/:userId").post(authenticateUser,proPlan)
router.route("/premiumPlan/:userId").post(authenticateUser,premiumPlan)
router.route("/retirementPlan/:userId").post(authenticateUser,retirementPlan)
router.route("/calInv/:userId").get(calculateTotalInvestmentCount)
router.route("/calTotalProfits/:userId").get(calculateTotalProfit)
router.route("/totalBalance/:userId").get(getTotalBalance)
router.route("/withdrawMoney/:userId").post(withdrawMoney)
router.route("/withdrawalHistory/:userId").get(withdrawalHistory)
router.route("/getTotalWithdraw/:userId").get(getTotalWithdraw)
router.route("/rejectWithdrawal").post(rejectWithdrawal)
router.route("/acceptWithdrawal").post(acceptWithdrawal)
router.route("/getWithdrawalRequests").get(getWithdrawalRequests)
router.route("/getTotalWithdrawals/:userId").get(getTotalWithdrawals)
router.route("/getLastWithdrawal/:userId").get(getLastWithdrawal)
router.route("/getOngoingPlans/:userId").get(getOngoingPlans)
router.route("/endedPlans/:userId").get(endedPlans)
router.route("/getLastInvestment/:userId").get(getLastInvestment)
router.route("/getRunningInvestment/:userId").get(getRunningInvestment)
router.route("/getCompletedInvestment/:userId").get(getCompletedInvestment)
router.route("/getScheduledInvestments/:userId").get(getScheduledInvestmentsByUserId)


module.exports = router


