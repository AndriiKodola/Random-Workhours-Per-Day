const copyToCCButton = document.getElementById('copy-button');
const tableBody = document.getElementsByTagName('tbody')[0];
const table = document.getElementById('schedule');
const input = document.getElementById('input-form');
const inputHoursSection = document.getElementById('input-hours');
const inputHours = inputHoursSection.querySelectorAll('input[type="text"]');
const inputScatterSection = document.getElementById('input-scatter');
const inputScatter = inputScatterSection.querySelectorAll('input[type="text"]');
const inputMonthSection = document.getElementById('input-month');
const inputMonth = inputMonthSection.querySelectorAll('input[type="text"]');

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

inputHoursSection.addEventListener('input', event => {
  for (let i = 0; i < inputHours.length; i++) {
    if (event.target !== inputHours[i]) {
      if (event.target.value !== '') {
        inputHours[i].disabled = true;
        inputHours[i].value = '';
      } else {
        inputHours[i].disabled = false;
      }
    }
  }
});

// TODO: user input validation

input.addEventListener('submit', event => {
  tableBody.innerHTML = '';


  const neededHours = Array.from(inputHours).map(hours => {
    if (hours.value) {
      return parseInt(hours.value, 10);
    } else {
      return null;
    }
  });
  const scatter = inputScatter[0].value ? parseFloat(inputScatter[0].value, 10) : 0;
  const monthNum = inputMonth[0].value ? parseInt(inputMonth[0].value, 10) - 1 : new Date().getMonth();
  const yearNum = inputMonth[1].value ? parseInt(inputMonth[1].value, 10) : new Date().getFullYear();

  inputHours.forEach( input => input.disabled = false );

  event.preventDefault();

  schedule = new Schedule(tableBody, neededHours, scatter, monthNum, yearNum);
  schedule.generate();
});

copyToCCButton.addEventListener('click', () => {
  selectElementContents(table);
  document.execCommand('copy');

  alert('Table is in clipboard now!');
});

/***************************************
 **************CLASSES******************
 ************************************* */

class Schedule {
  constructor (tableDestination, neededHours, scatter, monthNum, yearNum) {
      this.tableDestination = tableDestination;
      this.hoursPerDay = neededHours[0];
      this.hoursPerWeek = neededHours[1];
      this.hoursPerMonth = neededHours[2];
      this.scatter = scatter;
      this.targetMonth = new Month(monthNum, yearNum);
      this.targetTableMonth = this.targetMonth.getTableMonth();
  }

  getHoursPerDay = () => {
      let workDays = this.targetTableMonth.reduce((acc, cur) => {
          return cur.workDay ? ++acc : acc;
      }, 0);

      if (this.hoursPerDay) {
          return this.hoursPerDay;
      } else if (this.hoursPerWeek) {
          return this.hoursPerWeek / 5;
      } else if (this.hoursPerMonth) {
          return this.hoursPerMonth / workDays;
      }
  };
  

  // TODO: get rid of DOM manipulation procedures in Schedule class

  generate = () => {
    console.log('Starting schedule generation');

    const totalSum = document.getElementsByClassName('table-footer')[1];
    const hoursPerDay = this.getHoursPerDay();
    let totalHours = 0;
  
    for (let i = 0; i < this.targetTableMonth.length; i++) {
      const currTableDay = document.createElement('tr');
      const currTableDate = document.createElement('td');
      const currTableWorkhours = document.createElement('td');
      const sign = Math.random() < 0.5 ? -1 : 1;
  
      currTableDate.innerText = `${i + 1}/${this.targetMonth.monthNum + 1} ${this.targetTableMonth[i].weekDay}`;
      if (this.targetTableMonth[i].workDay) {

        // TODO: convert workhours value to format HH:MM from wholePart.decimalPart

        const workHours = this.round(sign * Math.random() * this.scatter + hoursPerDay, 1);
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
      this.tableDestination.appendChild(currTableDay);
    }
  
    totalSum.innerText = this.round(totalHours, 0);

    console.log('Scedule generated');
  };

  round = (value, decimals) => {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
}

class Month{
  constructor(monthNum, yearNum) {
      this.monthNum = monthNum;
      this.yearNum = yearNum;
      this.firstDayInMonth = new Date(this.yearNum, this.monthNum, 0).getDay();
      this.daysInMonth = new Date(this.yearNum, this.monthNum, 0).getDate();
  }

  genMonthDaysNum = (firstDay, numOfDays) => {
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

  getTableMonth = () => {
      const monthDaysNumArray = this.genMonthDaysNum(this.firstDayInMonth, this.daysInMonth);

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
}

