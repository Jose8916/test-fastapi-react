import React, { useEffect, useState } from "react";

const PersonaModal = ({ active, handleModal, token, id, setErrorMessage }) => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  useEffect(() => {
    const getPersonas = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/personas/${id}`, requestOptions);

      if (!response.ok) {
        setErrorMessage("No se pudo obtener las personas");
      } else {
        const data = await response.json();
        setNombre(data.nombre);
        setApellidos(data.apellidos);
        setEdad(data.edad);
        setFechaNacimiento(data.fechaNacimiento);
      }
    };

    if (id) {
      getPersonas();
    }
  }, [id, token]);

  const cleanFormData = () => {
    setNombre("");
    setApellidos("");
    setEdad("");
    setFechaNacimiento("");
  };

  const handleCreatePersona = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nombre: nombre,
        apellidos: apellidos,
        edad: edad,
        fechaNacimiento: fechaNacimiento,
      }),
    };
    const response = await fetch("/api/personas", requestOptions);
    if (!response.ok) {
      setErrorMessage("Algo fallo al crear la persona");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  const handleUpdatePersona = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nombre: nombre,
        apellidos: apellidos,
        edad: edad,
        fechaNacimiento: fechaNacimiento,
      }),
    };
    const response = await fetch(`/api/personas/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Hubo una falla al momento de actualizar la persona");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {id ? "Update Persona" : "Create Persona"}
          </h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Nombre</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Apellidos</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Ingrese apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Edad</label>
              <div className="control">
                <input
                  type="number"
                  placeholder="Ingrese la edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha de Nacimiento</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Ingrese fecha de nacimiento"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {id ? (
            <button className="button is-info" onClick={handleUpdatePersona}>
              Actualizar
            </button>
          ) : (
            <button className="button is-primary" onClick={handleCreatePersona}>
              Crear
            </button>
          )}
          <button className="button" onClick={handleModal}>
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PersonaModal;
