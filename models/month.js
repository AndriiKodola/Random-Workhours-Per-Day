export class Month{
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
