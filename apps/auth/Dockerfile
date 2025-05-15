# 1. Node.js 이미지를 사용
FROM node:18

# 2. 작업 디렉토리 생성
WORKDIR /app

# 4. 애플리케이션 파일 복사
COPY . .

# 3. 의존성 설치
RUN npm install
RUN npm run build

EXPOSE 3001

# 5. 애플리케이션 실행
CMD ["npm", "run", "start"]
