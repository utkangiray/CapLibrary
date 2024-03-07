const cds = require("@sap/cds");

// The service implementation with all service handlers
module.exports = cds.service.impl(async function () {
  var that = this;
  const { Books, Authors, Reporting, Category, InsertReport } = this.entities;

  this.after("READ", Books, (data) => {
    // Convert to array, if it's only a single risk, so that the code won't break here
    const books = Array.isArray(data) ? data : [data];

    books.forEach((book) => {
      // set criticality for books
      switch (book.avaliable) {
        case "Y":
          book.criticality = 3;
          break;
        case "N":
          book.criticality = 1;
          break;
        default:
          break;
      }
    });
  });


  this.before("CREATE", Books, (req) => {
    //change avaliability newly created book
    req.data.avaliable = "Y";
  });

  this.after("CREATE", Reporting, async (req) => {
    const db = await cds.connect.to("db");
    //change avaliability lended created book
    let avaliabilityUpdate = await UPDATE(Books).set({
      avaliable: 'N'
    }).where({ ID: req.book_ID })

  })
});
