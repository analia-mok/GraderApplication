/**
 * File Name: section_widget.js
 * Description: Module that handles display and removal of
 * selected sections in the new_assignment page
 *
 * @author: Analia Mok
 */

var SectionDropdownNDisplay = (function(){

    // 1. Array to hold onto all currently selected sections
    // 2. Reference to the ul used to display all selected sections
    var allSelections, selectedOutput;

    /**
     * init - Initialization function called before module is used. Sets
     *      all necessary variables in local scope.
     */
    var init = function(){
        allSelections = [];
        selectedOutput = $("#selected_sections")[0];
    };

    /**
     * addSection - Adds Section to display underneath drop down and to json
     *              string in dropdown's value
     * @return true on success; false otherwise
     */
    var addSection = function(){

        // 1. Output target: ul
        // 2. New li object: Method found in assignment.js
        var selected = $(".section-dropdown").val(),
            newItem = createListItem(selected);

        // First check to see if selected item is already in allSelection
        if(allSelections.indexOf(selected) != -1){
            // Get out if already added
            return false;
        }

        // Otherwise, add to allSelections
        allSelections.push(selected);

        // Remove Button
        var removeBtn = document.createElement("button");
        removeBtn.appendChild(document.createTextNode("Remove"));
        removeBtn.setAttribute("type", "button");
        removeBtn.setAttribute("name", "remove");
        removeBtn.className="blue-btn";

        removeBtn.onclick = removeSection;

        // Otherwise, add new item (with a remove button) to the ul
        newItem.appendChild(removeBtn);
        selectedOutput.append(newItem);

        return true;
    };


    /**
     * removeSection - Removes a list item from selected sections list
     */
    var removeSection = function(){
        // TODO
    };


    /**
     * assignValue - When form is successfully validated and ready to submit,
     *      create JSON string of all selected sections and assign to the
     *      .section-dropdown's value
     */
    var assignValue = function(){
        // TODO
    };


    return {
        init: init,
        addSection: addSection,
        removeSection: removeSection,
        assignValue: assignValue
    };

})();
