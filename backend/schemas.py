import pydantic

class _UserBase(pydantic.BaseModel):
    email: str

class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int

    class Config:
        orm_mode = True


class _PersonaBase(pydantic.BaseModel):
    nombre: str
    apellidos: str
    edad: int
    fechaNacimiento: str


class PersonaCreate(_PersonaBase):
    pass


class Persona(_PersonaBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
