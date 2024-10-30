import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../lib/firebase";
import styles from "./auth.module.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { validationSuccess } from "../../utils/auth";
import { ImSpinner2 } from "react-icons/im";
import { useToast } from "../../components/shared/toast-provider";

export function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const showToast = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const errors = validationSuccess({
      name,
      email,
      password,
      confirmPassword,
    });
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);

    try {
      const userCredentails = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredentails.user, {
        displayName: name,
      });

      await sendEmailVerification(userCredentails.user, {
        url: window.location.origin + "/login",
      });
      showToast({
        message: "Verification email sent successfully!",
        status: "success",
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  function resetFieldError(fieldName) {
    console.log(fieldName);
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: undefined });
    }
  }

  console.log("errors obj", errors);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.card__title}>Create an account</h2>
        <p className={styles.card__subtitle}>
          Enter your email below to create your account
        </p>
        <form className={styles.card__form} onSubmit={handleSubmit}>
          <div className={styles.form__field}>
            <label className={styles.field__label} htmlFor="email">
              Name*
            </label>
            <input
              required
              className={styles.field__input}
              type="text"
              id="name"
              name="name"
              onKeyDown={(event) => {
                resetFieldError(event.target.name);
              }}
            />
            <p className={styles.form__error}>
              {errors.name ? errors.name : ""} &#8203;
            </p>
          </div>
          <div className={styles.form__field}>
            <label className={styles.form__label} htmlFor="email">
              Email*
            </label>
            <input
              required
              className={styles.field__input}
              type="email"
              id="email"
              name="email"
              placeholder="m@example.com"
              onKeyDown={(event) => {
                resetFieldError(event.target.name);
              }}
            />
            <p className={styles.form__error}>
              {errors.email ? errors.email : ""} &#8203;
            </p>
          </div>
          <div className={styles.form__field}>
            <label className={styles.field__label} htmlFor="password">
              Password*
            </label>
            <input
              required
              className={styles.field__input}
              type="password"
              id="password"
              name="password"
              onKeyDown={(event) => {
                resetFieldError(event.target.name);
              }}
            />
            <p className={styles.form__error}>
              {errors.password ? errors.password : ""} &#8203;
            </p>
          </div>
          <div className={styles.form__field}>
            <label className={styles.field__label} htmlFor="confirmPassword">
              Confirm Password*
            </label>
            <input
              className={styles.field__input}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onKeyDown={(event) => {
                resetFieldError(event.target.name);
              }}
            />
            <p className={styles.form__error}>
              {errors.confirmPassword ? errors.confirmPassword : ""} &#8203;
            </p>
          </div>
          <button
            className={styles.form__button}
            type="submit"
            disabled={loading}
          >
            {loading && <ImSpinner2 fontSize={16} />}
            <span>Create Account</span>
          </button>
        </form>
      </div>
      <span className={styles.card__subtitle}>
        Already have an Account? <Link to="/login">login here</Link>
      </span>
    </div>
  );
}
