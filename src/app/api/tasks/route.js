import mongoose from "mongoose";

// ----- Task Schema -----
const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// ----- MongoDB Connection -----
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDB() {
  if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable");
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// ----- API Handlers -----
export async function GET(req) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId)
      return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, title } = body;

    if (!userId || !title)
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    const newTask = await Task.create({ userId, title, completed: false });
    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { taskId, completed, title } = body;

    if (!taskId)
      return new Response(JSON.stringify({ error: "Missing taskId" }), { status: 400 });

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...(completed !== undefined && { completed }), ...(title && { title }) },
      { new: true }
    );

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId)
      return new Response(JSON.stringify({ error: "Missing taskId" }), { status: 400 });

    await Task.findByIdAndDelete(taskId);
    return new Response(JSON.stringify({ message: "Task deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
