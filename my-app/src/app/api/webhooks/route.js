import { verifyWebhook } from "@clerk/nextjs/webhooks";
import User from "@/models/User";
import connectDB from "@/lib/db";
export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);
    const { email_addresses, first_name, last_name, id: clerkId } = evt.data;
    const email = email_addresses[0].email_address;
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 200 });
    }
    const createUser = new User({
      name: `${first_name} ${last_name}`,
      email,
      clerkId,
    });
    await createUser.save();
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}