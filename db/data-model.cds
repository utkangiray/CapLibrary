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
      placeOfBirth : String      @title: 'Place Of Birth'  @UI.HiddenFilter: true;
      books        : Association to many Books
                       on books.author = $self;
}

entity Category {
  key ID          : Integer @title: 'Category ID';
      name        : String  @title: 'Category Name';
      books       : Association to many Books
                      on books.category = $self;
      subcategory : Composition of many SubCategory
                      on subcategory.category = $self;
}

entity SubCategory {
  key ID       : Integer;
      name     : String;
      category : Association to one Category;
}

entity Reporting : cuid {
  takeDate  : Date    @title: 'Take Date';
  bringDate : Date    @title: 'Bring Date';
  person    : String  @title: 'Person';
  year      : String  @title: 'Year';
  month     : String  @title: 'Year/Month';
  week      : String  @title: 'Year/Week';
  book_ID   : Integer @title: 'Book ID';
  count     : Integer default 1;
  bookName  : String  @title: 'Book Title';
  author    : String  @title: 'Author Name';
}

entity Availability {
  key ID        : Integer;
      avaliable : String;
}
