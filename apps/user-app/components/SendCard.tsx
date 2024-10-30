"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2ptransfer";
export function SendCard(){
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return  <div className="h-[90vh]">
        
            <Card title ="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder="Enter phone number" onChange={(value) => setNumber(value)} label="Phone number" />
                    <TextInput placeholder="Enter amount" onChange={(value) => setAmount(value)} label="Amount" />
                        <div className="pt-4 flex justify-center">
                            <Button onClick={async () => {
                                console.log(number, amount)
                                await p2pTransfer(number, Number(amount)*100)
                            }}>Send</Button>
                        </div>
                </div>
            </Card>
        
    </div>
}