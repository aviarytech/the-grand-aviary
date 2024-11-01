$(document).ready(function() {
	$('#btnToggle').on('click', function(e) {
		let status;
		if($(this).text() == 'Unlock') {
			$(this).text('Lock');
			$(this).removeClass().addClass('btn btn-block btn-light');
			status = 'unlocked';
		} else {
			$(this).text('Unlock');
			$(this).removeClass().addClass('btn btn-block btn-dark');
			status = 'locked';
		}

		$.ajax({
			url: '/unlocker?status=' + status,
			method: 'GET',
			success: function(result) {
				console.log(result);
			}
		});
		e.preventDefault();
	});
});
