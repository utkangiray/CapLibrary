sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/type/Int",
    "sap/ui/model/type/Integer",
  ],
  function (
    Controller,
    Fragment,
    syncStyleClass,
    MessageToast,
    JSONModel,
    Int,
    Integer
  ) {
    "use strict";

    return Controller.extend("ntt.bookshop.custombookshop.controller.ListAll", {
      /**
       * @override
       */
      onInit: function () {
        this.oDataModel = this.getOwnerComponent().getModel();
        let oTableBook = this.getView("ListAll")
          .byId("idTblBookData")
          .getTable();
        oTableBook.setMode("MultiSelect");
        oTableBook.attachSelectionChange(this.onBookTableSelection, this);

        this._fetchData();
        this._initialModel();
      },
      _initialModel: function () {
        var oView = this.getView();
        var oCreateTableModel = {
          ID: null,
          title: "",
          descr: "",
          author: {
            ID: null,
            name: "",
          },
          author_ID: 0,
          category_ID: 0,
        };

        var oModel = new JSONModel();
        oView.setModel(oModel, "mainModel");
        oView
          .getModel("mainModel")
          .setProperty("/createBookData", oCreateTableModel);

        var oBooleanControl = {
          authorName: true,
        };

        oView
          .getModel("mainModel")
          .setProperty("/booleanControl", oBooleanControl);

        var oLendTableModel = {
          book_ID: null,
          bringDate: new Date(),
          person: "",
        };

        oView
          .getModel("mainModel")
          .setProperty("/LendBookData", oLendTableModel);
      },

      _fetchData: function () {
        var oView = this.getView();
        oView.byId("idTblBookData").rebindTable();
        oView.byId("idTblAuthorData").rebindTable();


        this.oDataModel.read("/Authors", {
          success: (oData, oResponse) => {
            var data = oData.results;
            if (data && data.length > 0) {
              oView.getModel("mainModel").setProperty("/Authors", data);
            } else {
              oView.getModel("mainModel").setProperty("/Authors", []);
            }
          },
          error: (oError) => {
            try {
              var errMessage = JSON.parse(oError.responseText);
              errMessage = errMessage.error.message.value;
            } catch (e) {
              errMessage = oError.message;
            }
            sap.m.MessageBox.alert(errMessage, {
              icon: sap.m.MessageBox.Icon.ERROR,
              title: "Error!",
            });
          },
        });
      },
      onOpenMultiEdit: function (oEvent) {
        Fragment.load({
          name: "ntt.bookshop.custombookshop.view.fragments.MultiEditBookDialog",
          controller: this,
        }).then(
          function (oFragment) {
            this.oBooksMultiEditDialog = oFragment;
            this.getView().addDependent(this.oBooksMultiEditDialog);

            this.oBooksMultiEditDialog.setEscapeHandler(
              function () {
                this.onCloseDialog();
              }.bind(this)
            );

            this.oBooksMultiEditDialog
              .getContent()[0]
              .setContexts(
                this.getView()
                  .byId("idTblBookData")
                  .getTable()
                  .getSelectedContexts()
              );
            syncStyleClass(
              "sapUiSizeCompact",
              this.getView(),
              this.oBooksMultiEditDialog
            );
            this.oBooksMultiEditDialog.open();
          }.bind(this)
        );
      },
      onBookCloseDialog: function () {
        this.oBooksMultiEditDialog.close();
        this.oBooksMultiEditDialog.destroy();
        this.oBooksMultiEditDialog = null;
      },
      onBookTableSelection: function () {
        var aSelectedItems = this.getView()
          .byId("idTblBookData")
          .getTable()
          .getSelectedItems();
        this.getView()
          .byId("btnMultiEditBook")
          .setEnabled(aSelectedItems.length > 0);
        this.getView()
          .byId("btnDeleteBook")
          .setEnabled(aSelectedItems.length > 0);
      },
      onBookDialogSaveButton: function () {
        var oMultiEditContainer = this.oBooksMultiEditDialog.getContent()[0];

        this.oBooksMultiEditDialog.setBusy(true);
        oMultiEditContainer
          .getErroneousFieldsAndTokens()
          .then(
            function (aErrorFields) {
              this.oBooksMultiEditDialog.setBusy(false);
              if (aErrorFields.length === 0) {
                this._saveChanges();
              }
            }.bind(this)
          )
          .catch(
            function () {
              this.oBooksMultiEditDialog.setBusy(false);
            }.bind(this)
          );
      },
      _saveChanges: function () {
        var oMultiEditContainer = this.oBooksMultiEditDialog.getContent()[0],
          that = this,
          aUpdatedContexts,
          oContext,
          oUpdatedData,
          oObjectToUpdate,
          oUpdatedDataCopy;

        var fnHandler = function (oField) {
          var sPropName = oField.getPropertyName(),
            sUomPropertyName = oField.getUnitOfMeasurePropertyName();
          if (
            !oField.getApplyToEmptyOnly() ||
            !oObjectToUpdate[sPropName] ||
            (typeof oObjectToUpdate[sPropName] == "string" &&
              !oObjectToUpdate[sPropName].trim())
          ) {
            oUpdatedDataCopy[sPropName] = oUpdatedData[sPropName];
          }
          if (oField.isComposite()) {
            if (
              !oField.getApplyToEmptyOnly() ||
              !oObjectToUpdate[sUomPropertyName]
            ) {
              oUpdatedDataCopy[sUomPropertyName] =
                oUpdatedData[sUomPropertyName];
            }
          }
        };

        MessageToast.show("Saving..");
        oMultiEditContainer.getAllUpdatedContexts(true).then(
          function (result) {
            MessageToast.show("Updated contexts available", {
              onClose: function () {
                aUpdatedContexts = result;
                for (var i = 0; i < aUpdatedContexts.length; i++) {
                  oContext = aUpdatedContexts[i].context;
                  oUpdatedData = aUpdatedContexts[i].data;
                  oObjectToUpdate = oContext
                    .getModel()
                    .getObject(oContext.getPath());
                  oUpdatedDataCopy = {};
                  this._getFields()
                    .filter(function (oField) {
                      return !oField.isKeepExistingSelected();
                    })
                    .forEach(fnHandler);
                  oContext
                    .getModel()
                    .update(oContext.getPath(), oUpdatedDataCopy);
                }
                MessageToast.show("Books was updated");

                that.onBookCloseDialog();
              }.bind(this),
            });
          }.bind(oMultiEditContainer)
        );
        this.oBooksMultiEditDialog.close();
      },
      onScanSuccess: function (oEvent) {
        var sID = oEvent.getParameter("text");
        var smartFilterBar = this.getView().byId("smartFilterBar");
        smartFilterBar.clear();

        var oFilterData = smartFilterBar.getFilterData();
        oFilterData.ID = {
          items: [{ key: sID }],
          ranges: [],
          value: null,
        };
        smartFilterBar.setFilterData(oFilterData, true);
        this.getView().byId("idTblBookData").rebindTable();
      },

      onBeforeRebindBooksTable: function (oSource) { },

      onScanError: function (oEvent) {
        MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
      },

      onDeleteBook: function (oEvent) {
        var aSelectedItems = this.getView()
          .byId("idTblBookData")
          .getTable()
          .getSelectedItems();
        this.oDataModel.setDeferredGroups(["group1"]);
        for (var i = 0; i < aSelectedItems.length; i++) {
          var sPath = aSelectedItems[i].getBindingContext().getPath();
          this.oDataModel.remove(sPath, {
            groupId: "group1",
            success: function (oData, oResponse) {
              MessageToast.show("Books was deleted");
            },
            error: function (oError) {
              try {
                var errMessage = JSON.parse(oError.responseText);
                errMessage = errMessage.error.message.value;
              } catch (e) {
                errMessage = oError.message;
              }
              sap.m.MessageBox.alert(errMessage, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: "Error!",
              });
            },
          });
        }
        this.oDataModel.submitChanges({
          groupId: "group1",
        });
      },

      onPressCreateBook: function (oEvent) {
        // create dialog lazily
        this.pDialog ??= this.loadFragment({
          name: "ntt.bookshop.custombookshop.view.fragments.CreateBookDialog",
        });

        this.pDialog.then((oDialog) => {
          this.bookDialog = oDialog;
          oDialog.open();
        });
      },

      onScanSuccessCreate: function (oEvent) {
        var sID = oEvent.getParameter("text");
        this.getView()
          .getModel("mainModel")
          .setProperty("/createBookData/ID", sID);
      },

      _onCloseBookDialog: function (oEvent) {
        this.bookDialog.close();
      },

      _onCreateBook: function (oEvent) {
        var that = this;
        var oCreateTableModel = this.getView().getModel("mainModel");
        var oCreateBookEntry = oCreateTableModel.getProperty("/createBookData");
        var checkAuthorNotExist = this.getView()
          .getModel("mainModel")
          .getProperty("/booleanControl/authorName");

        //if author exist no need to create, delete author deep entity
        if (!checkAuthorNotExist) {
          delete oCreateBookEntry.author;
        }
        sap.ui.core.BusyIndicator.show(0);
        this.oDataModel.create("/Books", oCreateBookEntry, {
          success: (oData, oResponse) => {
            sap.ui.core.BusyIndicator.hide(0);
            MessageToast.show("Book Created");
            //set initial data
            that._initialModel();
            //fetch jsonmodel data
            that._fetchData();
            that.bookDialog.close();
          },
          error: (oError) => {
            that.bookDialog.close();
            try {
              var errMessage = JSON.parse(oError.responseText);
              errMessage = errMessage.error.message.value;
            } catch (e) {
              errMessage = oError.message;
            }
            sap.m.MessageBox.alert(errMessage, {
              icon: sap.m.MessageBox.Icon.ERROR,
              title: "Error!",
            });
            sap.ui.core.BusyIndicator.hide(0);
          },
        });
      },

      onAuthorIdInputLiveChange: function (oEvent) {
        var oAuthorData = this.getView()
          .getModel("mainModel")
          .getProperty("/Authors");
        var authorID = parseInt(oEvent.getParameter("value"));

        //check if author already exist
        var checkAuthor = oAuthorData.filter((obj) => {
          return obj.ID === authorID;
        });

        //if author exist set  authour values
        if (checkAuthor.length > 0) {
          delete checkAuthor[0].__metadata;
          this.getView()
            .getModel("mainModel")
            .setProperty("/createBookData/author", checkAuthor[0]);
          this.getView()
            .getModel("mainModel")
            .setProperty("/boolanControl/authorName", false);
          this.getView().getModel("mainModel").refresh();
        } else {
          this.getView()
            .getModel("mainModel")
            .setProperty("/booleanControl/authorName", true);
          //if author doesnt exist set new author id to  the model
          this.getView()
            .getModel("mainModel")
            .setProperty("/createBookData/author/ID", authorID);
        }
      },

      onPressLendBook: function (oEvent) {
        this.pDialog2 ??= this.loadFragment({
          name: "ntt.bookshop.custombookshop.view.fragments.LendBookDialog",
        });

        this.pDialog2.then((oDialog) => {
          this.LendDialog = oDialog;
          oDialog.open();
        });
      },

      _onLendBook: function (oEvent) {
        var that = this;
        var oLenBookModel = this.getView().getModel("mainModel");
        var oLenBookEntry = oLenBookModel.getProperty("/LendBookData");
        var oBook = this.oDataModel.getContext("/Books(" + oLenBookEntry.book_ID + ")").getObject()
        //check if book is avaliable
        if (oBook === undefined || oBook.avaliable === 'N') {
          MessageToast.show('Book is not available on system')
          return;
        }

        var sAutorPath = "/" + oBook.author.__ref
        var oAuthor = this.oDataModel.getContext(sAutorPath).getObject();
        let today = new Date();
        let sFullYear = today.getFullYear().toString();
        let sMonth =
          (today.getMonth() + 1).toString().length > 1
            ? (today.getMonth() + 1).toString()
            : "0" + (today.getMonth() + 1).toString()

        //Calculate Week Number 
        let yearStart = +new Date(today.getFullYear(), 0, 1);
        let todayy = +new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let dayOfYear = (todayy - yearStart + 1) / 86400000;
        let sWeek = Math.ceil(dayOfYear / 7);

        //Fill Lended Book Values
        oLenBookEntry.author = oAuthor.name
        oLenBookEntry.bookName = oBook.title
        oLenBookEntry.takeDate = today;

        //Fill Values For Analytical Report
        oLenBookEntry.week = sFullYear + "/" + sWeek
        oLenBookEntry.year = sFullYear
        oLenBookEntry.month = sFullYear + "/" + sMonth
        sap.ui.core.BusyIndicator.show(0);
        this.oDataModel.create("/Reporting", oLenBookEntry, {
          success: (oData, oResponse) => {
            that.LendDialog.close();
            sap.ui.core.BusyIndicator.hide(0);
            //set Initial data
            that._initialModel();
            //rebind Table Book Data
            that.getView().byId("idTblBookData").rebindTable();
            //rebind Charts
            sap.ui.getCore().getEventBus().publish("ListAll", "bindCharts");
         

          },
          error: (oError) => {
            that.LendDialog.close();
            try {
              var errMessage = JSON.parse(oError.responseText);
              errMessage = errMessage.error.message.value;
            } catch (e) {
              errMessage = oError.message;
            }
            sap.m.MessageBox.alert(errMessage, {
              icon: sap.m.MessageBox.Icon.ERROR,
              title: "Error!",
            });
            sap.ui.core.BusyIndicator.hide(0);
          },
        });
      },

      _onCloseLendDialog: function (oEvent) {
        this.LendDialog.close();
      },

      onScanSuccessLend: function (oEvent) {
        var sID = oEvent.getParameter("text");
        this.getView()
          .getModel("mainModel")
          .setProperty("/LendBookData/book_ID", sID);
      },
    });
  }
);
