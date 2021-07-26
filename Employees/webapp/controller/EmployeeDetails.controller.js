/* eslint-disable no-undef */
//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter) {

        return Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {

            Formatter: formatter,
            onInit: function () {

            },
            onCreateIncidence: function () {

                var tableIncidence = this.getView().byId("tableIncidence"),
                    newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this),
                    incidenceModel = this.getView().getModel("incidenceModel"),
                    oData = incidenceModel.getData();

                var index = oData.length;
                oData.push({ index: index + 1 });

                incidenceModel.refresh();

                newIncidence.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newIncidence);

            },
            onDeleteIncidence: function (oEvent) {

                var tableIncidence = this.getView().byId("tableIncidence"),
                    rowIncidence = oEvent.getSource().getParent().getParent(),
                    incidenceModel = this.getView().getModel("incidenceModel"),
                    oData = incidenceModel.getData();

                var contextObject = rowIncidence.getBindingContext("incidenceModel").getObject();

                oData.splice(contextObject.index - 1, 1);

                for (var i in oData) {
                    oData[i].index = parseInt(i) + 1;
                }
                incidenceModel.refresh();
                tableIncidence.removeContent(rowIncidence);

                for (var j in tableIncidence.getContent()) {
                    tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
                }

            }
            /*
            var Main = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});
            Main.prototype.onInit = onInit;
            Main.prototype.onCreateIncidence = onCreateIncidence;
            Main.prototype.Formatter = formatter;
            Main.prototype.onDeleteIncidence = onDeleteIncidence;
            return Main;*/

        });
    });
