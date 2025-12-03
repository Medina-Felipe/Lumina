from flask import Blueprint, jsonify
import requests
import time 

bp = Blueprint('external', __name__)

@bp.route('/quote', methods=['GET'])
def get_quote():
    try:
        timestamp = time.time()
        
        url = f"https://zenquotes.io/api/random?t={timestamp}"
        
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        
        if data and len(data) > 0:
            quote_data = data[0]
            return jsonify({
                "quote": quote_data.get('q'),
                "author": quote_data.get('a'),
                "source": "ZenQuotes API"
            })
            
    except Exception as e:
        print(f"Error fetching quote: {e}")

    # Fallback
    return jsonify({
        "quote": "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
        "author": "Nelson Mandela",
        "source": "Lumina Fallback"
    })