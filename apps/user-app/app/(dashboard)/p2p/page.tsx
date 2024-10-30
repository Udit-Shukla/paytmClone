import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { SendCard } from "../../../components/SendCard";
import { P2PTransfer } from "../../../components/p2pTransfer";
import { authOptions } from "../../lib/auth";
async function getp2pTransaction () {
    const session =  await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where:{
            fromUserId: Number(session?.user?.id)
        }
    });

    return txns.map(txn=>({
        id:txn.id,
        time:txn.timestamp,
        amount:txn.amount,
        fromUserId:txn.fromUserId,
        toUserId:txn.toUserId
    }))
}
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
export default async function() {
    const session =  await getServerSession(authOptions);
    const transactions = await getp2pTransaction()
    const balance = await getBalance()
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] font-bold pt-8 mb-8"> Send Money</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
            <SendCard/>
        </div>
        <div>
        <BalanceCard amount={balance.amount} locked={balance.locked}/>
         <div className="pt-4">
         <P2PTransfer transactions={transactions} user={session?.user}/>
         </div>
         
        </div>
        </div>
        </div>
    
}