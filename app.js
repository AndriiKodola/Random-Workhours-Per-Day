const input = document.getElementById('input-form');
const inputFields = input.querySelectorAll('input[type="text"]');
const container = document.getElementById('table-container');
const copyToCCButton = document.getElementById('copy-button');
const tableBody = document.getElementsByTagName('tbody')[0];
const table = document.getElementById('schedule');
const today = new Date();
const currYear = today.getFullYear();
const currMonthNum = today.getMonth();
let nextMonth;

if (currMonthNum === 11) {
  nextMonth = 0;
} else {
  nextMonth = currMonthNum + 1;
}

const firstDayInMonth = new Date(currYear, nextMonth, 0).getDay();
const daysInMonth = new Date(currYear, nextMonth, 0).getDate();

const genMonthDaysNum = (firstDay, numOfDays) => {
  const daysNumArray = [];
  let currDay = firstDay;

  for (let i = 0; i < numOfDays; i++) {
    daysNumArray.push(currDay);
    currDay++;
    if (currDay === 7) {
      currDay = 0;
    }
  }

  return daysNumArray;
};

const monthDaysNum = genMonthDaysNum(firstDayInMonth, daysInMonth);

const createMonth = monthDaysNumArray => {
  return monthDaysNumArray.map(dayNum => {
    switch (dayNum) {
      case 0:
        return { id: ++dayNum, weekDay: "Monday", workDay: true };
      case 1:
        return { id: ++dayNum, weekDay: "Tuesday", workDay: true };
      case 2:
        return { id: ++dayNum, weekDay: "Wednesday", workDay: true };
      case 3:
        return { id: ++dayNum, weekDay: "Thursday", workDay: true };
      case 4:
        return { id: ++dayNum, weekDay: "Friday", workDay: true };
      case 5:
        return { id: ++dayNum, weekDay: "Saturday", workDay: false };
      case 6:
        return { id: ++dayNum, weekDay: "Sunday", workDay: false };
    }
  });
};

const currMonth = createMonth(monthDaysNum);

const getHoursPerDay = () => {
  const perDay = parseInt(inputFields[0].value, 10);
  const perWeek = parseInt(inputFields[1].value, 10);
  const perMonth = parseInt(inputFields[2].value, 10);
  let workDays = currMonth.reduce((acc, cur) => {
    return cur.workDay ? ++acc : acc;
  }, 0);

  if (perDay) {
    return perDay;
  } else if (perWeek) {
    return perWeek / 5;
  } else if (perMonth) {
    return perMonth / workDays;
  }
};

const generateSchedule = hoursPerDay => {
  const totalSum = document.getElementsByClassName('table-footer')[1];
  let totalHours = 0;

  for (let i = 0; i < currMonth.length; i++) {
    const currTableDay = document.createElement('tr');
    const currTableDate = document.createElement('td');
    const currTableWorkhours = document.createElement('td');

    currTableDate.innerText = `${i + 1}/${currMonthNum + 1} ${currMonth[i].weekDay}`;
    if (currMonth[i].workDay) {
      const workHours = Math.floor(Math.random()*3) + hoursPerDay - 1
      currTableWorkhours.innerText = workHours;
      currTableDate.classList.add('workday', 'day');
      currTableWorkhours.classList.add('workday', 'hours');
      totalHours += workHours;
    } else {
      currTableWorkhours.innerText = 0;
      currTableDate.classList.add('weekend', 'day');
      currTableWorkhours.classList.add('weekend', 'hours');
    }
    currTableDay.appendChild(currTableDate);
    currTableDay.appendChild(currTableWorkhours);
    tableBody.appendChild(currTableDay);
  }

  totalSum.innerText = totalHours;
};

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
  const neededHoursPerDay = getHoursPerDay();
  tableBody.innerHTML = '';
  inputFields.forEach( input => input.disabled = false );

  event.preventDefault();
  
  generateSchedule(neededHoursPerDay);
});

copyToCCButton.addEventListener('click', () => {
  selectElementContents(table);
  document.execCommand('copy');

  alert('Table is in clipboard now!');
});
