from django.test import TestCase
from rest_framework import serializers
from app.usuarios.serializer import UserSerializer
from app.usuarios.models import User

class CPFValidationTest(TestCase):
    def setUp(self):
        self.base_user_data = {
            'username': 'testuser',
            'idade': '25',
            'sexo': 'M',
            'profissao': 'Developer',
            'rua': 'Test Street',
            'bairro': 'Test Bairro',
            'numero': 123,
            'email': 'test@example.com',
            'password': 'password123',
            'tipo_de_usuario': 'locatario'
        }

    def test_valid_cpf(self):
        data = self.base_user_data.copy()
        data['cpf'] = '52998224725'
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_cpf_check_digit(self):
        data = self.base_user_data.copy()
        data['cpf'] = '52998224726' # Invalid check digit
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cpf', serializer.errors)
        self.assertEqual(serializer.errors['cpf'][0], "CPF inválido.")

    def test_invalid_cpf_repeating_digits(self):
        data = self.base_user_data.copy()
        data['cpf'] = '11111111111'
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cpf', serializer.errors)
        self.assertEqual(serializer.errors['cpf'][0], "CPF inválido.")

    def test_invalid_cpf_wrong_length(self):
        data = self.base_user_data.copy()
        data['cpf'] = '1234567890'
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cpf', serializer.errors)
        self.assertEqual(serializer.errors['cpf'][0], "CPF deve ter 11 dígitos.")

    def test_cpf_with_formatting(self):
        data = self.base_user_data.copy()
        data['cpf'] = '529.982.247-25'
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        # Check if it was cleaned
        self.assertEqual(serializer.validated_data['cpf'], '52998224725')

class UserRegistrationViewTest(TestCase):
    def setUp(self):
        self.registration_data = {
            'username': 'viewuser',
            'cpf': '52998224725',
            'idade': '25',
            'sexo': 'M',
            'profissao': 'Tester',
            'rua': 'View St',
            'bairro': 'View Bairro',
            'numero': 456,
            'email': 'view@example.com',
            'password': 'password123',
            'tipo_de_usuario': 'locatario'
        }

    def test_registration_returns_tokens(self):
        from django.urls import reverse
        from rest_framework.test import APIClient
        client = APIClient()
        url = reverse('register')
        response = client.post(url, self.registration_data, format='json')
        
        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('usuario', response.data)
        self.assertEqual(response.data['usuario']['username'], 'viewuser')


