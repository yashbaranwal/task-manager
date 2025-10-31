
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const projectsSnapshot = await db.collection('projects').get();
    const projects = [];
    for (const doc of projectsSnapshot.docs) {
      const projectData = doc.data();
      
      const tasksSnapshot = await db.collection('projects').doc(doc.id).collection('tasks').get();
      const tasks = tasksSnapshot.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() }));

      projects.push({
        id: doc.id,
        name: projectData.name,
        description: projectData.description,
        tasks,
      });
    }
    return new Response(JSON.stringify(projects), {
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
    const { name, description } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: 'Project name required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const projectRef = await db.collection('projects').add({ name, description });
    const projectDoc = await projectRef.get();

    return new Response(JSON.stringify({ id: projectRef.id, ...projectDoc.data() }), {
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
