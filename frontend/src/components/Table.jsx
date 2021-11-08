import React, { useContext, useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import PersonaModal from "./PersonaModal";
import { UserContext } from "../context/UserContext";

const Table = () => {
  const [token] = useContext(UserContext);
  const [personas, setPersonas] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);

  const handleUpdate = async (id) => {
    setId(id);
    setActiveModal(true);
  };

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/personas/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("No se pudo eliminar el registro de la persona");
    }

    getPersonas();
  };

  const getPersonas = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/personas", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the personas");
    } else {
      const data = await response.json();
      setPersonas(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getPersonas();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getPersonas();
    setId(null);
  };

  return (
    <>
      <PersonaModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}
      />
      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => setActiveModal(true)}
      >
        Create Persona
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && personas ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Edad</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id}>
                <td>{persona.nombre}</td>
                <td>{persona.apellidos}</td>
                <td>{persona.edad}</td>
                <td>{persona.fechaNacimiento}</td>
                <td>
                  <button
                    className="button mr-2 is-info is-light"
                    onClick={() => handleUpdate(persona.id)}
                  >
                    Actualizar
                  </button>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(persona.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando ...</p>
      )}
    </>
  );
};

export default Table;
