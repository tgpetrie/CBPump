import unittest
from app import process_product_data, format_crypto_data, format_banner_data

class TestProcessProductData(unittest.TestCase):
    def test_process_product_data(self):
        # Mock product, stats, and ticker data
        product = {"id": "BTC-USD"}
        stats_data = {"volume": "24000", "open": "29000"}
        ticker_data = {"price": "30000"}
        
        # Call the function
        result = process_product_data(product, stats_data, ticker_data)
        
        # Assert results
        self.assertEqual(result["symbol"], "BTC-USD")
        self.assertEqual(result["current_price"], 30000)
        self.assertAlmostEqual(result["price_change_percentage_1h"], 3.45, places=2)
        self.assertEqual(result["volume_1h"], 1000)  # 24000 / 24

class TestFormatCryptoData(unittest.TestCase):
    def test_format_crypto_data(self):
        # Mock crypto data
        crypto_data = [
            {"symbol": "BTC-USD", "current_price": 30000, "price_change_percentage_3min": 3.45},
            {"symbol": "ETH-USD", "current_price": 2000, "price_change_percentage_3min": 5.26}
        ]
        
        # Call the function
        result = format_crypto_data(crypto_data)
        
        # Assert results
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["symbol"], "BTC-USD")
        self.assertEqual(result[0]["current"], 30000)
        self.assertEqual(result[0]["gain"], 3.45)

class TestFormatBannerData(unittest.TestCase):
    def test_format_banner_data(self):
        # Mock banner data
        banner_data = [
            {"symbol": "BTC-USD", "current_price": 30000, "price_change_percentage_1h": 3.45, "volume_1h": 1000, "volume_change_percentage": 10},
            {"symbol": "ETH-USD", "current_price": 2000, "price_change_percentage_1h": 5.26, "volume_1h": 500, "volume_change_percentage": 15}
        ]
        
        # Call the function
        result = format_banner_data(banner_data)
        
        # Assert results
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["symbol"], "BTC-USD")
        self.assertEqual(result[0]["current"], 30000)
        self.assertEqual(result[0]["gain"], 3.45)
        self.assertEqual(result[0]["volume"], 1000)
        self.assertEqual(result[0]["volume_change"], 10)

if __name__ == "__main__":
    unittest.main()