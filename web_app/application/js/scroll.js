// $(document).ready(function(){
//   $("a[href='#top']").click(function() {
//     $("html, body").animate({ scrollTop: 0 }, "slow");
//     return false;
//   });
// })

// $(document).ready(function(){
// 	$("a[href='#top']").on('click', function(e){
// 	    var $link = $(e.target);
// 	    e.preventDefault();
// 	    if(!$link.data('lockedAt') || +new Date() - $link.data('lockedAt') > 300) {
// 	    	console.log("da")
// 	        $("html, body").animate({ scrollTop: 0 }, "slow");
//     		return false;
// 	    }
// 	    $link.data('lockedAt', +new Date());
// 	});
// })

// $(document).ready(function () {
//      $("a[href='#top']").on('click', function (event) {  
//            event.preventDefault();
//            var el = $(this);
//            el.prop('disabled', true);           
//            setTimeout(function(){el.prop('disabled', false); }, 3000);
//            console.log("da")
//      });
// });

$("a[href='#top']").click(function() {
	$('#up-button-div').fadeOut()
	$("html, body").animate({ scrollTop: 0 }, 800, 'swing', function(){ 
   		$('#up-button-div').fadeIn()
	});
	return false;
});