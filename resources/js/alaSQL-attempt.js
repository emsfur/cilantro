// plan is save and load datafile through neustorage
// JSON.Parse(fileResult) and use that when creating alasql db
// will have a different neustorage file for each task (created when using add task)



// var res = alasql("SELECT * FROM example1 ORDER BY b DESC");




// alasql("CREATE TABLE example1 (date DATE, b INT)");

// alasql.tables.example1.data = [               // Insert data directly from javascript object...
//     {a:'2015.10.23',b:6},
//     {a:`2022-11-17`,b:4}
// ];
const dater = new Date();

alasql("CREATE TABLE TestDates (StartDate DATE, EndDate DATE) ");
alasql("INSERT INTO TestDates VALUES('2015-10.23', '2015.11.24') ");
alasql("INSERT INTO TestDates VALUES('2015.11.23', '2015.12.24') ");
alasql(`INSERT INTO TestDates VALUES('${dater.getFullYear()}-${dater.getMonth() + 1}-${dater.getDate()}', '2015.13.24') `);


// alasql.tables.TestDates.data = [
//     {'StartDate': '2015-10-23', 'EndDate':'2022-10-23'}
// ];


document.querySelector('.now').addEventListener("click", () => {
    // res = alasql("SELECT * FROM example1 ORDER BY b DESC");
    res = alasql("SELECT * FROM TestDates");
    console.log(res); // [{a:2,b:6},{a:1,b:5},{a:3,b:4}]
});


// var res = alasql("SELECT * FROM example1 ORDER BY b DESC");

// console.log(res); // [{a:2,b:6},{a:1,b:5},{a:3,b:4}]





//  If you download data from external file, you can use this syntax:
// alaslq('CREATE table one; SELECT * INTO one FROM JSON("data.json")');


// the start and end date stuff could be usefful for optimization where,
// instead of keeping track of each date, we keep track of each streak,
// so as to only keep track of the streak start and end

// this is good for data storage, but how about when retriving and checking
// if each date is part of a streak or not?
