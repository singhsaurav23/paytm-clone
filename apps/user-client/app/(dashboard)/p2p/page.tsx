import { SendCard } from "../../../components/SendCard";
import { P2pTransactions } from "../../../components/P2pTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/orm/client";


async function get_p2pTransactions() {
    const session = await getServerSession(authOptions);

    const senttxns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });

    const receivedtxns = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id)
        }
    });

    // Safely combine both sent and received transactions into a single array, handling null values
    const txns = [
        ...(senttxns || []),  // If senttxns is null, fallback to an empty array
        ...(receivedtxns || []) // If receivedtxns is null, fallback to an empty array
    ];

    // Map over the combined array and return the desired structure
    return txns.map((t: any) => ({
        time: t.timestamp,   // Ensure this field matches your schema
        amount: t.amount,
        hasBeenSent: (t.fromUserId === Number(session?.user?.id)) ? true : false
    }));
}



export default async function () {
     const transactions = await get_p2pTransactions();
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard />
            </div>
            <div>
              <P2pTransactions transactions={transactions} />      
            </div>
        </div>
    </div>
}