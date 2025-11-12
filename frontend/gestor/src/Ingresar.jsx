import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
  const { login, error } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>

      {open && (
        <dialog open>
          <article>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
              <fieldset>
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Contraseña:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                {error && <p style={{ color: "red" }}>{error}</p>}
              </fieldset>

              <footer>
                <div className="grid">
                  <input
                    type="button"
                    className="secondary"
                    value="Cancelar"
                    onClick={() => setOpen(false)}
                  />
                  <input type="submit" value="Ingresar" />
                </div>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  );
};

