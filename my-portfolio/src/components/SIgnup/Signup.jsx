import React, { useState } from "react";
import Styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AvatarGenerator } from "random-avatar-generator";
import Lottie from "lottie-react";
import Loading from "../../lottie/loading.json";

export default function Signup() {
  const generator = new AvatarGenerator();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://portfolio-3l4k.onrender.com/api/auth/signup",
        // "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password,
            avatar: generator.generateRandomAvatar(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();

      if (json.status === "ok") {
        setLoading(false);
        history("/login");
      } else {
        toast.error(json.error);
      }

      console.log("Success:", JSON.stringify(json));
    } catch (error) {
      if (error) {
        toast.error(error);
      }
    }
  };

  return (
    <div className={Styles.login_container}>
      <ToastContainer />
      {loading ? (
        <Lottie animationData={Loading} loop={true} />
      ) : (
        <div className={Styles.ccontainer}>
          <div className={Styles.right}>
            <div className={Styles.form_container}>
              <img src="images/authBg.jpg" alt="register" />
              <form onSubmit={handleSubmit}>
                <div className={Styles.container}>
                  <input
                    type="text"
                    name="text"
                    className={Styles.input}
                    placeholder="username"
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className={Styles.container}>
                  <input
                    type="email"
                    name="text"
                    className={Styles.input}
                    placeholder="email"
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
                  Register
                </button>
              </form>
              <p>
                Already have an account? <a href="/login">Login here</a>.
              </p>
            </div>
          </div>
          <div className={Styles.left}>Register</div>
        </div>
      )}
    </div>
  );
}
