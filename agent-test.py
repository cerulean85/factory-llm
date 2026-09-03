# agent-test.py
import ollama
import json
import re
import requests
import os

TITAN_BASE_URL = "http://localhost:3301"

def load_file(path: str) -> str:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

# plan-slm.md와 api-spec.md를 읽어 시스템 프롬프트 구성
PLAN_SLM_ROLE = load_file("prompt/plan-slm.md")
API_SPEC = load_file("prompt/api-spec.md")

def extract_api_catalog_by_groups(spec_text: str) -> dict:
    """OpenAPI 105개 엔드포인트를 그룹별로 구조화하여 파싱"""
    lines = spec_text.split('\n')
    groups = {}
    current_group = "GENERAL"
    current_api = {}
    is_param_section = False
    
    for line in lines:
        line_s = line.strip()
        if line_s.startswith('## ') and not line_s.startswith('## 문서') and not line_s.startswith('## 그룹'):
            current_group = line_s.replace('## ', '').strip()
            if current_group not in groups:
                groups[current_group] = []
        elif line_s.startswith('### '):
            if current_api.get('endpoint'):
                groups.setdefault(current_group, []).append(current_api)
            current_api = {'name': line_s.replace('### ', '').strip(), 'params': [], 'group': current_group}
            is_param_section = False
        elif line_s.startswith('`') and any(m in line_s for m in ['GET ', 'POST ', 'PUT ', 'PATCH ', 'DELETE ']):
            content = line_s.replace('`', '').strip()
            parts = content.split(' ', 1)
            if len(parts) == 2 and parts[0] in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']:
                current_api['method'] = parts[0]
                current_api['endpoint'] = parts[1]
        elif line_s.startswith('- 설명:'):
            current_api['desc'] = line_s.replace('- 설명:', '').strip()
        elif any(line_s.startswith(p) for p in ['#### Request Body', '#### Path Parameters', '#### Query Parameters']):
            is_param_section = True
        elif any(line_s.startswith(p) for p in ['#### Responses', '## ']):
            is_param_section = False
        elif is_param_section and line_s.startswith('|') and ('★' in line_s or '○' in line_s) and not any(k in line_s for k in ['필드', '---', '이름', '위치']):
            parts = [p.strip() for p in line_s.split('|')]
            if len(parts) >= 5:
                req = "필수" if "★" in line_s else "선택"
                backticks = [p.replace('`', '').strip() for p in parts if '`' in p]
                if len(backticks) >= 2:
                    p_name = backticks[0]
                    p_type = backticks[1]
                    desc_candidates = [p for p in parts if p and p not in ['★', '○', 'path', 'query', '-'] and not p.startswith('`') and not p.endswith('`')]
                    p_desc = desc_candidates[0] if desc_candidates else ""
                    current_api['params'].append(f"    * {p_name} ({p_type}, {req}): {p_desc}")

    if current_api.get('endpoint'):
        groups.setdefault(current_group, []).append(current_api)
        
    return groups

GROUPED_APIS = extract_api_catalog_by_groups(API_SPEC)

def get_relevant_api_catalog(query: str) -> str:
    """질문 키워드와 연관된 API 그룹을 선별하여 2B 모델에게 최적화된 API 카탈로그 제공"""
    q = query.lower()
    selected_apis = []
    
    # 키워드 매핑
    target_groups = set()
    if any(k in q for k in ['알람', '경보', '에러', 'alarm', '장애']):
        target_groups.update(['ALARM', 'ALARM-HISTORY', 'ALARM-MESSAGE-DISPATCH'])
    if any(k in q for k in ['설비', '가동', '비가동', 'oee', '정지', 'equipment', '갠트리', '크레인', 'rgv']):
        target_groups.update(['EQUIPMENT', 'EQUIPMENT-OPERATION-HISTORY', 'EQUIPMENT-OPERATION-MAINTENANCE', 'EQUIPMENT-TYPE', 'CRANE-ITEM-HISTORY', 'GANTRY-ITEM-HISTORY'])
    if any(k in q for k in ['출하', '출고', '재고', '창고', '셀', '랙', '적재', 'pallet', 'shipping', 'warehouse', 'cell']):
        target_groups.update(['SHIPPING-SPECIFICATION', 'CELL-VIEW', 'CRANE-ITEM-HISTORY', 'WAREHOUSE'])
    if any(k in q for k in ['대시보드', '요약', '현황', 'dash']):
        target_groups.update(['DASH-BOARD', 'EQUIPMENT-OPERATION-HISTORY', 'ALARM-HISTORY'])
    if any(k in q for k in ['사용자', '로그인', '유저', '계정', 'user']):
        target_groups.update(['USERS', 'HISTORY'])
        
    if not target_groups:
        # 특정되지 않은 경우 주요 핵심 조회 API 제공
        target_groups = set(['EQUIPMENT-OPERATION-HISTORY', 'ALARM-HISTORY', 'DASH-BOARD', 'SHIPPING-SPECIFICATION', 'CELL-VIEW'])

    for grp in target_groups:
        if grp in GROUPED_APIS:
            selected_apis.extend(GROUPED_APIS[grp])

    formatted = []
    for api in selected_apis:
        p_str = "\n".join(api['params']) if api['params'] else "    (파라미터 없음)"
        desc = api.get('desc') or api.get('name')
        formatted.append(f"- [{api.get('method', 'POST')}] {api['endpoint']}\n  설명: {desc}\n  파라미터:\n{p_str}")
    return "\n\n".join(formatted)

def call_titan_api(endpoint: str, method: str, params: dict):
    # Path parameter 치환 (예: /alarm/{alarmId} -> /alarm/1)
    call_params = dict(params)
    for k, v in list(call_params.items()):
        if f"{{{k}}}" in endpoint:
            endpoint = endpoint.replace(f"{{{k}}}", str(v))
            call_params.pop(k, None)
            
    url = f"{TITAN_BASE_URL}{endpoint}"
    method = method.upper()
    try:
        if method == 'POST':
            res = requests.post(url, json=call_params, timeout=10)
        elif method == 'GET':
            res = requests.get(url, params=call_params, timeout=10)
        elif method == 'PUT':
            res = requests.put(url, json=call_params, timeout=10)
        elif method == 'PATCH':
            res = requests.patch(url, json=call_params, timeout=10)
        elif method == 'DELETE':
            res = requests.delete(url, json=call_params, timeout=10)
        else:
            return {"error": f"Unsupported method: {method}"}
        return res.json()
    except Exception as e:
        return {"error": f"API 호출 실패: {str(e)}"}

def parse_plan_json(text: str) -> dict:
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        return {}
    json_str = match.group()
    try:
        return json.loads(json_str)
    except Exception:
        # 2B 모델의 흔한 누락 콤마(,) 자동 보정
        fixed_str = re.sub(r'([0-9]|true|false|null|"[^"]*")\s*\n\s*(")', r'\1,\n\2', json_str)
        try:
            return json.loads(fixed_str)
        except Exception as e:
            print(f"JSON 파싱 실패: {e}")
            return {}

def run_agent(query: str):
    print(f"질문: {query}\n")
    
    # 1차 호출 (Plan-SLM): 질의와 관련된 API 카탈로그를 프롬프트에 주입
    relevant_catalog = get_relevant_api_catalog(query)
    system_prompt = f"""
당신은 공장 관리 시스템의 API 호출 계획을 수립하는 Plan-SLM입니다.
아래 [사용 가능한 API 목록]을 참조하여 사용자의 질문을 해결하기 위한 API Endpoint, Method, Parameters를 결정하세요.

[사용 가능한 API 목록]
{relevant_catalog}

[출력 규칙]
반드시 아래 JSON 포맷으로만 응답해야 합니다. 부연 설명이나 인사말은 일체 작성하지 마세요.

{{
  "endpoint": "/equipment-operation-history/get-aggregation",
  "method": "POST",
  "parameters": {{
    "startDate": "2026-08-01",
    "endDate": "2026-08-31"
  }}
}}

호출할 API가 없다면 아래와 같이 출력하세요:
{{
  "endpoint": "none",
  "method": "GET",
  "parameters": {{}}
}}
"""

    print("1. Gemma(Plan-SLM)가 호출할 API 계획 수립 중...")
    plan_res = ollama.chat(
        model='gemma2:2b',
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': query}
        ]
    )
    plan_text = plan_res['message']['content']
    print(f"[Plan 결과]:\n{plan_text}\n")
    
    plan_json = parse_plan_json(plan_text)
    endpoint = plan_json.get('endpoint') or plan_json.get('tool')
    method = plan_json.get('method', 'POST')
    params = plan_json.get('parameters', {})

    # 2. 실제 API 호출
    if endpoint and endpoint != 'none':
        # 구버전 tool 네이밍 대비 호환 처리
        if endpoint == 'get_equipment_aggregation':
            endpoint = '/equipment-operation-history/get-aggregation'
            
        print(f"2. Titan WAS API 호출 중: {method} {endpoint} (인자: {params})")
        api_data = call_titan_api(endpoint, method, params)        
        print(f"[API 응답 데이터 수신 완료]\n")
        
        # 3. 2차 호출 (Proc-SLM): 데이터 바탕으로 최종 답변 작성
        print("3. Gemma(Proc-SLM)가 최종 답변 생성 중...")
        
        # 설비 가동 내역인 경우 슬림화 전처리, 그 외는 API 원본 데이터 사용
        raw_list = api_data.get('data', [])
        if isinstance(raw_list, list) and len(raw_list) > 0 and 'equipmentTypeName' in raw_list[0]:
            target_data = [
                {
                    "유형": item.get("equipmentTypeName"),
                    "설비명": item.get("equipmentName"),
                    "상태": item.get("currentOperationStatus"),
                    "가동시간(분)": item.get("totalRunningMin"),
                    "가동률(%)": item.get("operationRate")
                }
                for item in raw_list
            ]
        else:
            target_data = api_data

        final_prompt = f"""
당신은 공장 관리 시스템의 설비 현황을 보고하는 한국인 AI 어시스턴트입니다.
아래 제공된 [조회 데이터]를 기반으로 사용자의 [질문]에 대한 분석 보고서를 한국어로 작성하세요.

[질문]
{query}

[조회 데이터]
{json.dumps(target_data, ensure_ascii=False, indent=1)}

[답변 작성 규칙]
1. 전체 요약 (총 설비 대수, 전체 가동 상태)을 먼저 작성하세요.
2. [조회 데이터]의 각 설비 항목을 바탕으로 마크다운 표(Table)를 작성하세요.
   - 컬럼: 설비명 | 유형 | 상태 | 가동시간(분) | 가동률(%)
   - 빈 칸이나 괄호 [ ]를 남기지 말고 실제 설비명(G211, SC1, RGV_1_1 등), 가동시간(분), 가동률(%) 값을 표의 행으로 채우세요.
3. 모든 설명과 요약은 자연스러운 한국어로 작성하세요.
"""
        final_res = ollama.chat(
            model='gemma2:2b',
            messages=[
                {'role': 'user', 'content': final_prompt}
            ]
        )
        print("\n=== 최종 답변 ===")
        print(final_res['message']['content'])
    else:
        print("호출할 API가 없어 일반 응답으로 처리합니다.")

if __name__ == "__main__":
    import sys
    test_query = sys.argv[1] if len(sys.argv) > 1 else "2026년 8월 1일부터 8월 31일까지 설비 가동 내역 집계해줘"
    run_agent(test_query)


