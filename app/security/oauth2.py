from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.security.token import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    print("=" * 60)

    print("Credentials:", credentials)

    if credentials is None:
        print("NO TOKEN RECEIVED")
        raise HTTPException(status_code=401)

    print("TOKEN:", credentials.credentials)

    try:

        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("PAYLOAD:", payload)

        return {
            "email": payload["sub"],
            "role": payload["role"]
        }

    except JWTError as e:

        print("=" * 60)
        print("JWT ERROR")
        print(e)

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    except Exception as e:

        print("=" * 60)
        print("OTHER ERROR")
        print(type(e))
        print(e)

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )