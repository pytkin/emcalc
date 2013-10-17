function addEvent(obj, type, fn) {
	if (obj.addEventListener)
		obj.addEventListener(type, fn, false);
	else if (obj.attachEvent)
	{
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() {obj["e"+type+fn](window.event); }
		obj.attachEvent("on"+type, obj[type+fn]);
	}
}

function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

var formcode = '<form action=""><fieldset><label><code>$$$</code> { <kbd><input onkeyup="calcFields()" class="calc" type="text" size="3"/> px</kbd></label> = <label><samp><input readonly="readonly" type="text" size="6"/> em</samp> } </label><span>Add: <a href="#" onclick="return addChild(this)">child</a>, <a href="#" onclick="return addSibling(this)">sibling</a> <a href="#" class="del" onclick="return removeThis(this)" title="Remove whole node (with child nodes)">x</a></span></fieldset></form>';

function addChild(o) {
	var li = o.parentNode.parentNode.parentNode.parentNode; //a -> span -> form -> fieldset -> li
	var linr = li.className.split("lv")[1]; //getting level number from class (1, 2, 3 etc)
	
	var lili = document.createElement("li");
	linr++;
	lili.className = "lv" + linr;
	
	if (document.getElementById("prompt").checked) {
		var node = prompt("Enter node name:","div");
		if (!node) node = "node" + linr;
		var temp = formcode.replace("$$$", node);
	} else {
		var node = "node" + linr;
		var temp = formcode.replace("$$$", node);
	}	
	
	lili.innerHTML = temp;
	
	if (li.childNodes[1]) { //when UL is already a (second) childNode of LI
		li.childNodes[1].appendChild(lili);
	} else { //UL doesn't exist so we have to create one
		var ul = document.createElement("ul");
		ul.appendChild(lili);
		li.appendChild(ul);
	}
	
	lili.getElementsByTagName("input")[0].focus();
	return false;
}

function addSibling(o) {
	var li = o.parentNode.parentNode.parentNode.parentNode; //a -> span -> form -> fieldset -> li
	var linr = li.className.split("lv")[1]; //getting level number from class (1, 2, 3 etc)
	var lili = document.createElement("li");
	lili.className = "lv" + linr;
	
	if (document.getElementById("prompt").checked) {
		var node = prompt("Enter node name:","div");
		if (!node) node = "node" + linr;
		var temp = formcode.replace("$$$", node);
	} else {
		var node = "node" + linr;
		var temp = formcode.replace("$$$", node);
	}	
	
	lili.innerHTML = temp;
	insertAfter(lili,li);
	lili.getElementsByTagName("input")[0].focus();
	return false;
}

function removeThis(o) {
	var li = o.parentNode.parentNode.parentNode.parentNode;
	li.parentNode.removeChild(li);
	return false;
}

/* This script is Copyright (c) Paul McFedries and 
Logophilia Limited (http://www.mcfedries.com/).
Permission is granted to use this script as long as 
this Copyright notice remains in place.*/

function roundDecimals(original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals)
    var result2 = Math.round(result1)
    var result3 = result2 / Math.pow(10, decimals)
    return pad_with_zeros(result3, decimals)
}

function pad_with_zeros(rounded_value, decimal_places) {

    // Convert the number to a string
    var value_string = rounded_value.toString()
    
    // Locate the decimal point
    var decimal_location = value_string.indexOf(".")

    // Is there a decimal point?
    if (decimal_location == -1) {
        
        // If no, then all decimal places will be padded with 0s
        decimal_part_length = 0
        
        // If decimal_places is greater than zero, tack on a decimal point
        value_string += decimal_places > 0 ? "." : ""
    }
    else {

        // If yes, then only the extra decimal places will be padded with 0s
        decimal_part_length = value_string.length - decimal_location - 1
    }
    
    // Calculate the number of decimal places that need to be padded with 0s
    var pad_total = decimal_places - decimal_part_length
    
    if (pad_total > 0) {
        
        // Pad the string with 0s
        for (var counter = 1; counter <= pad_total; counter++) 
            value_string += "0"
        }
    return value_string
}

/* ====================== end of © script ========================== */

function pixToEm(parentPix, childPix) {
	var calc = 0;
	calc = childPix / parentPix;
	var places = document.getElementById("round").value;
	calc = roundDecimals(calc, places);
	return calc;
}

function doMathBaby(o) {
	var parent = '';
	var parentul = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	if (parentul.id == "tree") {
		parent = document.getElementById("base").value;
	} else {
		parent = parentul.parentNode.getElementsByTagName("input")[0].value;
	}
	
	 
	var child = o.value;
	o.parentNode.parentNode.parentNode.getElementsByTagName("input")[1].value = pixToEm(parent, child);
}

function calcFields() {
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i < inputs.length; i++) {
		if (inputs[i].className == "calc") {
			doMathBaby(inputs[i]);
		}
	}
}