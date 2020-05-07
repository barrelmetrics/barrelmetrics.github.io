

const matrix = new Array(5).fill(0).map(() => new Array(4).fill(0)); //5rows x 4cols
matrix[0]=["Col1","Col2"];


function test(){
    alert(matrix[0][0]);
    alert(matrix[1][0]);
}

function clearMarks(){

  var r = confirm("All marks below will be erased! Do you want to proceed?");
  if (r == true) {
    var inputs = document.getElementById("priceTable").getElementsByTagName('input');
    for (i = 0; i < inputs.length; i++) { 
        inputs[i].value = "";
    }
  }
}

function populateTblColumn(){
  var table = document.getElementById("priceTable");
  var header = table.createTHead();
  var row = header.insertRow(0);
  var row2 = header.insertRow(1);
  //alert(prodArray.options.length);
  for(i=0; i<underlyings.length;i++){ 
    var cell = row.insertCell(i); //insert column header cell
    var cell2 = row2.insertCell(i);
    if(i==0){cell.outerHTML = "<th></th>";cell2.innerHTML = "";}
    else{
      cell.outerHTML = "<th>"+underlyings[i][1]+"</th>"; //insert underlying headers
      cell2.innerHTML = underlyings[i][2]; //insert underlying units
      for (var mthOffset=0; mthOffset<monthTenorCount; mthOffset++){
        cell = table.rows[mthOffset+2].insertCell(-1); //insert input cells in rest of column
        cell.innerHTML = '<input>';
      }
    }
  }
}

var Anterec;
(function(Anterec) {
  var JsDragTable = (function() {
    function JsDragTable(target) {
      this.offsetX = 5;
      this.offsetY = 5;
      this.container = target;
      this.rebind();
    }
    JsDragTable.prototype.rebind = function() {
      var _this = this;
      $(this.container).find('tr:first').find("th").each(function(headerIndex, header) {
        if(headerIndex>0) //first column undraggable
        {
            $(header).off("mousedown touchstart");
            $(header).off("mouseup touchend");
            $(header).on("mousedown touchstart", function(event) {
            _this.selectColumn($(header), event);
            });
            $(header).on("mouseup touchend", function(event) {
            _this.dropColumn($(header), event);
            });
        }
      });
      
      $(this.container).on("mouseup touchend", function() {
        _this.cancelColumn();
      });
//paste from clipboard=========================================================
    $('input').on('paste', function(e){
        var $this = $(this);
        $.each(e.originalEvent.clipboardData.items, function(i, v){
        if (v.type === 'text/plain'){
            v.getAsString(function(text){
                var x = $this.closest('td').index(),
                    y = $this.closest('tr').index(),
                text = text.trim('\r\n');
                $.each(text.split('\r\n'), function(i2, v2){
                    $.each(v2.split('\t'), function(i3, v3){
                            var row = y+i2+1, col = x+i3;
                            $this.closest('table').find('tr:eq('+row+') td:eq('+col+') input').val(v3);
                            //matrix[row][col]=v3;
                            //alert(v3);
                        });
                    });
                });
            }
        });
        return false;
    });

    };

    JsDragTable.prototype.selectColumn = function(header, event) {
      var _this = this;
      event.preventDefault();
      var userEvent = new UserEvent(event);
      this.selectedHeader = header;
      var sourceIndex = this.selectedHeader.index() + 1;
      var cells = [];

      $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function(cellIndex, cell) {
        cells[cells.length] = cell;
      });

      this.draggableContainer = $("<div/>");
      this.draggableContainer.addClass("jsdragtable-contents");
      this.draggableContainer.css({
        position: "absolute",
        left: userEvent.event.pageX + this.offsetX,
        top: userEvent.event.pageY + this.offsetY
      });

      var dragtable = this.createDraggableTable(header);

      $(cells).each(function(cellIndex, cell) {
        var tr = $("<tr/>");
        var td = $("<td/>");
        $(td).html($(cells[cellIndex]).html());
        $(tr).append(td);
        $(dragtable).find("tbody").append(tr);
      });

      this.draggableContainer.append(dragtable);
      $("body").append(this.draggableContainer);
      $(this.container).on("mousemove touchmove", function(event) {
        _this.moveColumn($(header), event);
      });
      $(".jsdragtable-contents").on("mouseup touchend", function() {
        _this.cancelColumn();
      });
    };

    JsDragTable.prototype.moveColumn = function(header, event) {
      event.preventDefault();
      this.selectedHeader = header;
      if (this.selectedHeader !== null) {
        var userEvent = new UserEvent(event);
        this.draggableContainer.css({
          left: userEvent.event.pageX + this.offsetX,
          top: userEvent.event.pageY + this.offsetY
        });
      }
    };

    JsDragTable.prototype.dropColumn = function(header, event) {
      var _this = this;
      event.preventDefault();
      var sourceIndex = this.selectedHeader.index() + 1;
      var targetIndex = $(event.target).index() + 1;
      var tableColumns = $(this.container).find('tr:first').find("th").length;

      var userEvent = new UserEvent(event);
      if (userEvent.isTouchEvent) {
        header = $(document.elementFromPoint(userEvent.event.clientX, userEvent.event.clientY));
        targetIndex = $(header).prevAll().length + 1;
      }

      if (sourceIndex !== targetIndex) {
        var cells = [];
        $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function(cellIndex, cell) {
          cells[cells.length] = cell;
          $(cell).remove();
          $(_this.selectedHeader).remove();
        });

        if (targetIndex >= tableColumns) {
          targetIndex = tableColumns - 1;
          this.insertCells(cells, targetIndex, function(cell, element) {
            $(cell).after(element);
          });
        } else {
          this.insertCells(cells, targetIndex, function(cell, element) {
            $(cell).before(element);
          });
        }

        $(this.container).off("mousemove touchmove");
        $(".jsdragtable-contents").remove();
        this.draggableContainer = null;
        this.selectedHeader = null;
        this.rebind();
      }
    };

    JsDragTable.prototype.cancelColumn = function() {
      $(this.container).off("mousemove touchmove");
      $(".jsdragtable-contents").remove();
      this.draggableContainer = null;
      this.selectedHeader = null;
    };

    JsDragTable.prototype.createDraggableTable = function(header) {
      var table = $("<table/>");
      var thead = $("<thead/>");
      var tbody = $("<tbody/>");
      var tr = $("<tr/>");
      var th = $("<th/>");
      $(table).addClass($(this.container).attr("class"));
      $(table).width($(header).width());
      $(th).html($(header).html());
      $(tr).append(th);
      $(thead).append(tr);
      $(table).append(thead);
      $(table).append(tbody);
      return table;
    };

    JsDragTable.prototype.insertCells = function(cells, columnIndex, callback) {
      var _this = this;
      $(this.container).find("tr td:nth-child(" + columnIndex + ")").each(function(cellIndex, cell) {
        callback(cell, $(cells[cellIndex]));
      });
      $(this.container).find("th:nth-child(" + columnIndex + ")").each(function(cellIndex, cell) {
        callback(cell, $(_this.selectedHeader));
      });
    };
    return JsDragTable;
  })();
  Anterec.JsDragTable = JsDragTable;

  var UserEvent = (function() {
    function UserEvent(event) {
      this.event = event;
      if (event.originalEvent && event.originalEvent.touches && event.originalEvent.changedTouches) {
        this.event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        this.isTouchEvent = true;
      }
    }
    return UserEvent;
  })();
})(Anterec || (Anterec = {}));
jQuery.fn.extend({
  jsdragtable: function() {
    return new Anterec.JsDragTable(this);
  }
});
