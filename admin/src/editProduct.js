
function grabSelected() {
	$('input:selected').each(function(index,data) {
	   var value = $(this).val();
	   console.log(value)
	});
}
