"use client";

import { useFormState } from "react-dom";

const initialState = { error: null };

export default function AuthSection({ isAuthed, loginAction, signupAction, logoutAction }) {
  if (isAuthed) {
    return (
      <section className="card">
        <h2>Signed in</h2>
        <p className="helper">Your session is stored in an httpOnly cookie.</p>
        <form action={logoutAction}>
          <button type="submit" className="danger">Log out</button>
        </form>
      </section>
    );
  }

  const [loginState, loginFormAction] = useFormState(loginAction, initialState);
  const [signupState, signupFormAction] = useFormState(signupAction, initialState);

  return (
    <section className="grid two">
      <div className="card">
        <h2>Login</h2>
        <form action={loginFormAction} className="grid">
          <div>
            <label htmlFor="login-email">Email</label>
            <input id="login-email" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" required />
          </div>
          <button type="submit" className="primary">Sign in</button>
          {loginState?.error ? <p className="error">{loginState.error}</p> : null}
        </form>
      </div>

      <div className="card">
        <h2>Sign up</h2>
        <form action={signupFormAction} className="grid">
          <div>
            <label htmlFor="signup-name">Name</label>
            <input id="signup-name" name="name" type="text" placeholder="Optional" />
          </div>
          <div>
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" name="password" type="password" required />
          </div>
          <button type="submit" className="primary">Create account</button>
          {signupState?.error ? <p className="error">{signupState.error}</p> : null}
        </form>
      </div>
    </section>
  );
}
