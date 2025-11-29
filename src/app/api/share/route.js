import mongoose from "mongoose";
import { NextResponse } from "next/server";

// ⭐ DB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "selfie" });
  }
}

// ⭐ Schema
const messageSchema = new mongoose.Schema(
  {
    fromEmail: String,
    toEmail: String,
    text: String,
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

// ⭐ POST /api/share → send msg
export async function POST(req) {
  await connectDB();

  const { fromEmail, toEmail, text } = await req.json();

  const msg = await Message.create({ fromEmail, toEmail, text });
  return NextResponse.json({ success: true, msg });
}

// ⭐ GET /api/share → fetch all messages
export async function GET() {
  await connectDB();

  const messages = await Message.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, messages });
}
