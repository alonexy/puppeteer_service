{
load:function(){
     var lists = [];
	  $('.n-item').each(function(){
	  		let arr = {
	  			artile_title:$(this).find('.name').text(),
	  			describe:$(this).find('.describe').text(),
	  			infos_time:$(this).find('.infos').find('.time').text()
	  		};
	  		lists.push(arr)
	  });
	  return lists;
	}
}