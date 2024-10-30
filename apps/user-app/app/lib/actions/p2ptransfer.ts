"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function p2pTransfer (to:string,amount:number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id

    if(!from){
        return {
            message :"Error while sending "
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });


    if(!toUser){
        return {
            message :"User not found  "
        }
    }
    console.log("toUser",toUser)

    await prisma.$transaction(async (txn)=>{
        await txn.$queryRaw `SELECT * from "Balance" where "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await txn.balance.findUnique({
            where:{
                userId:Number(from)
            },
        })

        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient balance");
        }

        await txn.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await txn.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });

          // making entry in db 
          await txn.p2pTransfer.create({
            data:{
                fromUserId:Number(from),
                toUserId:toUser.id,
                amount:amount,
                timestamp:new Date()
            }
          })
    })
}