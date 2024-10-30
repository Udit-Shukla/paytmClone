import db from "@repo/db/client";
import express from "express";
const app = express();

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.post("/hdfcWebhook", async  (req, res) => {
    // TODO: Add zod validation here 
    // Check if the request actually came from a bank, use webhook secret here 
    const paymentInformation ={
        token: req.body.token,
        amount: req.body.amount,
        userId: req.body.userId,
    };

    // we require a transaction so that both actions can happen in one go
    try{

        // TODO: Add a check to see if the transaction is already processed

        const check = await db.onRampTransaction.findUnique({
            where:{
                token: paymentInformation.token
            }
        });

        console.log(check);
        if(check?.status !== "Processing"){
            res.status(411).json({
                message: "Transaction already processed"
            })
            return;
        }

        await db.$transaction([
            db.balance.update({
                where:{
                    userId: paymentInformation.userId
                },
                data:{
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),

            db.onRampTransaction.update({
                where:{
                    token: paymentInformation.token
                },
                data:{
                    status: "Success"
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

});

app.listen(3003, () => {
    console.log("Server is running on port 3003");
});