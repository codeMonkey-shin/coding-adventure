const API_URL = 'https://f2d8c4d406cd083a-e8089672-34cb-46f4-8648-9c77ee9a78f7.functions.codemonkey.run';

let currentChallengeIndex = 0;
let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.28.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark'
  });

  loadChallenge(currentChallengeIndex);
});

function loadChallenge(index) {
  toggleLoadingSpinner(true);
  fetch(`${API_URL}/challenge/${index}`)
      .then(response => {
        if (response.status === 429) {
          throw new Error('Too Many Requests');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('mission-title').textContent = data.title;
        document.getElementById('mission-description').innerHTML = data.description;
        document.getElementById('hint').textContent = data.hint;
        editor.setValue(data.initialCode);
        toggleLoadingSpinner(false);
      })
      .catch(error => {
        toggleLoadingSpinner(false);
        handleApiError(error);
      });
}

document.getElementById('run-code').addEventListener('click', () => {
  const code = editor.getValue();
  try {
    const result = eval(code);
    document.getElementById('output').textContent = String(result);
  } catch (error) {
    document.getElementById('output').textContent = `Error: ${error.message}`;
  }
});

document.getElementById('submit-answer').addEventListener('click', () => {
  const code = editor.getValue();
  toggleLoadingSpinner(true);
  fetch(`${API_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, challengeIndex: currentChallengeIndex })
  })
      .then(response => {
        if (response.status === 429) {
          throw new Error('Too Many Requests');
        }
        return response.json();
      })
      .then(data => {
        toggleLoadingSpinner(false);
        if (data.success) {
          currentChallengeIndex++;
          if (currentChallengeIndex < 12) {  // assuming there are 12 challenges
            showModal('성공! 다음 미션으로 이동합니다.');
            loadChallenge(currentChallengeIndex);
          } else {
            showModal('축하합니다! 모든 미션을 완료했습니다. 당신은 네카라쿠배에 입사할 자격을 얻었습니다.', true);
          }
        } else {
          showModal('미션 실패. 코드를 다시 확인해 주세요.');
        }
      })
      .catch(error => {
        toggleLoadingSpinner(false);
        handleApiError(error);
      });
});

// Function to display a modal with a given message and optional redirect.
function showModal(message, redirect = false) {
  // Get references to the modal and its text element.
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');

  // Set the modal's text to the provided message.
  modalText.textContent = message;

  // Make the modal visible, and add/remove appropriate CSS classes for animations.
  modal.style.display = 'block';
  modal.classList.add('show');
  modal.classList.remove('hide');

  // Function to close the modal. It adds a hide class for animation purposes, then hides it and optionally redirects.
  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      if (redirect) {
        window.location.href = 'https://recruit.navercorp.com/rcrt/list.do';
      }
    }, 500);
  }

  // Attach event listeners to close the modal when clicking on the close button or outside of it.
  document.querySelector('.close').addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function toggleLoadingSpinner(show) {
  const spinner = document.getElementById('loading-spinner');
  spinner.style.display = show ? 'flex' : 'none';
}

function handleApiError(error) {
  if (error.message === 'Too Many Requests') {
    showModal('너무 많이 요청했습니다. 1분 후에 다시 시도해 주세요.');
  } else {
    showModal(`Error: ${error.message}`);
  }
}

const fibonacci=(n,a=0,b=1)=>n<=1?n:fibonacci(--n,b,a+b);
