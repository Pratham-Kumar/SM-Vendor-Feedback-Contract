sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/upload/Uploader",
    "sap/m/MessageToast"
],
function (Controller,JSONModel,Uploader,MessageToast) {
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

          onAfterItemAdded: function (oEvent) {
            var item = oEvent.getParameter("item");
            this._createEntity(item)
                .then((id) => {
                    this._uploadContent(item, id);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        onUploadCompleted: function (oEvent) {
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.removeAllIncompleteItems();
            oUploadSet.getBinding("items").refresh();
        },
        onRemovePressed: function (oEvent) {
            debugger
            oEvent.preventDefault();
            var oModel = this.getOwnerComponent().getModel();
           var oRemove = oEvent.getParameter("item").getBindingContext().getPath();
           oModel.remove(oRemove, {
            success: function (res) {
              console.log("Item deleted successfully");
              MessageToast.show("Item Deleted Successfully")
              
            },
            error: function (err) {
              console.error("Error deleting item:", err);
            }
        })
           
        },
        
        onOpenPressed: function (oEvent) {
            oEvent.preventDefault();
            var item = oEvent.getSource();
            this._fileName = item.getFileName();
            var that = this;
            this._download(item)
                .then((blob) => {
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', that._fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        

        _download: function (item) {
            debugger
            var settings = {
                url: item.getUrl(),
                method: "GET",
                headers: {
                    "Content-type": "application/octet-stream"
                },
                xhrFields: {
                    responseType: 'blob'
                }
            };

            return new Promise((resolve, reject) => {
                $.ajax(settings)
                    .done((result) => {
                        resolve(result);
                    })
                    .fail((err) => {
                        reject(err);
                    });
            });
        },

        _createEntity: function (item) {
            var data = {
                mediaType: item.getMediaType(),
                fileName: item.getFileName(),
                size: item.getFileObject().size,
               
            };

            var settings = {
                url: "/v2/odata/v4/catalog/Files",
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify(data)
            };

            return new Promise((resolve, reject) => {
                $.ajax(settings)
                    .done((results, textStatus, request) => {
                        resolve(results.ID);
                    })
                    .fail((err) => {
                        reject(err);
                    });
            });
        },
        _uploadContent: function (item, id) {
            var url =`/v2/odata/v4/catalog/Files(${id})/content`;
            item.setUploadUrl(url);
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.setHttpRequestMethod("PUT");
            oUploadSet.uploadItem(item);
        },
        formatThumbnailUrl: function (mediaType) {
            var iconUrl;
            switch (mediaType) {
                case "image/png":
                    iconUrl = "sap-icon://card";
                    break;
                case "text/plain":
                    iconUrl = "sap-icon://document-text";
                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    iconUrl = "sap-icon://excel-attachment";
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    iconUrl = "sap-icon://doc-attachment";
                    break;
                case "application/pdf":
                    iconUrl = "sap-icon://pdf-attachment";
                    break;
                default:
                    iconUrl = "sap-icon://attachment";
            }
            return iconUrl;
        },
        onExport: function () {
            // Get the selected items from the UploadSet
            var oUploadSet = this.getView().byId("uploadSet");
            var aSelectedItems = oUploadSet.getSelectedItems();
          
            // Check if any items are selected
            if (aSelectedItems.length === 0) {
              MessageToast.show("No items selected for export");
              return;
            }
          
            // Perform the export logic
            aSelectedItems.forEach(function (oSelectedItem) {
              var sUrl = oSelectedItem.getBindingContext().getProperty("url");
              var sFileName = oSelectedItem.getBindingContext().getProperty("fileName");
          
              // Fetch the file content from the server
              fetch(sUrl)
                .then((response) => response.blob())
                .then((blob) => {
                  // Create a download link for the blob
                  var link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = sFileName;
                  link.target = "_blank"; // Open the link in a new tab
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                })
                .catch((error) => {
                  console.error("Error fetching file:", error);
                  MessageToast.show("Error exporting file");
                });
            });
          },
          

          onSubmit:function(){
            function generateUniqueId(prefix) {
               const date = new Date();
               const dateString = date.toISOString().replace(/[-:.TZ]/g, "");
               return `${prefix}${dateString}`;
           }
           let oModel = this.getOwnerComponent().getModel();
           let ID = this.getView().byId("uniqueId").getValue(); // ID field in the form header
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
               let Comment = oItem.getCells()[1].getValue();
       
               if (Comment.trim() !== "") {
                   aTableData.push({
                       parentKey_ID: ID, // Reference to the parent key
                       Section: Section,
                       Comment: Comment
                   });
               }
           });
       
           let headerData = {
               ContractorName: ContractorName,
               ContractorCodeNumber: ContractorCodeNumber,
               ContractOwner: ContractOwner,
               ContractNumber: ContractNumber,
               ContractDescription: ContractDescription,
               FPALCode: FPALCode,
               ContractDuration: ContractDuration,
               DateofReport: DateofReport,
               ContractCloseout: ContractCloseout,
               lineItems: aTableData
           };
       
           // Check if ID is already set
           if (ID) {
               // Update existing entry
               oModel.update("/Headers('" + ID + "')", headerData, {
                   success: function () {
                       sap.m.MessageBox.success("Data updated successfully.");
                   },
                   error: function () {
                       sap.m.MessageBox.error("Error updating data.");
                   }
               });
           } else {
               // Generate a new ID and create a new entry
               ID = generateUniqueId("ID");
               headerData.ID = ID; // Add generated ID to the headerData
               
               oModel.create("/Headers", headerData, {
                   success: function () {
                       sap.m.MessageBox.success("Data saved successfully.");
                       // Set the ID field with the generated ID
                       this.getView().byId("uniqueId").setValue(ID);
                   }.bind(this), // Bind this to maintain the scope
                   error: function () {
                       sap.m.MessageBox.error("Error saving data.");
                   }
               });
           }
       }
    });
});
