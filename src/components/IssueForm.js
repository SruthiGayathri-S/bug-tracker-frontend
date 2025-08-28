import React, { useState } from "react";

export default function IssueForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title,
      description: desc,
      priority,
      assignedTo,
    });
    setTitle("");
    setDesc("");
    setPriority("Low");
    setAssignedTo("");
  };

  return (
    <form onSubmit={submit} className="card p-3 mb-3 shadow-sm">
      <h5>Add Issue</h5>
      <input
        className="form-control mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="row g-2 mb-2">
        <div className="col">
          <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="col">
          <input className="form-control" placeholder="Assign to (name/email)" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary">Add Issue</button>
    </form>
  );
}
