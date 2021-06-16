//@ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("logaligroup.Employees.controller.MainView", {
			onInit: function () {

            },
            onValidate: function(oEvent){
                var oInput = oEvent.getSource(),
                    sValue = oInput.getValue();

                if(oInput.getMaxLength() === sValue.length ){
                    //oInput.setDescription("OK");
                    this.byId("labelCountry").setVisible(true);
                    this.byId("slCountry").setVisible(true);
                }else{
                    //Input.setDescription("no OK");
                    this.byId("labelCountry").setVisible(false);
                    this.byId("slCountry").setVisible(false);

                }

            }
		});
	});
