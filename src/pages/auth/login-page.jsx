import styles from "./auth.module.css";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    setLoading(true);
    try {
      const userCredentails = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredentails);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.card__title}>Login account</h2>
        <p className={styles.card__subtitle}>
          Enter your email and password below to login
        </p>
        <form className={styles.card__form} onSubmit={handleSubmit}>
          <div className={styles.form__field}>
            <label className={styles.form__label} htmlFor="email">
              Email*
            </label>
            <input
              className={styles.field__input}
              type="email"
              id="email"
              name="email"
              placeholder="m@example.com"
            />
            <p className={styles.form__error}>&#8203;</p>
          </div>
          <div className={styles.form__field}>
            <label className={styles.field__label} htmlFor="password">
              Password*
            </label>
            <input
              className={styles.field__input}
              type="password"
              id="password"
              name="password"
            />
            <p className={styles.form__error}>&#8203;</p>
          </div>
          <button
            className={styles.form__button}
            type="submit"
            disabled={loading}
          >
            {loading && <ImSpinner2 fontSize={16} />}
            <span>Login</span>
          </button>
        </form>
      </div>
      <span className={styles.card__subtitle}>
        Does not have an Account? <Link to="/signup">sign up here</Link>
      </span>
    </div>
  );
}
