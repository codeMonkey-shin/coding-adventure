const challenges = [
  {
    title: "미션: 변수에 값을 할당하고 출력하기",
    description: "출력 결과가 <strong>Hello, World!</strong>가 되어야 합니다.",
    expectedOutput: "Hello, World!",
    initialCode: `// 변수에 값을 할당하고 출력하세요\nlet message = "";\nconsole.log(message);`,
    hint: "변수는 데이터를 저장하는 데 사용됩니다. 변수에 문자열을 할당하고 console.log()를 사용하여 출력하세요."
  },
  {
    title: "미션: 숫자 더하기",
    description: "출력 결과가 <strong>15</strong>가 되어야 합니다.",
    expectedOutput: "15",
    initialCode: `// 두 숫자의 합을 출력하세요\nlet a = ;\nlet b = ;\nconsole.log(a + b);`,
    hint: "변수를 선언하고 숫자를 할당한 후, 두 변수를 더하여 결과를 출력하세요."
  },
  {
    title: "미션: 조건문 사용하기",
    description: "출력 결과가 <strong>x is greater than 5</strong>가 되어야 합니다.",
    expectedOutput: "x is greater than 5",
    initialCode: `// 조건문을 사용하여 x가 5보다 크면 메시지를 출력하세요\nlet x = 10;\nif ( ) {\n  console.log("");\n}`,
    hint: "if 조건문을 사용하여 x가 5보다 큰지 확인한 후, 조건이 참일 때 메시지를 출력하세요."
  }
];

let currentChallengeIndex = 0;
let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.28.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: challenges[0].initialCode,
    language: 'javascript',
    theme: 'vs-dark'
  });

  loadChallenge(currentChallengeIndex);
});

function loadChallenge(index) {
  const challenge = challenges[index];
  document.getElementById('mission-title').textContent = challenge.title;
  document.getElementById('mission-description').innerHTML = challenge.description;
  document.getElementById('hint').textContent = challenge.hint;
  editor.setValue(challenge.initialCode);
  document.getElementById('output').innerHTML = '';
}

document.getElementById('run-code').addEventListener('click', () => {
  const code = editor.getValue();
  try {
    console.clear();
    const outputContainer = document.getElementById('output');
    outputContainer.innerHTML = '';
    console.log = (message) => {
      outputContainer.innerHTML += message + '<br>';
    };
    eval(code);

    if (outputContainer.textContent.trim() === challenges[currentChallengeIndex].expectedOutput) {
      currentChallengeIndex++;
      if (currentChallengeIndex < challenges.length) {
        alert('성공! 다음 미션으로 이동합니다.');
        loadChallenge(currentChallengeIndex);
      } else {
        alert('축하합니다! 모든 미션을 완료했습니다.');
      }
    } else {
      alert('미션 실패. 코드를 다시 확인해 주세요.');
    }
  } catch (e) {
    document.getElementById('output').innerHTML = `Error: ${e.message}`;
  }
});
