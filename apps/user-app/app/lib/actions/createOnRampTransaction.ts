"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function  createOnRampTransaction(amount:number,provider:string) {
    const session =  await getServerSession(authOptions);
    const userId = session?.user?.id
    const token = Math.random().toString();
    if(!userId) {
        return {
            message:"Unauthenticated request",
        }
    }

     await prisma.onRampTransaction.create({
        data:{
            userId:Number(userId),
            amount:amount*100,
            provider:provider,
            status:"Processing",
            startTime:new Date(),
            token:token // token generated by the provider to idenfify the transaction
        }
     })

     return {
        message:"On ramp transaction created successfully",
     }
}