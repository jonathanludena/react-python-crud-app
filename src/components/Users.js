import { useState, useEffect, useRef } from "react";

const Users = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");

  const [users, setUsers] = useState([]);
  const inputName = useRef(null);
  const [editing, setEditing] = useState(false);

  const API = process.env.REACT_APP_API;

  useEffect(() => {
    getUsers();
  });

  const cleanForm = () => {
    inputName.current.focus();
    setName("");
    setEmail("");
    setPassword("");
    setId("");
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editing) {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();
      alert(`User created with id: ${data}`);
    } else {
      const res = await fetch(`${API}/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data) {
        alert(data.message);
      }
    }

    cleanForm();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();

    setUsers(data);
  };

  const deleteUser = async (id) => {
    const userRes = window.confirm("Are your sure you want to delete it?");
    if (userRes) {
      const res = await fetch(`${API}/user/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/user/${id}`);
    const user = await res.json();

    setEditing(true);
    setId(id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              ref={inputName}
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              placeholder="name"
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              placeholder="email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-control"
              placeholder="password"
            />
          </div>
          <button className="btn btn-primary btn-block">
            {editing ? "Modify User" : "Create User"}
          </button>
        </form>
      </div>
      <div className="col-md-8">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={() => editUser(user._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
