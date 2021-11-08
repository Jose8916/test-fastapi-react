from typing import List
import fastapi 
import fastapi.security as security

import sqlalchemy.orm as orm

import services
import schemas 

app = fastapi.FastAPI()


@app.post("/api/users")
async def create_user(
    user: schemas.UserCreate, db: orm.Session = fastapi.Depends(services.get_db)
):
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await services.create_user(user, db)

    return await services.create_token(user)


@app.post("/api/token")
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    user = await services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Credenciales Incorrectas")

    return await services.create_token(user)


@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user


@app.post("/api/personas", response_model=schemas.Persona)
async def create_persona(
    persona: schemas.PersonaCreate,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.create_persona(user=user, db=db, persona=persona)


@app.get("/api/personas", response_model=List[schemas.Persona])
async def get_personas(
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.get_personas(user=user, db=db)


@app.get("/api/personas/{persona_id}", status_code=200)
async def get_persona(
    persona_id: int,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.get_persona(persona_id, user, db)


@app.delete("/api/personas/{persona_id}", status_code=204)
async def delete_persona(
    persona_id: int,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    await services.delete_persona(persona_id, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/personas/{persona_id}", status_code=200)
async def update_persona(
    persona_id: int,
    persona: schemas.PersonaCreate,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    await services.update_persona(persona_id, persona, user, db)
    return {"message", "Successfully Updated"}

@app.get("/api")
async def root():
    return {"message": "Personas"}