const input = document.getElementById('textInput');
const btn = document.getElementById('showBtn');
const area = document.getElementById('field');
const box = document.getElementById('selectBox');

let selected = [];
let isSelecting = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let dragLetter = null;

btn.addEventListener('click', function () {
  area.innerHTML = '';
  selected = [];

  const text = input.value;

  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.textContent = text[i];

    letter.addEventListener('click', function (e) {
      e.stopPropagation();

      if (e.ctrlKey) {
        if (letter.classList.contains('selected')) {
          letter.classList.remove('selected');
          selected = selected.filter(function (item) {
            return item !== letter;
          });
        } else {
          letter.classList.add('selected');
          selected.push(letter);
        }
      } else {
        clearSelected();
        letter.classList.add('selected');
        selected.push(letter);
      }
    });

    letter.addEventListener('mousedown', function (e) {
      e.stopPropagation();

      if (!letter.classList.contains('selected')) {
        clearSelected();
        letter.classList.add('selected');
        selected.push(letter);
      }

      isDragging = true;
      dragLetter = letter;

      for (let i = 0; i < selected.length; i++) {
        const rect = selected[i].getBoundingClientRect();
        selected[i].style.position = 'absolute';
        selected[i].style.left = rect.left + window.scrollX + 'px';
        selected[i].style.top = rect.top + window.scrollY + 'px';
      }
    });

    area.appendChild(letter);
  }
});

area.addEventListener('mousedown', function (e) {
  if (e.target !== area) {
    return;
  }

  clearSelected();

  isSelecting = true;
  startX = e.pageX;
  startY = e.pageY;

  box.style.display = 'block';
  box.style.left = startX + 'px';
  box.style.top = startY + 'px';
  box.style.width = '0px';
  box.style.height = '0px';
});

document.addEventListener('mousemove', function (e) {
  if (isSelecting) {
    const left = Math.min(startX, e.pageX);
    const top = Math.min(startY, e.pageY);
    const width = Math.abs(e.pageX - startX);
    const height = Math.abs(e.pageY - startY);

    box.style.left = left + 'px';
    box.style.top = top + 'px';
    box.style.width = width + 'px';
    box.style.height = height + 'px';

    clearSelected();

    const letters = document.querySelectorAll('.letter');

    for (let i = 0; i < letters.length; i++) {
      const rect = letters[i].getBoundingClientRect();
      const l = rect.left + window.scrollX;
      const t = rect.top + window.scrollY;
      const r = rect.right + window.scrollX;
      const b = rect.bottom + window.scrollY;

      if (r > left && l < left + width && b > top && t < top + height) {
        letters[i].classList.add('selected');
        selected.push(letters[i]);
      }
    }
  }

  if (isDragging) {
    for (let i = 0; i < selected.length; i++) {
      selected[i].style.left = e.pageX + i * 20 + 'px';
      selected[i].style.top = e.pageY + 'px';
    }
  }
});

document.addEventListener('mouseup', function (e) {
  if (isSelecting) {
    isSelecting = false;
    box.style.display = 'none';
  }

  if (isDragging) {
    if (selected.length === 1) {
      const target = document.elementFromPoint(e.clientX, e.clientY);

      if (
        target &&
        target.classList.contains('letter') &&
        target !== dragLetter
      ) {
        const temp = dragLetter.textContent;
        dragLetter.textContent = target.textContent;
        target.textContent = temp;
      }
    }

    isDragging = false;
    dragLetter = null;
  }
});

document.addEventListener('click', function (e) {
  if (!e.ctrlKey && !e.target.classList.contains('letter')) {
    clearSelected();
  }
});

function clearSelected() {
  for (let i = 0; i < selected.length; i++) {
    selected[i].classList.remove('selected');
  }

  selected = [];
}