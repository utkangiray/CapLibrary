using my.bookshop as my from '../db/data-model';

service CatalogService {


    entity Books        as projection on my.Books;
    entity Authors      as projection on my.Authors;
    entity Category     as projection on my.Category;
    entity SubCategory  as projection on my.SubCategory;
    entity Reporting    as projection on my.Reporting;

    @readonly
    entity Availability as projection on my.Availability;


    @Aggregation.ApplySupported.PropertyRestrictions: true
    view BooksAnalytics as
        select from my.Reporting {
            @Analytics.Dimension   : true
            bookName,
            @Analytics.Dimension   : true
            takeDate,
            @Analytics.Dimension   : true
            year,
            @Analytics.Dimension   : true
            @Common.IsCalendarMonth: true
            month,
            @Analytics.Dimension   : true
            @Common.IsCalendarWeek : true
            week,
            @Analytics.Measure     : true
            @Aggregation.default   : #SUM
            count
        }

    @Aggregation.ApplySupported.PropertyRestrictions: true
    view AuthorAnalytics as
        select from my.Reporting {
            @Analytics.Dimension   : true
            author,
            @Analytics.Dimension   : true
            takeDate,
            @Analytics.Dimension   : true
            @Common.IsCalendarYear
            year,
            @Analytics.Dimension   : true
            @Common.IsCalendarMonth: true
            month,
            @Analytics.Dimension   : true
            @Common.IsCalendarWeek : true
            week,
            @Analytics.Measure     : true
            @Aggregation.default   : #SUM
            count
        }
}
