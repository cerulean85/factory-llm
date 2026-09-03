import os
from ollama import Client

# Ollama 호스트 주소
OLLAMA_HOST = "http://localhost:11434"

# 프롬프트 파일 경로
CLAS_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompt", "clas-slm.md")
PLAN_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompt", "plan-slm.md")
PROC_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompt", "proc-slm.md")


def load_system_prompt(file_path: str) -> str:
    """프롬프트 마크다운 파일을 읽어옵니다."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"프롬프트 파일을 읽는 중 오류 발생: {e}")
        return ""

def chat_ollama_gemma2_2b_clas_slm(user_input: str):
    system_prompt = load_system_prompt(CLAS_PROMPT_PATH)
    
    try:
        print(f"질문: {user_input}")
        print("Ollama(gemma2:2b) 모델 분류 중...")
        
        client = Client(host=OLLAMA_HOST)
        response = client.chat(
            model="gemma2:2b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )
        return response['message']['content']
    except Exception as e:
        print(f"오류가 발생했습니다: {e}")

def chat_ollama_gemma2_2b_plan_slm(user_input: str):
    system_prompt = load_system_prompt(PLAN_PROMPT_PATH)
    
    try:
        print(f"질문: {user_input}")
        print("Ollama(gemma2:2b) 모델 계획 수립 중...")
        
        client = Client(host=OLLAMA_HOST)
        response = client.chat(
            model="gemma2:2b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )
        return response['message']['content']
    except Exception as e:
        print(f"오류가 발생했습니다: {e}")

if __name__ == "__main__":
    # 테스트 예시 입력
    test_query = "Gantry 설비의 지난 1개월 간의 가동 내역을 집계해서 보여줘!"
    category = chat_ollama_gemma2_2b_clas_slm(test_query)
    print(f"분류된 카테고리: {category}")
    plan = chat_ollama_gemma2_2b_plan_slm(test_query)
    print(f"계획된 작업: {plan}")


