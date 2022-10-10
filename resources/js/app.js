
// calendar source code: https://github.com/lashaNoz/Calendar
const date = new Date();

const renderCalendar = () => {
    date.setDate(1);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthDays = document.querySelector('.days')

    // returns the last day of the retrieved month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const firstDayIdx = date.getDay();

    document.querySelector('.date h1').innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;

    let days = "";
    let daysCount = 0;

    for (let x = firstDayIdx; x > 0; x--) {
        days += `<div class="prev-days">${prevLastDay - x + 1}</div>`;
        daysCount++;
    }

    // goes through the 1st to last day of the month and if one of the day's matches the current date, sets the class as "today"
    for (let i = 1; i <= lastDay; i++) {
        if ( i === new Date().getDate() && date.getMonth() === new Date().getMonth() ) {
            days += `<div class="today">${i}</div>`;
        } else {
            days += `<div>${i}</div>`;
        }
        daysCount++;
    }

    // ensures blank space in calandar is filled by some of the next month ( 7 days * 6 rows)
    daysLeft = (7 * 6) - daysCount
    for (let j = 1; j <= daysLeft; j++) {
        days += `<div class="next-days">${j}</div>`;
    }

    monthDays.innerHTML = days;
}

document.querySelector('.prev').addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next').addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// must be rendered once initially
renderCalendar();
