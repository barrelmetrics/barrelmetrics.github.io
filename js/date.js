function populateDate(){

    for (var mthOffset=0; mthOffset<monthTenorCount; mthOffset++){
    	$(".Maturity").append('<option value = '+(mthOffset+2)+ '>' + moment().add(mthOffset, 'months').format("MMM-YY") + '</option>');
        $(".Maturity2").append('<option value = '+(mthOffset+2)+ '>' + moment().add(mthOffset, 'months').format("MMM-YY") + '</option>');
        qtrChange = (moment().add(mthOffset, 'months').quarter()!=moment().add(mthOffset+1, 'months').quarter());
        if(qtrChange) //append quarterly tenors before quarter changes
        {
        	$(".Maturity").append('<option value = '+(mthOffset+2)+'A> Q' + moment().add(mthOffset, 'months').quarter() +'-'+ moment().add(mthOffset, 'months').year().toString().substr(-2) + '</option>');
        	$(".Maturity2").append('<option value = '+(mthOffset+2)+'A> Q' + moment().add(mthOffset, 'months').quarter() +'-'+ moment().add(mthOffset, 'months').year().toString().substr(-2) + '</option>');            
        }

        //Add tenor to price table and expiry table
        var table = document.getElementById("priceTable");
        var table2 = document.getElementById("futExpiryTable");
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow();
        var row2 = table2.insertRow();
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row2.insertCell(0);
        cell1.innerHTML = moment().add(mthOffset, 'months').format("MMM-YY");
        cell2.innerHTML = moment().add(mthOffset, 'months').format("MMM-YY");
	}
}

function getBusinessDays(endDate, startDate){
	var lastDay = moment(endDate);
    var firstDay = moment(startDate);
    let calcBusinessDays = 1 + (lastDay.diff(firstDay, 'days') * 5-(firstDay.day() - lastDay.day()) * 2) / 7;

    if (lastDay.day() == 6) calcBusinessDays--;//SAT
    if (firstDay.day() == 0) calcBusinessDays--;//SUN

	var holidays = [new Date(2020,0,2,23,59,59), new Date(2020,0,27,23,59,59)]; //month based on zero start index
	//alert(holidays[0].getDay());
	for(i = 0; i < holidays.length; i++){
		if(moment(holidays[i]) >= firstDay && moment(holidays[i]) <= lastDay && holidays[i].getDay() != 0 && holidays[i].getDay() != 6){
        	calcBusinessDays--;
            //alert("Holiday on "+holidays[i]);
		}
    }
    return calcBusinessDays;
}