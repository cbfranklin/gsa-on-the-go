function app(){
    $('.star-pin').on('click',function(){
        if($(this).parents('.list-group-item').attr('data-pinned') === 'false'){
            $(this).parents('.list-group-item').attr('data-pinned',true)
        }
        else{
            $(this).parents('.list-group-item').attr('data-pinned',false)
        }
        sortAppList();
    });
}

function sortAppList(){
    var $list = $('#apps-list'),
    $listli = $list.children('a');

    $listli.sort(function(a,b){
        var an = a.getAttribute('data-pinned'),
            bn = b.getAttribute('data-pinned');

            console.log(an,bn)

        if(an > bn) {
            return -1;
        }
        if(an < bn) {
            return 1;
        }
        return 0;
    });

    $listli.detach().appendTo($list);
}