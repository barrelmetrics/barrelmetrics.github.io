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
        //Add tenor to price table and futures expiry table
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
    $(".Maturity").append('<option value="999">Adjust Months</option>');
    $(".Maturity2").append('<option value="999">Adjust Months</option>');

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

function futExpired(prodVal,matMonth){
    var pastExpiryDate = true;
    for(i=0; i<futExpDate.length;i++){
        //get contract array and find contract month expiry date
        if(prodVal==futExpDate[i][0]){
            var expiryDate = findFutExpiry(matMonth,futExpDate[i]);
            if (expiryDate!=""){
                pastExpiryDate=moment()>expiryDate;
            }
        }
    }
    return pastExpiryDate;
}

function populateFutExpColumn(){
  var table = document.getElementById("futExpiryTable");
  var header = table.createTHead();
  var row = header.insertRow(0);
  //alert(prodArray.options.length);
  for(i=0; i<futExpDate.length;i++){ 
    var futurescell = row.insertCell(i); //insert column header cell
    if(i==0){futurescell.outerHTML = "<th>Contract Month</th>";}
    else{
        //alert(futExpDate[i][0]);
        contract = futExpDate[i][0];
        futurescell.outerHTML = "<th>"+contract+"</th>"; //insert futures headers
        for (mthOffset=1; mthOffset<=monthTenorCount; mthOffset++){//insert cells in rest of column
            var contractMth = table.rows[mthOffset].cells[0].innerHTML;
            var expirycell = table.rows[mthOffset].insertCell(i);
            //find expiry date corresponding to row contract month
            expirycell.innerHTML = findFutExpiry(contractMth,futExpDate[i]);
        }
    }
  }
}

function findFutExpiry(contractMth,contractArray){
    for (contractNum=1; contractNum<contractArray.length; contractNum++){
        recordMth = contractArray[contractNum][0];
        if(contractMth==recordMth){
            return moment(futExpDate[i][contractNum][1]).format("DD-MMM-YYYY");
        }
    }
    return "";
}

function adjustMonths(thisSelect){

    var txt;
    var r = confirm("All entries in the trade chit will be reset! Do you want to proceed?");
    if (r == true) {
        if ($(thisSelect).val() === "999"){
            monthTenorCount = prompt("Number of months to show:");
    
            //delete all options in dropdowns
            var matArray = document.querySelectorAll(".Maturity");
            var matArray2 = document.querySelectorAll(".Maturity2");
            for (i=0; i<(matArray.length); i++)
            {
                thisMatArray = matArray[i];
                thisMatArray2 = matArray2[i];
                while (thisMatArray.length > 1) {
                    thisMatArray.remove(thisMatArray.length-1);
                    thisMatArray2.remove(thisMatArray2.length-1);
                }
                thisMatArray.selectedIndex = "0"; //reset option to default
            }
            document.getElementById('priceTable').innerHTML = '';
            document.getElementById('futExpiryTable').innerHTML = '';
            
            //repopulate dropdown and price table
            populateDate(); //date.js
            populateTblColumn(); //curve_dragtable.js
            $("#priceTable").jsdragtable();
        }
    } 


}