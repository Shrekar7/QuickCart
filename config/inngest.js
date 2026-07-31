// src/inngest/client.ts

import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

export const inngest = new Inngest({
  id: "Sunshine-next",
});

// Inngest Function to save user data to database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      imageUrl: image_url,
    };

    await connectDB();

    const existingByEmail = await User.findOne({ email: userData.email });

    if (existingByEmail && existingByEmail._id !== id) {
      console.warn(
        `Skipping create: email ${userData.email} already exists under a different id (${existingByEmail._id}), new id was ${id}`
      );
      return { success: false, reason: "email_conflict" };
    }

    await User.findByIdAndUpdate(id, userData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    return { success: true };
  }
);

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest Function to delete user from database once deleted
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// function to create the user's order in database

export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 25, 
            timeout: '5s'
        }
    },
    {event: 'order/created'},
    async ({events}) => {

        const orders = events.map((event)=> {
            return{
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date : event.data.date
            }
        })

        await connectDB()
        await Order.insertMany(orders)

        return {success: true, processed: orders.length};

    }
)