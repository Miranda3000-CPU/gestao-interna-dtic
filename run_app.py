"""
Gestão Interna DTIC - Launcher para Windows
Inicia o servidor Flask e abre o navegador automaticamente.
"""
import sys
import os
import threading
import webbrowser
import socket
import time

def get_base_path():
    """Retorna o diretório base, funciona tanto em dev quanto empacotado."""
    if getattr(sys, 'frozen', False):
        # Executando como executável PyInstaller
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

def find_free_port(start=5000, end=5100):
    """Encontra uma porta livre no intervalo especificado."""
    for port in range(start, end):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('127.0.0.1', port))
            sock.close()
            return port
        except OSError:
            continue
    return 5000

def open_browser(port):
    """Abre o navegador após um breve atraso para o servidor iniciar."""
    time.sleep(1.5)
    webbrowser.open(f'http://127.0.0.1:{port}')

def main():
    base_path = get_base_path()

    # Garante que os arquivos JSON existam
    for json_file in ['voluntarios.json', 'militares.json']:
        filepath = os.path.join(base_path, json_file)
        if not os.path.exists(filepath):
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('[]')

    # Garante que o arquivo .env exista
    env_path = os.path.join(base_path, '.env')
    if not os.path.exists(env_path):
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write('ADMIN_PASSWORD=#admin#@2024\n')

    # Define variáveis de ambiente
    os.environ['FLASK_ENV'] = 'production'

    # Configura o path para que o app.py encontre seus arquivos
    os.chdir(base_path)
    sys.path.insert(0, base_path)

    # Importa o app Flask
    from app import app

    port = find_free_port()

    print(f"""
╔══════════════════════════════════════════════════╗
║       Gestão Interna DTIC - Servidor Local       ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Servidor rodando em: http://127.0.0.1:{port:<5}     ║
║                                                  ║
║  O navegador será aberto automaticamente.        ║
║  Para encerrar, feche esta janela.               ║
║                                                  ║
╚══════════════════════════════════════════════════╝
""")

    # Abre o navegador em uma thread separada
    browser_thread = threading.Thread(target=open_browser, args=(port,), daemon=True)
    browser_thread.start()

    # Inicia o servidor Flask (sem debug em produção)
    app.run(host='127.0.0.1', port=port, debug=False, use_reloader=False)

if __name__ == '__main__':
    main()
