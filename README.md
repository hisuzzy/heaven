# HEAVEN 체크리스트 서버 버전 v2

수정사항:
- 업로드 이미지 크기를 줄여 Netlify Function 요청 용량 제한에 덜 걸리게 수정
- Netlify Functions classic handler 방식으로 변경
- 테스트용 /.netlify/functions/ping 엔드포인트 추가

배포 후 테스트:
1. https://사이트주소/.netlify/functions/ping 접속
2. ok 가 나오면 Functions는 배포 성공
3. 체크리스트에서 이미지 저장하기 테스트
