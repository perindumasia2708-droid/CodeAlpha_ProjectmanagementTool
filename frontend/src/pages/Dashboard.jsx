import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);
  
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }
}, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);

      res.data.forEach((project) => {
        fetchTasks(project._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(`/tasks/${projectId}`);

      setTasks((prev) => ({
        ...prev,
        [projectId]: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async (e) => {
  e.preventDefault();

  try {
    await API.post("/projects", {
      title,
      description,
    });

    setTitle("");
    setDescription("");

    fetchProjects();
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
      error.message
    );
  }
};
  const updateProject = async (id) => {
  try {
    await API.put(`/projects/${id}`, {
      title: editTitle,
      description: editDescription,
    });

    setEditingProjectId(null);

    fetchProjects();
  } catch (error) {
    console.log(error);
  }
};
  const deleteProject = async (id) => {
  try {
    await API.delete(`/projects/${id}`);
    fetchProjects();
  } catch (error) {
    console.log(error);
  }
};

 const createTask = async (projectId) => {
  console.log("Add Task clicked");
  console.log("Title:", taskTitle);
  console.log("Description:", taskDescription);
  console.log("ProjectId:", projectId);

  try {
    const res = await API.post("/tasks", {
      title: taskTitle,
      description: taskDescription,
      projectId,
    });

    console.log("Task Created:", res.data);

    setTaskTitle("");
    setTaskDescription("");

    fetchTasks(projectId);
  } catch (error) {
    console.log("ERROR:", error);

    alert(
      error?.response?.data?.message ||
      error.message
    );
  }
};

  const updateTaskStatus = async (taskId, projectId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        status,
      });

      fetchTasks(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId, projectId) => {
    try {
      await API.delete(`/tasks/${taskId}`);

      fetchTasks(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div style={{ padding: "30px" }}>
    <h1>Project Management Dashboard 🚀</h1>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
    >
      Logout
    </button>

    <br /><br />

      <h2>Create Project</h2>

      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Project</button>
      </form>

      <hr />

      <h2>My Projects</h2>

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          {editingProjectId === project._id ? (
  <>
    <input
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
    />

    <br /><br />

    <input
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
    />

    <br /><br />

    <button
      onClick={() => updateProject(project._id)}
    >
      Save
    </button>
  </>
) : (
  <>
    <h3>{project.title}</h3>
    <p>{project.description}</p>

    <button
      onClick={() => {
        setEditingProjectId(project._id);
        setEditTitle(project.title);
        setEditDescription(project.description);
      }}
    >
      Edit
    </button>
  </>
)}

          <button onClick={() => deleteProject(project._id)}>
            Delete Project
          </button>

          <hr />

          <h4>Create Task</h4>

          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <br /><br />

          <button
  onClick={() => {
    console.log("BUTTON CLICKED");
    createTask(project._id);
  }}
>
  Add Task
</button>

          <hr />

          <h4>Tasks</h4>

          {tasks[project._id]?.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h5>{task.title}</h5>
              <p>{task.description}</p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <button
                onClick={() =>
                  updateTaskStatus(
                    task._id,
                    project._id,
                    "Todo"
                  )
                }
              >
                Todo
              </button>

              <button
                onClick={() =>
                  updateTaskStatus(
                    task._id,
                    project._id,
                    "In Progress"
                  )
                }
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  updateTaskStatus(
                    task._id,
                    project._id,
                    "Done"
                  )
                }
              >
                Done
              </button>

              <button
                onClick={() =>
                  deleteTask(task._id, project._id)
                }
              >
                Delete Task
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;