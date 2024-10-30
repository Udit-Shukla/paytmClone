import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
    // upsert means create if not exists, update if exists
    const alice = await prisma.user.upsert({
        where :{number:'1111111111'},
        update :{},
        create :{
            number:'1111111111',
            name:'Alice',
            password:await bcrypt.hash('alice',10),
            balance:{
                create:{
                    amount:1000,
                    locked:0,
            }
        },
        onRampTransactions:{
            create:{
                startTime:new Date(),
                status:'Success',
                amount:2000,
                token:"token__1",
                provider:"HDFC Bank"
        },
    },
},
})

const bob = await prisma.user.upsert({
    where :{number:'2222222222'},
    update :{},
    create :{
        number:'2222222222',
        name:'Bob',
        password:await bcrypt.hash('bob',10),
        balance:{
            create:{
                amount:1000,
                locked:0,
        }
    },
    onRampTransactions:{
        create:{
            startTime:new Date(),
            status:'Success',
            amount:2000,
            token:"token__1",
            provider:"HDFC Bank"
    },
},
},
});
    console.log({alice,bob})
}

main().then(async()=>{
    await prisma.$disconnect()
}).catch(async(e)=>{
    console.log(e)
    await prisma.$disconnect()
})