import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User, Account } from "next-auth";
import db from "@repo/orm/client";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ user, account }: {
            user: User;
            account: Account | null;
        }) {
            console.log("hi signin");
            if (!user.email) {
                return false;
            }

            await db.merchant.upsert({
                where: {
                    email: user.email
                },
                create: {
                    email: user.email,
                    name: user.name || "",
                    auth_type: account?.provider === "google" ? "Google" : "Github"
                },
                update: {
                    name: user.name || "",
                    auth_type: account?.provider === "google" ? "Google" : "Github"
                }
            });

            return true;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret"
};
