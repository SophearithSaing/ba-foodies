$(() => {
  const output = $('.output');
  const outputContent = $('.output .content');
  let data = $('.tab-item.selected').data('type');
  $(`.${data}`).fadeIn({ duration: 200 });

  $('.tab-item').on('click', function () {
    $('.tab-item').removeClass('selected');
    const selectedTabWidth = $(this).outerWidth();
    const distance = $(this).position().left;
    $('.tabs .indicator').css('transform', `translateX(${distance}px)`);
    $(this).addClass('selected');

    $(`.form`).fadeOut({ duration: 200 });
    data = $(this).data('type');
    setTimeout(() => {
      $(`.${data}`).fadeIn({ duration: 200 });
    }, 200);
  });

  $('.equal .calc').on('click', function () {
    resetOutput();

    const price = Number($('.equal #price').val());
    const people = Number($('.equal #people').val());
    const amount = price / people;
    const html = `<p>Each person has to pay ${amount.toString()} baht</p>`;
    outputContent.append(html);
    output.slideDown();
  });

  $('.individual .add').on('click', function () {
    const rowCount = $('.individual .row.person').length;
    const personRowHtml = `
      <div class="row person">
        <input id="person-${
          rowCount + 1
        }-name" type="text" placeholder="Person ${rowCount + 1}" />
        <input id="person-${
          rowCount + 1
        }-amount" type="number" placeholder="Amount" />
      </div>
    `;
    $(personRowHtml).insertAfter($('.individual .row.person')[rowCount - 1]);
  });

  $('.individual .calc').on('click', function () {
    resetOutput();

    const vat = Number($('#individual-vat').val());
    const service = Number($('#individual-service').val());
    let total = 0;

    $('.individual .row.person').each(function (index) {
      const number = index + 1;
      const name = $(`#person-${number}-name`).val();
      const amount = Number($(`#person-${number}-amount`).val());
      const amountWithVat = (amount * vat) / 100;
      const amountWithService = (amount * service) / 100;
      const totalAmount = amount + amountWithVat + amountWithService;
      const personHtml = `
        <p class="person">
          <span class="name">${name}</span>
          <span class="number">${amount}</span>
          <span>+</span>
          <span class="number">${amountWithVat}</span>
          <span>+</span>
          <span class="number">${amountWithService}</span>
          <span>=</span>
          <span class="number">${totalAmount}</span>
        </p>
      `;

      outputContent.append(personHtml);
      total += totalAmount;

      if (index === $('.individual .row.person').length - 1) {
        const totalHtml = `
          <p class="total">
            <span class="name">Total</span>
            <span class="number">${total}</span>
          </p>
        `;
        outputContent.append(totalHtml);
      }
    });

    output.slideDown();
  });

  function resetOutput() {
    outputContent.empty();
    output.hide();
  }
});
