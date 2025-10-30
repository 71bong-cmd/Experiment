const startScreen = document.getElementById('start-screen');
const introScreen = document.getElementById('intro-screen');
const demographicsScreen = document.getElementById('demographics-screen');
const questionIntroScreen = document.getElementById('question-intro-screen');
const experimentScreen = document.getElementById('experiment-screen');

const startButton = document.getElementById('start-button');
const introNextButton = document.getElementById('intro-next-button');
const startMainButton = document.getElementById('start-main-button');
const startSessionButton = document.getElementById('start-session-button');

const questionDescriptionElement = document.getElementById('question-description');
const questionTextElement = document.getElementById('question-text');
const leftImageElement = document.getElementById('image-left');
const rightImageElement = document.getElementById('image-right');
const imageContainer = document.querySelector('.image-container');

const trialsPerQuestion = 10;
// 001.png ~ 080.png, 'images/' 접두사가 이미 src 세팅에 있으니 여기선 'Scenery/'까지만!
const sceneryPool = Array.from(
  { length: 80 },
  (_, i) => `Scenery/${String(i + 1).padStart(3, '0')}.png`
);

const experimentData = [
    {
        question: "Q1. 두 장소 중, 전반적으로 더 마음이 끌리는 곳은 어디인가요?",
        description: "첫 번째 세션에서는 두 장소에 대한 전반적인 선호를 평가합니다.<br><br>여기서 단순히 보기 좋은 곳을 넘어 (1) 안전하고 편안하게 느껴져 쉽게 이해할 수 있으면서도, (2) 동시에 무언가 더 둘러보고 싶게 만드는 흥미로운 곳<br><br>이 두 가지 측면을 종합적으로 고려하여, 두 장소 중 어느 곳이 더 선호되는지 선택해 주세요.",
        imagePool: sceneryPool
    },
    {
        question: "Q2. 두 장소 중, 전체적으로 더 질서 있고 조화롭게 느껴지는 곳은 어디인가요?",
        description: "두 번째 세션에서는 두 장소에 대한 경관의 통일성을 평가합니다.<br><br>'통일성 있는 장소'란, 그곳을 이루는 여러 요소들(예: 건물, 나무, 포장, 간판 등)이 서로 잘 어우러져 시각적으로 질서 있고 조화롭게 느껴지는 곳을 의미합니다.<br>또한, 장면이 복합하더라도, 일정한 패턴이나 규칙이 있어 한눈에 쉽게 파악할 수 있는 곳입니다.<br><br>이 기준에 따라, 두 장소 중 어느 곳이 더 통일성 있게 느껴지는지 선택해 주세요.",
        imagePool: sceneryPool
    },
    {
        question: "Q3. 두 장소 중, 시각적으로 더 다채롭고 흥미로운 요소가 많다고 느껴지는 곳은 어디인가요?",
        description: "세 번째 세션에서는 두 장소에 대한 경관의 복합성을 평가합니다.<br><br>'복합성 있는 장소'란, 그곳을 이루는 여러 요소들(예: 건물, 나무, 포장, 간판 등)이 얼마나 다채롭고 풍부하여 볼거리를 많이 제공하는지를 의미합니다.<br>또한, 장면이 지루하지 않고, 탐색하고 싶은 흥미로운 것들이 많은 곳입니다.<br><br>이 기준에 따라, 두 장소 중 어느 곳이 더 다채롭고 흥미로운 요소가 많다고 느껴지는지 선택해 주세요.",
        imagePool: sceneryPool
    },
    {
        question: "Q4. 두 장소 중, 처음 방문하더라도 길을 잃지 않고 더 쉽게 다닐 수 있을 것 같은 곳은 어디인가요?",
        description: "네 번째 세션에서는 두 장소에 대한 경관의 가독성을 평가합니다.<br><br>'가독성 있는 장소'란, 그 공간의 구조가 명확하고 알기 쉽게 구성되어 있어 처음 방문하더라도 길을 잃지 않고 쉽게 목적지를 찾아갈 수 있을 것 같은 곳을 의미합니다.<br>눈에 띄는 건물이나 표지판이 있거나, 길이 단순하여 전체적인 지도를 머릿속에 그리기 쉬운 곳입니다.<br><br>이 기준에 따라, 두 장소 중 어느 곳이 더 가독성 있게 느껴지는지 선택해 주세요.",
        imagePool: sceneryPool
    },
    {
        question: "Q5. 두 경관 중, 저 너머에 무엇이 있을지 궁금해지고 더 들어가 보고 싶다는 호기심이 생기는 곳은 어디인가요?",
        description: "마지막 세션에서는 두 장소에 대한 경관의 신비성을 평가합니다.<br><br>'신비감 있는 장소'란, 현재 보이는 것 너머에 무언가 더 있을 것이라는 기대감을 주어 더 탐험해보고 싶게 만드는 곳을 의미합니다.<br>예를 들어, 길이 살짝 굽어있거나 나무에 가려져 있어, 저 모퉁이를 돌면 무엇이 나올지 궁금해지는 곳입니다.<br><br>이 기준에 따라, 두 장소 중 어느 곳이 더 신비감 있게 느껴지는지 선택해 주세요.",
        imagePool: sceneryPool
    }
];

let participantInfo = {};
let currentQuestionIndex = 0;
let currentPairCount = 0;

function sendDataToGoogleForm(data) {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdKjrPw9qH-V5dCnQCzfzt9dKyo6CogO6_mxjuJOpM-soqmUQ/formResponse";
    
    const formData = new FormData();
    formData.append("entry.358687263", data.name || "");
    formData.append("entry.1354431399", data.contact || "");
    formData.append("entry.1954863761", data.gender || "");
    formData.append("entry.729090754", data.age || "");
    formData.append("entry.496751721", data.questionIndex !== undefined ? data.questionIndex : "");
    formData.append("entry.344271547", data.questionText || "");
    formData.append("entry.359462935", data.trialNumber || "");
    formData.append("entry.831233853", data.shownImages || "");
    formData.append("entry.790394210", data.chosenImage || "");
    formData.append("entry.1564705789", data.timestamp || "");

    fetch(formUrl, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).catch(error => console.error('Error!', error.message));
}

function showQuestionIntro() {
    const currentQuestionData = experimentData[currentQuestionIndex];
    questionDescriptionElement.querySelector('h2').textContent = `세션 ${currentQuestionIndex + 1}/${experimentData.length}`;
    questionDescriptionElement.querySelector('p').innerHTML = currentQuestionData.description;
    demographicsScreen.classList.add('hidden');
    experimentScreen.classList.add('hidden');
    questionIntroScreen.classList.remove('hidden');
}

function displayRandomPair() {
    const currentQuestionData = experimentData[currentQuestionIndex];
    const pool = currentQuestionData.imagePool;
    if (pool.length < 2) {
        console.error("이미지 풀에 이미지가 최소 2개 필요합니다!");
        return;
    }
    let index1 = Math.floor(Math.random() * pool.length);
    let index2 = Math.floor(Math.random() * pool.length);
    while (index1 === index2) {
        index2 = Math.floor(Math.random() * pool.length);
    }
    const image1 = pool[index1];
    const image2 = pool[index2];
    questionTextElement.textContent = `(${currentPairCount + 1}/${trialsPerQuestion}) ${currentQuestionData.question}`;
    leftImageElement.src = 'images/' + image1;
    rightImageElement.src = 'images/' + image2;
    leftImageElement.dataset.filename = image1;
    rightImageElement.dataset.filename = image2;
}

function endExperiment() {
    experimentScreen.classList.add('hidden');
    const endScreen = document.createElement('div');
    endScreen.id = 'start-screen'; 
    endScreen.innerHTML = '<h1>실험이 종료되었습니다.</h1><p>참여해주셔서 진심으로 감사합니다!</p>';
    document.body.appendChild(endScreen);
}

function handleImageClick(event) {
    const chosenImage = event.target.dataset.filename;
    const leftImage = leftImageElement.dataset.filename;
    const rightImage = rightImageElement.dataset.filename;
    
    const resultData = {
        name: participantInfo.name,
        contact: participantInfo.contact,
        gender: participantInfo.gender,
        age: participantInfo.age,
        questionIndex: currentQuestionIndex + 1,
        questionText: experimentData[currentQuestionIndex].question,
        trialNumber: currentPairCount + 1,
        shownImages: `${leftImage}, ${rightImage}`,
        chosenImage: chosenImage,
        timestamp: new Date().toISOString()
    };
    sendDataToGoogleForm(resultData);
    
    currentPairCount++;
    if (currentPairCount >= trialsPerQuestion) {
        currentQuestionIndex++;
        currentPairCount = 0;
        if (currentQuestionIndex >= experimentData.length) {
            endExperiment();
            return;
        }
        experimentScreen.classList.add('hidden');
        showQuestionIntro();
    } else {
        displayRandomPair();
    }
}

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
});

introNextButton.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    demographicsScreen.classList.remove('hidden');
});

startMainButton.addEventListener('click', () => {
    const name = document.getElementById('name-input').value;
    const contact = document.getElementById('contact-input').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age-select').value;

    if (name.trim() === "" || contact.trim() === "") {
        alert("이름과 연락처를 모두 입력해주세요.");
        return;
    }
    if (!gender || age === "") {
        alert("성별과 연령을 모두 선택해주세요.");
        return;
    }

    participantInfo = {
        name: name,
        contact: contact,
        gender: gender.value,
        age: age
    };

    showQuestionIntro();
});

startSessionButton.addEventListener('click', () => {
    questionIntroScreen.classList.add('hidden');
    experimentScreen.classList.remove('hidden');
    displayRandomPair();
});

leftImageElement.addEventListener('click', handleImageClick);
rightImageElement.addEventListener('click', handleImageClick);