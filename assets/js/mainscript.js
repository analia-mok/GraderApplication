/**
 * File Name:   mainscript.js
 * Description: Main JS Script to handle all events & interactions throughout
 * application
 *
 * @author: Analia Mok
 */


window.onload = init;

function init(){

    if($(".table-body").length > 0){
        // if table-body exists
        // See if each table has to be modified
        // NOTE: Will execute no matter what
        //modifyTables();
    }

    if($("#list") != null){
        // NOTE: Will execute no matter what
        getUpcomingList();
    }

    if($("#add_another") != null){
        // Add Another Button Event
        $("#add_another").click(addAnotherStudent);
    }

    if($("#section-dropdown") != null && $(".table-group") != null){
        // on-change events found in gradebook

        // class section dropdown event
        $("#section-dropdown").change(changeSections);

        // student name search dropdown
        $("input[type=search]").change(toggleGradeRows);

    }

    // New Assignment Page

    if($("#section_add") != null){
        // Initialize Section Module
        SectionDropdownNDisplay.init();

        // Add item to selected sections area
        $("#section_add").click(SectionDropdownNDisplay.addSection);
    }

    if($(".sub-category") != null){
        // New Sub Category Button
        $(".sub-category").click(addSubCategory);
    }

    if($(".category") != null){
        // New Category Button
        $(".category").click(addCategory);
    }

} // End of init


// Simple Helper Methods

/**
 * jumpPage - Simple method that takes a url and directs to the page
 * represented by that url
 * @param  String location - Full url
 */
function jumpPage(location){
    window.location.href = location;
} // End of jumpPage


// Dashboard Methods


/**
 * disappear - Removes the element current being displayed
 */
function disappear(element){
    element.parentNode.style.display = "none";
} // End of disappear


 // Table Methods


/**
 * modifyTables - Setup function that looks at each table on the dashboard,
 *      and shortens a table if it is more than 3 rows long. If so, the last
 *      3 rows are hidden and replaced with a "See More" button.
 *
 * @return null
 */
function modifyTables(){

    var tables = $(".table-body"),
        tableGroups = $('.table-group');

    for(var i = 0; i < tables.length; i++){

        var currTable = tables.get(i),
            currTableGroup = tableGroups.get(i),
            rows = $("ul", currTable);

        // Hide Rows 3 and onward
        if(rows.length > 3){
            //rows.slice(3).css("display", "none");
            var remaining = rows.slice(3);
            remaining.toggle();

            // See More Button
            var button = document.createElement("button");
            button.appendChild(document.createTextNode("See More"));

            // Button Styling
            button.style.fontFamily = "Open Sans, sans-serif";
            button.style.margin = "0.5em";
            button.style.backgroundColor = "#EEE";
            button.style.border = "0";
            button.style.textDecoration = "underline";
            button.style.cursor = "pointer";
            button.style.fontSize = "1em";

            // Adding Toggle Event to Button
            button.onclick = function(){ remaining.toggle(); };

            // Button Holder
            var newRow = document.createElement("div");
            newRow.className = "table-button-holder";
            newRow.appendChild(button);

            // Row Styling
            newRow.style.textAlign = "center";

            // $table.append(newRow);
            currTableGroup.append(newRow);

        }

    }
} // End of modifyTables


// Assignment Methods


/**
 * getUpcomingList - Makes an AJAX request that retrieves any upcoming
 *     assignments to grade within the month. Items are generated either with
 *     or without a checkbox. Checkboxes are only available on the Calendar
 *     page where users can "complete" a task
 */
function getUpcomingList(){

    var withCheckBoxes = (document.getElementById("home-upcoming") === null);

    // Requesting to populate upcoming list
    $.ajax({
        url: "http://localhost/GraderApplication/index.php/calendar/find_upcoming",
        type: "post",
        mimetype: "json",
        data: {'withCheckBoxes' : withCheckBoxes},
        success: function(response){
            $("#list").html(response);
        },
        error: function(response){
            console.log("ERROR: " + response);
        }
    });

} // End of getUpcomingList


/**
 * completeAssignment - Given an assignment ID, send an AJAX request to
 *      Calendar controller to change is_completed state of assignment to true.
 * @param assignmentID - int
 * @return null
 */
function completedAssignment(assignmentID){
    $.ajax({
        url: "http://localhost/GraderApplication/index.php/calendar/complete_assignment",
        type: "post",
        mimetype: "json",
        data: { 'assignmentID': assignmentID },
        success: function(response){
            // Replace list items to reflect change
            $("#list").html(response);

            // Look for event in calendar to remove
            $("#event"+assignmentID).css("display", "none");

        },
        error: function(response){
            console.log("ERROR: " + response);
        }
    });
} // End of completedAssignment


// Gradebook Methods


/**
 * addAnotherStudent - Makes an AJAX request to the Gradebook
 *      controller to create another new student form
 */
function addAnotherStudent(){
    // Total Current forms
    var totalForms = $("#total_forms").attr("value");

    $.ajax({
        url: "http://localhost/GraderApplication/index.php/gradebook/set_more_rules",
        type: "post",
        mimetype: "json",
        data: { 'total_forms': totalForms },
        success: function(response){
            // If successful, append a a set of
            // Reset and delete buttons to latest form,
            // then append new form
            var currForm = "#form_" + (totalForms-1);

            // Adding a button group to latest group
            var buttonGroup = document.createElement("div");
            buttonGroup.className = "button-group";

            // Clear Button
            var clearBtn = document.createElement("button");
            clearBtn.name = "clear_"+(totalForms-1);
            clearBtn.value = "clear_"+(totalForms-1);
            clearBtn.className = "blue-btn";
            clearBtn.appendChild(document.createTextNode("Clear"));

            // Clear values of this forms inputs
            clearBtn.onclick = function(){
                var underscoreIdx = this.name.lastIndexOf("_");
                var formNumber = this.name.substr(underscoreIdx+1);

                var firstName = document.getElementById("first_name_"+formNumber);

                if(firstName != null){
                    firstName.value = "";
                }

                var lastName = document.getElementById("last_name_"+formNumber);
                if(lastName != null){
                    lastName.value = "";
                }

                // Do not submit
                return false;
            };

            // Delete Button
            var deleteBtn = document.createElement("button");
            deleteBtn.name = "delete_"+(totalForms-1);
            deleteBtn.value = "delete_"+(totalForms-1);
            deleteBtn.className = "blue-btn";
            deleteBtn.appendChild(document.createTextNode("Delete"));

            deleteBtn.onclick = function(){
                var underscoreIdx = this.name.lastIndexOf("_");
                var formNumber = parseInt(this.name.substr(underscoreIdx+1));

                // Remove form entirely
                $("#form_"+formNumber).remove();

                // Decrement value in total_form hidden input
                var totalForms = $("#total_forms").attr("value") - 1;
                $("#total_forms").attr("value", totalForms);

                // Re-number forms
                var forms = $(".student-info-group");
                for(var i = 0; i < totalForms; i++){
                    var curr = forms[i];
                    underscoreIdx = curr.id.lastIndexOf("_");
                    var currFormNumber = curr.id.substr(underscoreIdx+1);

                    curr.id = "form_" + i;
                    var firstName = document.getElementById("first_name_"+currFormNumber);
                    firstName.id = "first_name_"+i;
                    firstName.name = "first_name_"+i;

                    var lastName = document.getElementById("last_name_"+currFormNumber);
                    lastName.id = "last_name_"+i;
                    lastName.name = "last_name_"+i;

                    var sections = document.getElementsByClassName("section-dropdown")[i];
                    sections.name = "sections_"+i;

                }

                // Do not submit
                return false;
            };

            buttonGroup.appendChild(clearBtn);
            buttonGroup.appendChild(deleteBtn);

            $(currForm).append(buttonGroup);

            // Inserting new form after the latest form
            $(currForm).after(response);

            // Focus on first input of new form
            $("#first_name_"+totalForms).focus();

            // Increment value in total_form hidden input
            $("#total_forms").attr("value", ++totalForms);

            // Change value of "Add Student" button
            $("input[type=submit]").attr("value", "Add All Students");

            console.log("Success: New Form Added");

        },
        error: function(response){
            console.log("ERROR: " + response);
        }
    });

} // End of addAnotherStudent


/**
 * changeSections - onchange event that occurs when user selects a
 *      different class section to filter by. Sends an AJAX request to change
 *      contents of grade table
 */
function changeSections(){

    var sectionID = $(".section-dropdown").val();

    $.ajax({
        url: "http://localhost/GraderApplication/index.php/gradebook/change_grade_table",
        type: "post",
        mimetype: "json",
        data: { 'section_id': sectionID },
        success: function(response){
            // Change html inside table-group
            $(".table-group").html(response);

            // Change content of h2#selected_section
            $("#selected_section").html(sectionID);
        },
        error: function(response){
            console.log("ERROR: " + response);
        }
    });
} // End of changeSections


/**
 * toggleGradeRows - onchange event that triggers when user types inside search
 *      bar. Checks to see if any part of the student's name contains the given
 *      input
 */
function toggleGradeRows(){

    // Search Input & table rows
    var search = $("input[type=search]").val(),
        records = $(".table-group ul");

    for(var i = 1, length = records.length; i < length; i++){
        var name = records[i].children[0].innerHTML;

        if(name.includes(search) === false){
            // If name doesn't match search, toggleOff
            records[i].style.display = "none";
        }else{
            records[i].style.display = "table-row";
        }

    }

} // End of toggleGradeRows


/**
 * openStudentModal - Displays & populates modal for editing student
 *      information. All information required to populate inputs are present on
 *      page.
 *
 * @param student - li object holding clicked student
 */
function openStudentModal(student){

    var modal = document.getElementById("student-modal");
    var modalContent = document.getElementsByClassName("modal-content")[0];
    var section = document.getElementById("selected_section").value;

    // Formatting last name & first name
    var name = student.innerText;
    name = name.split(" ");

    var firstName = name[1];
    var lastName = name[0].substr(0, name[0].length-1);


    // Pre-populating Inputs & Modal Title
    document.getElementById("first_name").setAttribute("value", firstName);
    document.getElementById("last_name").setAttribute("value", lastName);
    modal.getElementsByClassName("section-dropdown")[0].value = section;

    var header = document.getElementById("title");
    header.innerText = "";
    header.appendChild(
        document.createTextNode(firstName + " " + lastName + " - Edit Student")
    );

    // Now display modal
    modal.style.display = "block";

} // End of openStudentModal


/**
 * disappearModal - Hide modal on page
 */
function disappearModal(){
    document.getElementsByClassName("modal")[0].style.display = "none";
}
