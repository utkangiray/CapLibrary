using from './cat-service';


annotate CatalogService.Books with @(
    Common.SemanticKey: [ID],
    UI                : {
        Identification             : [{Value: title}],
        SelectionFields            : [
            ID,
            title,
            author_ID
        ],
        LineItem                   : [
            {
                Value: ID,
                Label: 'Book ID'
            },
            {
                Value: author.name,
                Label: 'Author'
            },
            {
                Value: title,
                Label: 'Title'
            },
            {
                Value: descr,
                Label: 'Description'
            },
            {

                Value: category.name,
                Label: 'Category'
            },
            {
                Value      : avaliable,
                Label      : 'Availability',
                Criticality: criticality
            }
        ],
        FieldGroup #GeneratedGroup1: {
            $Type: 'UI.FieldGroupType',
            Data : [
                {
                    $Type: 'UI.DataField',
                    Label: 'Book ID',
                    Value: ID,
                },
                {
                    $Type: 'UI.DataField',
                    Label: 'Title',
                    Value: title,
                },
                {
                    $Type: 'UI.DataField',
                    Label: 'Description',
                    Value: descr,
                },
                {
                    $Type      : 'UI.DataField',
                    Label      : 'Availability',
                    Value      : avaliable,
                    Criticality: level
                },
            ],
        },
        UI.Facets                  : [{
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup1',
        }, ]
    }

);

annotate CatalogService.Authors with @(
    Common.SemanticKey: [ID],
    UI                : {
        Identification : [{Value: ID}],
        SelectionFields: [
            ID,
            name
        ],
        LineItem       : [
            {
                Value: ID,
                Label: 'Author ID'
            },
            {
                Value: name,
                Label: 'Author Name'
            }
        ]
    }

);

annotate CatalogService.Category with @(
    Common.SemanticKey: [ID],
    UI                : {
        Identification : [{Value: ID}],
        SelectionFields: [
            ID,
            name
        ],
        LineItem       : [
            {
                Value: ID,
                Label: 'Category ID'
            },
            {
                Value: name,
                Label: 'Category Name'
            }
        ]
    }

);

annotate CatalogService.SubCategory with @(
    Common.SemanticKey: [ID],
    UI                : {
        Identification : [{Value: ID}],
        SelectionFields: [
            ID,
            name
        ],
        LineItem       : [
            {
                Value: ID,
                Label: 'Category ID'
            },
            {
                Value: name,
                Label: 'SubCategory Name'
            },
            {
                Value: category.name,
                Label: 'Category Name'
            }
        ]
    }

);

annotate CatalogService.Reporting with @(UI: {
    Identification : [{Value: ID}],
    SelectionFields: [takeDate, ],
    LineItem       : [
        {
            Value: bookName,
            Label: 'Book Name'
        },
        {
            Value: author,
            Label: 'Author Name'
        },
        {
            Value: takeDate,
            Label: 'Take Date'
        },
        {
            Value: bringDate,
            Label: 'Bring Date'
        },
        {
            Value: person,
            Label: 'Person'
        }
    ]
}

);

annotate CatalogService.Books with {

    ID        @Commonlabel                    : {
        Text           : title,
        TextArrangement: #TextLast
    }
              @Common.ValueListWithFixedValues: false
              @Common.ValueList               : {
        $Type          : 'Common.ValueListType',
        Label          : 'Book ',
        CollectionPath : 'Books',
        SearchSupported: true,
        Parameters     : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: ID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'title'
            }
        ]
    };

    author    @Common                         : {
        Text           : author.name,
        TextArrangement: #TextLast
    }
              @Common.ValueListWithFixedValues: false
              @Common.ValueList               : {
        $Type          : 'Common.ValueListType',
        Label          : 'Author',
        CollectionPath : 'Authors',
        SearchSupported: true,
        Parameters     : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: author_ID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    };

    title     @Common.ValueListWithFixedValues: false
              @Common.ValueList               : {
        $Type           : 'Common.ValueListType',
        Label           : 'Title',
        CollectionPath  : 'Books',
        @SearchSupported: true,
        Parameters      : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: title,
            ValueListProperty: 'title'
        }]
    };
    descr     @Common.ValueListWithFixedValues: false
              @Common.ValueList               : {
        $Type           : 'Common.ValueListType',
        Label           : 'Description',
        CollectionPath  : 'Books',
        @SearchSupported: true,
        Parameters      : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: descr,
            ValueListProperty: 'descr'
        }]
    };

    avaliable @Common.ValueListWithFixedValues: true
              @Common.ValueList               : {
        $Type           : 'Common.ValueListType',
        Label           : 'Avaliability',
        CollectionPath  : 'Availability',
        @SearchSupported: true,
        Parameters      : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: avaliable,
            ValueListProperty: 'avaliable'
        }]
    };

};

annotate CatalogService.Authors with {
    ID   @Common.ValueListWithFixedValues: false
         @Common.ValueList               : {
        $Type           : 'Common.ValueListType',
        Label           : 'Author ID',
        CollectionPath  : 'Authors',
        @SearchSupported: true,
        Parameters      : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: ID,
            ValueListProperty: 'ID'
        }]
    };
    name @Common.ValueListWithFixedValues: false
         @Common.ValueList               : {
        $Type           : 'Common.ValueListType',
        Label           : 'Author Name',
        CollectionPath  : 'Authors',
        @SearchSupported: true,
        Parameters      : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: name,
            ValueListProperty: 'name'
        }]
    };
};

annotate CatalogService.AuthorAnalytics with @(UI: {
    SelectionFields: [takeDate],
    Chart          : {
        ChartType          : #Column,
        Dimensions         : [
            author,
            year,
        ],
        DimensionAttributes: [
            {
                Dimension: 'author',
                Role     : #Category
            },
            {
                Dimension: 'year',
                Role     : #Category
            }
        ],
        Measures           : ['count'],
        MeasureAttributes  : [{
            Measure: 'count',
            Role   : #Axis1
        }]
    }
});

annotate CatalogService.BooksAnalytics with @(UI: {
    SelectionFields: [takeDate],
    Chart          : {
        ChartType          : #Column,
        Dimensions         : [
            bookName,
            year,
        ],
        DimensionAttributes: [
            {
                Dimension: 'bookName',
                Role     : #Category
            },
            {
                Dimension: 'year',
                Role     : #Category
            }
        ],
        Measures           : ['count'],
        MeasureAttributes  : [{
            Measure: 'count',
            Role   : #Axis1
        }]
    }
});
