import urllib.request
import json
import os

print("Baixando EXDB do OpenGym...")
url_exdb = "https://raw.githubusercontent.com/DuarteSantos8/openGym/main/frontend/src/lib/exercises-data.js"
req = urllib.request.Request(url_exdb, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode("utf-8")

# Pega a linha do EXDB
exdb_line = ""
for line in content.splitlines():
    if line.startswith("export const EXDB"):
        exdb_line = line
        break

prefix = "JSON.parse('"
start = exdb_line.find(prefix) + len(prefix)
end = exdb_line.rfind("')")
raw_json = exdb_line[start:end].encode("utf-8").decode("unicode_escape")
exdb = json.loads(raw_json)
print(f"Total de exercícios no EXDB: {len(exdb)}")

print("Baixando pt-BR.json do OpenGym...")
url_pt = "https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/i18n/pt-BR.json"
req_pt = urllib.request.Request(url_pt, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req_pt) as resp:
    pt_map = json.loads(resp.read().decode("utf-8"))
print(f"Total de traduções pt-BR: {len(pt_map)}")

# Dicionários de mapeamento em português amigável
BODYPART_MAP_PT = {
    "waist": "Abdômen & Cintura",
    "chest": "Peitoral",
    "back": "Costas & Dorsais",
    "shoulders": "Ombros & Deltoides",
    "upper arms": "Braços (Bíceps/Tríceps)",
    "lower arms": "Antebraços",
    "upper legs": "Coxas & Quadríceps",
    "lower legs": "Panturrilhas",
    "cardio": "Cardio & Resistência",
    "neck": "Pescoço & Trapézio",
    "full body": "Corpo Inteiro (Funcional)"
}

EQUIPMENT_MAP_PT = {
    "body weight": "Peso Corporal",
    "dumbbell": "Halteres",
    "barbell": "Barra",
    "cable": "Polia / Cabo",
    "leverage machine": "Máquina / Aparelho",
    "band": "Faixa Elástica",
    "smith machine": "Smith Machine",
    "kettlebell": "Kettlebell",
    "weighted": "Com Carga Extra",
    "stability ball": "Bola Suíça",
    "ez barbell": "Barra W / EZ",
    "rope": "Corda",
    "medicine ball": "Medicine Ball",
    "trap bar": "Barra Hexagonal",
    "bosu ball": "Bosu",
    "sled apparatus": "Trenó / Sled",
    "roller": "Rolo de Liberação",
    "assisted": "Graviton / Assistido",
    "wheel roller": "Roda Abdominal",
    "skierg machine": "SkiErg",
    "elliptical machine": "Elíptico",
    "stepmill machine": "Simulador de Escada",
    "stationary bike": "Bicicleta Ergométrica"
}

catalogo_final = []

for ex in exdb:
    eid = str(ex.get("id"))
    tr = pt_map.get(eid, {})
    
    nome_pt = tr.get("name")
    if not nome_pt:
        nome_pt = ex.get("n", "").title()
    else:
        nome_pt = nome_pt.strip().title()

    instrucoes_pt = tr.get("instructions", [])
    if not instrucoes_pt:
        instrucoes_pt = [
            "Execute o movimento mantendo a postura firme, amplitude adequada e respiração controlada."
        ]

    bp_raw = ex.get("bp", "full body").lower()
    eq_raw = ex.get("eq", "body weight").lower()
    
    item = {
        "id": eid,
        "nome": nome_pt,
        "nomeEn": ex.get("n", "").title(),
        "bodyPart": bp_raw,
        "bodyPartPt": BODYPART_MAP_PT.get(bp_raw, bp_raw.title()),
        "equipment": eq_raw,
        "equipmentPt": EQUIPMENT_MAP_PT.get(eq_raw, eq_raw.title()),
        "target": ex.get("tg", "geral"),
        "secondaryMuscles": ex.get("sm", []),
        "category": ex.get("cat", "strength"),
        "clipUrl": f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/clip/{eid}.mp4",
        "stillUrl": f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/still/{eid}.webp",
        "instructions": instrucoes_pt,
        "descricao": instrucoes_pt[0] if instrucoes_pt else "Movimento guiado com postura correta."
    }
    catalogo_final.append(item)

print(f"Catálogo compilado: {len(catalogo_final)} exercícios!")

out_path = os.path.join("frontend", "src", "data", "openGymCatalogue.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(catalogo_final, f, ensure_ascii=False)

file_size_kb = os.path.getsize(out_path) / 1024
print(f"Salvo em: {out_path} ({file_size_kb:.1f} KB)")
