// src/inngest/client.ts
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "Sunshine-next" });

//Inngest Function to save user data to a database

export  const syncUserCreation = inngest.CreateFunction(
    {
        id:'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB
        await User.create(userData)
    }
)

// inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk'
    },
    {
        event: 'clerk/use.updated'
    },
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngest fucntion delete user from the database

export const syncUserDeletion = inngest.createFunction(
    {
        id : 'delete-user-with-clerk'
    }
    {
        event: 'clerk/user.deleted' 
    },
    async ({event}) => {
        const{id} = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)