import sqlalchemy as sa
import sqlalchemy.orm as orm
import passlib.hash as hash

import database as _database

class User(_database.Base):
    __tablename__ = "users"
    id = sa.Column(sa.Integer, primary_key=True, index=True)
    email = sa.Column(sa.String, unique=True, index=True)
    hashed_password = sa.Column(sa.String)

    personas = orm.relationship("Persona", back_populates="usuario")

    def verify_password(self, password: str):
        return hash.bcrypt.verify(password, self.hashed_password)


class Persona(_database.Base):
    __tablename__ = "personas"
    id = sa.Column(sa.Integer, primary_key=True, index=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"))
    nombre = sa.Column(sa.String, index=True)
    apellidos = sa.Column(sa.String, index=True)
    edad = sa.Column(sa.Integer, index=True)
    fechaNacimiento = sa.Column(sa.String, index=True, default="")

    usuario = orm.relationship("User", back_populates="personas")
