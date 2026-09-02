import re

def clean_tags_in_concept():
    path = r"c:\Users\hanwha\Desktop\PIRELLI\AI AGENT\v0.01\concept.md"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("태그를 관리하여", "카테고리별로 체계화하여")
    content = content.replace("사용자 정의 카테고리 & 태그 관리", "사용자 정의 카테고리 관리")
    content = content.replace("사용자 정의 카테고리/태그", "사용자 정의 카테고리")
    content = content.replace("커스텀 카테고리/태그", "커스텀 카테고리")
    content = content.replace("카테고리 및 태그", "카테고리")
    content = content.replace("커스텀 태그(#제로점재설정, #위치센서) 관리", "문서를 체계적으로 분류 매핑")
    content = content.replace("태그 기반 원클릭 필터링 뷰", "카테고리별 문서 목록 뷰")
    content = content.replace(" 및 태그(#센서교체) 생성/관리", " 생성 및 문서 분류 관리")
    content = content.replace(" 및 태그(#센서교체, #서보초기화) 생성/관리", " 생성 및 문서 분류 관리")
    content = content.replace(" 및 태그 생성/관리", " 계층 관리")
    content = content.replace("커스텀 카테고리/태그 관리 기능", "커스텀 카테고리 관리 기능")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("concept.md cleaned successfully.")

def clean_tags_in_features():
    path = r"c:\Users\hanwha\Desktop\PIRELLI\AI AGENT\v0.01\features.md"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("• 커스텀 카테고리/태그", "• 커스텀 카테고리 관리")
    content = content.replace("사용자 정의 카테고리/태그로 분류하여", "사용자 정의 카테고리로 분류하여")
    content = content.replace("사용자 정의 카테고리 & 태그 관리", "사용자 정의 카테고리 관리")
    content = content.replace("커스텀 카테고리(예: \"AGV 3호기 전용\") 및 태그(#센서교체) 생성/관리", "커스텀 카테고리(예: \"AGV 3호기 전용\") 생성 및 문서 분류 관리")
    content = content.replace("카테고리명, 태그 키워드, 문서 매핑 입력", "카테고리명, 상위/하위 분류, 문서 매핑 입력")
    content = content.replace("사용자 정의 태그/카테고리 메타데이터 매핑", "사용자 정의 카테고리 경로 메타데이터 매핑")
    content = content.replace("태그 기반 고속 필터링 트리 구성", "카테고리 기반 고속 필터링 트리 구성")
    content = content.replace("• 계층형 카테고리 트리 UI\n• 태그 기반 원클릭 필터링 뷰", "• 계층형 카테고리 트리 UI\n• 카테고리별 문서 목록 뷰")
    content = content.replace("커스텀 카테고리/태그 관리", "커스텀 카테고리 관리")
    content = content.replace("사용자 정의 카테고리/태그", "사용자 정의 카테고리")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("features.md cleaned successfully.")

if __name__ == "__main__":
    clean_tags_in_concept()
    clean_tags_in_features()
