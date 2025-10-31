'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const TASK_STATUSES = ['Todo', 'In Progress', 'Done'];

export default function Dashboard() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;
  
  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (res.ok) {
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } else {
      alert('Failed to load projects: ' + data.error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle || !selectedProjectId) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: selectedProjectId,
        title: newTaskTitle,
      }),
    });
    if (res.ok) {
      setNewTaskTitle('');
      fetchProjects();
    } else {
      const data = await res.json();
      alert('Failed to add task: ' + data.error);
    }
  };

  const openEditDialog = (task) => {
    setEditTask(task);
    setEditTaskTitle(task.title);
    setEditTaskStatus(task.status);
  };

  const handleUpdateTask = async () => {
    if (!editTask || !selectedProjectId) return;
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: selectedProjectId,
        taskId: editTask.id,
        title: editTaskTitle,
        status: editTaskStatus,
      }),
    });
    if (res.ok) {
      fetchProjects();
      setEditTask(null);
    } else {
      const data = await res.json();
      alert('Failed to update task: ' + data.error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!selectedProjectId) return;
    const res = await fetch(`/api/tasks?projectId=${selectedProjectId}&taskId=${taskId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchProjects();
    } else {
      const data = await res.json();
      alert('Failed to delete task: ' + data.error);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Container sx={{ mt: 4, mb: 4, pt:4, bgcolor: 'background.paper' }}>
      <Typography variant="h3" gutterBottom color='black'>
        Project Dashboard
      </Typography>

      <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item size={{xs:12,md:3}} key={project.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Tasks
                </Typography>
                {project.tasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No tasks available.
                  </Typography>
                ) : (
                  <List dense>
                    {project.tasks.map((task) => (
                      <ListItem key={task.id}>
                        <ListItemText
                          primary={task.title}
                          secondary={`Status: ${task.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

      <FormControl fullWidth margin="normal">
        <InputLabel id="project-select-label">Select Project</InputLabel>
        <Select
          labelId="project-select-label"
          value={selectedProjectId}
          label="Select Project"
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedProject && (
        <>
          <Box component={Paper} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h5">{selectedProject.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedProject.description}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Tasks
            </Typography>

            <List>
              {selectedProject.tasks.length === 0 && (
                <Typography color="text.secondary">No tasks added yet.</Typography>
              )}
              {selectedProject.tasks.map((task) => (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <>
                      <IconButton edge="end" onClick={() => openEditDialog(task)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={task.title}
                    secondary={`Status: ${task.status}${task.dueDate ? `, Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', mt: 2 }} gap={2}>
              <TextField
                label="New Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddTask} sx={{whiteSpace:"nowrap", width:200}}>
                Add Task
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onClose={() => setEditTask(null)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={editTaskStatus}
              label="Status"
              onChange={(e) => setEditTaskStatus(e.target.value)}
            >
              {TASK_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTask(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateTask}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
