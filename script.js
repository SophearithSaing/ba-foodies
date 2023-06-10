$(() => {
  let data = $('.tab-item.selected').data('type');

  $('.tab-item').on('click', function () {
    $('.tab-item').removeClass('selected');
    const selectedTabWidth = $(this).outerWidth();
    const distance = $(this).position().left;
    $('.tabs .indicator').css('transform', `translateX(${distance}px)`);
    $(this).addClass('selected');

    data = $(this).data('type');
  });

  $('.equal .calc').on('click', function () {
    const price = $('.equal #price').val();
    const people = $('.equal #people').val();
    const amount = price / people;
    const html = `<p>Each person has to pay ${amount} baht</p>`;
    $('.output').append(html);
    $('.output').slideDown();
  });
});
