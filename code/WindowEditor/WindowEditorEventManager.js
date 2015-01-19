/* 

*/

WindowEditorEventManger = function () {

    this.addOrEditWindowGridMovement = function (toGrid, fromGrid) {

        var selected = fromGrid.getSelectionModel().getSelections()
        var startingCount = toGrid.store.getCount();


        if (selected.length > 0) {

            for (var i = 0; i < selected.length; i++) {

                // check to see if 'All' is being moved to currentDepartments, if this is case all records must be moved
                // to the All Departments Grid and only 'All' Departments will be in current departments
                if ((selected[i].data.Key == "ALL") && (toGrid.id == "WindowEditorCurrentDepartmentsGrid")) {

                    // Loop through all records on the currentDepartmentsGrid and remove them
                    for (var x = 0; x < startingCount; x++) {

                        // x is not used below because the index's of the store will decrease as records are removed
                        // thus you will only remove about half of the records once X > new record amount
                        fromGrid.store.add(toGrid.store.getAt(0));
                        toGrid.store.remove(toGrid.store.getAt(0));

                    }
                    //Add the 'All' record to the currentDepartmentsGrid
                    fromGrid.store.remove(selected[i]);
                    toGrid.store.add(selected[i]);

                    //Terminate the For Loop
                    i = selected.length;
                }

                // if 'All' wasn't selected 
                else {
                    fromGrid.store.remove(selected[i]);
                    toGrid.store.add(selected[i]);

                    // remove 'All' from the CurrentDepartments Grid if it's there
                    for (var z = 0; z < startingCount; z++) {
                        if ((toGrid.store.data.items[z].data.Key == "ALL") && (toGrid.id == "WindowEditorCurrentDepartmentsGrid")) {
                            fromGrid.store.add(toGrid.store.getAt(z));
                            toGrid.store.remove(toGrid.store.getAt(z));
                        }
                    }
                }
            }
        }

        fromGrid.store.sort('Value', 'ASC');
        toGrid.store.sort('Value', 'ASC');

        var indexFrom = fromGrid.getStore().find('Key', 'ALL');
        if (indexFrom >= 0) {
            var record = fromGrid.getStore().getAt(indexFrom);
            fromGrid.getStore().removeAt(indexFrom);
            fromGrid.getStore().insert(0, record);
        }



    };

    this.addOrEditWindowSaveBTNClick = function (selectedRow) {

        var contactObj = WindowEditorObj.getEventManager().buildContactObj(selectedRow);

        // add
        if (selectedRow == null)
            WindowEditorObj.getParentFormObj().getLoader().addContact(contactObj);

        // update
        else {

            // The following Logic will compare the old selected departments (SelectedRow) to the new ones (contactObj)
            // If the User has removed any departments then we need to prompt with a confirmation before we save
            var newDeptList = "";
            var departmentsIdenticalOrAddedTo = true;

            // required so short names cannot be found in sections of larger oens .. aka 'Ams' getting found in 'Amsolve'
            for (var i = 0; i < contactObj.Departments.length; i++) {
                newDeptList += '"' + contactObj.Departments[i] + '"';
            }

            for (var i = 0; i < selectedRow.Departments.length; i++) {
                var wasFound = (newDeptList.indexOf(selectedRow.Departments[i]))
                if (wasFound == "-1")
                    departmentsIdenticalOrAddedTo = false;
            }

            if (contactObj.AllowAllDepartments || departmentsIdenticalOrAddedTo)
                WindowEditorObj.getParentFormObj().getLoader().updateContact(contactObj);
            else {
                // Check to see if the Contact currently has an Unset Email. If they do provide a Yes No confirmation before safe, simplly attempt a save
                var callbackIfEmailExists = function (contactObj) { WindowEditorObj.getExtjsGenerator().renderSaveConfirmation(contactObj) };
                var callbackIfNoEmailExists = function (contactObj) { WindowEditorObj.getParentFormObj().getLoader().updateContact(contactObj) };
                WindowEditorObj.getParentFormObj().getLoader().ValidateEmailExistsForContact(selectedRow.IndexID, callbackIfNoEmailExists, callbackIfEmailExists, contactObj);
            }

        }
    }

    this.addOrEditWindowValidateDataChanged = function (selectedRow, callingAction) {

        var triggerCallback = false;

        if (selectedRow != null) {
            var contactObj = this.buildContactObj(selectedRow);
            // compare the columns if anything changed
            if (selectedRow.FirstName != contactObj.FirstName || selectedRow.LastName != contactObj.LastName || selectedRow.EmailAddress != contactObj.EmailAddress || selectedRow.AllowAllDepartments != contactObj.AllowAllDepartments.toString() || selectedRow.EmailByDefault != contactObj.EmailByDefault.toString()) {
                triggerCallback = true;
            } else {
                if (selectedRow.AllowAllDepartments != "true" && selectedRow.Departments.toString() != contactObj.Departments.toString()) {
                    triggerCallback = true;
                }
            }
        }

        // If something changed or a record is being added
        if (triggerCallback || selectedRow == null) {
            if (callingAction == 'Cancel')
                WindowEditorObj.getExtjsGenerator().renderCancelConfirmationWindow(selectedRow);
            if (callingAction == 'AddOrUpdate')
                WindowEditorObj.getValidation().validateWindowEditorForm(selectedRow);
        }
        else
            Ext.getCmp('addOrUpdateWindow').close();
    }

    this.buildContactObj = function (selectedRow) {

        var AddOrUpdate;
        var IndexID;
        var AllowAllDepartments = false; //can be flipped in logic below if 'ALL' is added to department list

        // Determine if we are adding or updating
        if (selectedRow != null) {
            AddOrUpdate = 'update';
            indexID = parseInt(selectedRow.IndexID);
        }
        else {
            AddOrUpdate = 'add';
            indexID = 0;
        }

        // build Departments Array
        var currentDeptsGrid = Ext.getCmp('WindowEditorCurrentDepartmentsGrid');
        var currentDeptsArray = new Array();
        for (var i = 0; i < currentDeptsGrid.store.data.items.length; i++) {
            currentDeptsArray[i] = currentDeptsGrid.store.data.items[i].data.Key;
        }

        // determine if 'All' has been selected. If this is the no departments are selected and the AllowallDepartments flag is flipped
        for (var i = 0; i < currentDeptsArray.length; i++) {
            if (currentDeptsArray[i] == "ALL") {
                AllowAllDepartments = true;
                currentDeptsArray = [];
            }
        }

        var contactObj = {
            IndexID: indexID,
            FirstName: $('#firstNameTXT').val(),
            LastName: $('#lastNameTXT').val(),
            EmailAddress: $('#emailTXT').val(),
            AllowAllDepartments: AllowAllDepartments,
            EmailByDefault: Ext.getCmp('automaticEmailCHKBOX').checked,
            DepartmentNames: [],
            Departments: currentDeptsArray
            //            Deleted: null,
            //            CreatedTimeStamp: null,
            //            UpdatedTimeStamp: null,
            //            contactDepartmentMaps: null
        }

        return contactObj;
    }

}