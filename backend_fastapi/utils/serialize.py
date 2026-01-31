"""Make MongoEngine/BSON structures JSON-serializable."""
from bson import ObjectId
from datetime import datetime, date


def _serialize_value(v):
    if v is None:
        return None
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, (datetime, date)):
        return v.isoformat() if hasattr(v, "isoformat") else str(v)
    if isinstance(v, dict):
        return {k: _serialize_value(x) for k, x in v.items()}
    if isinstance(v, list):
        return [_serialize_value(x) for x in v]
    return v


def doc_to_dict(doc):
    """Convert MongoEngine document to JSON-serializable dict."""
    if doc is None:
        return None
    d = doc.to_mongo().to_dict()
    # Remove __v if present (Mongoose adds it; MongoEngine strict mode rejects it)
    d.pop("__v", None)
    return _serialize_value(d)
