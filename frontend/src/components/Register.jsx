import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassowrd, setConfirmationPassowrd] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    
    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, hashed_password: password}),
        };

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassowrd && password.length > 5) {
            submitRegistration();
        } else {
            setErrorMessage("Verifique que la claves claves sean iguale y que sea de mas de 5 caracteres")
        };

    }

    return (
        <div className="column">
         <form className="box" onSubmit={handleSubmit}>
          <h1 className="title has-text-centered">Registro Usuario</h1>
           <div className="field">
            <label className="label">Email</label>
             <div className="control">
              <input 
                type="email" 
                placeholder="Ingrese Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input"
                required
              />
             </div>
           </div>

           <div className="field">
            <label className="label">Password</label>
             <div className="control">
              <input 
                type="password" 
                placeholder="Ingrese Clave" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input"
                required
              />
             </div>
           </div>

           <div className="field">
            <label className="label">Confirmar Clave</label>
             <div className="control">
              <input 
                type="password" 
                placeholder="Ingrese Clave" 
                value={confirmationPassowrd} 
                onChange={(e) => setConfirmationPassowrd(e.target.value)} 
                className="input"
                required
              />
             </div>
           </div>
           
           <ErrorMessage message={errorMessage} />
            
            <button className="button is-primary" type="submit">
                Registrar
            </button>
         
         </form>
        </div>

    );

};

export default Register