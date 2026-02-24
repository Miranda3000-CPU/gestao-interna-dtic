from flask import Flask, render_template, request, redirect, url_for, session, flash
from dotenv import load_dotenv
from functools import wraps
import json
import os
import calendar
from datetime import datetime, timedelta
import locale
import time

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração de Caminhos Absolutos
basedir = os.path.abspath(os.path.dirname(__file__))
template_dir = os.path.join(basedir, 'templates')
static_dir = os.path.join(basedir, 'static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

DB_CIVIL = os.path.join(basedir, 'voluntarios.json')
DB_MILITAR = os.path.join(basedir, 'militares.json')

# Chave secreta para gerenciamento de sessão
app.config['SECRET_KEY'] = os.urandom(24)
# Configurar tempo de sessão (5 minutos)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')



# Tenta configurar local para PT-BR
try:
    locale.setlocale(locale.LC_ALL, 'pt_BR.utf8')
except:
    try:
        locale.setlocale(locale.LC_ALL, 'pt_BR') 
    except:
        pass 

# Decorator para exigir login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        # Verifica se a sessão expirou (5 minutos = 300 segundos)
        if 'session_start' in session:
            if time.time() - session['session_start'] > 300:
                session.clear()
                flash('Sua sessão expirou. Faça login novamente.')
                return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Manipulador de erro 403
@app.errorhandler(403)
def forbidden_error(error):
    flash('Acesso negado. Redirecionando para home.')
    return redirect(url_for('home'))

# Manipulador de erro 404
@app.errorhandler(404)
def not_found_error(error):
    flash('Página não encontrada.')
    return redirect(url_for('home'))

# --- FUNÇÕES DE BANCO DE DADOS ---
def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# --- ROTAS PRINCIPAIS ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['password'] == ADMIN_PASSWORD:
            session.permanent = True
            session['logged_in'] = True
            session['session_start'] = time.time()
            flash('Login realizado com sucesso!')
            return redirect(url_for('home'))
        else:
            error = 'Senha inválida. Tente novamente.'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('Você foi desconectado.')
    return redirect(url_for('login'))

@app.route('/')
@login_required
def home():
    # 1. Carrega os dois bancos de dados (Civil e Militar)
    # Se der erro aqui, verifique se definiu DB_CIVIL e DB_MILITAR lá em cima
    civis = load_json(DB_CIVIL)       
    militares = load_json(DB_MILITAR) 
    
    # 2. Configura os dados padrão (ISSO CORRIGE O ERRO 'padrao undefined')
    agora = datetime.now()
    ultimo_dia = calendar.monthrange(agora.year, agora.month)[1]
    
    dados_padrao = {
        "nota_num": "001",
        "dia_inicio": "01",
        "dia_fim": str(ultimo_dia), 
        "comandante": "LUIZ ALFREDO SILVA GALIZA DOS SANTOS – TCEL QOBM",
        "nome_guerra_comandante": "LUIZ ALFREDO"
    }
    
    # 3. Envia tudo para o HTML com os nomes corretos
    return render_template(
        'index.html', 
        civis=civis,          # O HTML novo espera 'civis' (não 'voluntarios')
        militares=militares,  # O HTML novo espera 'militares'
        padrao=dados_padrao   # <--- AQUI ESTÁ A CORREÇÃO PRINCIPAL
    )

# --- CRUD CIVIL (Mantido) ---
@app.route('/add_civil', methods=['POST'])
@login_required
def add_civil():
    data = load_json(DB_CIVIL)
    novo_id = max([v['id'] for v in data] + [0]) + 1
    novo = {
        "id": novo_id,
        "nome": request.form.get('nome').upper(),
        "nome_guerra": request.form.get('nome_guerra').upper(),
        "funcao": request.form.get('funcao'),
        "turno": request.form.get('turno')
    }
    data.append(novo)
    save_json(DB_CIVIL, data)
    return redirect(url_for('index'))

@app.route('/del_civil/<int:id>')
@login_required
def del_civil(id):
    data = load_json(DB_CIVIL)
    data = [v for v in data if v['id'] != id]
    save_json(DB_CIVIL, data)
    return redirect(url_for('index'))

# --- CRUD MILITAR (Novo) ---
@app.route('/add_militar', methods=['POST'])
@login_required
def add_militar():
    data = load_json(DB_MILITAR)
    novo_id = max([v['id'] for v in data] + [0]) + 1
    novo = {
        "id": novo_id,
        "graduacao": request.form.get('graduacao').upper(),
        "nome": request.form.get('nome').upper(),
        "nome_guerra": request.form.get('nome_guerra').upper()
    }
    data.append(novo)
    save_json(DB_MILITAR, data)
    return redirect(url_for('index'))

@app.route('/del_militar/<int:id>')
@login_required
def del_militar(id):
    data = load_json(DB_MILITAR)
    data = [v for v in data if v['id'] != id]
    save_json(DB_MILITAR, data)
    return redirect(url_for('index'))

# --- GERAÇÃO DE FOLHAS ---
def _generate_dias_data(year, month):
    agora = datetime(year, month, 1) # Use the provided year and month
    _, num_dias_mes = calendar.monthrange(year, month)

    dias = []
    for d in range(1, 32): # Table fixed to 31 rows generally
        if d > num_dias_mes:
            dias.append({"numero": d, "tipo": "nulo", "texto": ""})
            continue

        dt = datetime(year, month, d)
        weekday = dt.weekday()

        tipo = "dia_util"
        texto = ""

        if weekday == 5:
            tipo = "sabado"
            texto = "SÁBADO"
        elif weekday == 6:
            tipo = "domingo"
            texto = "DOMINGO"

        dias.append({"numero": f"{d:02d}", "tipo": tipo, "texto": texto})
    return dias


@app.route('/gerar_civil')
@login_required
def gerar_civil():
    voluntarios = load_json(DB_CIVIL)
    comandante = request.args.get('comandante', 'LUIZ ALFREDO SILVA GALIZA DOS SANTOS – TCEL QOBM')
    nome_guerra_comandante = request.args.get('nome_guerra_comandante', 'LUIZ ALFREDO')
    
    agora = datetime.now()
    mes_nome = calendar.month_name[agora.month].upper()
    _, num_dias = calendar.monthrange(agora.year, agora.month)
    
    dias = []
    for d in range(1, num_dias + 1):
        dt = datetime(agora.year, agora.month, d)
        dias.append({
            "numero": d,
            "is_fim_de_semana": dt.weekday() >= 5, # 5=Sáb, 6=Dom
            "texto": "SÁBADO" if dt.weekday() == 5 else "DOMINGO" if dt.weekday() == 6 else ""
        })
        
    return render_template('folha_civil.html', 
                           voluntarios=voluntarios, 
                           mes=mes_nome, 
                           ano=agora.year, 
                           dias=dias, 
                           comandante=comandante,
                           nome_guerra_comandante=nome_guerra_comandante)

@app.route('/gerar_militar')
@login_required
def gerar_militar():
    militares = load_json(DB_MILITAR)
    nota_num = request.args.get('nota_num', '001')
    
    # 1. Detecta Data Atual
    agora = datetime.now()
    
    # 2. Configura Mês e Último Dia Real (ex: Fev = 28)
    # locale já foi configurado no início do script, então month_name vem em PT ou Inglês dependendo do sistema
    # Vamos garantir UPPERCASE
    mes_nome = calendar.month_name[agora.month].upper()
    _, ultimo_dia = calendar.monthrange(agora.year, agora.month)
    
    # 3. Textos
    periodo_str = f"01 A {ultimo_dia:02d} DE {mes_nome} DE {agora.year}"
    nota_str = f"{nota_num}/{agora.year}"

    # 4. Gera dias DINÂMICOS (Só vai até o último dia do mês, igual ao Civil)
    dias = []
    for d in range(1, ultimo_dia + 1):
        dt = datetime(agora.year, agora.month, d)
        weekday = dt.weekday() # 0=Seg, 5=Sáb, 6=Dom
        
        tipo = "dia_util"
        texto = ""
        
        if weekday == 5:
            tipo = "sabado"
            texto = "SÁBADO"
        elif weekday == 6:
            tipo = "domingo"
            texto = "DOMINGO"
            
        dias.append({"numero": f"{d:02d}", "tipo": tipo, "texto": texto})

    return render_template('folha_militar.html',
                           militares=militares,
                           nota=nota_str,
                           periodo=periodo_str,
                           dias=dias)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)