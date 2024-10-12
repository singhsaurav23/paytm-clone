"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [phoneNumber, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="h-[90vh]">
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"PhoneNumber"} label="Phone Number" onChange={(value: string) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value: string) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                       
                              await p2pTransfer(phoneNumber, Number(amount) * 100)
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
        
    </div>
}