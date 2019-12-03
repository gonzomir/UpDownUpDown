jQuery(document).ready(function(){

  //Hide empty elements within vote badges
  jQuery( '.updown-vote-box div:empty' ).hide();

  function votePost( post_id, direction ) {
      var data = {
        action: 'register_vote',
        post_id: post_id,
        direction: direction
      };
      jQuery.post(UpDownUpDown.ajaxurl, data, function(response){ handleVoteCallback(response); });
  }

  function voteComment( comment_id, direction ) {
      var data = {
        action: 'register_vote',
        comment_id: comment_id,
        direction: direction
      };
      jQuery.post(UpDownUpDown.ajaxurl, data, function(response){ handleVoteCallback(response); });
  }

  function handleVoteCallback( response ) {

    var vote_response = jQuery.parseJSON(response);
    console.log(vote_response);
    if ( vote_response.status !== 1 ) {
      // Failure, notify user and return early.
      if ( vote_response.message ) {
        alert( vote_response.message );
      }
      return;
    }

    // Success, update vote count.

    if ( vote_response.post_id ) {
      var element_name = 'post';
      var element_id = vote_response.post_id;
    } else if ( vote_response.comment_id ) {
      var element_name = 'comment';
      var element_id = vote_response.comment_id;
    }

    var vote_up_count = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-up-count' );
    var vote_up_button = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-up-button' );

    var vote_total_count = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-total-count' );

    var vote_down_count = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-down-count' );
    var vote_down_button = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-down-button' );

    var vote_label = jQuery( '#updown-' + element_name + '-' + element_id + ' .updown-label' );;

    dehighlightButton( vote_down_button );
    dehighlightButton( vote_up_button );
    if ( vote_response.direction == 1 ) {
      highlightButton( vote_up_button );
    }
    else if ( vote_response.direction == -1 ){
      highlightButton( vote_down_button );
    }

    if (vote_up_count.length && vote_down_count.length) {
      if ( vote_response.vote_totals.up == 0 ) {
        vote_up_count.removeClass( 'updown-active' );
      }
      else {
        vote_up_count.addClass( 'updown-active' );
      }

      if ( vote_response.vote_totals.down == 0 ) {
        vote_down_count.removeClass( 'updown-active' );
      }
      else {
        vote_down_count.addClass( 'updown-active' );
      }
    }

    if (vote_total_count.length) {
      var sign = vote_total_count.hasClass('updown-count-sign')
      var vote_total_count_text = vote_response.vote_totals.up - vote_response.vote_totals.down;
      vote_total_count.removeClass('updown-pos-count');
      vote_total_count.removeClass('updown-neg-count');
      if (vote_total_count_text > 0) {
        if (sign) {
          vote_total_count_text = '+' + vote_total_count_text;
        }
        vote_total_count.addClass( 'updown-pos-count');
      }
      else if (vote_total_count_text < 0) {
        vote_total_count.addClass( 'updown-neg-count');
        if (!sign) {
          vote_total_count_text = ('' + vote_total_count_text).substr (1);
        }
      }
      vote_total_count_num = parseInt(vote_response.vote_totals.up) + parseInt(vote_response.vote_totals.down);
      if ( vote_total_count[0].hasAttribute( 'title' ) ) {
        vote_total_count.attr( 'title', vote_total_count_num + ' vote' + (vote_total_count_num == 1 ? '' : 's') + ' so far');
      }
    }
    vote_total_count.text(vote_total_count_text);

    if ( vote_response.vote_totals.up > 0 ) {
      vote_response.vote_totals.up = '+' + vote_response.vote_totals.up;
    }
    if ( vote_response.vote_totals.down > 0 ) {
      vote_response.vote_totals.down = '-' + vote_response.vote_totals.down;
    }

    if (vote_up_count.length) {
      vote_up_count.text(vote_response.vote_totals.up);
    }
    if (vote_down_count.length) {
      vote_down_count.text(vote_response.vote_totals.down);
    }
  }

  function highlightButton( buttonObj ) {
    buttonObj.addClass('on');
    image = buttonObj.find('img');
    if ( image.length > 0 ) {
      image.prop( 'src', image.prop( 'src' ).replace( '.png', '-on.png' ) );
    }
  }

  function dehighlightButton( buttonObj ) {
    buttonObj.removeClass('on');
    image = buttonObj.find('img');
    if ( image.length > 0 ) {
      image.prop( 'src', image.prop( 'src' ).replace( '-on.png', '.png' ) );
    }
  }

	jQuery('.updown-button').on( 'click', function( event ) {
		var id = jQuery(this).parent().parent().attr('id').split('-');
    var vote_value = -1;
    var button_obj = jQuery(this);

    //Remove vote if clicking same vote again
		if ( button_obj.hasClass('on') ) {
			vote_value = 0;
    }
		else {
			vote_value = button_obj.data('vote-direction');
    }

		if (id[1] === 'post' && id[2]){
			votePost(id[2], vote_value );
    }
		if (id[1] === 'comment' && id[2]){
			voteComment(id[2], vote_value );
    }
  });

});
