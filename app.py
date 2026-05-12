from __future__ import annotations

import calendar
import json
import locale
import os
import re
from datetime import date, datetime, timedelta
from typing import Any

from flask import Flask, flash, redirect, render_template, request, url_for
from markupsafe import Markup, escape


# Caminhos da aplicação
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
DB_CIVIL = os.path.join(BASE_DIR, "voluntarios.json")
DB_MILITAR = os.path.join(BASE_DIR, "militares.json")

DEFAULT_COMMANDER = "LUIZ ALFREDO SILVA GALIZA DOS SANTOS – TCEL QOBM"
DEFAULT_COMMANDER_NOME_GUERRA = "LUIZ ALFREDO"

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.config["SECRET_KEY"] = os.urandom(24)


def configure_locale() -> None:
    """Configura locale PT-BR com fallback entre plataformas."""
    for loc in (
        "pt_BR.UTF-8",
        "pt_BR.utf8",
        "pt_BR",
        "Portuguese_Brazil.1252",
        "",
    ):
        try:
            locale.setlocale(locale.LC_ALL, loc)
            break
        except locale.Error:
            continue


@app.errorhandler(403)
def forbidden_error(error):
    flash("Acesso negado. Redirecionando para home.")
    return redirect(url_for("home"))


@app.errorhandler(404)
def not_found_error(error):
    flash("Página não encontrada.")
    return redirect(url_for("home"))


def load_json(filepath: str) -> list[dict[str, Any]]:
    if not os.path.exists(filepath):
        return []

    try:
        with open(filepath, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []

    if not isinstance(data, list):
        return []

    return [item for item in data if isinstance(item, dict)]


def save_json(filepath: str, data: list[dict[str, Any]]) -> None:
    with open(filepath, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


def _to_upper(value: str | None) -> str:
    return (value or "").strip().upper()


def _safe_int(
    value: str | None, default: int, min_value: int | None = None, max_value: int | None = None
) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return default

    if min_value is not None and number < min_value:
        return default
    if max_value is not None and number > max_value:
        return default

    return number


def _next_id(data: list[dict[str, Any]]) -> int:
    return max((item.get("id", 0) for item in data), default=0) + 1


def _delete_by_id(data: list[dict[str, Any]], item_id: int) -> list[dict[str, Any]]:
    return [item for item in data if item.get("id") != item_id]


def _highlight_nome_guerra(nome: str | None, nome_guerra: str | None) -> Markup:
    nome = (nome or "").strip()
    nome_guerra = (nome_guerra or "").strip()

    if not nome:
        return Markup("")
    if not nome_guerra:
        return escape(nome)

    match_full = re.search(re.escape(nome_guerra), nome, flags=re.IGNORECASE)
    if match_full:
        start, end = match_full.span()
        return Markup(f"{escape(nome[:start])}<b>{escape(nome[start:end])}</b>{escape(nome[end:])}")

    tokens = re.findall(r"[A-ZÀ-Ý0-9]+", nome_guerra.upper())
    tokens = sorted({token for token in tokens if len(token) >= 2}, key=len, reverse=True)
    if not tokens:
        return escape(nome)

    spans = []
    for token in tokens:
        pattern = rf"(?<!\w){re.escape(token)}(?!\w)"
        spans.extend(match.span() for match in re.finditer(pattern, nome, flags=re.IGNORECASE))

    if not spans:
        return escape(nome)

    spans.sort(key=lambda span: (span[0], -(span[1] - span[0])))
    merged = []
    for start, end in spans:
        if not merged or start >= merged[-1][1]:
            merged.append([start, end])

    chunks = []
    last = 0
    for start, end in merged:
        chunks.append(escape(nome[last:start]))
        chunks.append(Markup(f"<b>{escape(nome[start:end])}</b>"))
        last = end
    chunks.append(escape(nome[last:]))

    return Markup("").join(chunks)


def _easter_sunday(year: int) -> date:
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


def _get_feriados_brasil(year: int) -> set[date]:
    pascoa = _easter_sunday(year)
    return {
        date(year, 1, 1),
        date(year, 4, 21),
        date(year, 5, 1),
        date(year, 9, 7),
        date(year, 10, 12),
        date(year, 11, 2),
        date(year, 11, 15),
        date(year, 11, 20),
        date(year, 12, 25),
        pascoa - timedelta(days=47),
        pascoa - timedelta(days=2),
        pascoa + timedelta(days=60),
    }


def _build_dias_civis(ano: int, mes: int) -> list[dict[str, Any]]:
    _, num_dias = calendar.monthrange(ano, mes)
    feriados = _get_feriados_brasil(ano)
    dias = []

    for day in range(1, num_dias + 1):
        dt = datetime(ano, mes, day)
        data_atual = date(ano, mes, day)
        is_feriado = data_atual in feriados

        texto = ""
        if is_feriado:
            texto = "FERIADO"
        elif dt.weekday() == 5:
            texto = "SÁBADO"
        elif dt.weekday() == 6:
            texto = "DOMINGO"

        dias.append(
            {
                "numero": day,
                "is_fim_de_semana": dt.weekday() >= 5,
                "is_feriado": is_feriado,
                "texto": texto,
            }
        )

    return dias


def _build_dias_militares(ano: int, mes: int) -> list[dict[str, str]]:
    _, ultimo_dia = calendar.monthrange(ano, mes)
    dias = []

    for day in range(1, ultimo_dia + 1):
        dt = datetime(ano, mes, day)
        tipo = "dia_util"
        texto = ""

        if dt.weekday() == 5:
            tipo = "sabado"
            texto = "SÁBADO"
        elif dt.weekday() == 6:
            tipo = "domingo"
            texto = "DOMINGO"

        dias.append({"numero": f"{day:02d}", "tipo": tipo, "texto": texto})

    return dias


app.jinja_env.filters["highlight_nome_guerra"] = _highlight_nome_guerra
configure_locale()


@app.route("/")
def home():
    civis = load_json(DB_CIVIL)
    militares = load_json(DB_MILITAR)

    agora = datetime.now()
    ultimo_dia = calendar.monthrange(agora.year, agora.month)[1]

    dados_padrao = {
        "nota_num": "001",
        "dia_inicio": "01",
        "dia_fim": str(ultimo_dia),
        "comandante": DEFAULT_COMMANDER,
        "nome_guerra_comandante": DEFAULT_COMMANDER_NOME_GUERRA,
        "ano_atual": agora.year,
        "mes_atual": agora.month,
    }

    return render_template("index.html", civis=civis, militares=militares, padrao=dados_padrao)


@app.route("/add_civil", methods=["POST"])
def add_civil():
    data = load_json(DB_CIVIL)
    novo = {
        "id": _next_id(data),
        "nome": _to_upper(request.form.get("nome")),
        "nome_guerra": _to_upper(request.form.get("nome_guerra")),
        "funcao": (request.form.get("funcao") or "").strip(),
        "turno": (request.form.get("turno") or "").strip(),
    }

    if not novo["nome"] or not novo["nome_guerra"]:
        flash("Nome e nome de guerra são obrigatórios para cadastro civil.")
        return redirect(url_for("home"))

    data.append(novo)
    save_json(DB_CIVIL, data)
    return redirect(url_for("home"))


@app.route("/del_civil/<int:item_id>")
def del_civil(item_id: int):
    data = load_json(DB_CIVIL)
    save_json(DB_CIVIL, _delete_by_id(data, item_id))
    return redirect(url_for("home"))


@app.route("/add_militar", methods=["POST"])
def add_militar():
    data = load_json(DB_MILITAR)
    novo = {
        "id": _next_id(data),
        "graduacao": _to_upper(request.form.get("graduacao")),
        "nome": _to_upper(request.form.get("nome")),
        "nome_guerra": _to_upper(request.form.get("nome_guerra")),
    }

    if not novo["nome"] or not novo["nome_guerra"]:
        flash("Nome e nome de guerra são obrigatórios para cadastro militar.")
        return redirect(url_for("home"))

    data.append(novo)
    save_json(DB_MILITAR, data)
    return redirect(url_for("home"))


@app.route("/del_militar/<int:item_id>")
def del_militar(item_id: int):
    data = load_json(DB_MILITAR)
    save_json(DB_MILITAR, _delete_by_id(data, item_id))
    return redirect(url_for("home"))


@app.route("/gerar_civil")
def gerar_civil():
    voluntarios = load_json(DB_CIVIL)
    comandante = request.args.get("comandante", DEFAULT_COMMANDER)
    nome_guerra_comandante = request.args.get(
        "nome_guerra_comandante", DEFAULT_COMMANDER_NOME_GUERRA
    )

    agora = datetime.now()
    mes = _safe_int(request.args.get("mes"), agora.month, min_value=1, max_value=12)
    ano = _safe_int(request.args.get("ano"), agora.year, min_value=1900, max_value=2100)
    mes_nome = calendar.month_name[mes].upper()

    return render_template(
        "folha_civil.html",
        voluntarios=voluntarios,
        mes=mes_nome,
        ano=ano,
        dias=_build_dias_civis(ano, mes),
        comandante=comandante,
        nome_guerra_comandante=nome_guerra_comandante,
    )


@app.route("/gerar_militar")
def gerar_militar():
    militares = load_json(DB_MILITAR)
    nota_num = request.args.get("nota_num", "001")

    agora = datetime.now()
    mes_nome = calendar.month_name[agora.month].upper()
    _, ultimo_dia = calendar.monthrange(agora.year, agora.month)

    periodo = f"01 A {ultimo_dia:02d} DE {mes_nome} DE {agora.year}"
    nota = f"{nota_num}/{agora.year}"

    return render_template(
        "folha_militar.html",
        militares=militares,
        nota=nota,
        periodo=periodo,
        dias=_build_dias_militares(agora.year, agora.month),
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
