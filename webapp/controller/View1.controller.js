sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/upload/Uploader"
],
function (Controller,JSONModel,Uploader) {
    "use strict";

    return Controller.extend("com.kpo.smvendorfeedbackcontractfiori.controller.View1", {
        onInit: function () {
            let sectionData=[
                {
               "section":"Question1"
            },
            {
                "section":"Question2"
             },
             {
                "section":"Question3"
             },
             {
                "section":"Question4"
             },
             {
                "section":"Question5"
             },
             {
                "section":"Question6"
             },
             {
                "section":"Question7"
             },
             {
                "section":"Question8"
             },
             {
                "section":"Question9"
             },
             {
                "section":"Question10"
             },
             {
                "section":"Question11"
             },
        ]

        let jModel=new JSONModel(sectionData);
        this.getView().setModel(jModel,"jModel");

        },
        i18nFormatter: function (sKey) {
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            return oBundle.getText(sKey);
          },
          

          onSubmit:function(){
            function generateUniqueId(prefix) {
               const date = new Date();
               const dateString = date.toISOString().replace(/[-:.TZ]/g, "");
               return `${prefix}${dateString}`;
           }

            let oModel = this.getOwnerComponent().getModel();
            let ID = generateUniqueId("ID");
            let ContractorName = this.getView().byId("_IDGenInput1").getValue();
            let ContractorCodeNumber = this.getView().byId("_IDGenInput2").getValue();
            let ContractOwner = this.getView().byId("_IDGenInput3").getValue();
            let ContractNumber = this.getView().byId("_IDGenInput4").getValue();
            let ContractDescription = this.getView().byId("_IDGenInput5").getValue();
            let FPALCode = this.getView().byId("_IDGenInput6").getValue();
            let ContractDuration = this.getView().byId("_IDGenInput7").getDateValue();
            let DateofReport = this.getView().byId("_IDGenInput8").getDateValue();
            let ContractCloseout = this.getView().byId("_IDGenInput9").getDateValue();

            let aTableData = [];
            let oTable = this.getView().byId("t1");
            let aItems = oTable.getItems();

            aItems.forEach(function (oItem) {
                let Section = oItem.getCells()[0].getText();
                let Comment = oItem.getCells()[1].getValue()
                

                if (Comment.trim() !== "") {
                    aTableData.push({
                        parentKey_ID: ID, // Reference to the parent key
                        Section: Section,
                        Comment: Comment
                    });
                }
            });

            let headerData={
                ContractorName:ContractorName,
                ContractorCodeNumber:ContractorCodeNumber,
                ContractOwner:ContractOwner,
                ContractNumber:ContractNumber,
                ContractDescription:ContractDescription,
                FPALCode:FPALCode,
                ContractDuration:ContractDuration,
                DateofReport:DateofReport,
                ContractCloseout:ContractCloseout,
                lineItems:aTableData
            }
            oModel.create("/Headers", headerData, {
                success: function (data) {

                    sap.m.MessageBox.success("Data saved " );

                },
                error: function () {
                    sap.m.MessageBox.error("Error saving data");
                }

            });
          }
    });
});
