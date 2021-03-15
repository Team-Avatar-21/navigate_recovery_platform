import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";

export default function SignIn() {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const { email, password } = data;
    auth.signin(email, password);
  };
  return (
    <>
      <Navbar />
      <h2>Signin</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={register} />
          <br />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" ref={register} />
          <br />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
