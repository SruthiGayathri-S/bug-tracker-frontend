import { Table, Badge, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function IssuesTable({ issues, loading }) {
  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td>{issue.id}</td>
            <td>{issue.title}</td>
            <td>{issue.description}</td>
            <td>
              <Badge bg={issue.status === "Resolved" ? "success" : "warning"}>
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
            <td>{issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : "-"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
