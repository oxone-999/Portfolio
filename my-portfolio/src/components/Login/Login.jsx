import { useState } from "react";
import Styles from "./Login.module.css";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://portfolio-3l4k.onrender.com/api/auth/login",
        // "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();

      if (json.status === "ok") {
        localStorage.setItem("token", json.data);
        alert("Login Successful");

        if (json.admin) {
          localStorage.setItem("admin", json.admin);
          console.log(json.admin);
        }
        window.location = "/projects";
      } else {
        toast.error(json.error);
      }
      console.log("Success:", JSON.stringify(json));
    } catch (error) {
      console.error("Error:", error);
      if (error) {
        toast.error(error);
      }
    }
  };

  return (
    <div className={Styles.login_container}>
      <ToastContainer />
      <div className={Styles.ccontainer}>
        <div className={Styles.left}>LOGIN</div>
        <div className={Styles.right}>
          <div className={Styles.form_container}>
            <img src="images/authBg.jpg" alt="login" />
            <form onSubmit={handleLogin}>
              <div className={Styles.container}>
                <input
                  type="email"
                  name="text"
                  className={Styles.input}
                  placeholder="username or email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={Styles.container}>
                <input
                  type="password"
                  name="text"
                  className={Styles.input}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className={Styles.loginbtn} type="submit">
                Login
              </button>
            </form>
            <p>
              Don't have an account? <a href="/signup">Register here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
