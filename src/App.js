import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge, Toast, ToastContainer } from "react-bootstrap";
import api from "./api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium"
  });
  const [showContent, setShowContent] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const fetchIssues = async () => {
    try {
      const response = await api.get("/Issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    fetchIssues();
    const timer = setTimeout(() => setShowContent(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const openEditModal = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedIssue({ ...selectedIssue, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/Issues/${selectedIssue.id}`, selectedIssue);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === selectedIssue.id ? selectedIssue : issue
        )
      );
      setShowModal(false);
      showToast("Issue updated successfully!");
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Issues/${id}`);
      setIssues(issues.filter((issue) => issue.id !== id));
      showToast("Issue deleted successfully!");
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleNewIssueChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const handleAddIssue = async () => {
    try {
      const response = await api.post("/Issues", newIssue);
      setIssues([...issues, response.data]);
      setNewIssue({ title: "", description: "", status: "Open", priority: "Medium" });
      showToast("Issue added successfully!");
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  // Search filter
  const filteredIssues = issues.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  // Chart data
  const statusCounts = {
    Open: issues.filter(i => i.status === "Open").length,
    "In Progress": issues.filter(i => i.status === "In Progress").length,
    Resolved: issues.filter(i => i.status === "Resolved").length,
  };

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ["#ffb703","#219ebc","#2a9d8f"],
    }]
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <div className="title-container">
        <h1 className="animated-title">🐞 Bug Tracker</h1>
      </div>

      {/* Dark Mode Toggle */}
      <div className="text-center mb-3">
        <Button variant={darkMode ? "light" : "dark"} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </div>

      {showContent && (
        <div className="content-container">

          {/* Toast */}
          <ToastContainer className="p-3" position="top-end">
            {toastMsg && (
              <Toast show={true} bg="success" onClose={() => setToastMsg("")}>
                <Toast.Body>{toastMsg}</Toast.Body>
              </Toast>
            )}
          </ToastContainer>

          {/* Search */}
          <Form.Control type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-3" />

          {/* Add Issue Form */}
          <div className="mb-4 p-3 border rounded bg-light shadow-sm">
            <h5>Add New Issue</h5>
            <Form className="row g-3 align-items-end">
              <div className="col-md-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={newIssue.title} onChange={handleNewIssueChange} />
              </div>
              <div className="col-md-4">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" name="description" value={newIssue.description} onChange={handleNewIssueChange} />
              </div>
              <div className="col-md-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={newIssue.status} onChange={handleNewIssueChange}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Form.Label>Priority</Form.Label>
                <Form.Select name="priority" value={newIssue.priority} onChange={handleNewIssueChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Select>
              </div>
              <div className="col-md-1">
                <Button variant="success" onClick={handleAddIssue}>Add</Button>
              </div>
            </Form>
          </div>

          {/* Issues Table */}
          <Table striped bordered hover className="shadow-sm animate-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{issue.title}</td>
                  <td>{issue.description}</td>
                  <td>
                    <Badge bg={
                      issue.status === "Resolved" ? "success" :
                      issue.status === "In Progress" ? "warning" :
                      "secondary"
                    }>
                      {issue.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={
                      issue.priority === "High" ? "danger" :
                      issue.priority === "Medium" ? "secondary" :
                      "info"
                    }>
                      {issue.priority}
                    </Badge>
                  </td>
                  <td>{new Date(issue.createdAt).toLocaleString()}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(issue)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(issue.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Chart */}
          <div className="mt-5 p-3 border rounded bg-light shadow-sm">
            <h5>Status Statistics</h5>
            <Pie data={chartData} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIssue && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={selectedIssue.title} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={selectedIssue.description} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={selectedIssue.status} onChange={handleChange}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select name="priority" value={selectedIssue.priority} onChange={handleChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" onClick={handleUpdate}>Update Issue</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
