/* Class 
* =======
* Performs all the Validation for WindowEditor
*/

WindowEditorValidation = function () {

    this.MAX_TXT_VALUES_LENGTH = 75;

    this.VALIDATION_FNAME_EMPTY_MSG = " *First Name is required";
    this.VALIDATION_FNAME_GREATER_THAN_LIMIT_CHARS_MSG = "*First name may only contain " + this.MAX_TXT_VALUES_LENGTH + " characters";
    this.VALIDATION_LNAME_EMPTY_MSG = " *Last Name is required";
    this.VALIDATION_LNAME_GREATER_THAN_LIMIT_CHARS_MSG = "*Last name may only contain " + this.MAX_TXT_VALUES_LENGTH + " characters";
    this.VALIDATION_EMAIL_EMPTY_MSG = " *Email is required";
    this.VALIDATION_EMAIL_GREATER_THAN_LIMIT_MSG = " *Email may only contain " + this.MAX_TXT_VALUES_LENGTH + " characters";

    this.VALIDATION_EMAIL_ALREADY_EXISTS_MSG = "*Email Already Exists";
    this.VALIDATION_EMAIL_INCORRECT_FORMAT_MSG = "*Please enter a Valid Email Address";
    this.VALIDATION_DEPARTMENT_MSG = " *No " + strDepartmentLbl + " selected";

    this.isFormInError;
    this.emailInError;

    this.checkForValidationSuccess = function (selectedRow) {
        if (this.isFormInError == false)
            WindowEditorObj.getEventManager().addOrEditWindowSaveBTNClick(selectedRow);
    }

    this.validateWindowEditorForm = function (selectedRow) {
        this.isFormInError = false;
        this.emailInError = false;

        this.validateFirstName();
        this.validateLastName();
        this.validateEmail();
        this.validateDepartmentSelected(selectedRow);
        this.validateEmailAlreadyExists(selectedRow);

    }

    this.validateFirstName = function () {
        var fNameInError = false;

        // TextField is Blank
        if (Ext.getCmp('firstNameTXT').getValue() == "") {
            Ext.getCmp('firstNameErrorLBL').setText(this.VALIDATION_FNAME_EMPTY_MSG);
            this.isFormInError = fNameInError = true;
        }

        // TextField is too long
        if (Ext.getCmp('firstNameTXT').getValue().length > this.MAX_TXT_VALUES_LENGTH && !fNameInError) {
            Ext.getCmp('firstNameErrorLBL').setText(this.VALIDATION_FNAME_GREATER_THAN_LIMIT_CHARS_MSG);
            this.isFormInError = fNameInError = true;

        }
        if (fNameInError)
            Ext.getCmp('firstNameErrorLBL').getEl().show();
        else
            Ext.getCmp('firstNameErrorLBL').getEl().hide();

    }

    this.validateLastName = function () {
        var lNameInError = false;

        // TextField is Blank
        if (Ext.getCmp('lastNameTXT').getValue() == "") {
            Ext.getCmp('lastNameErrorLBL').setText(this.VALIDATION_LNAME_EMPTY_MSG);
            this.isFormInError = lNameInError = true;
        }

        // TextField is too long
        if (Ext.getCmp('lastNameTXT').getValue().length > this.MAX_TXT_VALUES_LENGTH && !lNameInError) {
            Ext.getCmp('lastNameErrorLBL').setText(this.VALIDATION_LNAME_GREATER_THAN_LIMIT_CHARS_MSG);
            this.isFormInError = lNameInError = true;

        }

        if (lNameInError)
            Ext.getCmp('lastNameErrorLBL').getEl().show();
        else
            Ext.getCmp('lastNameErrorLBL').getEl().hide();

    }


    this.validateEmail = function () {
        this.emailInError = false;

        // blank test
        if (Ext.getCmp('emailTXT').getValue() == "") {
            Ext.getCmp('emailErrorLBL').setText(this.VALIDATION_EMAIL_EMPTY_MSG);
            this.isFormInError = this.emailInError = true;
        }

        // Email format text
        if (!this.emailInError) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!(emailRegex.test(Ext.getCmp('emailTXT').getValue()))) {
                Ext.getCmp('emailErrorLBL').setText(this.VALIDATION_EMAIL_INCORRECT_FORMAT_MSG);
                this.isFormInError = this.emailInError = true;
            }
        }

        // Email Length Check
        if (Ext.getCmp('emailTXT').getValue().length > this.MAX_TXT_VALUES_LENGTH && !this.emailInError) {
            Ext.getCmp('emailErrorLBL').setText(this.VALIDATION_EMAIL_GREATER_THAN_LIMIT_MSG);
            this.isFormInError = this.emailInError = true;
        }

        if (this.emailInError)
            Ext.getCmp('emailErrorLBL').getEl().show();
        else
            Ext.getCmp('emailErrorLBL').getEl().hide();


    }

    this.validateEmailAlreadyExists = function (selectedRow) {

        // validates that the email doesn't already exist. This is only done if there are no other errors & it is not equal to it's old value
        if (this.emailInError == false)
            ContactManagerObj.getLoader().validateEmailinUse(selectedRow);
        else
            WindowEditorObj.getValidation().checkForValidationSuccess(selectedRow);
    }

    this.validateDepartmentSelected = function () {
        var currentDeptsGrid = Ext.getCmp('WindowEditorCurrentDepartmentsGrid');
        var allDeptsGrid = Ext.getCmp('WindowEditorAllDepartmentsGrid');

        // IF the grid is empty display the Error message. The second part if this If statement prevent the error message
        // from displaying if your loading for the first time.

        if (allDeptsGrid.store.getCount() > 0) {
            if ((currentDeptsGrid.store.getCount() == 0) && (allDeptsGrid.store.getCount() > 0)) {
                Ext.getCmp('departmentsErrorLBL').setText(this.VALIDATION_DEPARTMENT_MSG);
                Ext.getCmp('departmentsErrorLBL').getEl().show();
                this.isFormInError = true;
            }
            else
                Ext.getCmp('departmentsErrorLBL').getEl().hide();
        }

    }
}