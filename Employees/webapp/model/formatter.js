/* eslint-disable no-undef */
sap.ui.define([], function () {

    function dateFormat(date){

        var timeDate = 24 * 60* 60 * 1000;

        if(date){   

            var currentDate = new Date(),
                dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd"}),
                dateCurrentFormat = new Date(dateFormat.format(currentDate));

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
            switch(true){

                case date.getTime() === dateCurrentFormat.getTime():
                    return oResourceBundle.getText("today");

                case date.getTime() === dateCurrentFormat.getTime() + timeDate:
                    return oResourceBundle.getText("tomorrow");

                case date.getTime() === dateCurrentFormat.getTime() - timeDate:
                    return oResourceBundle.getText("yesterday");

                 default:
                     return "";   
            }
        }

    }
    return{
      dateFormat: dateFormat
    }
});