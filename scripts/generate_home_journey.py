import json
import os

with open("frontend/src/data/openGymCatalogue.json", "r", encoding="utf-8") as f:
    CAT = {str(ex["id"]): ex for ex in json.load(f)}

def ex_item(eid, series, reps, descanso=45, custom_nome=None):
    eid = str(eid)
    base = CAT.get(eid, {})
    musculos = [base.get("target")] if base.get("target") else []
    for sm in base.get("secondaryMuscles", []):
        if sm and sm not in musculos:
            musculos.append(sm)
    return {
        "id": eid,
        "openGymId": eid,
        "nome": custom_nome or base.get("nome", f"Exercício {eid}"),
        "series": series,
        "reps": str(reps),
        "descanso": descanso,
        "musculos": musculos or ["full body"],
        "clipUrl": base.get("clipUrl", f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/clip/{eid}.mp4"),
        "stillUrl": base.get("stillUrl", f"https://raw.githubusercontent.com/DuarteSantos8/openGym/main/catalogue/media/still/{eid}.webp"),
        "instrucao": base.get("descricao", "Execute o movimento com postura firme e respiração controlada.")
    }

JOURNEY = [
    {
        "id": "mes-1",
        "mesNumero": 1,
        "trimestre": "1º Trimestre",
        "semanas": "Semanas 1–4",
        "nivel": "Iniciante",
        "titulo": "Mês 1 • Despertar & Base Corporal",
        "foco": "Adaptação articular, respiração, mobilidade e movimentos fundamentais em casa.",
        "duracao": "20 min",
        "duracaoMinutos": 20,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Corpo Inteiro & Cardio",
                "exercicios": [
                    ex_item("3094", 3, "30 seg", 30, "Polichinelos (Aquecimento)"),
                    ex_item("3948", 3, "12", 45, "Agachamento Livre"),
                    ex_item("0662", 3, "8", 45, "Flexão de Braços"),
                    ex_item("2471", 3, "15", 45, "Ponte de Glúteo no Chão"),
                    ex_item("0463", 3, "25 seg", 45, "Prancha Frontal")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Pernas & Glúteos",
                "exercicios": [
                    ex_item("3094", 2, "30 seg", 30, "Polichinelos (Ativação)"),
                    ex_item("1197", 3, "15", 45, "Agachamento Base"),
                    ex_item("4950", 3, "10 por perna", 45, "Avanço / Afundo Frontal"),
                    ex_item("2471", 3, "15", 45, "Ponte de Glúteo no Chão"),
                    ex_item("7557", 2, "25 seg", 45, "Cadeira Isométrica na Parede (Wall Sit)")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • Superiores (Peito, Ombro & Braços)",
                "exercicios": [
                    ex_item("0662", 3, "10", 45, "Flexão de Braços"),
                    ex_item("0129", 3, "10", 45, "Mergulho de Tríceps (na Cadeira/Banco)"),
                    ex_item("0699", 3, "12 toques", 45, "Prancha com Toque nos Ombros"),
                    ex_item("0463", 3, "25 seg", 45, "Prancha Estabilizada"),
                    ex_item("0942", 2, "30 seg", 20, "Postura do Gato (Alívio Lombar)")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Core, Abdômen & Postura",
                "exercicios": [
                    ex_item("0274", 3, "15", 40, "Abdominal Supra no Chão"),
                    ex_item("0001", 3, "12", 40, "Abdominal 3/4 Controlado"),
                    ex_item("0463", 3, "30 seg", 45, "Prancha Frontal"),
                    ex_item("0942", 3, "30 seg", 25, "Postura do Gato (Mobilidade)"),
                    ex_item("0560", 3, "30 seg/lado", 25, "Alongamento de Flexor do Quadril")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Circuito Metabólico Suave",
                "exercicios": [
                    ex_item("3094", 3, "40 seg", 30, "Polichinelos"),
                    ex_item("3948", 3, "15", 40, "Agachamento Livre"),
                    ex_item("0630", 3, "20 seg", 40, "Escalador (Mountain Climber)"),
                    ex_item("0662", 3, "10", 45, "Flexão de Braços"),
                    ex_item("2471", 3, "15", 40, "Ponte de Glúteo")
                ]
            }
        ]
    },
    {
        "id": "mes-2",
        "mesNumero": 2,
        "trimestre": "1º Trimestre",
        "semanas": "Semanas 5–8",
        "nivel": "Iniciante +",
        "titulo": "Mês 2 • Tônus & Resistência Muscular",
        "foco": "Aumento de repetições, inclusão de movimentos unilaterais e controle do core.",
        "duracao": "25 min",
        "duracaoMinutos": 25,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Corpo Inteiro Progressivo",
                "exercicios": [
                    ex_item("3094", 3, "45 seg", 25, "Polichinelos"),
                    ex_item("3948", 4, "15", 40, "Agachamento Livre"),
                    ex_item("0662", 4, "12", 45, "Flexão de Braços"),
                    ex_item("4950", 3, "12 por perna", 45, "Afundo Alternado"),
                    ex_item("0463", 3, "35 seg", 40, "Prancha Frontal")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Pernas, Coxas & Glúteos",
                "exercicios": [
                    ex_item("1064", 4, "15", 45, "Agachamento Sumô"),
                    ex_item("0781", 3, "12 por perna", 45, "Agachamento Dividido"),
                    ex_item("0726", 3, "12 por perna", 40, "Ponte Unilateral de Glúteos"),
                    ex_item("7557", 3, "35 seg", 45, "Cadeira Isométrica na Parede"),
                    ex_item("0560", 2, "30 seg/lado", 20, "Alongamento de Quadril")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • Peito, Ombros & Tríceps",
                "exercicios": [
                    ex_item("0662", 4, "12", 45, "Flexão de Braços Tradicional"),
                    ex_item("0259", 3, "10", 45, "Flexão Pegada Fechada (Tríceps)"),
                    ex_item("0129", 4, "12", 45, "Mergulho de Tríceps (Banco/Cadeira)"),
                    ex_item("0699", 3, "16 toques", 40, "Prancha com Toque no Ombro"),
                    ex_item("0463", 3, "35 seg", 40, "Prancha Frontal")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Abdômen Definido & Lombar",
                "exercicios": [
                    ex_item("0147", 3, "16", 40, "Abdominal Bicicleta com Rotação"),
                    ex_item("0274", 4, "15", 40, "Abdominal Supra"),
                    ex_item("0133", 3, "25 seg/lado", 35, "Prancha Lateral"),
                    ex_item("0630", 3, "30 seg", 40, "Escalador (Mountain Climber)"),
                    ex_item("0942", 3, "30 seg", 20, "Postura do Gato")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Cardio & Queima Calórica",
                "exercicios": [
                    ex_item("3094", 4, "45 seg", 25, "Polichinelos"),
                    ex_item("0501", 3, "10", 45, "Burpee com Polichinelo"),
                    ex_item("0630", 4, "30 seg", 30, "Escalador"),
                    ex_item("3948", 3, "20", 40, "Agachamento Livre"),
                    ex_item("0463", 3, "40 seg", 40, "Prancha Frontal")
                ]
            }
        ]
    },
    {
        "id": "mes-3",
        "mesNumero": 3,
        "trimestre": "1º Trimestre",
        "semanas": "Semanas 9–12",
        "nivel": "Intermediário",
        "titulo": "Mês 3 • Fechamento 1º Trimestre (Queima & Fôlego)",
        "foco": "Treinos mais intensos com menor tempo de descanso para consolidar os primeiros 90 dias.",
        "duracao": "30 min",
        "duracaoMinutos": 30,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Full Body Metabólico",
                "exercicios": [
                    ex_item("3094", 4, "50 seg", 20, "Polichinelos"),
                    ex_item("0501", 4, "12", 45, "Burpee com Polichinelo"),
                    ex_item("0662", 4, "15", 40, "Flexão de Braços"),
                    ex_item("1064", 4, "18", 40, "Agachamento Sumô"),
                    ex_item("0630", 4, "35 seg", 30, "Escalador")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Inferiores Intensos",
                "exercicios": [
                    ex_item("0513", 3, "12", 45, "Agachamento com Salto"),
                    ex_item("3743", 3, "10 por perna", 45, "Agachamento Búlgaro (Cadeira)"),
                    ex_item("4950", 4, "14 por perna", 40, "Avanço / Afundo"),
                    ex_item("0726", 4, "15 por perna", 35, "Ponte Unilateral"),
                    ex_item("7557", 3, "45 seg", 45, "Wall Sit (Parede)")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • Superiores & Força",
                "exercicios": [
                    ex_item("0279", 3, "10", 45, "Flexão Declinada (Pés Elevados)"),
                    ex_item("0259", 4, "12", 45, "Flexão Pegada Fechada"),
                    ex_item("0129", 4, "15", 40, "Mergulho no Banco"),
                    ex_item("0699", 4, "20 toques", 35, "Prancha Toque no Ombro"),
                    ex_item("0463", 3, "45 seg", 40, "Prancha Frontal")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Core Total & Mobilidade",
                "exercicios": [
                    ex_item("0502", 3, "12", 40, "Canivete no Chão"),
                    ex_item("0147", 4, "20", 35, "Abdominal Bicicleta"),
                    ex_item("0133", 3, "35 seg/lado", 30, "Prancha Lateral"),
                    ex_item("0274", 4, "20", 35, "Abdominal Supra"),
                    ex_item("0560", 3, "35 seg/lado", 20, "Alongamento de Quadril")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Desafio Trimestral 90 Dias",
                "exercicios": [
                    ex_item("3094", 4, "60 seg", 20, "Polichinelos"),
                    ex_item("0501", 4, "15", 40, "Burpee com Polichinelo"),
                    ex_item("0513", 3, "15", 40, "Agachamento com Salto"),
                    ex_item("0662", 4, "15", 40, "Flexão de Braços"),
                    ex_item("0630", 4, "40 seg", 30, "Escalador")
                ]
            }
        ]
    },
    {
        "id": "mes-4",
        "mesNumero": 4,
        "trimestre": "2º Trimestre",
        "semanas": "Semanas 13–16",
        "nivel": "Intermediário +",
        "titulo": "Mês 4 • Força Unilateral & Calistenia",
        "foco": "Início do 2º Trimestre: sobrecarga usando ângulos, apoio unilateral e tempo sob tensão.",
        "duracao": "32 min",
        "duracaoMinutos": 32,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Empurrar & Core em Casa",
                "exercicios": [
                    ex_item("0279", 4, "12", 45, "Flexão Declinada"),
                    ex_item("0662", 4, "15", 40, "Flexão Tradicional"),
                    ex_item("0259", 3, "12", 45, "Flexão Fechada (Tríceps)"),
                    ex_item("0129", 4, "15", 40, "Mergulho no Banco"),
                    ex_item("0699", 4, "20 toques", 35, "Prancha Toque no Ombro")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Pernas Unilaterais & Glúteos",
                "exercicios": [
                    ex_item("3743", 4, "12 por perna", 45, "Agachamento Búlgaro com Cadeira"),
                    ex_item("2984", 3, "8 por perna", 50, "Agachamento Pistol Assistido (Cadeira)"),
                    ex_item("1064", 4, "20", 40, "Agachamento Sumô"),
                    ex_item("0726", 4, "18 por perna", 35, "Ponte Unilateral"),
                    ex_item("7557", 3, "50 seg", 40, "Wall Sit")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • HIIT Cardio & Agilidade",
                "exercicios": [
                    ex_item("3094", 4, "60 seg", 20, "Polichinelos"),
                    ex_item("0501", 4, "15", 35, "Burpees"),
                    ex_item("0630", 4, "45 seg", 25, "Escalador Rápido"),
                    ex_item("0513", 4, "15", 40, "Agachamento com Salto"),
                    ex_item("0463", 3, "50 seg", 35, "Prancha Frontal")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Abdômen Avançado & Coluna",
                "exercicios": [
                    ex_item("0502", 4, "15", 40, "Abdominal Canivete"),
                    ex_item("0147", 4, "24", 30, "Abdominal Bicicleta"),
                    ex_item("0133", 4, "40 seg/lado", 30, "Prancha Lateral"),
                    ex_item("0001", 4, "20", 35, "Abdominal 3/4"),
                    ex_item("0942", 3, "35 seg", 20, "Postura do Gato")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Corpo Inteiro Resistência",
                "exercicios": [
                    ex_item("3948", 4, "25", 40, "Agachamento Livre"),
                    ex_item("0662", 4, "18", 40, "Flexão de Braços"),
                    ex_item("4950", 4, "16 por perna", 40, "Afundo"),
                    ex_item("0129", 4, "15", 40, "Mergulho Tríceps"),
                    ex_item("0463", 3, "60 seg", 40, "Prancha 1 Minuto")
                ]
            }
        ]
    },
    {
        "id": "mes-5",
        "mesNumero": 5,
        "trimestre": "2º Trimestre",
        "semanas": "Semanas 17–20",
        "nivel": "Avançado",
        "titulo": "Mês 5 • Potência & Definição Atlética",
        "foco": "Movimentos explosivos, flexão arqueiro e alta densidade muscular sem aparelhos.",
        "duracao": "35 min",
        "duracaoMinutos": 35,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Peito & Braços Calistenia",
                "exercicios": [
                    ex_item("3294", 3, "8 por lado", 50, "Flexão Arqueiro"),
                    ex_item("0279", 4, "15", 40, "Flexão Declinada"),
                    ex_item("0259", 4, "15", 40, "Flexão Fechada"),
                    ex_item("0699", 4, "24 toques", 35, "Prancha Toque Ombro"),
                    ex_item("0129", 4, "18", 35, "Mergulho no Banco")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Pernas Explosivas",
                "exercicios": [
                    ex_item("0513", 4, "18", 40, "Agachamento com Salto"),
                    ex_item("2984", 4, "10 por perna", 45, "Pistol Squat na Cadeira"),
                    ex_item("3743", 4, "15 por perna", 40, "Agachamento Búlgaro"),
                    ex_item("0726", 4, "20 por perna", 30, "Ponte Unilateral"),
                    ex_item("7557", 3, "60 seg", 40, "Wall Sit 1 Minuto")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • Condicionamento Intenso",
                "exercicios": [
                    ex_item("0501", 5, "15", 35, "Burpees"),
                    ex_item("3094", 4, "60 seg", 20, "Polichinelos"),
                    ex_item("0630", 4, "50 seg", 25, "Escalador"),
                    ex_item("1064", 4, "22", 35, "Agachamento Sumô"),
                    ex_item("0463", 3, "60 seg", 35, "Prancha")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Core de Aço",
                "exercicios": [
                    ex_item("0502", 4, "18", 35, "Canivete no Chão"),
                    ex_item("0147", 4, "30", 30, "Abdominal Bicicleta"),
                    ex_item("0133", 4, "45 seg/lado", 30, "Prancha Lateral"),
                    ex_item("0630", 4, "45 seg", 30, "Escalador"),
                    ex_item("0560", 3, "40 seg/lado", 20, "Alongamento de Quadril")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Circuito Atlético Full Body",
                "exercicios": [
                    ex_item("3094", 4, "60 seg", 20, "Polichinelos"),
                    ex_item("3294", 3, "8 por lado", 45, "Flexão Arqueiro"),
                    ex_item("3743", 4, "12 por perna", 40, "Búlgaro"),
                    ex_item("0501", 4, "15", 35, "Burpees"),
                    ex_item("0463", 4, "60 seg", 35, "Prancha Frontal")
                ]
            }
        ]
    },
    {
        "id": "mes-6",
        "mesNumero": 6,
        "trimestre": "2º Trimestre",
        "semanas": "Semanas 21–24",
        "nivel": "Elite em Casa",
        "titulo": "Mês 6 • Desafio 180 Dias (Semestre Completo)",
        "foco": "Consolidação de 6 meses de transformação física, força máxima e condicionamento em casa.",
        "duracao": "40 min",
        "duracaoMinutos": 40,
        "sessoes": [
            {
                "dia": "Segunda",
                "nome": "Segunda • Superiores Elite",
                "exercicios": [
                    ex_item("3294", 4, "10 por lado", 45, "Flexão Arqueiro"),
                    ex_item("0279", 4, "18", 40, "Flexão Declinada"),
                    ex_item("0259", 4, "15", 40, "Flexão Fechada"),
                    ex_item("0129", 4, "20", 35, "Mergulho Tríceps"),
                    ex_item("0699", 4, "30 toques", 30, "Prancha Toque Ombro")
                ]
            },
            {
                "dia": "Terça",
                "nome": "Terça • Pernas Elite",
                "exercicios": [
                    ex_item("2984", 4, "12 por perna", 45, "Pistol Squat na Cadeira"),
                    ex_item("0513", 4, "20", 40, "Agachamento com Salto"),
                    ex_item("3743", 4, "15 por perna", 40, "Búlgaro"),
                    ex_item("0726", 4, "20 por perna", 30, "Ponte Unilateral"),
                    ex_item("7557", 4, "60 seg", 35, "Wall Sit")
                ]
            },
            {
                "dia": "Quarta",
                "nome": "Quarta • HIIT Semestre Máximo",
                "exercicios": [
                    ex_item("0501", 5, "18", 30, "Burpees"),
                    ex_item("3094", 5, "60 seg", 15, "Polichinelos"),
                    ex_item("0630", 5, "50 seg", 20, "Escalador"),
                    ex_item("0513", 4, "18", 35, "Agachamento com Salto"),
                    ex_item("0662", 4, "20", 35, "Flexões")
                ]
            },
            {
                "dia": "Quinta",
                "nome": "Quinta • Core & Descompressão",
                "exercicios": [
                    ex_item("0502", 4, "20", 35, "Abdominal Canivete"),
                    ex_item("0147", 4, "30", 30, "Bicicleta"),
                    ex_item("0463", 4, "65 seg", 30, "Prancha Frontal"),
                    ex_item("0133", 4, "45 seg/lado", 25, "Prancha Lateral"),
                    ex_item("0942", 3, "40 seg", 20, "Postura do Gato")
                ]
            },
            {
                "dia": "Sexta",
                "nome": "Sexta • Grande Final 6 Meses",
                "exercicios": [
                    ex_item("3094", 4, "60 seg", 15, "Polichinelos"),
                    ex_item("0501", 4, "18", 35, "Burpees"),
                    ex_item("3294", 4, "10 por lado", 40, "Flexão Arqueiro"),
                    ex_item("2984", 4, "12 por perna", 40, "Pistol Squat"),
                    ex_item("0463", 4, "70 seg", 30, "Prancha Final")
                ]
            }
        ]
    }
]

out_path = os.path.join("frontend", "src", "data", "homeJourney6Months.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(JOURNEY, f, ensure_ascii=False, indent=2)

print(f"Jornada 6 Meses salva com sucesso em {out_path} ({len(JOURNEY)} meses, {sum(len(m['sessoes']) for m in JOURNEY)} treinos diarios)")
