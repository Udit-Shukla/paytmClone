import { Card } from "@repo/ui/card";

export const P2PTransfer = ({
  transactions,user
}: {
    user:any
  transactions: {
    id: number;
    time: Date;
    amount: number;
    fromUserId: number;
    toUserId: number;
  }[];
}) => {
    if (!transactions.length) {
      return (
        <div className="text-center pb-8 pt-8">No recent transactions</div>
      );
    }
 
    return (
        <Card title="Recent Transfers ">
            <div className="pt-2 flex flex-col gap-2"> 
                {transactions.map((txn)=>(
                    <div key={txn.id} className="flex justify-between flex-row  ">
                        <div>
                            <div className="text-sm">Sent </div>
                            <div className="text-slate-600 text-xs">
                                {txn.time.toDateString()}
                            </div>
                           
                        </div>
                        <div className="text-sm">
                           - Rs {txn.amount / 100}
                            </div>
                        </div>
                ))}
            </div>
        </Card>
    );
};