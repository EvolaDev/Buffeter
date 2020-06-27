import React, { useState, useEffect } from 'react';
import '../style/AuthPage.css';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';

export const AuthPage = () => {
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (error) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Buffeter</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div className="input-wrapper">
              <div className="input-field">
                <input
                  placeholder="Type your email"
                  id="email"
                  type="text"
                  name="email"
                  className="auth-input"
                  onChange={changeHandler}
                ></input>
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input
                  placeholder="Type your password"
                  id="password"
                  type="password"
                  name="password"
                  className="auth-input"
                  onChange={changeHandler}
                ></input>
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="login-button btn yellow darken-4">Login</button>
            <button
              className="register-button btn grey lighten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
