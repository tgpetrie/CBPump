from unittest.mock import patch
import sys
import types
import unittest

# Provide dummy Flask modules so app.py can be imported without dependencies
flask = types.ModuleType("flask")
class _DummyFlask:
    def __init__(self, *a, **kw):
        self.config = {}

    def route(self, *a, **kw):
        def decorator(f):
            return f
        return decorator

flask.Flask = _DummyFlask
flask.jsonify = lambda x=None, *a, **kw: x
flask.request = types.SimpleNamespace()
sys.modules.setdefault("flask", flask)

flask_socketio = types.ModuleType("flask_socketio")
class _DummySocketIO:
    def __init__(self, *a, **kw):
        pass

    def on(self, *a, **kw):
        def decorator(f):
            return f
        return decorator

    def emit(self, *a, **kw):
        pass

flask_socketio.SocketIO = _DummySocketIO
flask_socketio.emit = lambda *a, **kw: None
sys.modules.setdefault("flask_socketio", flask_socketio)

flask_cors = types.ModuleType("flask_cors")
flask_cors.CORS = lambda *a, **kw: None
sys.modules.setdefault("flask_cors", flask_cors)

requests = types.ModuleType("requests")
sys.modules.setdefault("requests", requests)

from app import (
    calculate_interval_changes,
    format_crypto_data,
    format_banner_data,
    price_history,
    CONFIG,
    process_product_data,
)


class TestCalculateIntervalChanges(unittest.TestCase):
    def setUp(self):
        price_history.clear()
        CONFIG['INTERVAL_MINUTES'] = 3

    def test_calculate_interval_changes(self):
        with patch('app.time.time', side_effect=[100, 280]):
            # Initial call populates history only
            result1 = calculate_interval_changes({'BTC-USD': 100.0})
            self.assertEqual(result1, [])

            # Second call calculates change over the interval
            result2 = calculate_interval_changes({'BTC-USD': 110.0})

        self.assertEqual(len(result2), 1)
        coin = result2[0]
        self.assertEqual(coin['symbol'], 'BTC-USD')
        self.assertEqual(coin['current_price'], 110.0)
        self.assertEqual(coin['initial_price_3min'], 100.0)
        self.assertAlmostEqual(coin['price_change_percentage_3min'], 10.0)
        self.assertAlmostEqual(coin['actual_interval_minutes'], 3.0)


class TestFormatCryptoData(unittest.TestCase):
    def test_format_crypto_data(self):

         crypto_data = [
              {
                'symbol': 'BTC-USD',
                'current_price': 110.0,
                'initial_price_3min': 100.0,
                'price_change_percentage_3min': 10.0,
                'actual_interval_minutes': 3.0,
            }
        ]  
         
         result = format_crypto_data(crypto_data)
         expected = [
    {
        'symbol': 'BTC-USD',
        'current': 110.0,
        'initial_3min': 100.0,
        'gain': 10.0,
        'interval_minutes': 3.0,
    }
]
        self.assertEqual(result, expected)


class TestFormat24hBannerData(unittest.TestCase):
    def test_format_24h_banner_data(self):
        banner_data = [

              {
                'symbol': 'BTC-USD',
                'current_price': 30000,
                'initial_price_24h': 28000,
                'initial_price_1h': 29500,
                'price_change_24h': 7.14,
                'price_change_1h': 1.69,
                'volume_24h': 50000,
                'market_cap': 1000000,
            }
        ]
        result = format_24h_banner_data(banner_data)
        expected = [
            {
                'symbol': 'BTC-USD',
                'current_price': 30000,
                'initial_price_24h': 28000,
                'initial_price_1h': 29500,
                'price_change_24h': 7.14,
                'price_change_1h': 1.69,
                'volume_24h': 50000,
                'market_cap': 1000000,
            }
        ] 
        
        self.assertEqual(result, expected)


class TestProcessProductData(unittest.TestCase):
    def test_process_product_data(self):
        product_data = {'volume_24h': 24000}
        result = process_product_data(product_data)
        self.assertEqual(result['volume_1h'], 1000)

if __name__ == '__main__':
    from unittest.mock import patch
import sys
import types

# Provide dummy Flask modules so app.py can be imported without dependencies
flask = types.ModuleType("flask")
class _DummyFlask:
    def __init__(self, *a, **kw):
        self.config = {}

    def route(self, *a, **kw):
        def decorator(f):
            return f
        return decorator

flask.Flask = _DummyFlask
flask.jsonify = lambda x=None, *a, **kw: x
flask.request = None
sys.modules.setdefault("flask", flask)

flask_socketio = types.ModuleType("flask_socketio")
class _DummySocketIO:
    def __init__(self, *a, **kw):
        pass

    def on(self, *a, **kw):
        def decorator(f):
            return f
        return decorator

    def emit(self, *a, **kw):
        pass

flask_socketio.SocketIO = _DummySocketIO
flask_socketio.emit = lambda *a, **kw: None
sys.modules.setdefault("flask_socketio", flask_socketio)

flask_cors = types.ModuleType("flask_cors")
flask_cors.CORS = lambda *a, **kw: None
sys.modules.setdefault("flask_cors", flask_cors)

requests = types.ModuleType("requests")
sys.modules.setdefault("requests", requests)

from app import (
    calculate_interval_changes,
    format_crypto_data,
    format_24h_banner_data,
    price_history,
    CONFIG,
)


class TestCalculateIntervalChanges(unittest.TestCase):
    def setUp(self):
        price_history.clear()
        CONFIG['INTERVAL_MINUTES'] = 3

    def test_calculate_interval_changes(self):
        with patch('app.time.time', side_effect=[100, 280]):
            # Initial call populates history only
            result1 = calculate_interval_changes({'BTC-USD': 100.0})
            self.assertEqual(result1, [])

            # Second call calculates change over the interval
            result2 = calculate_interval_changes({'BTC-USD': 110.0})

        self.assertEqual(len(result2), 1)
        coin = result2[0]
        self.assertEqual(coin['symbol'], 'BTC-USD')
        self.assertEqual(coin['current_price'], 110.0)
        self.assertEqual(coin['initial_price_3min'], 100.0)
        self.assertAlmostEqual(coin['price_change_percentage_3min'], 10.0)
        self.assertAlmostEqual(coin['actual_interval_minutes'], 3.0)


class TestFormatCryptoData(unittest.TestCase):
    def test_format_crypto_data(self):

         crypto_data = [
              {
                'symbol': 'BTC-USD',
                'current_price': 110.0,
                'initial_price_3min': 100.0,
                'price_change_percentage_3min': 10.0,
                'actual_interval_minutes': 3.0,
            }
        ]  
         
         result = format_crypto_data(crypto_data
                                        expected = [
            {
                'symbol': 'BTC-USD',
                'current': 110.0,
                'initial_3min': 100.0,
                'gain': 10.0,
                'interval_minutes': 3.0,
            }
        ]
        self.assertEqual(result, expected)


class TestFormat24hBannerData(unittest.TestCase):
    def test_format_24h_banner_data(self):
        banner_data = [

              {
                'symbol': 'BTC-USD',
                'current_price': 30000,
                'initial_price_24h': 28000,
                'initial_price_1h': 29500,
                'price_change_24h': 7.14,
                'price_change_1h': 1.69,
                'volume_24h': 50000,
                'market_cap': 1000000,
            }
        ]
        result = format_24h_banner_data(banner_data)
        expected = [
            {
                'symbol': 'BTC-USD',
                'current_price': 30000,
                'initial_price_24h': 28000,
                'initial_price_1h': 29500,
                'price_change_24h': 7.14,
                'price_change_1h': 1.69,
                'volume_24h': 50000,
                'market_cap': 1000000,
            }
        ] 
        
        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()unittest.main()