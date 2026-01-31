"""Standard API response helpers."""
from fastapi import status
from fastapi.responses import JSONResponse
from bson import json_util
import json


def success(message: str):
    return JSONResponse(
        content={"message": message},
        status_code=status.HTTP_200_OK,
    )


def result(data, message: str = None):
    content = {"result": json.loads(json_util.dumps(data))}
    if message is not None:
        content["message"] = message
    return JSONResponse(content=content, status_code=status.HTTP_200_OK)


def error(message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
    return JSONResponse(
        content={"detail": message},
        status_code=status_code,
    )


def un_authorized(message: str):
    return JSONResponse(
        content={"detail": message},
        status_code=status.HTTP_401_UNAUTHORIZED,
        headers={"Access-Control-Allow-Origin": "*"},
    )
