import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../utils/api";
import { Navigate, useNavigate } from "react-router-dom";

const RegisterPage = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secPassword, setSecPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const checkEmailExists = async (email) => {
    try {
      const response = await api.post("/user/check", { email });
      return response.status === 200 && response.data.user;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name || !email || !password) {
        throw new Error("이름, 이메일, 비밀번호는 필수 입력 항목입니다.");
      }

      // 이메일 중복 확인
      if (email !== "") {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          throw new Error("이미 등록된 이메일입니다.");
        }
      }

      if (password !== secPassword) {
        throw new Error("패스워드가 일치하지 않습니다. 다시 입력해주세요");
      }

      const response = await api.post("/user", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        setName("");
        setPassword("");
        setEmail("");
        setSecPassword("");
        navigate("/login");
      } else {
        throw new Error(response.data.error);
      }

      console.log("responseresponse", response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="display-center">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Form className="login-box" onSubmit={handleSubmit}>
        <h1>회원가입</h1>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="string"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicSecPassword">
          <Form.Label>re-enter the password</Form.Label>
          <Form.Control
            type="password"
            placeholder="re-enter the password"
            value={secPassword}
            onChange={(event) => setSecPassword(event.target.value)}
          />
        </Form.Group>

        <Button className="button-primary" type="submit">
          회원가입
        </Button>
      </Form>
    </div>
  );
};

export default RegisterPage;
