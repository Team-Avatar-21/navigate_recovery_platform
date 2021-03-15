import { useDebugValue, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";

export default function SignIn() {
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  const [successMessage, setSuccessMessage] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const showSuccessMessage = () => {
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const onSubmit = (data) => {
    const { email, password } = data; //{email:value,}
    const displayName = data.name;
    axios
      .post("/api/user/add_user", {
        email,
        password,
        displayName,
        token: auth.authState.tokenResult.token,
      })
      .then((res) => {
        console.log(res);
        showSuccessMessage();
        reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (!admin) {
    return <>Access Denied</>;
  }
  return (
    <>
      <Navbar />
      <h2>Add users</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="name" name="name" id="name" ref={register} />
          <br />
        </div>
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
        {successMessage ? <p>Success</p> : ""}
      </form>
    </>
  );
}
