function calcPL(){

    //read html price table and store into 2D array
    var priceTable = [];

    //get size of html table
    var rowCount = document.getElementById("priceTable").rows.length; //alert(rowCount);
    var colCount = document.getElementById("priceTable").rows[0].cells.length; //alert(colCount);

    //for each row in html table
    for (i=0;i<rowCount;i++){
        var x = document.getElementById("priceTable").rows[i].cells;
        var arrayOfThisRow = [];
        for (j=0;j<colCount;j++){
            if(x[j].childElementCount==0){ //not an input cell, then get text
                //alert(x[j].textContent);
                arrayOfThisRow.push(x[j].textContent);
            }
            else{ //get text value from input cell
                //alert(x[j].children[0].value);
                arrayOfThisRow.push(x[j].children[0].value);
            }
        }
        priceTable.push(arrayOfThisRow);
    }

	//get all deal info
	var BSArray = document.querySelectorAll(".BS");
    var qtyArray = document.querySelectorAll(".Quantity");
    var unitArray = document.querySelectorAll(".Unit");
    var matArray = document.querySelectorAll(".Maturity");
    var matArray2 = document.querySelectorAll(".Maturity2");
	var prodArray = document.querySelectorAll(".Product");
    var prodArray2 = document.querySelectorAll(".Product2");
    var strikeArray = document.querySelectorAll(".Strike");
    var mtmArray = document.querySelectorAll(".MTM");
    var pnlArray = document.querySelectorAll(".PnL");

    if (checkRequiredField(1)==0){
        alert("Pls fill in required fields for calculating P&L");
        return; //early exit from function
    }

    //initialise each leg price to be 0
    var p1=0,p2=0,t1=0,t2=0;
    //initialise each leg exposure to be 0
    var pa=0,pb=0,ta=0,tb=0;
    //initialise each array to be null
    var p1Array=[],p2Array=[],t1Array=[],t2Array=[];
    var totalMtm=0;

    //get exposure and prices for every leg of each deal
    for(var i=0; i<BSArray.length;i++){
        p1Array=getPrice(priceTable,unitArray,matArray,prodArray,qtyArray,i); //alert(p1Array);
        if(prodArray2[i].selectedIndex>0){
            alert("PS");
            p2Array=getPrice(priceTable,unitArray,matArray,prodArray,qtyArray,i);
        }
        if(matArray2[i].selectedIndex>0){
            alert("TS");
            t1Array=getPrice(priceTable,unitArray,matArray,prodArray,qtyArray,i);
            if(prodArray2[i].selectedIndex>0){
                alert("Box");
                t2Array=getPrice(priceTable,unitArray,matArray,prodArray,qtyArray,i);
            }
        }

        //get marked prices
        if(p1Array.length>0){p1=p1Array[1];}
        if(p2Array.length>0){p2=p2Array[1];}
        if(t1Array.length>0){t1=t1Array[1];}
        if(t2Array.length>0){t2=t2Array[1];}
        
        finalMtm=((p1-p2)-(t1-t2)); mtmArray[i].value=finalMtm;
        finalExpo = p1Array[0]; //assume full unpriced exposure, instead of balmo exposure
        strike = strikeArray[i].value;

        //calculate and display p&l
        pnlArray[i].value = BSArray[i].value*finalExpo*(finalMtm-strike);
        totalMtm = parseFloat(totalMtm)+parseFloat(pnlArray[i].value);

        //scroll to bottom
        var scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollTop = scrollingElement.scrollHeight;

    }
    document.getElementById("totalMtm").innerHTML = totalMtm;

}

function getPrice(priceTable,unitArray,matArray,prodArray,qtyArray,i){

    //get selected product text
    currProdVal = prodArray[i].options[prodArray[i].selectedIndex].text; //alert(currProdVal);
    //get index of selected product text in product header row
    currProdIdx = priceTable[0].indexOf(currProdVal); //alert(currProdIdx);
    //get selected maturity text
    currMatVal = matArray[i].options[matArray[i].selectedIndex].text; //alert(currMatVal.charAt(0));
    //get maturity column as array from price table
    //matCol = priceTable.map(function(value,index) {return value[0];});

    //maturity index in dropdown(NOT PRICE TABLE!!), starts at 2
    currMatIdx=matArray[i].value.charAt(0); //alert(currMatIdx);

    var expoPrice = []; //array in form [exposure,price]
    if(matArray[i].value.charAt(1)=="A"){ //quarterly price
        //alert("Q");
        tempMatIdx = currMatIdx;
        sumExpo=0; sumNotional=0;
        //while maturity index is within qtr and is valid tenor
        while((tempMatIdx>(currMatIdx-3))&&(tempMatIdx>1)){
            
            //get monthly exposure
            currExpo = getExpo(qtyArray[i].value,tempMatIdx); //alert(currExpo);
            //currExpo = parseFloat(qtyArray[i].value);
            sumExpo += currExpo;
            //corresponding maturity index in price table is 1 less than dropdown index
            currPrice = priceTable[tempMatIdx][currProdIdx];
            if(currPrice === ""){ //check not blank price field
                alert("Price not entered for "+priceTable[tempMatIdx][0]+" "+currProdVal);
                return; //end function
            }
            if(isNaN(currPrice)){ //check if is number
                alert("Invalid number for "+priceTable[tempMatIdx][0]+" "+currProdVal);
                return; //end function
            }
            else{
                currPrice = convertPrice(currPrice,unitArray[i].value,prodArray[i].value);
                sumNotional += currExpo*currPrice; 
            }
            tempMatIdx-=1;
        }
        //alert(sumExpo);
        wtAvgPrice = sumNotional/sumExpo; //alert(wtAvgPrice);
        //push qtr sum of exposures and weight avg price into array
        expoPrice.push(sumExpo);expoPrice.push(wtAvgPrice);
    }
    else{ //monthly price
        //alert("M");
        //corresponding maturity index in price table is 1 less than dropdown index
        currPrice = priceTable[currMatIdx][currProdIdx];
        if(currPrice === ""){ //check not blank price field
            alert("Price not entered for "+priceTable[currMatIdx][0]+" "+currProdVal);
            return; //end function
        }
        if(isNaN(currPrice)){ //check if is number
            alert("Invalid number for "+priceTable[currMatIdx][0]+" "+currProdVal);
            return; //end function
        }
        else{
            //push exposure and monthly price
            currExpo = getExpo(qtyArray[i].value,currMatIdx); //alert(currExpo);
            expoPrice.push(currExpo);
            currPrice = convertPrice(currPrice,unitArray[i].value,prodArray[i].value);
            expoPrice.push(currPrice); //alert(priceTable[currMatIdx-1][currProdIdx]);
        }
    }
    return expoPrice;
}

function getExpo(currQty, currMatIdx){
    currQty = parseFloat(currQty);
    return currQty;
    /*
    if(currMatIdx==2){ //balmo exposure
        return (currMthRemainBdays/currFullMthBdays)*currQty;
    }
    else{ //full month exposure
        return currQty;
    }*/
}

function convertPrice(currPrice,currUnit,prodVal){
    var primitiveUnit="";
    var conversionfactor = 1;
    for(var i=0;i<(underlyings.length);i++){
        //alert(underlying[i][0]);
        if(underlyings[i][0]==prodVal){
            //alert(underlyings[i][2]);
            primitiveUnit=underlyings[i][2];
            conversionfactor=underlyings[i][3];
            break;
        }
    }
    // $/mt to $/bbl
    if(currUnit==1 && primitiveUnit=="$/mt"){
        return currPrice/conversionfactor;
    }
    // $/bbl to $/mt
    else if(currUnit==2 && primitiveUnit=="$/bbl"){
        return currPrice*conversionfactor;
    }
    else
        return currPrice;
}