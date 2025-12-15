import unittest
from unittest.mock import patch
from app import create_app

class TestZenQuotesIntegration(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    # CASO 1: La API externa responde bien
    @patch('app.routes.external.requests.get')
    def test_get_quote_success(self, mock_get):
        # 1. Preparamos la mentira (Mock)
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = [{
            "q": "El código limpio es arte.",
            "a": "Programador Anónimo",
            "h": "..."
        }]

        # 2. Llamamos a Lumina
        response = self.client.get('/api/external/quote')
        data = response.get_json()

        # 3. Verificamos que el código proceso bien la resp
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['quote'], "El código limpio es arte.")
        self.assertEqual(data['source'], "ZenQuotes API")

    # CASO 2: La API externa falla
    @patch('app.routes.external.requests.get')
    def test_get_quote_failure(self, mock_get):
        # 1. Simulamos que la API explota
        mock_get.side_effect = Exception("Conexión rechazada")

        # 2. Llamamos a la ruta
        response = self.client.get('/api/external/quote')
        data = response.get_json()

        # 3. Verificamos que salta el Fallback
        self.assertEqual(response.status_code, 200) 
        self.assertEqual(data['author'], "Nelson Mandela")
        self.assertEqual(data['source'], "Lumina Fallback")

if __name__ == '__main__':
    unittest.main()