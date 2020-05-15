const init = () => {
  // Do not remove
  generateQuestionId();
};

// Do not modify the code mentioned below
const generateQuestionId = () => {
  const id = randomIntInRange(0, 6);
  document.getElementById("current-question-id").value = id.toString();
};

const randomIntInRange = (min, max, notIn) => {
  const value = Math.floor(Math.random() * (max - min + 1) + min);
  if (notIn && notIn.includes(value)) {
    return randomIntInRange(min, max, notIn);
  } else {
    return value;
  }
};
// Do not modify

init();

window.onload = () => {
  const API_URL = "https://jsonmock.hackerrank.com/api/questions";

  const pre_quiz = document.getElementById("pre-quiz");
  const loader = document.getElementById("loader-view");
  const btn_start = document.getElementById("get-started-button");
  const quiz = document.getElementById("quiz");
  const question = document.getElementById("question");
  const option_container = document.getElementById("options-container");

  const id = document.getElementById("current-question-id").value;
  const submit = document.getElementById("submit-button");
  const quiz_status = document.getElementById("quiz-status");

  var score = 0;
  var correct_ans;
  var user_op;
  var count = 0;

  const fetch_question = (id) => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((qn) => {
        submit.disabled = true;
        loader.classList.add("hide");
        quiz.classList.remove("hide");
        submit.innerHTML = "Submit";

        const q = qn.data.question;
        const options = qn.data.options;
        correct_ans = qn.data.answer;

        question.innerText = q;

        options.forEach((option, index) => {
          const op = document.createElement("button");
          op.innerText = option;
          op.dataset.i = index;
          op.classList.add("option");
          option_container.appendChild(op);
        });
      })
      .then(() => {
        selectAnswer();
        count++;
      });
  };

  const selectAnswer = () => {
    const op = document.getElementsByClassName("option");

    option_container.addEventListener("click", (e) => {
      submit.disabled = false;
      user_op = e.target;

      for (const btn in op) {
        if (op[btn] == e.target) {
          op[btn].classList.add("user-answer");
        } else if (op[btn] != e.target) {
          op[btn].classList.remove("user-answer");
        }
      }
    });

    submit.addEventListener("click",checkAnswer);
    if(count == 5){
        endSession();
    }
  };

  const checkAnswer = () => {
    const op = document.getElementsByClassName("option");

    if (user_op.dataset.i == correct_ans) {
      user_op.classList.add("correct-answer");
      score++;
    } else {
      user_op.classList.add("wrong-answer");
      op[correct_ans].classList.add("correct-answer");
    }
    quiz_status.innerText = `Your score = ${score}/5`;
    setTimeout(()=>setNextQuestion(),1000);
  };

  const setNextQuestion = () => {
    quiz.classList.add("hide");
    loader.classList.remove("hide");
    var child = option_container.lastElementChild;
    while (child) {
      option_container.removeChild(child);
      child = option_container.lastElementChild;
    }
    generateQuestionId();
    const id_new = document.getElementById("current-question-id").value;
    fetch_question(id_new);
  };

  const endSession = () => {
    quiz.classList.add("hide");
    const result = document.createElement('div');
    const finalbtn = document.createElement('button');
    const p = document.createElement('p');
    result.id = "result";
    result.appendChild(p);
    p.classList.add('final-score');
    p.innerText = `Your score = ${score}/5`;
    document.body.appendChild(result);

    setTimeout(()=>location.reload(),5000);
    
  };

  btn_start.addEventListener("click", () => {
    pre_quiz.classList.add("hide");
    loader.classList.remove("hide");
    fetch_question(id);
  });
};
