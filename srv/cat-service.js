const cds = require("@sap/cds");

// The service implementation with all service handlers
module.exports = cds.service.impl(async function () {
  var that = this;
  const { Books, Authors, Reporting, Category, SubCategory } = this.entities;

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

  this.before("CREATE", Books, async (req) => {
    //change avaliability newly created book
    req.data.avaliable = "Y";
  });
  this.before("CREATE", Reporting, async (req) => {
    var reportData = req.data;

    //TODO join Books with Authors entity
    // const book = await SELECT.from(Books)
    //   .join(Authors)
    //   .on((Books.author_ID = Authors.ID))
    //   .columns(["title", "avaliable", "Authors.name"])
    //   .where({ ID: data.data.book_ID });

    //Find book properties
    const book = await SELECT.from(Books)
      .columns("title", "avaliable", "author_ID")
      .where({ ID: reportData.book_ID });
    if (book.length <= 0 || book[0].avaliable === "N") {
      req.error(400, "Book Not Found In Library");
      return;
    } else {
      //Change Avaliability Of Book
      await UPDATE(Books, reportData.book_ID).with({ avaliable: { "=": "N" } });
    }

    //Find author properties
    const author = await SELECT.from(Authors)
      .columns("name")
      .where({ ID: book["0"].author_ID });

    //Fill Reporting Data
    req.data.bookName = book[0].title;
    req.data.author = author[0].name;
    const today = new Date();
    req.data.takeDate = today;
    req.data.week = today.getFullYear().toString() + "/" + (await GetWeek());
    req.data.year = today.getFullYear();
    var sMonth =
      (today.getMonth() + 1).toString().length > 1
        ? (today.getMonth() + 1).toString()
        : "0" + (today.getMonth() + 1).toString();
    req.data.month = today.getFullYear().toString() + "/" + sMonth;
  });

  async function GetWeek() {
    const d = new Date();
    let yearStart = +new Date(d.getFullYear(), 0, 1);
    let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let dayOfYear = (today - yearStart + 1) / 86400000;
    let week = Math.ceil(dayOfYear / 7);
    return week.toString();
  }
});
