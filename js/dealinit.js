function addRow(){

    //destroy sortable plugin first
    $("#dealTable tbody").sortable("destroy");

    //clone div and reset content
    var elmnt = document.getElementsByClassName("row-data")[0];
    var cln = elmnt.cloneNode(true);
    clearChildren(cln);
    cln.getElementsByClassName("ID")[0].textContent = genUID();
    document.getElementById("dealTable").getElementsByTagName('tbody')[0].appendChild(cln);

    //rebind sortable plugin
    sortTableRow();

    //remove all duplicate labels
    //var origlbl1 = document.querySelectorAll('.lbl1')[0];
    //var i,all = document.querySelectorAll('.lbl1');
   	//for(i=0;i<all.length;i++)
   	//{
	//	if (all[i] !== original)
    // 	{//this is a clone
    //   	all[i].parentNode.removeChild(all[i]);
    // 	}
   	//}
}

//clone row and contents
function cloneRow(ele){
    //destroy sortable plugin first
    $("#dealTable tbody").sortable("destroy");

    var cln = ele.parentNode.parentNode.cloneNode(true);
    var i, eleSelect = ele.parentNode.parentNode.querySelectorAll("select");
    clnSelect = cln.querySelectorAll("select");
    //Copy all selected index from clone
    for(let i = 0; i < eleSelect.length; i++)
    {
		//alert(eleSelect[i].selectedIndex);
        clnSelect[i].selectedIndex = eleSelect[i].selectedIndex;
        $(clnSelect[i]).css('border','');
    } 
    cln.getElementsByClassName("ID")[0].textContent = genUID();
    
    document.getElementById("dealTable").getElementsByTagName('tbody')[0].appendChild(cln);
    //rebind sortable plugin
    sortTableRow();
}

//remove row
function removeThis(ele){
	var sameClass = document.getElementsByClassName("row-data")
	//if only 1 row is left
	if(sameClass.length==1)
	{
        //rowlength = ele.parentNode.parentNode.childNodes.length;
        //alert(rowlength);
        //var e = ele.parentNode.parentNode.childNodes[2];
        var e = ele.parentNode.parentNode;
        clearChildren(e);
        //alert(e.nodeName);
    }//end if
	else{ele.parentNode.parentNode.remove();}
};

//recursive childnode reset and UID generation
function clearChildren(element){
   for (var i = 0; i < element.childNodes.length; i++) {
      var e = element.childNodes[i];
      if (e.tagName) switch (e.tagName.toLowerCase()) {
         case 'input':
            switch (e.type) {
               case "radio":
               case "checkbox": e.checked = false; break;
               case "button":
               case "text":
                   //alert(i);
                    $(e).css('border','');
                    e.value='';
                    if(e.className=='MTM'||e.className=='PnL') e.placeholder='-readonly-';
                    else e.placeholder='';
                    break;
               case "image": break;
               default: e.value = ''; break;
            }
            break;
         case 'select': e.selectedIndex = 0; $(e).css('border',''); break;
         case 'label': //e.textContent = genUID();
         default: clearChildren(e);
      }
   }
}

function populateProduct(currArray){
    var select1 = document.getElementsByClassName("Product")[0];
    var select2 = document.getElementsByClassName("Product2")[0];

    for(i=1; i<currArray.length;i++){
        var udl = currArray[i];
        var el1 = document.createElement("option");var el2 = document.createElement("option");
        el1.textContent = udl[1];el2.textContent = udl[1];
        el1.value = udl[0];el2.value = udl[0];
        select1.appendChild(el1);
        select2.appendChild(el2);
    }
}

function sortTableRow(){
    $("#dealTable tbody").sortable({
        items: "> tr:not(:first)",
      cursor: "move",
      placeholder: "sortable-placeholder",
      helper: function(e, tr)
      {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
        // Set helper cell sizes to match the original sizes
        $(this).width($originals.eq(index).width());
        });
        return $helper;
      }
    }).disableSelection();
}

function genUID(){
    var a = moment([2020, 0, 1]);
    return 'T' + moment().diff(a);
}

function checkRequiredField(checktype){ //0 for position; 1 for pnl
    //get all column info
	var BSArray = document.querySelectorAll(".BS");
    var qtyArray = document.querySelectorAll(".Quantity");
    var unitArray = document.querySelectorAll(".Unit");
    var matArray = document.querySelectorAll(".Maturity");
    var prodArray = document.querySelectorAll(".Product");
    var strikeArray = document.querySelectorAll(".Strike");
    var checkFields = 1;

    //Check relevant deal entry and highlight blank fields
    for(var i=0; i<BSArray.length;i++){
        if(BSArray[i].value == 0) {
            $(BSArray[i]).val('').css( "border-color", "red" );
            $(BSArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
        	$(BSArray[i]).css('border','');
        
        if(qtyArray[i].value == "") {
            $(qtyArray[i]).val('').css( "border-color", "red" );
            $(qtyArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else if(isNaN(qtyArray[i].value)){
            alert("Please enter valid number for quantity");
            $(qtyArray[i]).val(qtyArray[i].value).css( "border-color", "red" );
            $(qtyArray[i]).val(qtyArray[i].value).css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
        	$(qtyArray[i]).css('border','');

        if(unitArray[i].value == 0) {
            $(unitArray[i]).val('').css( "border-color", "red" );
            $(unitArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
            $(unitArray[i]).css('border','');

        if(matArray[i].value == 0) {
            $(matArray[i]).val('').css( "border-color", "red" );
            $(matArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
        	$(matArray[i]).css('border','');
        
        if(prodArray[i].value == 0) {
            $(prodArray[i]).val('').css( "border-color", "red" );
            $(prodArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
            $(prodArray[i]).css('border','');
            
        if(strikeArray[i].value == 0 && checktype==1) {
            $(strikeArray[i]).val('').css( "border-color", "red" );
            $(strikeArray[i]).val('').css( "border-width", "thick" );
            checkFields *= 0;
        }
        else if(isNaN(strikeArray[i].value)){
            alert("Please enter valid number for strike price");
            $(strikeArray[i]).val(strikeArray[i].value).css( "border-color", "red" );
            $(strikeArray[i]).val(strikeArray[i].value).css( "border-width", "thick" );
            checkFields *= 0;
        }
        else
            $(strikeArray[i]).css('border','');
    }

    return checkFields;

}

function updateDD(thisDropDown){

    if(thisDropDown.value==1){
        var strike = thisDropDown.parentNode.parentNode.querySelectorAll(".Strike");
        strike[0].placeholder = "$/bbl";
        var mtm = thisDropDown.parentNode.parentNode.querySelectorAll(".MTM");
        mtm[0].placeholder = "$/bbl";
    }
    else if(thisDropDown.value==2){
        var strike = thisDropDown.parentNode.parentNode.querySelectorAll(".Strike");
        strike[0].placeholder = "$/mt";
        var mtm = thisDropDown.parentNode.parentNode.querySelectorAll(".MTM");
        mtm[0].placeholder = "$/mt";
    }
   
/*
    var lblStrike;
    var lblMTM;
    if(thisDropDown.value==1){
        lblStrike = "Strike Price ($/bbl)";
        lblMTM = "Mtm Price ($/bbl)";
    }
    else if(thisDropDown.value==2){
        lblStrike = "Strike Price ($/mt)";
        lblMTM = "Mtm Price ($/mt)";
    }
    document.getElementById("strikePricePerUnit").innerHTML=lblStrike;
    document.getElementById("mtmPricePerUnit").innerHTML=lblMTM;
*/
}

function updateText(thisTextBox){
    //thisTextBox.value = thisTextBox.value + " " + thisTextBox.placeholder;
}