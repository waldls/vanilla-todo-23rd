# [CEOS 23rd Week1] - Vanilla Todo

캘린더를 기준으로 날짜별 할 일을 관리하고, 오늘과 이번 달 진행 상황을 함께 확인할 수 있는 [Vanilla Todo](https://vanilla-todo-23rd.vercel.app/) 프로젝트입니다.

HTML, CSS, JavaScript만으로 캘린더 UI와 Todo 상태 관리를 직접 구현했습니다.

## 주요 기능

- 날짜 선택 기반 Todo 추가, 완료, 삭제
- 월간 캘린더에서 날짜 이동 및 선택
- 오늘/월별 Todo 통계 제공
- `localStorage` 기반 데이터 저장
- 모바일과 데스크톱에 대응하는 반응형 UI

## 폴더 구조

```text
vanilla-todo-23rd/
├─ index.html             # 앱의 마크업 구조
├─ script.js              # 캘린더, Todo, 통계 로직
└─ style.css              # 전체 UI 스타일 및 반응형 스타일
```

## 기술 스택

| 구분       | 기술                                                                                                                 | 사용 이유                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Markup     | <img src="https://img.shields.io/badge/html5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" />           | 시맨틱한 구조로 캘린더, 통계, Todo 입력/목록 UI를 구성하기 위해 사용    |
| Styling    | <img src="https://img.shields.io/badge/css3-663399.svg?style=for-the-badge&logo=css&logoColor=white" />              | 레이아웃, 상태별 스타일, 반응형 UI를 직접 제어하기 위해 사용            |
| Language   | <img src="https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" /> | 캘린더 렌더링, Todo CRUD, 통계 계산 등 동적인 동작을 구현하기 위해 사용 |
| Formatting | <img src="https://img.shields.io/badge/prettier-1A2B34.svg?style=for-the-badge&logo=prettier&logoColor=F7B93E" />    | 코드 포맷을 일관되게 유지해 가독성과 유지보수성을 높이기 위해 사용      |
| Deploy     | <img src="https://img.shields.io/badge/vercel-000000.svg?style=for-the-badge&logo=vercel&logoColor=white" />         | 정적 웹 앱을 배포하고 실제 동작을 빠르게 확인하기 위해 사용             |

## 실행 방법

```bash
git clone -b waldls https://github.com/waldls/vanilla-todo-23rd.git
cd vanilla-todo-23rd
```

이후 `index.html`을 브라우저에서 열면 별도의 빌드 과정 없이 바로 실행할 수 있습니다.
