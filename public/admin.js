// Client-side script for the admin page

(() => {
  const questionsContainer = document.getElementById('questions');
  const addQuestionBtn = document.getElementById('add-question');
  const form = document.getElementById('quiz-form');
  const messageDiv = document.getElementById('message');

  let questionCounter = 0;

  addQuestionBtn.addEventListener('click', () => {
    addQuestionBlock();
  });

  // Add the first question by default
  addQuestionBlock();

  function addQuestionBlock() {
    const qId = questionCounter++;
    const block = document.createElement('div');
    block.className = 'question-block';
    block.dataset.qid = qId;
    block.innerHTML = `
      <h3>Question ${qId + 1}</h3>
      <div class="form-group">
        <label>Type
          <select class="q-type">
            <option value="mcq">Multiple Choice</option>
            <option value="tf">True/False</option>
            <option value="text">Short Text</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label>Question Text
          <input type="text" class="q-text" required>
        </label>
      </div>
      <div class="options-container"></div>
      <div class="answer-container"></div>
      <div class="button-group">
        <button type="button" class="button add-option">Add Option</button>
        <button type="button" class="button remove-question">Remove Question</button>
      </div>
    `;
    questionsContainer.appendChild(block);

    // Set up listeners for this block
    const typeSelect = block.querySelector('.q-type');
    const addOptionBtn = block.querySelector('.add-option');
    const removeQuestionBtn = block.querySelector('.remove-question');
    typeSelect.addEventListener('change', () => updateQuestionBlock(block));
    addOptionBtn.addEventListener('click', () => addOption(block));
    removeQuestionBtn.addEventListener('click', () => {
      block.remove();
      updateQuestionHeaders();
    });
    // Initialise with MCQ fields
    updateQuestionBlock(block);
  }

  function updateQuestionHeaders() {
    const blocks = document.querySelectorAll('.question-block');
    blocks.forEach((blk, idx) => {
      const h3 = blk.querySelector('h3');
      h3.textContent = `Question ${idx + 1}`;
    });
  }

  function updateQuestionBlock(block) {
    const type = block.querySelector('.q-type').value;
    const optionsContainer = block.querySelector('.options-container');
    const answerContainer = block.querySelector('.answer-container');
    const addOptionBtn = block.querySelector('.add-option');
    // Clear existing content
    optionsContainer.innerHTML = '';
    answerContainer.innerHTML = '';
    if (type === 'mcq') {
      // Show add option button
      addOptionBtn.style.display = 'inline-block';
      // Create two default options if none exist
      addOption(block);
      addOption(block);
    } else if (type === 'tf') {
      // Hide add option button
      addOptionBtn.style.display = 'none';
      // Create select for true/false
      const select = document.createElement('select');
      select.className = 'tf-answer';
      select.innerHTML = '<option value="true">True</option><option value="false">False</option>';
      answerContainer.appendChild(select);
    } else if (type === 'text') {
      // Hide add option button
      addOptionBtn.style.display = 'none';
      // Create text input for answer
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'text-answer';
      input.required = true;
      answerContainer.appendChild(input);
    }
  }

  function addOption(block) {
    const type = block.querySelector('.q-type').value;
    if (type !== 'mcq') return;
    const optionsContainer = block.querySelector('.options-container');
    const qIndex = Array.from(questionsContainer.children).indexOf(block);
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-input';
    optionDiv.innerHTML = `
      <input type="radio" name="correct_${qIndex}">
      <input type="text" class="option-text" required>
      <button type="button" class="button remove-option">Remove</button>
    `;
    optionsContainer.appendChild(optionDiv);
    // Attach remove listener
    optionDiv.querySelector('.remove-option').addEventListener('click', () => {
      optionDiv.remove();
    });
  }

  form.addEventListener('submit', evt => {
    evt.preventDefault();
    const title = document.getElementById('quiz-title').value.trim();
    if (!title) {
      alert('Please provide a quiz title');
      return;
    }
    const questionBlocks = document.querySelectorAll('.question-block');
    const questions = [];
    let valid = true;
    questionBlocks.forEach((block, idx) => {
      const type = block.querySelector('.q-type').value;
      const questionText = block.querySelector('.q-text').value.trim();
      if (!questionText) {
        alert(`Please provide text for question ${idx + 1}`);
        valid = false;
        return;
      }
      if (type === 'mcq') {
        const optionDivs = block.querySelectorAll('.option-input');
        const options = [];
        let answer = '';
        optionDivs.forEach(div => {
          const optText = div.querySelector('.option-text').value.trim();
          const radio = div.querySelector('input[type=radio]');
          options.push(optText);
          if (radio.checked) answer = optText;
        });
        if (options.length < 2) {
          alert(`Question ${idx + 1} must have at least two options.`);
          valid = false;
          return;
        }
        if (!answer) {
          alert(`Please select the correct answer for question ${idx + 1}.`);
          valid = false;
          return;
        }
        questions.push({ type: 'mcq', question: questionText, options, answer });
      } else if (type === 'tf') {
        const select = block.querySelector('.tf-answer');
        const answer = select.value;
        questions.push({ type: 'tf', question: questionText, answer });
      } else if (type === 'text') {
        const ansInput = block.querySelector('.text-answer');
        const answer = ansInput.value.trim();
        if (!answer) {
          alert(`Please provide the correct answer for question ${idx + 1}.`);
          valid = false;
          return;
        }
        questions.push({ type: 'text', question: questionText, answer });
      }
    });
    if (!valid) return;
    // Submit the quiz via fetch API
    fetch('/api/create-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          messageDiv.textContent = `Quiz created successfully! You can take it here: ${window.location.origin}/quiz/${data.id}`;
          // Reset the form
          form.reset();
          questionsContainer.innerHTML = '';
          questionCounter = 0;
          addQuestionBlock();
        } else {
          messageDiv.textContent = 'Error creating quiz.';
        }
      })
      .catch(err => {
        console.error(err);
        messageDiv.textContent = 'Failed to create quiz.';
      });
  });
})();