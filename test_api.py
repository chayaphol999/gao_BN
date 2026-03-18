import requests
import json

url = "http://127.0.0.1:3001/users/register"
data = {
    "email": "test@example.com",
    "password": "password123",
    "name": "Khun Test"
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Body: {response.text}")
