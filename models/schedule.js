import Month from month;

export class Schedule {
    constructor (tableDestination, neededHours, scatter=1, monthNum=new Date().getMonth(), yearNum=new Date().getFullYear()) {
        this.targetMonth = new Month(monthNum, yearNum);
        this.targetTableMonth = targetMonth.getTableMonth();
        this.scatter = scatter;
        this.monthNum = monthNum;
        this.yearNum = yearNum;
        this.hoursPerDay = parseInt(neededHours[0].value, 10);
        this.hoursPerWeek = parseInt(neededHours[1].value, 10);
        this.hoursPerMonth = parseInt(neededHours[2].value, 10);
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
    
    generate = () => {
        const totalSum = document.getElementsByClassName('table-footer')[1];
        let totalHours = 0;
      
        for (let i = 0; i < this.targetTableMonth.length; i++) {
          const currTableDay = document.createElement('tr');
          const currTableDate = document.createElement('td');
          const currTableWorkhours = document.createElement('td');
      
          currTableDate.innerText = `${i + 1}/${this.targetMonth.monthNum + 1} ${this.targetTableMonth[i].weekDay}`;
          if (this.targetTableMonth[i].workDay) {
            const workHours = Math.floor(Math.random() * this.scatter) + this.hoursPerDay - this.scatter / 2
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
          tableDestination.appendChild(currTableDay);
        }
      
        totalSum.innerText = totalHours;
    };
}