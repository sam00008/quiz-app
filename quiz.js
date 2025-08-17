document.addEventListener('DOMContentLoaded', () => {
    const Start_button = document.querySelector('.quiz-btn');
    const category_section = document.getElementById('category');
    const difficulty_Section = document.getElementById('complexity');
    const containerTop = document.querySelector('.container');
    const containerTopic = document.querySelector('.topic');
    const containerdifficulty = document.querySelector('.difficulty');
    const showError = document.getElementById('show-error');
    const quizContainer = document.querySelector('.quiz-container');


    let Question = JSON.parse(localStorage.getItem('QnA')) || [];
    let score = parseInt(localStorage.getItem('score')) || 0;
    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;



    async function getQuestion(category, difficulty) {
        const url = `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            Question = data.results;
            score = 0;
            currentIndex = 0;
            showError.classList.add('hidden');
            saveState();
            createQuestion();
            console.log(data.results);
        }
        catch (err) {
            console.error("Fetch Error:", err);
            showError.textContent = "Failed to get questions. Please refresh.";
            showError.classList.remove('hidden');
        }
    }

    function createQuestion() {
        const q = Question[currentIndex];
        const options = shuffleArray([...q.incorrect_answers, q.correct_answer]);

        const QuestionList = document.createElement('div');
        QuestionList.setAttribute('class', "ParentList");
        QuestionList.innerHTML = `
          <p>${q.question}</p>
           ${options.map(opt => `<button class = 'option-btn'>${opt}</button>`).join('')}
    `;
        quizContainer.innerHTML = '';
        quizContainer.appendChild(QuestionList);
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function saveState() {
        localStorage.setItem('QnA', JSON.stringify(Question));
        localStorage.setItem('score', score);
        localStorage.setItem('currentIndex', currentIndex);
    }

    function restartQuiz() {
       localStorage.clear();
       location.reload();
    }

    Start_button.addEventListener('click', async () => {

        let category = category_section.value;
        let difficulty = difficulty_Section.value.toLowerCase();

        if (!category || !difficulty) {
            alert('Please select both Category and Difficulty');
            return;
        }
        containerTopic.classList.add('hidden');
        containerdifficulty.classList.add('hidden');

        Start_button.disabled = true;
        Start_button.textContent = "Loading...";

        await getQuestion(category, difficulty);
        Start_button.classList.add('hidden');

    });


    quizContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('option-btn')) {
            const selected = e.target.textContent;
            const correct = Question[currentIndex].correct_answer;

            if (selected === correct) {
                score++;
            }

            currentIndex++;
            saveState();

            if (currentIndex < Question.length) {
                createQuestion();
            }
            else {
                quizContainer.innerHTML = `
            <h2></h2>
            <p>Your Score : ${score} / ${Question.length} </p>
             <button class='quiz-btn'>Restart Quiz</button>
            `;
            document.querySelector('.quiz-btn').addEventListener('click',restartQuiz);
                localStorage.clear();
            }
        }
    });

    if (currentIndex > 0 && currentIndex < Question.length) {
        containerTopic.classList.add('hidden');
        containerdifficulty.classList.add('hidden');
        Start_button.classList.add('hidden');

        createQuestion();
    }

});
