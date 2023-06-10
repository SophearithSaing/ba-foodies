$(() => {
  let data = $('.tab-item.selected').data('type');

  $('.tab-item').click(function () {
    $('.tab-item').removeClass('selected');
    const selectedTabWidth = $(this).outerWidth();
    const distance = $(this).position().left;
    $('.tabs .indicator').css('transform', `translateX(${distance}px)`);
    $(this).addClass('selected');

    data = $(this).data('type');
  });
});
