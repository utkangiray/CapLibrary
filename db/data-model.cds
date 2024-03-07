namespace my.bookshop;

using {
  managed,
  cuid
} from '@sap/cds/common';

entity Books : managed {
  key ID          : Integer                     @title: 'Book ID';
      title       : String(111)                 @title: 'Title';
      descr       : String(1111)                @title: 'Description'  @UI.HiddenFilter: true;
      author      : Composition of Authors      @title: 'Author';
      category    : Association to one Category @title: 'Category';
      avaliable   : String(1)                   @title: 'Availability';
      criticality : Integer;
}
entity Authors : managed {
  key ID           : Integer     @title: 'Author ID';
      name         : String(111) @title: 'Author Name';
      placeOfBirth : String(50)  @title: 'Place Of Birth'  @UI.HiddenFilter: true;
      books        : Association to many Books
                       on books.author = $self;
}
entity Category {
  key ID          : Integer    @title: 'Category ID';
      name        : String(50) @title: 'Category Name';
      books       : Association to many Books
                      on books.category = $self;
      subcategory : Composition of many SubCategory
                      on subcategory.category = $self;
}
entity SubCategory {
  key ID       : Integer    @title: 'Sub Cat. ID';
      name     : String(50) @title: 'Sub Cat. Name';
      category : Association to one Category;
}
entity Reporting : cuid {
  takeDate  : Date;
  bringDate : Date        @title: 'Bring Date';
  person    : String(50)  @title: 'Person';
  year      : String(4)   @title: 'Year';
  month     : String      @title: 'Year/Month';
  week      : String      @title: 'Year/Week';
  book_ID   : Integer     @title: 'Book ID';
  count     : Integer default 1;
  bookName  : String(50)  @title: 'Book Title';
  author    : String(111) @title: 'Author Name';
}
entity Availability {
  key ID        : Integer;
      avaliable : String(1);
}
