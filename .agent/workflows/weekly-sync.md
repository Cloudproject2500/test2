---
description: 매주 일요일 18:00에 실행되는 학업 스케줄 동기화 및 주간 계획 생성 워크플로우
---

// turbo-all
# /weekly-sync Workflow

이 워크플로우는 학생의 Canvas 데이터를 스캔하고, 다음 한 주의 학업 계획을 시뮬레이션 및 검증한 후 통보합니다.

## [Scan] - 데이터 스캔
1. Canvas API 및 공지사항을 스캔하여 최신 데이터를 수집합니다.
   `npm run scan-canvas` (가상 명령어)

## [Extract] - 정보 추출
2. `Canvas-Parser`를 통해 마감 기한, 장소, 시험 공지를 JSON으로 추출합니다.

## [Plan] - 주간 계획 생성
3. `Smart-Scheduler`를 활용하여 시간순으로 정렬된 'Weekly Implementation Plan' 아티팩트를 생성합니다.

## [Verify] - 시뮬레이션 및 검증
4. 브라우저 대시보드에서 생성된 계획을 시뮬레이션합니다.
5. 시스템 로그 및 무결성 검증을 수행합니다.

## [Finalize] - 최종 통보
6. `Notification-Dispatcher`를 통해 학생의 개인 플랫폼으로 푸시 알림을 전송합니다.
7. 로컬 DB와 동기화를 완료합니다.
