import fastapi 
import fastapi.security as security
import jwt
import sqlalchemy.orm as orm
import passlib.hash as hash

import database 
import models  
import schemas

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


def create_database():
    return database.Base.metadata.create_all(bind=database.engine)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: orm.Session):
    return db.query(models.User).filter(models.User.email == email).first()


async def create_user(user: schemas.UserCreate, db: orm.Session):
    user_obj = models.User(
        email=user.email, hashed_password=hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(email: str, password: str, db: orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)

    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: orm.Session = fastapi.Depends(get_db),
    token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Correo o password no validado"
        )

    return schemas.User.from_orm(user)


async def create_persona(user: schemas.User, db: orm.Session, persona: schemas.PersonaCreate):
    persona = models.Persona(**persona.dict(), user_id=user.id)
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return schemas.Persona.from_orm(persona)


async def get_personas(user: schemas.User, db: orm.Session):
    personas = db.query(models.Persona).filter_by(user_id=user.id)

    return list(map(schemas.Persona.from_orm, personas))


async def _persona_selector(persona_id: int, user: schemas.User, db: orm.Session):
    persona = (
        db.query(models.Persona)
        .filter_by(user_id=user.id)
        .filter(models.Persona.id == persona_id)
        .first()
    )

    if persona is None:
        raise fastapi.HTTPException(status_code=404, detail="Persona does not exist")

    return persona


async def get_persona(persona_id: int, user: schemas.User, db: orm.Session):
    persona = await _persona_selector(persona_id=persona_id, user=user, db=db)

    return schemas.Persona.from_orm(persona)


async def delete_persona(persona_id: int, user: schemas.User, db: orm.Session):
    persona = await _persona_selector(persona_id, user, db)

    db.delete(persona)
    db.commit()

async def update_persona(persona_id: int, persona: schemas.PersonaCreate, user: schemas.User, db: orm.Session):
    persona_db = await _persona_selector(persona_id, user, db)

    persona_db.nombre = persona.nombre
    persona_db.apellidos = persona.apellidos
    persona_db.edad = persona.edad
    persona_db.fechaNacimiento = persona.fechaNacimiento

    db.commit()
    db.refresh(persona_db)
    return schemas.Persona.from_orm(persona_db)

