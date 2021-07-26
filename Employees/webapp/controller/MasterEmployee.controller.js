/* eslint-disable no-undef */
//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("logaligroup.Employees.controller.MasterEmployee", {
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },
            onFilter: function () {
                var oJSON = this.getView().getModel("Countries").getData(),
                    oTable = this.getView().byId("tableEmployee");
                var aFilters = [];

                if (oJSON.EmployeeId !== "") {
                    aFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
                }
                if (oJSON.CountryKey !== "") {
                    aFilters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
                }
                oTable.getBinding("items").filter(aFilters);

            },
            onClearFilter: function () {
                var oModel = this.getView().getModel("Countries");

                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
                this.onFilter();

            },
            turnOnOff: function () {

                var oModelConfig = this.getView().getModel("Config"),
                    bVisibleCity = oModelConfig.getProperty("/visibleCity"),
                    bOposite = bVisibleCity ? false : true;

                if (bVisibleCity) { // si la columna está visible
                    oModelConfig.setProperty("/visibleBtnShowCity", true);
                    oModelConfig.setProperty("/visibleBtnHideCity", false);
                } else {
                    oModelConfig.setProperty("/visibleBtnShowCity", false);
                    oModelConfig.setProperty("/visibleBtnHideCity", true);
                }
                oModelConfig.setProperty("/visibleCity", bOposite);
            },
            showPostalCode: function (oEvent) {

                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("Employees");

                var objectContext = oContext.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);
            },
            showOrders: function (oEvent) {
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("odataNorthwind");
                if (!this.oDialogOrders) {
                    this.oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders", this);
                    this.getView().addDependent(this.oDialogOrders);
                }
                //Dialog binding to context
                this.oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
                this.oDialogOrders.open();
            },
            onCloseOrder: function () {
                 this.oDialogOrders.close();
            },           
            onValidate: function (oEvent) {
                var oInput = oEvent.getSource(),
                    sValue = oInput.getValue();

                if (oInput.getMaxLength() === sValue.length) {
                    //oInput.setDescription("OK");
                    this.byId("labelCountry").setVisible(true);
                    this.byId("slCountry").setVisible(true);
                } else {
                    //Input.setDescription("no OK");
                    this.byId("labelCountry").setVisible(false);
                    this.byId("slCountry").setVisible(false);

                }

            },
            showEmployee: function (oEvent){
                var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();

                this._bus.publish("flexible", "showEmployee", path);

            }
        });
    });
