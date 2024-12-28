from app import create_app

app = create_app()


if __name__ == '__main__':
    port: int = app.config.get('FLASK_RUN_PORT', 5000)
    debug = app.config.get('FLASK_DEBUG', False)
    app.run(debug=debug, port=port)


@app.errorhandler(413)
def request_entity_too_large(error):
    return "File is too large. Maximum file size is 24 MB.", 413