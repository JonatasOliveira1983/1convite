# GUIA TÉCNICO: CALIBRAÇÃO E FINE-TUNING DOS MENTORES LAYA

> Sistema 1Convite — Inteligência Bíblica & Caminhada Diária
> Documento técnico canônico de referência para calibração hermenêutica e treinamento de modelos de linguagem.

---

## 1. Filosofia de Especialização em 3 Níveis

Seguindo a arquitetura canônica da Base Tecnológica, a inteligência da LAYA é especializada em três camadas progressivas:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Nível 1: RAG Bíblico Local & Nuvem (BM25 Okapi)                        │
│ └── Zero custo de treino, resposta instantânea (< 5ms).                │
│     Uso: 31.106 versículos da ACF, Dicionário Teológico, Matriz 365.   │
├────────────────────────────────────────────────────────────────────────┤
│ Nível 2: Roteamento Semântico e Intenção em CPU                        │
│ └── Classificador local de palavras-chave e n-grams.                   │
│     Uso: Identificação do mentor sugerido (Jesus, Salomão, Davi, etc). │
├────────────────────────────────────────────────────────────────────────┤
│ Nível 3: Fine-Tuning LoRA / QLoRA de LLM (Unsloth / PEFT)              │
│ └── Calibração profunda de estilo pastoral, vocabulário e autoridade.   │
│     Uso: Redação compassiva de orações, conselhos e desafios práticos. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Estrutura do Dataset de Instrução

O dataset canônico reside em [`tools/tuning/laya_mentores_instruction.jsonl`](file:///tools/tuning/laya_mentores_instruction.jsonl) no formato Chat JSONL (compatível com Hugging Face ChatML, OpenAI Fine-Tuning e Llama-Factory).

### Especificação de Papéis (Personas Canônicas)
1. **Jesus Cristo (`jesus`)**: Tom de mestre amoroso, autoridade divina e graça restauradora. Aconselhamento focado no Sermão da Montanha, salvação e descanso da alma.
2. **Rei Salomão (`salomao`)**: Tom objetivo, analítico, focado na gestão diligente do trabalho, finanças, prudência contratual e relacionamentos saudáveis.
3. **Rei Davi (`davi`)**: Tom apaixonado, íntimo, focado no quebrantamento diante de Deus, superação de gigantes e louvor na adversidade.
4. **Apóstolo Paulo (`paulo`)**: Tom apostólico, teológico, focado no propósito eterno, combate da fé e alegria em meio às prisões.
5. **Moisés (`moises`)**: Tom pastoral e humilde, focado na perseverança pelo deserto, delegação de tarefas e intimidade face a face.
6. **Rainha Ester (`ester`)**: Tom estratégico, solene e corajoso, focado no jejum, discernimento do tempo certo e posicionamento diante dos reis.

---

## 3. Receita de Treinamento com Unsloth (LoRA / QLoRA)

Para treinar adaptadores com consumo inferior a 6 GB de VRAM (compatível com Google Colab gratuito T4 ou GPUs locais):

```python
from unsloth import FastLanguageModel
from trl import SFTTrainer
from transformers import TrainingArguments
from datasets import load_dataset

# 1. Carregamento do Modelo Base em 4-bits
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="Qwen/Qwen2.5-3B-Instruct",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=True,
)

# 2. Configuração dos Adaptadores LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing=True,
)

# 3. Carregamento do Dataset 1Convite
dataset = load_dataset("json", data_files="tools/tuning/laya_mentores_instruction.jsonl", split="train")

# 4. Hiperparâmetros de Treinamento
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="messages",
    max_seq_length=2048,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60,
        learning_rate=2e-4,
        fp16=not FastLanguageModel.is_bfloat16_supported(),
        bf16=FastLanguageModel.is_bfloat16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs_laya_lora",
    ),
)

# 5. Executar Treinamento
trainer_stats = trainer.train()

# 6. Salvar Adaptador LoRA e Exportar GGUF
model.save_pretrained_merged("laya_qwen_lora", tokenizer, save_method="merged_16bit")
model.save_pretrained_gguf("laya_qwen_q4", tokenizer, quantization_method="q4_k_m")
```

---

## 4. Avaliação e Critérios de Aprovação do Modelo

Antes de qualquer peso ser promovido a produção, o modelo calibrado deve passar pela seguinte régua hermenêutica:
1. **Zero Distorção Doutrinária**: Toda afirmação teológica deve ter correspondência direta com o cânon bíblico da ACF.
2. **Identidade Clara do Mentor**: Jesus não deve usar termos burocráticos de Salomão; Salomão não deve romantizar a má gestão financeira.
3. **Ausência de Alucinação de Capítulos**: Versículos citados devem existir exatamente na Bíblia ACF indexada no RAG.
