/* eslint-disable no-undef */
//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.Employees.controller.Main", {
            
            onInit: function () {

                var oJSONEmployees = new sap.ui.model.json.JSONModel(),
                    oJSONCountries = new sap.ui.model.json.JSONModel(),
                    oJSONLayouts = new sap.ui.model.json.JSONModel();
                var oView = this.getView();

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

                
                var oJSONConfig = new sap.ui.model.json.JSONModel({
                    visibleId: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONConfig, "Config");

                oJSONEmployees.loadData("./mockdata/Employees.json", false);
                oView.setModel(oJSONEmployees, "Employees");

                oJSONCountries.loadData("./mockdata/Countries.json", false);
                oView.setModel(oJSONCountries, "Countries"); 

                oJSONLayouts.loadData("./mockdata/Layouts.json", false);
                oView.setModel(oJSONLayouts, "Layouts"); 

            },
            showEmployeeDetails: function(category, nameEvent, path){

                var detailView = this.getView().byId("detailEmployeeView");

                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("Layouts").setProperty("/ActiveKey","TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);

                detailView.setModel(incidenceModel,"incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

            }
        });
    });
