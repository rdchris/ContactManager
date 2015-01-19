/* Class WindowEditorExtjsGenerator
   * The following Class controls all Extjs usage for the AddEdit Widnow
*/

WindowEditorExtjsGenerator = function () {
    //Branding changes applied using strDepartmentsLbl and strDepartmentsLbl

    this.WINDOW_SAVE_SUCCESSFUL_TITLE = "Contact has been updated successfully";
    this.WINDOW_ADD_SUCCESSFUL_TITLE = "New contact has been successfully added";

    this.SAVE_CONFIRMATION_MSG = 'This contact has unsent emails in the Outbox. Saving your changes will remove this contact’s email address from all unsent email.';
    this.maxLengthForTXT = 255;

    this.renderWindowAddEdit = function (selectedRow) {

        // Edit
        if (selectedRow != null) {
            var addOrUpdateWindowTitle = 'Edit Contact';
            var addOrUpdateBTN = 'Save';
            var addOrUpdateBTNSaveorInsert = '/Images/Icons/save.gif';
            var firstNameValue = $("<div/>").html(Ext.util.Format.htmlEncode(selectedRow.FirstName)).text();
            var lastNameValue = $("<div/>").html(Ext.util.Format.htmlEncode(selectedRow.LastName)).text();
            var emailValue = $("<div/>").html(Ext.util.Format.htmlEncode(selectedRow.EmailAddress)).text();
            var isEmailByDefault = (selectedRow.EmailByDefault === "true");
            var departmentsArray = new Array();

            var departmentsArray = new Array();
            //Converts the Simple String Array into an ArrayList to be used in the Store
            for (i = 0; i < selectedRow.Departments.length; i++) {
                var testArray = new Array(selectedRow.Departments[i], selectedRow.DepartmentNames[i]);
                departmentsArray[i] = testArray;
            }
        }
        // Add 
        else {
            var addOrUpdateWindowTitle = 'Add Contact';
            var addOrUpdateBTN = 'Add';
            var addOrUpdateBTNSaveorInsert = '/Images/add.png';
            var firstNameValue = "";
            var lastNameValue = "";
            var emailValue = "";
            var departmentsArray = new Array();
        }


        // Right Grid
        var currentDepartmentStore = new Ext.data.ArrayStore({
            fields: [{ name: 'Key', type: 'String', width: 180 },
                     { name: 'Value', type: 'String', width: 180}],
            remoteSort: false,
            setDefaultSort: { fieldName: 'Value', dir: 'ASC' }
        });

        var selectModelAllDepartments = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            checkOnly: true,
            hideable: false,
            fixed: true,
            sortable: false,
            mode: 'MULTI'
        });

        currentDepartmentStore.addListener('datachanged', function () {
            WindowEditorObj.getValidation().validateDepartmentSelected();
        });

        // Left grid
        var contactIndexId = null;
        if (selectedRow != null) {
            contactIndexId = parseInt(selectedRow.IndexID);
        }

        var allDepartmentsStore = (new ContactManagerLoader()).buildDepartmentListStore(contactIndexId);

        var selectModeCurrentDepartments = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            checkOnly: true,
            hideable: false,
            fixed: true,
            sortable: false,
            mode: 'MULTI'
        });

        // Render Window
        var window = new Ext.Window({
            title: addOrUpdateWindowTitle,
            id: 'addOrUpdateWindow',
            bodyStyle: 'padding: 10px;',
            layout: 'absolute',
            modal: true,
            width: 630,
            height: 445,
            closeAction: 'closeFunction',
            closeFunction: function () { WindowEditorObj.getEventManager().addOrEditWindowValidateDataChanged(selectedRow, 'Cancel'); },
            items: [{ xtype: 'label', text: 'First Name', width: 115, x: 10, y: 14 },
                    { xtype: 'textfield', id: 'firstNameTXT', value: firstNameValue, width: 290, x: 85, y: 10,
                        listeners: {
                            blur: function (d) { WindowEditorObj.getValidation().validateFirstName(); }
                        }
                    },
                    { xtype: 'label', id: 'firstNameErrorLBL', cls: 'errorTxt', width: 200, x: 395, y: 14 },
                    { xtype: 'label', text: 'Last Name', width: 115, x: 10, y: 44 },
                    { xtype: 'textfield', id: 'lastNameTXT', value: lastNameValue, width: 290, x: 85, y: 40,
                        listeners: {
                            blur: function (d) { WindowEditorObj.getValidation().validateLastName(); }
                        }
                    },
                    { xtype: 'label', id: 'lastNameErrorLBL', cls: 'errorTxt', width: 200, x: 395, y: 44 },
                    { xtype: 'label', text: 'Email', width: 115, x: 10, y: 73 },
                    { xtype: 'textfield', id: 'emailTXT', value: emailValue, width: 290, x: 85, y: 70,
                        listeners: {
                            blur: function (d) { WindowEditorObj.getValidation().validateEmail(); }
                        }
                    },
                    { xtype: 'label', id: 'emailErrorLBL', cls: 'errorTxt', width: 200, x: 395, y: 74 },
            /*         { xtype: 'label', id: 'emailExistsErrorLBL', cls: 'errorTxt', text: this.VALIDATION_EMAIL_ALREADY_EXISTS_MSG, width: 200, x: 395, y: 72 },
            { xtype: 'label', id: 'emailIncorrectFormapErrorLBL', cls: 'errorTxt', text: this.VALIDATION_EMAIL_INCORRECT_FORMAT_MSG, width: 200, x: 395, y: 72 }, */
                    {xtype: 'label', text: 'Available ' + strDepartmentsLbl, x: 11, y: 120 },
                    new Ext.grid.GridPanel({
                        store: allDepartmentsStore,
                        columns: [{
                            id: 'searchByDepartment',
                            width: 210,
                            dataIndex: 'Value',
                            renderer: function (value, meta, record) {                                
                                return "<div ext:qtip='" + value + "'>" + value + "</div>";
                            }
                        }],
                        id: 'WindowEditorAllDepartmentsGrid',
                        height: 180,
                        width: 230,
                        viewConfig: { forceFit: true },
                        selModel: selectModelAllDepartments,
                        x: 10,
                        y: 140
                    }),
                    { xtype: 'button', text: 'Add', icon: '/Images/icons/arrow_right.png', width: 100, x: 255, y: 180,
                        handler: function (btn, event) { WindowEditorObj.getEventManager().addOrEditWindowGridMovement(Ext.getCmp('WindowEditorCurrentDepartmentsGrid'), Ext.getCmp('WindowEditorAllDepartmentsGrid')) }
                    },
                    { xtype: 'button', text: 'Remove', icon: '/Images/icons/arrow_left.png', width: 100, x: 255, y: 225,
                        handler: function (btn, event) { WindowEditorObj.getEventManager().addOrEditWindowGridMovement(Ext.getCmp('WindowEditorAllDepartmentsGrid'), Ext.getCmp('WindowEditorCurrentDepartmentsGrid')) }
                    },
                    { xtype: 'label', text: 'Selected ' + strDepartmentsLbl, x: 375, y: 120 },
                    new Ext.grid.GridPanel({
                        store: currentDepartmentStore,
                        columns: [{ id: 'departments', width: 210, dataIndex: 'Value'}],
                        columns: [{
                            id: 'departments',
                            width: 210,
                            dataIndex: 'Value',
                            renderer: function (value, meta, record) {
                                return "<div ext:qtip='" + value + "'>" + value + "</div>";
                            }
                        }],
                        id: 'WindowEditorCurrentDepartmentsGrid',
                        height: 180,
                        width: 230,
                        viewConfig: { forceFit: true },
                        selModel: selectModeCurrentDepartments,
                        x: 375,
                        y: 140

                    }),
                    { xtype: 'label', id: 'departmentsErrorLBL', cls: 'errorTxt', width: 200, x: 10, y: 330 },
                    { xtype: 'checkbox', id: 'automaticEmailCHKBOX', checked: isEmailByDefault, boxLabel: 'User will be automatically included in all emails to selected ' + strDepartmentsLbl, x: 10, y: 350 }
                    ],
            buttons: [{ text: addOrUpdateBTN, icon: addOrUpdateBTNSaveorInsert, handler: function (btn, event) { WindowEditorObj.getEventManager().addOrEditWindowValidateDataChanged(selectedRow, 'AddOrUpdate'); } },
                       { text: 'Cancel', icon: 'Images/delete.png', handler: function (btn, event) { WindowEditorObj.getEventManager().addOrEditWindowValidateDataChanged(selectedRow, 'Cancel'); } }]

        });
        window.show();
        allDepartmentsStore.load();
        currentDepartmentStore.loadData(departmentsArray);

        // TODO in Extjs 4.0 we should remove this and use Extjs's capabilities 
        $('#firstNameTXT,#lastNameTXT,#emailTXT').attr('maxlength', this.maxLengthForTXT); //maxLengthForTXT

    }

    this.renderAddSuccessfulWindow = function (contactObj) {

        Ext.MessageBox.show({
            title: this.WINDOW_ADD_SUCCESSFUL_TITLE,
            msg: $('<div/>').text(contactObj.FirstName).html() + ' ' + $('<div/>').text(contactObj.LastName).html() + ' (' + $('<div/>').text(contactObj.EmailAddress).html() + ') ' + 'has been successfully created',
            buttons: Ext.MessageBox.OK,
            animEl: 'mb4',
            icon: Ext.MessageBox.INFO
        });
    }

    this.renderUpdateSuccessfulWindow = function (contactObj) {

        Ext.MessageBox.show({
            title: this.WINDOW_SAVE_SUCCESSFUL_TITLE,
            msg: $('<div/>').text(contactObj.FirstName).html() + ' ' + $('<div/>').text(contactObj.LastName).html() + ' (' + $('<div/>').text(contactObj.EmailAddress).html() + ') ' + ' have been successfully saved',
            buttons: Ext.MessageBox.OK,
            animEl: 'mb4',
            icon: Ext.MessageBox.INFO
        });
    }

    this.renderCancelConfirmationWindow = function (selectedRow) {

        Ext.MessageBox.show({
            title: 'Save Changes?',
            msg: 'Are you sure you want to cancel without Saving the current Contact?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (BTN) {
                if (BTN == "yes")
                    Ext.getCmp('addOrUpdateWindow').close();
            },
            animEl: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }

    this.renderSaveConfirmation = function (contactObj) {
        // Called if the contact has an Unset email 
        Ext.MessageBox.show({
            title: 'Contact has unset Emails',
            msg: this.SAVE_CONFIRMATION_MSG,
            buttons: Ext.MessageBox.YESNO,
            fn: function (BTN) {
                if (BTN == "yes")
                    WindowEditorObj.getParentFormObj().getLoader().updateContact(contactObj);
            },
            animEl: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }

}


