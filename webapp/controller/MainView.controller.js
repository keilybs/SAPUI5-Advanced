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

        return Controller.extend("logaligroup.Employees.controller.MainView", {
            onInit: function () {
                var oJSONEmployees = new sap.ui.model.json.JSONModel(),
                    oJSONCountries = new sap.ui.model.json.JSONModel();
                var oView = this.getView();

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
            turnOnOff: function (oEvent) {

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
            _addOrdersOption1: function (oEvent,ordersTable) {
                var itemPressed = oEvent.getSource(),
                    oContext = itemPressed.getBindingContext("Employees");

                var objectContext = oContext.getObject(),
                    orders = objectContext.Orders,
                    ordersItems = [];

                ordersTable.destroyItems();
                for (var i in orders) {
                    ordersItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: orders[i].OrderID }),
                            new sap.m.Label({ text: orders[i].Freight }),
                            new sap.m.Label({ text: orders[i].ShipAddress })
                        ]
                    }));
                }
                var newTable = new sap.m.Table({
                    width: "auto",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                    ],
                    items: ordersItems
                }).addStyleClass("sapUiSmallMagin");

                ordersTable.addItem(newTable);
            },

            _addOrdersOption2: function (oEvent, ordersTable) {
                var itemPressed = oEvent.getSource(),
                    oContext = itemPressed.getBindingContext("Employees");

                var objectContext = oContext.getObject(),
                    orders = objectContext.Orders,
                    ordersItems = [];

                var newTableJSON = new sap.m.Table();
                newTableJSON.setWidth("auto");
                newTableJSON.addStyleClass("sapUiSmallMagin");

                var columnOrderID = new sap.m.Column();
                var labelOrderID = new sap.m.Label();
                labelOrderID.bindProperty("text", "i18n>orderID");
                columnOrderID.setHeader(labelOrderID);
                newTableJSON.addColumn(columnOrderID);

                var columnFreight = new sap.m.Column();
                var labelFreight = new sap.m.Label();
                labelFreight.bindProperty("text", "i18n>freight");
                columnFreight.setHeader(labelFreight);
                newTableJSON.addColumn(columnFreight);

                var columnShipAddress = new sap.m.Column();
                var labelShipAddress = new sap.m.Label();
                labelShipAddress.bindProperty("text", "i18n>shipAddress");
                columnShipAddress.setHeader(labelShipAddress);
                newTableJSON.addColumn(columnShipAddress);

                var columnList = new sap.m.ColumnListItem();

                var cellOrderID = new sap.m.Label();
                cellOrderID.bindProperty("text", "Employees>OrderID");
                columnList.addCell(cellOrderID);

                var cellFreight = new sap.m.Label();
                cellFreight.bindProperty("text", "Employees>Freight");
                columnList.addCell(cellFreight);

                var cellShipAddress = new sap.m.Label();
                cellShipAddress.bindProperty("text", "Employees>ShipAddress");
                columnList.addCell(cellShipAddress);                
                
                var oBindingInfo = {
                    model: "Employees",
                    path: "Orders",
                    template: columnList
                }

                newTableJSON.bindAggregation("items", oBindingInfo );
                newTableJSON.bindElement("Employees>" + oContext.getPath());

                ordersTable.addItem(newTableJSON);
            },            


            showOrders: function (oEvent) {

                var ordersTable = this.getView().byId("ordersTable");
                ordersTable.destroyItems();

                this._addOrdersOption1(oEvent,ordersTable);
                this._addOrdersOption2(oEvent,ordersTable);

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

            }
        });
    });
