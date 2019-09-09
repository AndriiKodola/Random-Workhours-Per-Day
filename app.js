import Schedule from models/Schedule;

const input = document.getElementById('input-form');
const inputFields = input.querySelectorAll('input[type="text"]');
const copyToCCButton = document.getElementById('copy-button');
const tableBody = document.getElementsByTagName('tbody')[0];
const table = document.getElementById('schedule');

const selectElementContents = el => {
	let body = document.body, range, sel;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();
	}
}

input.addEventListener('input', event => {
  for (let i = 0; i < inputFields.length; i++) {
    if (event.target !== inputFields[i]) {
      if (event.target.value !== '') {
        inputFields[i].disabled = true;
        inputFields[i].value = '';
      } else {
        inputFields[i].disabled = false;
      }
    }
  }
});

input.addEventListener('submit', event => {
  tableBody.innerHTML = '';
  inputFields.forEach( input => input.disabled = false );

  event.preventDefault();
  
  schedule = new Schedule(tableBody, inputFields);
  schedule.generate();
});

copyToCCButton.addEventListener('click', () => {
  selectElementContents(table);
  document.execCommand('copy');

  alert('Table is in clipboard now!');
});
