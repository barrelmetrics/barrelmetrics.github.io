//Show curve checkbox list
var expanded = true;

function populateCheckboxes(currArray){
    var checkboxes = document.getElementById("checkboxes");
    for(i=1; i<currArray.length;i++){
        var node = document.createElement('div');        
        node.innerHTML = '<input type="checkbox" id="'+i+'" checked>'+ currArray[i][1];       
        document.getElementById('checkboxes').appendChild(node);  
    }
}

function showCheckboxes(){
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

function getCheckedValues(){
    //delete all underlying columns in table
    var table = document.getElementById("priceTable");
    rows = table.rows;
    while(rows[0].cells.length>1) {
        //alert(rows[0].cells.length);
        for (var j = 0; j < rows.length; j++) {
            rows[j].deleteCell(1);
        }
    }
    //insert selected curves as columns
    var checks = document.querySelectorAll("input[type='checkbox']:checked");
    for(i=0; i<checks.length;i++){
        var checkName = checks[i].nextSibling.nodeValue;
        if(checkName!="Select All" && checkName!=""){
            var cell = rows[0].insertCell(-1); //insert cell at end of row
            var cell2 = rows[1].insertCell(-1); //insert cell at end of row
            cell.outerHTML = "<th>"+checkName+"</th>"; //get label value next to checkbox
            cell2.innerHTML = getPrimitiveUnits(checkName);
            for (mthOffset=2; mthOffset<=monthTenorCount+1; mthOffset++){
                cell = table.rows[mthOffset].insertCell(-1); //insert input cells in rest of column
                cell.innerHTML = '<input>';
            }
        }
    }
    $("#priceTable").jsdragtable();
}

function getPrimitiveUnits(thisUdl){
    for(var i=0;i<(underlyings.length);i++){
        //alert(underlying[i][0]);
        if(underlyings[i][1]==thisUdl){
            return underlyings[i][2];
        }
    }
}

function toggle(source){
    checkboxes = document.querySelectorAll("input[type=checkbox]");
    //alert(checkboxes.length);
    for (var i = 0; i < checkboxes.length; i++) {
        //alert(checkboxes[i].checked);
        checkboxes[i].checked=source.checked;
      }
}