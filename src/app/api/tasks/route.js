import { db } from '@/lib/firebaseAdmin';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'projectId query param required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tasksSnapshot = await db.collection('projects').doc(projectId).collection('tasks').get();
    const tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const { projectId, title, status, dueDate } = await req.json();
    if (!projectId || !title) {
      return new Response(JSON.stringify({ error: 'projectId and title are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const task = {
      title,
      status: status || 'Todo',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    const taskRef = await db.collection('projects').doc(projectId).collection('tasks').add(task);

    return new Response(JSON.stringify({ id: taskRef.id, ...task }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  try {
    const { projectId, taskId, title, status, dueDate } = await req.json();
    if (!projectId || !taskId) {
      return new Response(JSON.stringify({ error: 'projectId and taskId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    await db.collection('projects').doc(projectId).collection('tasks').doc(taskId).update(updateData);

    return new Response(JSON.stringify({ message: 'Task updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const taskId = url.searchParams.get('taskId');

    if (!projectId || !taskId) {
      return new Response(JSON.stringify({ error: 'projectId and taskId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.collection('projects').doc(projectId).collection('tasks').doc(taskId).delete();

    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
