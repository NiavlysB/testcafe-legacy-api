'@fixture Test fixture';
'@page http://my.page.url';


'@test'['My first test'] = {
    '@testCases': [
        {'@name': 'case1', field: 'test'},
        {},
        {'@name': 'case2', field: 'test'}
    ],

    '1.Do smthg cool': function () {
        var foo = 'bar',
            baz = 0;

        for (var i = 0; i < 50; i++)
            baz++;

        act.click(foo);
    },

    '2.Stop here': function () {
        act.wait(500);
    }
};
