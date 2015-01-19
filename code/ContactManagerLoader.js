

ContactManagerLoader = function () {

    /* this.URL_ACTIVE_CONTACTS = "/services/contact-manager/GetActiveContacts"; */
    this.URL_ADD_CONTACT = "/services/contact-manager/AddContact";
    this.URL_DDL_DEPARTMENTS = "/services/contact-manager/GetDDLDepartments";
    this.URL_DELETE_CONTACT = "/services/contact-manager/DeleteContact";
    this.URL_SEARCH_CONTACTS = "/services/contact-manager/SearchActiveContacts";
    this.URL_UPDATE_CONTACT = "/services/contact-manager/UpdateContact";
    this.URL_VALIDATE_EMAIL = "/services/contact-manager/ValidateEmail";
    this.URL_VALIDATE_EMAIL_EXISTS_FOR_CONTACT = "/services/contact-manager/ValidateEmailExistsForContact";

    this.addContact = function (contactObj) {
        Ext.Ajax.request({
            url: this.URL_ADD_CONTACT,
            headers: { 'Accept': 'application/json' },
            method: 'POST',
            params: { t: (new Date()).getTime() },
            success: function (response) {
                var data = Ext.util.JSON.decode(response.responseText);
                if (data.length == 0) {
                    ContactManagerObj.getExtjsGenerator().reloadGrid();
                    Ext.getCmp('addOrUpdateWindow').close();
                    WindowEditorObj.getExtjsGenerator().renderAddSuccessfulWindow(contactObj);
                }
                else
                    renderServerSideErrorMsg(data);

            },
            failure: function (response) {
                UIServiceError.handleErrorCode(response.status);
            },
            jsonData: contactObj
        });
    };

    this.deleteContact = function (IndexID) {
        Ext.Ajax.request({
            url: this.URL_DELETE_CONTACT,
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            params: { t: (new Date()).getTime(), "indexID": IndexID },
            success: function (response) {
                var data = Ext.util.JSON.decode(response.responseText);
                if (data.length == 0)
                    ContactManagerObj.getExtjsGenerator().reloadGrid();
                else
                    renderServerSideErrorMsg(data);
            },
            failure: function (response) {
                UIServiceError.handleErrorCode(response.status);
            }
        });
    };

    this.updateContact = function (contactObj) {
        Ext.Ajax.request({
            url: this.URL_UPDATE_CONTACT,
            headers: { 'Accept': 'application/json' },
            method: 'POST',
            params: { t: (new Date()).getTime() },
            success: function (response) {
                var data = Ext.util.JSON.decode(response.responseText);
                if (data.length == 0) {
                    ContactManagerObj.getExtjsGenerator().reloadGrid();
                    Ext.getCmp('addOrUpdateWindow').close();
                    WindowEditorObj.getExtjsGenerator().renderUpdateSuccessfulWindow(contactObj);
                }
                else
                    renderServerSideErrorMsg(data);
            },
            failure: function (response) {
                UIServiceError.handleErrorCode(response.status);
            },
            jsonData: contactObj
        });
    };

    this.validateEmailinUse = function (selectedRow) {

        var contactObj = WindowEditorObj.getEventManager().buildContactObj(selectedRow);

        Ext.Ajax.request({
            url: this.URL_VALIDATE_EMAIL,
            headers: { 'Accept': 'application/json' },
            method: 'POST',
            params: { t: (new Date()).getTime() },
            success: function (response) {
                if (response.responseText == 0) {
                    if (Ext.getCmp('emailErrorLBL')) {
                        Ext.getCmp('emailErrorLBL').getEl().hide();
                        WindowEditorObj.getValidation().checkForValidationSuccess(selectedRow);
                    }
                }
                else {
                    WindowEditorObj.getValidation().isFormInError = true;
                    Ext.getCmp('emailErrorLBL').setText(WindowEditorObj.getValidation().VALIDATION_EMAIL_ALREADY_EXISTS_MSG);
                    Ext.getCmp('emailErrorLBL').getEl().show();
                }
            },
            failure: function (response) {
                UIServiceError.handleErrorCode(response.status);
            },
            jsonData: contactObj
        });
    };

    this.ValidateEmailExistsForContact = function (IndexID, callbackIfNoEmailExists, callbackIfEmailExists, contactObj) {

        Ext.Ajax.request({
            url: this.URL_VALIDATE_EMAIL_EXISTS_FOR_CONTACT,
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            params: { t: (new Date()).getTime(), "indexID": IndexID },
            success: function (response) {
                var data = Ext.util.JSON.decode(response.responseText);

                // If the Contact is being used in an Email we should alert the user before the delete prompt, if not we simply display the delete prompt
                if (data == 0)
                    callbackIfEmailExists(contactObj);
                else
                    callbackIfNoEmailExists(contactObj);
            },
            failure: function (response) {
                UIServiceError.handleErrorCode(response.status);
            }
        });
    };


    /***********/
    /* Stores  */
    /***********/

    this.buildActiveContactsStore = function (searchName, searchDepartment) {


        /* Builds & Populates the Grid */
        var proxy = new Ext.data.HttpProxy(Ext.apply({
            headers: { 'Accept': 'application/json' }
        }, {
            method: 'GET',
            baseParams: { t: (new Date()).getTime() },
            api: {
                read: this.URL_SEARCH_CONTACTS
            }
        }));


        var store = new Ext.data.JsonStore({
            // totalProperty: 'totalResults',
            //  root: 'contacts',
            baseParams: {
                t: (new Date()).getTime(),
                searchName: "",
                searchDepartment: ""
            },
            listeners: {
                beforeload: function () {
                    store.baseParams.t = (new Date()).getTime(),
                    store.baseParams.searchName = Ext.getCmp('searchByNameTXT').getValue(),
                    store.baseParams.searchDepartment = Ext.getCmp('searchByDepartmentDD').getValue()
                },
                load: function () {
                    store.sort('LastName', 'ASC');
                },
                loadexception: function (event, proxy, responseHeader) {
                    UIServiceError.handleErrorResponseHeader(responseHeader);
                }
            },

            remoteSort: false,
            fields: [
                                { name: 'IndexID', type: 'string' },
                                { name: 'FirstName', type: 'string' },
                                { name: 'LastName', type: 'string' },
                                { name: 'EmailAddress', type: 'string' },
                                { name: 'AllowAllDepartments', type: 'string' },
                                { name: 'EmailByDefault', type: 'string' },
                                { name: 'Departments', type: 'array' },
                                { name: 'DepartmentNames', type: 'array' }

                            ],
            proxy: proxy,
            storeId: 'contactGridPanelStore'

        });

        return store;
    }

    this.buildDepartmentListStore = function (indexID) {

        if (indexID == null)
            indexID = 0;

        var proxy = new Ext.data.HttpProxy(Ext.apply({
            headers: { 'Accept': 'application/json' }
        }, {
            method: 'GET',
            api: {
                read: this.URL_DDL_DEPARTMENTS
            }
        }));

        var store = new Ext.data.Store({
            baseParams: { t: (new Date()).getTime(), 'indexID': indexID },
            listeners: {
                beforeload: function () {
                    this.baseParams.t = (new Date()).getTime();
                },
                loadexception: function (event, proxy, responseHeader) {
                    UIServiceError.handleErrorResponseHeader(responseHeader);
                }
            },
            remoteSort: false,
            reader: new Ext.data.JsonReader({
                fields: [
                                { name: 'Key', type: 'string' },
                                { name: 'Value', type: 'string' }
                            ]
            }),
            setDefaultSort: { fieldName: 'Value', dir: 'ASC' },
            proxy: proxy
        });


        return store;
    }

}