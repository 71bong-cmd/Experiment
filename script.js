// --- HTML 요소 가져오기 ---
const startScreen = document.getElementById('start-screen');
const demographicsScreen = document.getElementById('demographics-screen');
const experimentScreen = document.getElementById('experiment-screen');

const startButton = document.getElementById('start-button');
const startMainButton = document.getElementById('start-main-button');

const questionTextElement = document.getElementById('question-text');
const leftImageElement = document.getElementById('image-left');
const rightImageElement = document.getElementById('image-right');
const imageContainer = document.querySelector('.image-container');

// --- 실험 데이터 ---
const trialsPerQuestion = 10;
const experimentData = [
    { question: "첫 번째 질문: 둘 중 더 편안해 보이는 이미지는 무엇인가요?", imagePool: ['scenery_1.jpg', 'scenery_2.jpg', 'scenery_3.jpg', 'scenery_4.jpg', 'scenery_5.jpg', 'scenery_6.jpg', 'scenery_7.jpg', 'scenery_8.jpg'] },
    { question: "두 번째 질문: 더 역동적으로 느껴지는 이미지는 무엇인가요?", imagePool: ['sports_1.jpg', 'sports_2.jpg', 'sports_3.jpg', 'sports_4.jpg', 'sports_5.jpg', 'sports_6.jpg', 'sports_7.jpg', 'sports_8.jpg'] },
];

// --- 결과 저장 변수 ---
let participantInfo = {}; // 참가자 정보 저장 객체
const results = [];
let currentQuestionIndex = 0;
let currentPairCount = 0;

// --- 함수들 (이전과 동일) ---
function displayRandomPair() { /* ... 이전과 동일 ... */ }
function endExperiment() { /* ... 이전과 동일 ... */ }
function handleImageClick(event) { /* ... 이전과 동일 ... */ }

// --- (동일한 함수 코드는 공간 절약을 위해 생략, 실제 파일에는 전체 코드를 붙여넣으세요) ---
function displayRandomPair() {
    const currentQuestionData = experimentData[currentQuestionIndex]; const pool = currentQuestionData.imagePool;
    if (pool.length < 2) { console.error("이미지 풀 부족!"); return; }
    let index1 = Math.floor(Math.random() * pool.length); let index2 = Math.floor(Math.random() * pool.length);
    while (index1 === index2) { index2 = Math.floor(Math.random() * pool.length); }
    const image1 = pool[index1]; const image2 = pool[index2];
    questionTextElement.textContent = `(${currentPairCount + 1}/${trialsPerQuestion}) ${currentQuestionData.question}`;
    leftImageElement.src = 'images/' + image1; rightImageElement.src = 'images/' + image2;
    leftImageElement.dataset.filename = image1; rightImageElement.dataset.filename = image2;
}
function endExperiment() {
    // 최종 결과에 참가자 정보도 함께 기록
    console.log("--- 참가자 정보 ---", participantInfo);
    console.log("--- 최종 실험 결과 ---", results);
    questionTextElement.textContent = "실험이 종료되었습니다. 참여해주셔서 감사합니다!";
    imageContainer.style.display = 'none';
    alert("실험이 종료되었습니다. F12를 눌러 콘솔에서 최종 결과를 확인하세요.");
}
function handleImageClick(event) {
    const chosenImage = event.target.dataset.filename; const leftImage = leftImageElement.dataset.filename; const rightImage = rightImageElement.dataset.filename;
    const resultData = { questionIndex: currentQuestionIndex, questionText: experimentData[currentQuestionIndex].question, trialNumber: currentPairCount + 1, shownImages: [leftImage, rightImage], chosenImage: chosenImage, timestamp: new Date() };
    results.push(resultData);
    currentPairCount++;
    if (currentPairCount >= trialsPerQuestion) {
        currentQuestionIndex++; currentPairCount = 0;
        if (currentQuestionIndex >= experimentData.length) { endExperiment(); return; }
    }
    displayRandomPair();
}


// --- 이벤트 리스너 설정 (핵심 로직 변경) ---

// 1. 첫 시작 버튼 클릭: 시작 화면 숨기고 -> 정보 입력 화면 보여주기
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    demographicsScreen.classList.remove('hidden');
});

// 2. 본 실험 시작 버튼 클릭: 정보 저장하고 -> 정보 화면 숨기고 -> 실험 화면 보여주기
startMainButton.addEventListener('click', () => {
    // 선택된 값 가져오기
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age-select').value;

    // 유효성 검사: 둘 다 선택했는지 확인
    if (!gender || age === "") {
        alert("성별과 연령대를 모두 선택해주세요.");
        return; // 선택 안 했으면 넘어가지 않음
    }

    // 참가자 정보 저장
    participantInfo = {
        gender: gender.value,
        age: age
    };

    // 화면 전환
    demographicsScreen.classList.add('hidden');
    experimentScreen.classList.remove('hidden');

    // 진짜 실험 시작
    displayRandomPair();
});

// 3. 이미지 클릭 리스너
leftImageElement.addEventListener('click', handleImageClick);
rightImageElement.addEventListener('click', handleImageClick);