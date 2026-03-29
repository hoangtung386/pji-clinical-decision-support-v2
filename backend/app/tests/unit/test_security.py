from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        raw = "my_secure_password"
        hashed = hash_password(raw)
        assert hashed != raw
        assert verify_password(raw, hashed) is True

    def test_wrong_password(self):
        hashed = hash_password("correct_password")
        assert verify_password("wrong_password", hashed) is False


class TestJwtToken:
    def test_create_and_decode(self):
        token = create_access_token("42", "surgeon")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "42"
        assert payload["role"] == "surgeon"

    def test_invalid_token(self):
        assert decode_access_token("invalid.token.here") is None
