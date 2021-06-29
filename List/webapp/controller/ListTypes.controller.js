// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
	function (Controller,JSONModel) {
		"use strict";

		return Controller.extend("logali.List.controller.ListTypes", {
			onInit: function () {
                var oJSONModel = new JSONModel();
                oJSONModel.loadData("./localService/mockdata/ListData.json");
                this.getView().setModel(oJSONModel);
            },
            getGroupHeader: function(oGroup){
                var groupHeader = new sap.m.GroupHeaderListItem({
                    title: oGroup.key,
                    upperCase: true
                });
                return groupHeader;
            },
            onShowSelectedRow:function(){
                var oList = this.getView().byId("standardList"),
                    selectItems = oList.getSelectedItems();

                var i18nModel =  this.getView().getModel("i18n").getResourceBundle();
                
                if(selectItems.length === 0){
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                }else{
                    var sTextMessage = i18nModel.getText("selection");
                    for( var i in selectItems){
                        var context = selectItems[i].getBindingContext(),
                            oContext = context.getObject();

                         sTextMessage = sTextMessage + "-" + oContext.Material;    
                    }
                    sap.m.MessageToast.show(sTextMessage);
                }
            },
            onDeleteSelectRows: function(){

                var oList = this.getView().byId("standardList"),
                    selectItems = oList.getSelectedItems(),
                    oModel = this.getView().getModel(),
                    products = oModel.getProperty("/Products");

                var i18nModel =  this.getView().getModel("i18n").getResourceBundle();
                
                if(selectItems.length === 0){
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                }else{
                    var sTextMessage = i18nModel.getText("selection");
                    var arrayId = [];

                    for( var i in selectItems){
                        var context = selectItems[i].getBindingContext(),
                            oContext = context.getObject();

                        arrayId.push(oContext.Id); 
                        sTextMessage = sTextMessage + "-" + oContext.Material;      
                    }
                    products = products.filter(function(iProduct){
                        return !arrayId.includes(iProduct.Id);
                    })
                    oModel.setProperty("/Products", products);
                    oList.removeSelections();

                    sap.m.MessageToast.show(sTextMessage);
                }                
            },
            onDeleteRow: function(onDeleteRow){
                var selectRow = onDeleteRow.getParameter("listItem"),
                    context = selectRow.getBindingContext(),
                    splitPath = context.getPath().split(),
                    indexSelectRow = splitPath[splitPath.length - 1];

                var oModel = this.getView().getModel(),
                    products = oModel.getProperty("/Products");
                
                //Delete selected row with the function splice
                products.splice(indexSelectRow,1);
                oModel.refresh();

                sap.m.MessageToast.show(indexSelectRow);

            }
		});
	});
