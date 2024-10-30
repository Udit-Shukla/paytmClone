import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { AddMoneyCard } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session =  await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where:{
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount:balance?.amount || 0,
        locked:balance?.locked || 0
    }
}

async function getOnRampTransaction () {
    const session =  await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where:{
            userId: Number(session?.user?.id)
        }
    });

    return txns.map(txn=>({
        time:txn.startTime,
        amount:txn.amount,
        status:txn.status,
        provider:txn.provider
    }))   
}

export default async function (){ 
    const balance = await getBalance()
    const transactions = await getOnRampTransaction()

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] font-bold pt-8 mb-8">Transfer</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
            <AddMoneyCard/>
        </div>
        <div>
            <BalanceCard amount={balance.amount} locked={balance.locked}/>
            <div className="pt-4">
                <OnRampTransactions transactions={transactions}/>
            </div>
        </div>
        </div>
    </div>
}