import urllib.request
import json
import os
import re

print("Carregando openGymCatalogue.json local...")
with open("frontend/src/data/openGymCatalogue.json", "r", encoding="utf-8") as f:
    cat_list = json.load(f)
CAT_MAP = {str(ex["id"]): ex for ex in cat_list}
print(f"Catálogo indexado: {len(CAT_MAP)} exercícios.")

def enrich_ex(eid, sets=3, reps=10, rest=60, mode="reps", note=""):
    eid = str(eid)
    ex = CAT_MAP.get(eid)
    if not ex:
        # fallback com o proprio ID
        return {
            "id": eid,
            "nome": f"Exercício #{eid}",
            "series": sets,
            "reps": f"{reps} seg" if mode == "time" else str(reps),
            "descanso": rest,
            "musculos": ["full body"],
            "clipUrl": f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/clip/{eid}.mp4",
            "stillUrl": f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/still/{eid}.webp",
            "instrucao": note or "Execute o movimento com postura firme e controle respiratório."
        }
    musculos = [ex.get("target")] if ex.get("target") else []
    for sm in ex.get("secondaryMuscles", []):
        if sm and sm not in musculos:
            musculos.append(sm)
    return {
        "id": eid,
        "nome": ex["nome"],
        "series": int(sets),
        "reps": f"{reps} seg" if mode == "time" else str(reps),
        "descanso": int(rest),
        "musculos": musculos or [ex.get("bodyPart", "full body")],
        "clipUrl": ex["clipUrl"],
        "stillUrl": ex["stillUrl"],
        "instrucao": note or ex.get("descricao") or "Execute o movimento mantendo a postura."
    }

# 1. Traduções para os planos e dias
TITLE_PT = {
    "Push, pull, legs": "Empurrar, Puxar e Pernas (PPL)",
    "Upper / Lower": "Superiores & Inferiores (4 Dias)",
    "Full body": "Corpo Inteiro • 3x na Semana",
    "5×5 Strength": "Força Pura 5×5 (Progressão Linear)",
    "Home bodyweight": "Treino em Casa (Peso Corporal)",
    "Dumbbells only": "Treino Completo com Halteres",
    "Resistance bands": "Treino com Faixas Elásticas",
    "Hotel / Travel": "Treino Rápido de Viagem / Hotel",
    "Lower body, glutes first": "Foco em Glúteos & Inferiores (4 Dias)",
    "Push, pull, legs (6 days)": "PPL Intensivo • 6 Dias (Avançado)",
    "25-minute circuit": "Circuito Metabólico 25 Min",
    "Desk reset": "Alívio Postural & Mobilidade (Escritório)",
    "Dumbbell sweat": "Resistência & Suor com Halteres",
    "One kettlebell": "Treino Funcional com 1 Kettlebell",
    "Bar and floor": "Barra Fixa & Chão (Calistenia)",
    "Body-part split": "Divisão por Músculo (ABCDE • 5 Dias)",
    "Linear strength": "Força Linear Clássica",
    "Pull-up bar basics": "Básico na Barra Fixa",
    "Ten sets of ten": "Volume Alemão 10×10 (Hipertrofia)",
    "Twice a week": "Essencial 2x na Semana (Manutenção)",
    "Ganzkörper zuhause": "Corpo Inteiro em Casa (Sem Aparelhos)"
}

DAY_PT = {
    "Push Day": "Dia A • Empurrar (Peito, Ombros e Tríceps)",
    "Pull Day": "Dia B • Puxar (Costas e Bíceps)",
    "Leg Day": "Dia C • Pernas Completas",
    "Upper A": "Superiores A (Foco Força)",
    "Lower A": "Inferiores A (Foco Posterior/Glúteos)",
    "Upper B": "Superiores B (Foco Hipertrofia)",
    "Lower B": "Inferiores B (Foco Quadríceps)",
    "Full Body A": "Corpo Inteiro A",
    "Full Body B": "Corpo Inteiro B",
    "Full Body C": "Corpo Inteiro C",
    "Bodyweight A": "Em Casa • Treino A",
    "Bodyweight B": "Em Casa • Treino B",
    "Dumbbells A": "Halteres • Treino A",
    "Dumbbells B": "Halteres • Treino B",
    "Bands A": "Elásticos • Treino A",
    "Bands B": "Elásticos • Treino B",
    "Hotel A": "Viagem • Treino A",
    "Hotel B": "Viagem • Treino B",
}

GOAL_PT = {
    "muscle": "Hipertrofia",
    "strength": "Força",
    "conditioning": "Condicionamento",
    "mobility": "Mobilidade & Postura",
    "fat-loss": "Emagrecimento",
    "general": "Saúde Geral"
}

LEVEL_PT = {
    "beginner": "Iniciante",
    "intermediate": "Intermediário",
    "advanced": "Avançado"
}

routines_final = []

# 2. Importar STARTER_PLANS de api/coach/core/starter-plans.js
starter_defs = [
    ("home-bw", "Treino em Casa (Peso Corporal)", "casa", "Iniciante", "25 min", 25,
     "Treino completo usando apenas o peso do próprio corpo, sem nenhum equipamento.",
     [
         ("Em Casa • Treino A (Superior & Core)", [['0662', 3, 10], ['1197', 3, 15], ['3381', 3, 8], ['2471', 3, 15], ['0463', 3, 40, 'time']]),
         ("Em Casa • Treino B (Inferior & Cardio)", [['2921', 3, 8], ['0781', 3, 10], ['0815', 3, 10], ['0726', 3, 10], ['0715', 3, 30, 'time']])
     ]),
    ("full-body", "Corpo Inteiro • 3x na Semana", "academia", "Iniciante", "45 min", 45,
     "Trabalha todos os grandes grupos musculares 3 vezes por semana com base sólida.",
     [
         ("Corpo Inteiro A", [['0043', 3, 8], ['0025', 3, 8], ['2330', 3, 10], ['0586', 3, 12], ['0334', 2, 12], ['0031', 2, 12]]),
         ("Corpo Inteiro B", [['0085', 3, 8], ['0047', 3, 10], ['1323', 3, 10], ['0585', 3, 12], ['0334', 2, 12], ['0241', 2, 12]]),
         ("Corpo Inteiro C", [['0739', 3, 10], ['0025', 2, 10], ['0027', 3, 10], ['0426', 2, 10], ['0586', 3, 12], ['0605', 3, 15]])
     ]),
    ("ppl", "Empurrar, Puxar e Pernas (PPL)", "academia", "Intermediário", "55 min", 55,
     "A divisão clássica mundial para hipertrofia muscular e recuperação ideal.",
     [
         ("Dia A • Empurrar (Peito, Ombros e Tríceps)", [['0025', 4, 8], ['0047', 3, 10], ['0426', 3, 10], ['0334', 3, 12], ['0241', 3, 12], ['0251', 3, 10]]),
         ("Dia B • Puxar (Costas e Bíceps)", [['2330', 4, 10], ['0027', 4, 8], ['1323', 3, 10], ['0031', 3, 10], ['0313', 3, 12]]),
         ("Dia C • Pernas Completas", [['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0585', 3, 12], ['0586', 3, 12], ['0605', 4, 15]])
     ]),
    ("upper-lower", "Superiores & Inferiores (4 Dias)", "academia", "Intermediário", "50 min", 50,
     "Divisão equilibrada de 4 sessões semanais alternando membros superiores e inferiores.",
     [
         ("Superiores A", [['0025', 3, 8], ['2330', 3, 10], ['0047', 2, 10], ['1323', 2, 10], ['0334', 2, 12], ['0241', 2, 12], ['0031', 2, 12]]),
         ("Inferiores A", [['0043', 3, 8], ['0085', 3, 8], ['0739', 2, 10], ['0586', 2, 12], ['0605', 3, 15]]),
         ("Superiores B", [['0047', 3, 8], ['0027', 3, 8], ['0426', 2, 10], ['2330', 2, 10], ['0334', 2, 12], ['0241', 2, 12], ['0313', 2, 12]]),
         ("Inferiores B", [['0739', 3, 10], ['0085', 2, 10], ['0585', 2, 12], ['0586', 3, 12], ['0605', 3, 15]])
     ]),
    ("5x5", "Força Pura 5×5 (Progressão Linear)", "academia", "Intermediário", "45 min", 45,
     "Foco total em ganho de força máxima nos grandes levantamentos compostos.",
     [
         ("Treino 5×5 A", [['0043', 5, 5], ['0025', 5, 5], ['0027', 5, 5]]),
         ("Treino 5×5 B", [['0085', 5, 5], ['0426', 5, 5], ['2330', 5, 5]]),
         ("Treino 5×5 C", [['0739', 5, 5], ['0047', 5, 5], ['1323', 5, 5]])
     ]),
    ("dumbbells", "Treino Completo só com Halteres", "casa", "Iniciante", "35 min", 35,
     "Ideal para quem treina em casa ou condomínio tendo apenas um par de halteres.",
     [
         ("Halteres • Treino A", [['1760', 3, 10], ['2982', 3, 10], ['0293', 3, 10], ['0426', 3, 10], ['0294', 2, 12]]),
         ("Halteres • Treino B", [['1459', 3, 10], ['2960', 3, 10], ['4742', 3, 12], ['0334', 3, 12], ['0463', 3, 40, 'time']])
     ]),
    ("cardio-emagrecimento", "Aquecimento & Queima Calórica em Casa", "casa", "Todos os Níveis", "20 min", 20,
     "Circuito dinâmico com Polichinelo (3094), Agachamento e Prancha para ativar o metabolismo.",
     [
         ("Circuito Ativação", [['3094', 3, 30, 'time'], ['3948', 3, 15], ['0662', 3, 10], ['0463', 3, 30, 'time']])
     ])
]

for rid, titulo, cat, nivel, dur_str, dur_min, desc, sessions in starter_defs:
    sess_objs = []
    all_muscles = []
    for s_name, ex_list in sessions:
        enriched = []
        for item in ex_list:
            eid = item[0]
            sets = item[1]
            reps = item[2]
            mode = item[3] if len(item) > 3 else "reps"
            e_obj = enrich_ex(eid, sets, reps, 60, mode)
            enriched.append(e_obj)
            for m in e_obj["musculos"]:
                if m not in all_muscles:
                    all_muscles.append(m)
        sess_objs.append({"nome": s_name, "exercicios": enriched})

    routines_final.append({
        "id": rid,
        "origem": "Starter Oficial OpenGym",
        "categoria": cat,
        "nivel": nivel,
        "titulo": titulo,
        "duracao": dur_str,
        "duracaoMinutos": dur_min,
        "metaSessoes": len(sess_objs) * 4,
        "foco": desc,
        "calorias": dur_min * 6,
        "musculos": all_muscles[:5],
        "sessoes": sess_objs
    })

# 3. Baixar os 13 arquivos de routines/opengym/*.json
opengym_files = [
    "glutes-first.json",
    "circuit-25.json",
    "desk-reset.json",
    "ppl-six-days.json",
    "body-part-split.json",
    "dumbbell-sweat.json",
    "one-kettlebell.json",
    "bar-and-floor.json",
    "linear-strength.json",
    "pullup-bar-basics.json",
    "ten-sets-of-ten.json",
    "twice-a-week.json",
]

for fname in opengym_files:
    url = f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/routines/opengym/{fname}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            rdata = json.loads(resp.read().decode("utf-8"))
        
        rid = fname.replace(".json", "")
        raw_title = rdata.get("title", rid)
        titulo_pt = TITLE_PT.get(raw_title, raw_title)
        dur = int(rdata.get("duration", 40))
        tags = rdata.get("tags", [])
        
        if "mobility" in rdata.get("goal", "") or "desk" in rid:
            cat = "mobilidade"
        elif "home" in tags or "bodyweight" in tags or "kettlebell" in rid or "bar-and-floor" in rid or "circuit" in rid:
            cat = "casa"
        else:
            cat = "academia"

        sess_objs = []
        all_muscles = []
        for sess in rdata.get("sessions", []):
            s_name_raw = sess.get("name", "Treino")
            s_name_pt = DAY_PT.get(s_name_raw, s_name_raw)
            enriched = []
            for ex in sess.get("exercises", []):
                eid = str(ex.get("id"))
                sets = ex.get("sets", 3)
                reps = ex.get("reps", ex.get("sec", 10))
                mode = "time" if "sec" in ex else "reps"
                rest = ex.get("rest", 60)
                note = ex.get("note", "")
                e_obj = enrich_ex(eid, sets, reps, rest, mode, note)
                enriched.append(e_obj)
                for m in e_obj["musculos"]:
                    if m not in all_muscles:
                        all_muscles.append(m)
            if enriched:
                sess_objs.append({"nome": s_name_pt, "exercicios": enriched})

        if sess_objs:
            routines_final.append({
                "id": rid,
                "origem": "Programa Oficial OpenGym",
                "categoria": cat,
                "nivel": LEVEL_PT.get(rdata.get("level", "intermediate"), "Intermediário"),
                "titulo": titulo_pt,
                "duracao": f"{dur} min",
                "duracaoMinutos": dur,
                "metaSessoes": len(sess_objs) * 4,
                "foco": rdata.get("description", "Programa estruturado oficial do OpenGym."),
                "calorias": dur * 6,
                "musculos": all_muscles[:5],
                "sessoes": sess_objs
            })
            print(f"Importado: {titulo_pt} ({len(sess_objs)} dias)")
    except Exception as e:
        print(f"Erro ao baixar {fname}: {e}")

out_path = os.path.join("frontend", "src", "data", "openGymRoutines.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(routines_final, f, ensure_ascii=False, indent=2)

print(f"Total de programas oficiais salvos: {len(routines_final)} em {out_path}")
